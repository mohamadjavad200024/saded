import { NextRequest } from "next/server";
import { getRow, getRows, runQuery } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import { logger } from "@/lib/logger";
import { getSessionUserFromRequest } from "@/lib/auth/session";
import { ensureChatTables, getChatSchemaInfo } from "@/lib/chat/schema";

/**
 * GET /api/chat/unread-count - Get unread message count
 * Query params:
 *   - chatId (optional): Get unread count for specific chat
 *   - all (optional): Get unread counts for all chats
 */
export async function GET(request: NextRequest) {
  try {
    await ensureChatTables();
    const schema = await getChatSchemaInfo();
    // Authentication removed - unread count is now open to everyone
    const sessionUser = await getSessionUserFromRequest(request);
    const isAdmin = sessionUser?.role === "admin";

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");
    const getAll = searchParams.get("all") === "true";

    // Ensure table exists (best-effort)
    try {
      await runQuery(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id VARCHAR(255) PRIMARY KEY,
          chatId VARCHAR(255) NOT NULL,
          userId VARCHAR(255) NULL,
          text TEXT,
          sender VARCHAR(50) NOT NULL,
          attachments JSON DEFAULT '[]',
          status VARCHAR(50) DEFAULT 'sent',
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_chat_messages_chatId (chatId)
        );
      `);
    } catch (createError: any) {
      if (createError?.code !== "ER_TABLE_EXISTS_ERROR" && !createError?.message?.includes("already exists") && !createError?.message?.includes("Duplicate")) {
        logger.error("Error creating chat_messages table:", createError);
      }
    }

    if (chatId) {
      const chat = await getRow<any>(`SELECT * FROM quick_buy_chats WHERE id = ?`, [chatId]);
      if (!chat) {
        throw new AppError("چت یافت نشد", 404, "CHAT_NOT_FOUND");
      }
      if (!isAdmin) {
        // For non-admin users, check ownership
        // If sessionUser exists, verify ownership
        // If sessionUser doesn't exist but chatId is provided, allow access (guest user scenario)
        if (sessionUser) {
          const chatPhone = chat.customerPhone ? String(chat.customerPhone) : "";
          const chatUserId = schema.chatHasUserId && chat.userId ? String(chat.userId) : "";
          const isOwnerByUserId = schema.chatHasUserId && chatUserId === sessionUser.id;
          const isOwnerByPhone = !schema.chatHasUserId && chatPhone === sessionUser.phone;
          const canClaimByPhone = schema.chatHasUserId && (!chatUserId || chatUserId.trim() === "") && chatPhone === sessionUser.phone;
          if (!isOwnerByUserId && !isOwnerByPhone) {
            if (canClaimByPhone) {
              await runQuery(`UPDATE quick_buy_chats SET userId = ? WHERE id = ?`, [sessionUser.id, chatId]);
            } else {
              throw new AppError("شما به این چت دسترسی ندارید", 403, "FORBIDDEN");
            }
          }
        }
        // If no sessionUser, allow access if chatId is provided (guest user with known chat)
        // This allows guest users to check unread count
      }

      // Get unread count for specific chat
      // WhatsApp style: only count messages from "user" that have NOT been read yet
      // Count messages with status 'sent', 'delivered', or 'sending' (not 'read')
      // NULL status messages are considered unread (new messages without status set)
      const result = await getRow<{ count: string }>(
        `SELECT COUNT(*) as count 
         FROM chat_messages 
         WHERE chatId = ? 
           AND sender = 'user' 
           AND (status IS NULL OR (status != 'read' AND status IN ('sent', 'delivered', 'sending')))`,
        [chatId]
      );

      const unreadCount = parseInt(result?.count || "0", 10);

      return createSuccessResponse({
        chatId,
        unreadCount,
      });
    } else if (getAll) {
      // Get unread counts for all chats (admin) or user's chats
      try {
        let chats: { id: string }[] = [];
        
        if (isAdmin) {
          // Admin: Get all chats from chat_messages table
          try {
            chats = await getRows<{ id: string }>(`SELECT DISTINCT chatId as id FROM chat_messages`);
          } catch (error: any) {
            // If table doesn't exist, return empty array
            if (error?.code === "ER_NO_SUCH_TABLE" || error?.message?.includes("doesn't exist") || error?.message?.includes("does not exist")) {
              logger.warn("Chat messages table does not exist yet, returning empty chats list");
              return createSuccessResponse({ chats: [] });
            }
            throw error;
          }
        } else {
          // User: Get only their chats
          try {
            if (!sessionUser) {
              chats = [];
            } else {
              chats = await getRows<{ id: string }>(
                `SELECT DISTINCT m.chatId as id
                 FROM chat_messages m
                 JOIN quick_buy_chats c ON c.id = m.chatId
                 WHERE ${schema.chatHasUserId ? "c.userId = ?" : "c.customerPhone = ?"}`,
                [schema.chatHasUserId ? sessionUser.id : sessionUser.phone]
              );
            }
          } catch (error: any) {
            // If table doesn't exist, return empty array
            if (error?.code === "ER_NO_SUCH_TABLE" || error?.message?.includes("doesn't exist") || error?.message?.includes("does not exist")) {
              logger.warn("Chat messages table does not exist yet, returning empty chats list");
              return createSuccessResponse({ chats: [] });
            }
            throw error;
          }
        }

        const chatsWithUnreadCount = await Promise.all(
          chats.map(async (chat) => {
            try {
              const result = await getRow<{ count: string }>(
                `SELECT COUNT(*) as count 
                 FROM chat_messages 
                 WHERE chatId = ? 
                   AND sender = 'user' 
                   AND (status IS NULL OR (status != 'read' AND status IN ('sent', 'delivered', 'sending')))`,
                [chat.id]
              );

              return {
                id: chat.id,
                unreadCount: parseInt(result?.count || "0", 10),
              };
            } catch (error) {
              logger.error(`Error getting unread count for chat ${chat.id}:`, error);
              return {
                id: chat.id,
                unreadCount: 0,
              };
            }
          })
        );

        return createSuccessResponse({
          chats: chatsWithUnreadCount,
        });
      } catch (error: any) {
        // If table doesn't exist, return empty array
        if (error?.code === "ER_NO_SUCH_TABLE" || error?.message?.includes("doesn't exist") || error?.message?.includes("does not exist")) {
          logger.warn("Chat messages table does not exist yet, returning empty chats list");
          return createSuccessResponse({
            chats: [],
          });
        }
        throw error;
      }
    } else {
      // No chatId and getAll not specified, return error
      throw new AppError("chatId or all parameter is required", 400, "MISSING_PARAMS");
    }
  } catch (error) {
    logger.error("[GET /api/chat/unread-count] Error:", error);
    return createErrorResponse(error);
  }
}

