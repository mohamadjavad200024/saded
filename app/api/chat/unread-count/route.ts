import { NextRequest, NextResponse } from "next/server";
import { getRow, getRows, runQuery } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import { logger } from "@/lib/logger";

/**
 * GET /api/chat/unread-count - Get unread message count
 * Query params:
 *   - chatId (optional): Get unread count for specific chat
 *   - all (optional): Get unread counts for all chats
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");
    const getAll = searchParams.get("all") === "true";

    // Ensure tables exist
    try {
      await runQuery(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id VARCHAR(255) PRIMARY KEY,
          "chatId" VARCHAR(255) NOT NULL,
          text TEXT,
          sender VARCHAR(50) NOT NULL,
          attachments JSONB DEFAULT '[]'::jsonb,
          status VARCHAR(50) DEFAULT 'sent',
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);
    } catch (createError: any) {
      if (createError?.code !== "42P07" && !createError?.message?.includes("already exists")) {
        logger.error("Error creating chat_messages table:", createError);
      }
    }

    if (chatId) {
      // Get unread count for specific chat
      // WhatsApp style: only count messages from "user" that have NOT been read yet
      // Count messages with status 'sent', 'delivered', or 'sending' (not 'read')
      // NULL status messages are considered unread (new messages without status set)
      const result = await getRow<{ count: string }>(
        `SELECT COUNT(*) as count 
         FROM chat_messages 
         WHERE "chatId" = $1 
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
      // Get unread counts for all chats
      const chats = await getRows<{ id: string }>(
        `SELECT DISTINCT "chatId" as id FROM chat_messages`
      );

      const chatsWithUnreadCount = await Promise.all(
        chats.map(async (chat) => {
          const result = await getRow<{ count: string }>(
            `SELECT COUNT(*) as count 
             FROM chat_messages 
             WHERE "chatId" = $1 
               AND sender = 'user' 
               AND (status IS NULL OR (status != 'read' AND status IN ('sent', 'delivered', 'sending')))`,
            [chat.id]
          );

          return {
            id: chat.id,
            unreadCount: parseInt(result?.count || "0", 10),
          };
        })
      );

      return createSuccessResponse({
        chats: chatsWithUnreadCount,
      });
    } else {
      // No chatId and getAll not specified, return error
      throw new AppError("chatId or all parameter is required", 400, "MISSING_PARAMS");
    }
  } catch (error) {
    logger.error("[GET /api/chat/unread-count] Error:", error);
    return createErrorResponse(error);
  }
}

