import { NextRequest, NextResponse } from "next/server";
import { getRow, runQuery, getRows } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import { cache, cacheKeys } from "@/lib/cache";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/chat - Create a new chat and save messages
 */
export async function POST(request: NextRequest) {
  // Rate limiting: 20 requests per minute per IP
  const rateLimitResponse = await rateLimit(20, 60000)(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json().catch(() => {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    });

    const { customerInfo, messages } = body;

    if (!customerInfo || !customerInfo.name || !customerInfo.phone) {
      throw new AppError("اطلاعات مشتری الزامی است", 400, "MISSING_CUSTOMER_INFO");
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new AppError("حداقل یک پیام الزامی است", 400, "MISSING_MESSAGES");
    }

    // Ensure tables exist (create in order to handle foreign keys)
    try {
      // Create chats table first
      await runQuery(`
        CREATE TABLE IF NOT EXISTS quick_buy_chats (
          id VARCHAR(255) PRIMARY KEY,
          customerName VARCHAR(255) NOT NULL,
          customerPhone VARCHAR(255) NOT NULL,
          customerEmail VARCHAR(255),
          status VARCHAR(50) NOT NULL DEFAULT 'active',
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `);

      // Create messages table (depends on chats)
      await runQuery(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id VARCHAR(255) PRIMARY KEY,
          chatId VARCHAR(255) NOT NULL,
          text TEXT,
          sender VARCHAR(50) NOT NULL,
          attachments JSON DEFAULT '[]',
          status VARCHAR(50) DEFAULT 'sent',
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_chat_messages_chatId (chatId),
          FOREIGN KEY (chatId) REFERENCES quick_buy_chats(id) ON DELETE CASCADE
        );
      `);

      // Create attachments table (depends on messages)
      await runQuery(`
        CREATE TABLE IF NOT EXISTS chat_attachments (
          id VARCHAR(255) PRIMARY KEY,
          messageId VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          filePath VARCHAR(500),
          fileName VARCHAR(255),
          fileSize BIGINT,
          fileUrl VARCHAR(500),
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_chat_attachments_messageId (messageId),
          FOREIGN KEY (messageId) REFERENCES chat_messages(id) ON DELETE CASCADE
        );
      `);
    } catch (createError: any) {
      if (createError?.code !== "ER_TABLE_EXISTS_ERROR" && !createError?.message?.includes("already exists") && !createError?.message?.includes("Duplicate")) {
        logger.error("Error creating chat tables:", createError);
      }
    }

    // Check if chatId is provided (for updating existing chat)
    const providedChatId = body.chatId;
    let chatId: string;
    const now = new Date().toISOString();

    if (providedChatId) {
      // Update existing chat
      chatId = providedChatId;
      await runQuery(
        `UPDATE quick_buy_chats 
         SET updatedAt = ? 
         WHERE id = ?`,
        [now, chatId]
      );
    } else {
      // Create new chat
      chatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await runQuery(
        `INSERT INTO quick_buy_chats (id, customerName, customerPhone, customerEmail, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          chatId,
          customerInfo.name.trim(),
          customerInfo.phone.trim(),
          customerInfo.email?.trim() || null,
          "active",
          now,
          now,
        ]
      );
    }

    // Get existing message IDs to avoid duplicates
    const existingMessages = await getRows<{ id: string }>(
      `SELECT id FROM chat_messages WHERE chatId = ?`,
      [chatId]
    );
    const existingMessageIds = new Set(existingMessages.map((m) => m.id));

    // Save messages and their attachments
    const savedMessages = [];
    for (const message of messages) {
      const messageId = message.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const messageCreatedAt = message.timestamp ? new Date(message.timestamp).toISOString() : now;
      
      const isNewMessage = !existingMessageIds.has(messageId);

      // Filter attachments to only include valid URLs (not blob/data URLs)
      const validAttachments = message.attachments && Array.isArray(message.attachments) 
        ? message.attachments.filter((att: any) => {
            const url = att.url || att.fileUrl || att.filePath;
            const isValid = url && 
                           !url.startsWith('blob:') && 
                           !url.startsWith('data:') &&
                           (url.startsWith('http') || url.startsWith('/'));
            if (!isValid && url) {
              logger.warn(`Filtered out invalid attachment URL for message ${messageId}:`, { url, attachment: att });
            }
            return isValid;
          })
        : [];
      
      // Log attachments being saved (only in development)
      if (validAttachments.length > 0) {
        logger.debug(`💾 Saving ${validAttachments.length} attachment(s) for message ${messageId}:`, 
          validAttachments.map((att: any) => ({ 
            id: att.id, 
            type: att.type, 
            url: att.url || att.fileUrl,
            name: att.name 
          }))
        );
      }

      // Get message status from request or default based on sender
      const messageStatus = message.status || (message.sender === "user" ? "sent" : null);
      
      // Save message using UPSERT to avoid duplicates
      await runQuery(
        `INSERT INTO chat_messages (id, chatId, text, sender, attachments, status, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           text = VALUES(text),
           attachments = VALUES(attachments),
           status = COALESCE(VALUES(status), chat_messages.status)`,
        [
          messageId,
          chatId,
          message.text || null,
          message.sender,
          JSON.stringify(validAttachments),
          messageStatus,
          messageCreatedAt,
        ]
      );

      // ALWAYS save attachments, even if message already exists (important for images)
      if (validAttachments && Array.isArray(validAttachments) && validAttachments.length > 0) {
        for (const attachment of validAttachments) {
          // Ensure we have a valid URL for the attachment
          const attachmentUrl = attachment.url || attachment.fileUrl || null;
          
          if (attachmentUrl && !attachmentUrl.startsWith('blob:') && !attachmentUrl.startsWith('data:')) {
            // Only save if URL is not a blob URL or data URL (those are temporary)
            // Ensure we have a valid type
            const attachmentType = attachment.type || (attachmentUrl.includes("image-") ? "image" : 
                                                       attachmentUrl.includes("audio-") ? "audio" : "file");
            
            try {
              // First, check if attachment with this URL already exists for this message
              const existingAttachment = await getRow<any>(
                `SELECT id FROM chat_attachments WHERE messageId = ? AND fileUrl = ?`,
                [messageId, attachmentUrl]
              );
              
              const attachmentId = existingAttachment?.id || attachment.id || `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              
              if (existingAttachment) {
                // Update existing attachment
                await runQuery(
                  `UPDATE chat_attachments 
                   SET type = ?, fileName = ?, fileSize = ?, fileUrl = ?
                   WHERE id = ?`,
                  [
                    attachmentType,
                    attachment.name || null,
                    attachment.size || null,
                    attachmentUrl,
                    attachmentId,
                  ]
                );
                logger.debug(`Updated existing attachment ${attachmentId} for message ${messageId}:`, { 
                  type: attachmentType, 
                  url: attachmentUrl,
                  name: attachment.name 
                });
              } else {
                // Insert new attachment
                await runQuery(
                  `INSERT INTO chat_attachments (id, messageId, type, filePath, fileName, fileSize, fileUrl, createdAt)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    attachmentId,
                    messageId,
                    attachmentType,
                    attachmentUrl,
                    attachment.name || null,
                    attachment.size || null,
                    attachmentUrl,
                    now,
                  ]
                );
                logger.debug(`Saved new attachment ${attachmentId} for message ${messageId}:`, { 
                  type: attachmentType, 
                  originalType: attachment.type,
                  url: attachmentUrl,
                  name: attachment.name 
                });
              }
              
            } catch (error) {
              logger.error(`Error saving attachment for message ${messageId}:`, error);
            }
          } else if (!attachmentUrl) {
            logger.warn(`Attachment has no URL, skipping database save:`, attachment);
          } else {
            logger.warn(`Attachment has temporary URL (blob/data), skipping database save:`, attachmentUrl);
          }
        }
      }

      // Get the saved message with status from database
      const savedMessage = await getRow<any>(
        `SELECT id, status FROM chat_messages WHERE id = ?`,
        [messageId]
      );
      
      savedMessages.push({
        id: messageId,
        chatId,
        text: message.text,
        sender: message.sender,
        attachments: message.attachments || [],
        createdAt: messageCreatedAt,
        status: savedMessage?.status || messageStatus,
      });
    }

    return createSuccessResponse({
      chatId,
      messages: savedMessages,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * GET /api/chat - Get chat by ID or list chats
 */
export async function GET(request: NextRequest) {
  // Rate limiting: 120 requests per minute per IP (increased for polling - allows 2 requests per second)
  const rateLimitResponse = await rateLimit(120, 60000)(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");
    const lastMessageId = searchParams.get("lastMessageId"); // For polling new messages
    const since = searchParams.get("since"); // ISO timestamp for polling

    if (chatId) {
      // Get single chat with messages
      let chat;
      try {
        chat = await getRow<any>(
          `SELECT * FROM quick_buy_chats WHERE id = ?`,
          [chatId]
        );
      } catch (dbError: any) {
        // If table doesn't exist, return 404
        if (dbError?.code === "ER_NO_SUCH_TABLE" || dbError?.message?.includes("doesn't exist") || dbError?.message?.includes("does not exist")) {
          throw new AppError("چت یافت نشد", 404, "CHAT_NOT_FOUND");
        }
        throw dbError;
      }

      if (!chat) {
        throw new AppError("چت یافت نشد", 404, "CHAT_NOT_FOUND");
      }

      // Build query based on polling parameters
      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
      const offset = (page - 1) * limit;
      
      let messagesQuery = `SELECT * FROM chat_messages WHERE chatId = ?`;
      const queryParams: any[] = [chatId];
      
      if (lastMessageId) {
        // Get messages after the last known message ID (for polling)
        // First get the createdAt of the last message, then get messages after that time
        const lastMessage = await getRow<any>(
          `SELECT createdAt FROM chat_messages WHERE id = ?`,
          [lastMessageId]
        );
        if (lastMessage) {
          messagesQuery += ` AND createdAt > ? ORDER BY createdAt ASC LIMIT ?`;
          queryParams.push(lastMessage.createdAt, limit);
        } else {
          // Fallback: use id comparison if createdAt not found
          messagesQuery += ` AND id != ? ORDER BY createdAt ASC LIMIT ?`;
          queryParams.push(lastMessageId, limit);
        }
      } else if (since) {
        // Get messages after a specific timestamp (for polling)
        messagesQuery += ` AND createdAt > ? ORDER BY createdAt ASC LIMIT ?`;
        queryParams.push(since, limit);
      } else {
        // Get paginated messages (for initial load)
        messagesQuery += ` ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);
      }

      let messages = await getRows<any>(messagesQuery, queryParams);
      
      // If not polling, reverse order to show newest first (but we fetched DESC, so reverse)
      if (!lastMessageId && !since) {
        messages = messages.reverse();
      }

      // Optimize: Get all attachments in one query instead of N+1 queries
      const messageIds = messages.map((m: any) => m.id);
      let allDbAttachments: any[] = [];
      
      if (messageIds.length > 0) {
        try {
          // Use IN clause to get all attachments in one query
          const placeholders = messageIds.map(() => '?').join(',');
          allDbAttachments = await getRows<any>(
            `SELECT * FROM chat_attachments WHERE messageId IN (${placeholders})`,
            messageIds
          );
        } catch (error: any) {
          // If table doesn't exist, continue with empty attachments
          if (error?.code === "ER_NO_SUCH_TABLE" || error?.message?.includes("doesn't exist") || error?.message?.includes("does not exist")) {
            logger.warn("Chat attachments table does not exist yet, continuing without attachments");
            allDbAttachments = [];
          } else {
            logger.error("Error fetching attachments:", error);
            allDbAttachments = [];
          }
        }
      }
      
      // Group attachments by messageId for O(1) lookup
      const attachmentsByMessageId = new Map<string, any[]>();
      allDbAttachments.forEach((att) => {
        if (!attachmentsByMessageId.has(att.messageId)) {
          attachmentsByMessageId.set(att.messageId, []);
        }
        attachmentsByMessageId.get(att.messageId)!.push(att);
      });

      // Process messages and merge attachments
      for (const message of messages) {
        // First try to get attachments from JSON field
        let jsonAttachments: any[] = [];
        if (message.attachments) {
          if (Array.isArray(message.attachments)) {
            // Already an array (MySQL JSON returns as array)
            jsonAttachments = message.attachments;
          } else if (typeof message.attachments === 'string') {
            // Try to parse if it's a string
            try {
              const parsed = JSON.parse(message.attachments);
              jsonAttachments = Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
              logger.error(`Error parsing attachments JSON for message ${message.id}:`, e);
              jsonAttachments = [];
            }
          } else if (typeof message.attachments === 'object' && message.attachments !== null) {
            // Single object, convert to array
            jsonAttachments = Array.isArray(message.attachments) ? message.attachments : [message.attachments];
          }
        }
        
        // Get attachments from database table (already loaded)
        const dbAttachments = attachmentsByMessageId.get(message.id) || [];
        
        // Merge attachments - prefer database table attachments (they are more reliable)
        const allAttachments: any[] = [];
        const addedUrls = new Set<string>();
        
        // First add database table attachments (these are the source of truth)
        dbAttachments.forEach((att) => {
          if (att.fileUrl && !att.fileUrl.startsWith('blob:') && !att.fileUrl.startsWith('data:')) {
            // Only add if URL exists and is not a temporary blob/data URL
            // Ensure type is preserved (important for audio, etc.)
            allAttachments.push({
              id: att.id,
              type: att.type || "file", // Default to "file" if type is missing
              url: att.fileUrl,
              name: att.fileName,
              size: att.fileSize,
            });
            addedUrls.add(att.fileUrl);
          }
        });
        
        // Then add JSON attachments if not already in database and not temporary URLs
        if (Array.isArray(jsonAttachments) && jsonAttachments.length > 0) {
          jsonAttachments.forEach((att) => {
            const attachmentUrl = att.url || att.fileUrl || att.filePath;
            // Skip if URL is temporary or already added
            if (attachmentUrl && 
                !attachmentUrl.startsWith('blob:') && 
                !attachmentUrl.startsWith('data:') &&
                !addedUrls.has(attachmentUrl)) {
              // Check if we already have this attachment by URL (even if ID is different)
              const existingByUrl = allAttachments.find(a => a.url === attachmentUrl);
              if (!existingByUrl) {
                allAttachments.push({
                  id: att.id || `att-${Date.now()}-${Math.random()}`,
                  type: att.type || "file", // Ensure type is always set
                  url: attachmentUrl,
                  name: att.name || att.fileName,
                  size: att.size || att.fileSize,
                  duration: att.duration,
                });
                addedUrls.add(attachmentUrl);
              }
            }
          });
        }
        
        message.attachments = allAttachments;
      }

      return createSuccessResponse({
        chat,
        messages,
      });
    } else {
      // Check if we should find chat by customer info
      const customerPhone = searchParams.get("customerPhone");
      const customerName = searchParams.get("customerName");

      if (customerPhone) {
        // Find chat by customer phone (and optionally name)
        let chat;
        if (customerName) {
          chat = await getRow<any>(
            `SELECT * FROM quick_buy_chats 
             WHERE customerPhone = ? AND customerName = ? 
             ORDER BY createdAt DESC LIMIT 1`,
            [customerPhone, customerName]
          );
        } else {
          chat = await getRow<any>(
            `SELECT * FROM quick_buy_chats 
             WHERE customerPhone = ? 
             ORDER BY createdAt DESC LIMIT 1`,
            [customerPhone]
          );
        }

        if (chat) {
          // Get messages for this chat
          const messages = await getRows<any>(
            `SELECT * FROM chat_messages WHERE chatId = ? ORDER BY createdAt ASC`,
            [chat.id]
          );

          // Optimize: Get all attachments in one query instead of N+1 queries
          const messageIds = messages.map((m: any) => m.id);
          let allDbAttachments: any[] = [];
          
          if (messageIds.length > 0) {
            try {
              // Use IN clause to get all attachments in one query
              const placeholders = messageIds.map(() => '?').join(',');
              allDbAttachments = await getRows<any>(
                `SELECT * FROM chat_attachments WHERE messageId IN (${placeholders})`,
                messageIds
              );
            } catch (error: any) {
              // If table doesn't exist, continue with empty attachments
              if (error?.code === "ER_NO_SUCH_TABLE" || error?.message?.includes("doesn't exist") || error?.message?.includes("does not exist")) {
                logger.warn("Chat attachments table does not exist yet, continuing without attachments");
                allDbAttachments = [];
              } else {
                logger.error("Error fetching attachments:", error);
                allDbAttachments = [];
              }
            }
          }
          
          // Group attachments by messageId for O(1) lookup
          const attachmentsByMessageId = new Map<string, any[]>();
          allDbAttachments.forEach((att) => {
            if (!attachmentsByMessageId.has(att.messageId)) {
              attachmentsByMessageId.set(att.messageId, []);
            }
            attachmentsByMessageId.get(att.messageId)!.push(att);
          });

          // Process messages and merge attachments
          for (const message of messages) {
            // First try to get attachments from JSON field
            let jsonAttachments: any[] = [];
            if (message.attachments) {
              if (Array.isArray(message.attachments)) {
                // MySQL JSON returns as array
                jsonAttachments = message.attachments;
              } else if (typeof message.attachments === 'string') {
                // Try to parse if it's a string
                try {
                  const parsed = JSON.parse(message.attachments);
                  jsonAttachments = Array.isArray(parsed) ? parsed : [parsed];
                } catch (e) {
                  // Only log in development
                  if (process.env.NODE_ENV === 'development') {
                    logger.error(`Error parsing attachments JSON for message ${message.id}:`, e);
                  }
                  jsonAttachments = [];
                }
              } else if (typeof message.attachments === 'object' && message.attachments !== null) {
                // Single object, convert to array
                jsonAttachments = Array.isArray(message.attachments) ? message.attachments : [message.attachments];
              }
            }
            
            // Get attachments from database table (already loaded)
            const dbAttachments = attachmentsByMessageId.get(message.id) || [];
            
            // Merge attachments - prefer database table attachments (they are more reliable)
            const allAttachments: any[] = [];
            const addedUrls = new Set<string>();
            
            // First add database table attachments (these are the source of truth)
            dbAttachments.forEach((att) => {
              if (att.fileUrl && !att.fileUrl.startsWith('blob:') && !att.fileUrl.startsWith('data:')) {
                // Only add if URL exists and is not a temporary blob/data URL
                // Ensure type is preserved (important for audio, etc.)
                allAttachments.push({
                  id: att.id,
                  type: att.type || "file", // Default to "file" if type is missing
                  url: att.fileUrl,
                  name: att.fileName,
                  size: att.fileSize,
                });
                addedUrls.add(att.fileUrl);
              }
            });
            
            // Then add JSON attachments if not already in database and not temporary URLs
            if (Array.isArray(jsonAttachments) && jsonAttachments.length > 0) {
              jsonAttachments.forEach((att) => {
                const attachmentUrl = att.url || att.fileUrl || att.filePath;
                // Skip if URL is temporary or already added
                if (attachmentUrl && 
                    !attachmentUrl.startsWith('blob:') && 
                    !attachmentUrl.startsWith('data:') &&
                    !addedUrls.has(attachmentUrl)) {
                  // Check if we already have this attachment by URL (even if ID is different)
                  const existingByUrl = allAttachments.find(a => a.url === attachmentUrl);
                  if (!existingByUrl) {
                    allAttachments.push({
                      id: att.id || `att-${Date.now()}-${Math.random()}`,
                      type: att.type || "file", // Ensure type is always set
                      url: attachmentUrl,
                      name: att.name || att.fileName,
                      size: att.size || att.fileSize,
                      duration: att.duration,
                    });
                    addedUrls.add(attachmentUrl);
                  }
                }
              });
            }
            
            message.attachments = allAttachments;
          }

          return createSuccessResponse({
            chat,
            messages,
          });
        } else {
          // No chat found
          return createSuccessResponse({
            chat: null,
            messages: [],
          });
        }
      } else {
        // Get list of chats
        try {
          // Try cache first (cache for 10 seconds since chat list changes frequently)
          const cacheKey = cacheKeys.chatList();
          const cached = cache.get<any>(cacheKey);
          if (cached) {
            return createSuccessResponse({ chats: cached });
          }
          
          const chats = await getRows<any>(
            `SELECT * FROM quick_buy_chats ORDER BY createdAt DESC LIMIT 50`
          );

          // Optimize: Get unread counts for all chats in one query using GROUP BY
          const chatIds = chats.map((c: any) => c.id);
          let unreadCountsMap = new Map<string, number>();
          
          if (chatIds.length > 0) {
            try {
              // Use IN clause with GROUP BY to get all unread counts in one query
              const placeholders = chatIds.map(() => '?').join(',');
              const unreadCounts = await getRows<{ chatId: string; count: string }>(
                `SELECT chatId, COUNT(*) as count 
                 FROM chat_messages 
                 WHERE chatId IN (${placeholders})
                   AND sender = 'user' 
                   AND (status IS NULL OR (status != 'read' AND status IN ('sent', 'delivered', 'sending')))
                 GROUP BY chatId`,
                chatIds
              );
              
              // Create map for O(1) lookup
              unreadCounts.forEach((result) => {
                unreadCountsMap.set(result.chatId, parseInt(result.count || "0", 10));
              });
            } catch (error: any) {
              // If table doesn't exist or other error, continue with 0 counts
              if (error?.code === "ER_NO_SUCH_TABLE" || error?.message?.includes("doesn't exist") || error?.message?.includes("does not exist")) {
                logger.warn("Chat messages table does not exist yet, using 0 unread counts");
              } else if (process.env.NODE_ENV === 'development') {
                logger.error(`Error getting unread counts:`, error);
              }
            }
          }
          
          // Map chats with unread counts
          const chatsWithUnreadCount = chats.map((chat: any) => ({
            ...chat,
            unreadCount: unreadCountsMap.get(chat.id) || 0,
          }));
          
          // Cache the result for 10 seconds
          cache.set(cacheKey, chatsWithUnreadCount, 10000);

          return createSuccessResponse({ chats: chatsWithUnreadCount });
        } catch (dbError: any) {
          // If table doesn't exist, return empty array instead of error
          if (dbError?.code === "ER_NO_SUCH_TABLE" || dbError?.message?.includes("doesn't exist") || dbError?.message?.includes("does not exist")) {
            logger.warn("Chat table does not exist yet, returning empty chats list");
            return createSuccessResponse({ chats: [] });
          }
          throw dbError;
        }
      }
    }
  } catch (error) {
    logger.error("[GET /api/chat] Error:", error);
    return createErrorResponse(error);
  }
}

