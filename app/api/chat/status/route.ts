import { NextRequest, NextResponse } from "next/server";
import { runQuery } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";

/**
 * PATCH /api/chat/status - Update message status
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json().catch(() => {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    });

    const { messageId, status } = body;

    if (!messageId || !status) {
      throw new AppError("messageId and status are required", 400, "MISSING_PARAMS");
    }

    if (!["sending", "sent", "delivered", "read"].includes(status)) {
      throw new AppError("Invalid status", 400, "INVALID_STATUS");
    }

    await runQuery(
      `UPDATE chat_messages 
       SET status = ? 
       WHERE id = ?`,
      [status, messageId]
    );

    return createSuccessResponse({ messageId, status });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * POST /api/chat/status - Mark messages as delivered or read
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    });

    const { chatId, sender, action = "read" } = body;

    if (!chatId || !sender) {
      throw new AppError("chatId and sender are required", 400, "MISSING_PARAMS");
    }

    // Mark all messages from the opposite sender
    const oppositeSender = sender === "user" ? "support" : "user";
    
    if (action === "delivered") {
      // Mark as delivered if not already read or delivered
      await runQuery(
        `UPDATE chat_messages 
         SET status = 'delivered' 
         WHERE chatId = ? AND sender = ? AND status NOT IN ('read', 'delivered')`,
        [chatId, oppositeSender]
      );
    } else {
      // Mark as read
      await runQuery(
        `UPDATE chat_messages 
         SET status = 'read' 
         WHERE chatId = ? AND sender = ? AND status != 'read'`,
        [chatId, oppositeSender]
      );
    }

    return createSuccessResponse({ chatId, action, marked: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}

