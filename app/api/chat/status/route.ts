import { NextRequest } from "next/server";
import { getRow, runQuery } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import { getSessionUserFromRequest } from "@/lib/auth/session";

/**
 * PATCH /api/chat/status - Update message status
 */
export async function PATCH(request: NextRequest) {
  try {
    const sessionUser = await getSessionUserFromRequest(request);
    if (!sessionUser || !sessionUser.enabled) {
      throw new AppError("برای استفاده از چت باید وارد حساب کاربری شوید", 401, "UNAUTHORIZED");
    }
    const isAdmin = sessionUser.role === "admin";

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

    // Access control: message must belong to user's chat (or admin)
    const msg = await getRow<any>(
      `SELECT m.id, c.userId as chatUserId
       FROM chat_messages m
       JOIN quick_buy_chats c ON c.id = m.chatId
       WHERE m.id = ?
       LIMIT 1`,
      [messageId]
    );
    if (!msg) {
      throw new AppError("پیام یافت نشد", 404, "MESSAGE_NOT_FOUND");
    }
    if (!isAdmin) {
      const chatUserId = msg.chatUserId ? String(msg.chatUserId) : "";
      if (!chatUserId || chatUserId !== sessionUser.id) {
        throw new AppError("شما به این پیام دسترسی ندارید", 403, "FORBIDDEN");
      }
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
    const sessionUser = await getSessionUserFromRequest(request);
    if (!sessionUser || !sessionUser.enabled) {
      throw new AppError("برای استفاده از چت باید وارد حساب کاربری شوید", 401, "UNAUTHORIZED");
    }
    const isAdmin = sessionUser.role === "admin";

    const body = await request.json().catch(() => {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    });

    const { chatId, sender, action = "read" } = body;

    if (!chatId || !sender) {
      throw new AppError("chatId and sender are required", 400, "MISSING_PARAMS");
    }

    const chat = await getRow<any>(`SELECT id, userId, customerPhone FROM quick_buy_chats WHERE id = ?`, [chatId]);
    if (!chat) {
      throw new AppError("چت یافت نشد", 404, "CHAT_NOT_FOUND");
    }
    if (!isAdmin) {
      const chatUserId = chat.userId ? String(chat.userId) : "";
      if (!chatUserId || chatUserId !== sessionUser.id) {
        throw new AppError("شما به این چت دسترسی ندارید", 403, "FORBIDDEN");
      }
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

