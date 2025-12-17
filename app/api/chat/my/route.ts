import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import { getRow, runQuery } from "@/lib/db/index";
import { getSessionUserFromRequest } from "@/lib/auth/session";
import { ensureChatTables, getChatSchemaInfo } from "@/lib/chat/schema";

/**
 * GET /api/chat/my
 * Returns the current user's chat (creates one if none exists).
 */
export async function GET(request: NextRequest) {
  try {
    await ensureChatTables();
    const schema = await getChatSchemaInfo();

    const sessionUser = await getSessionUserFromRequest(request);
    if (!sessionUser || !sessionUser.enabled) {
      throw new AppError("برای استفاده از چت باید وارد حساب کاربری شوید", 401, "UNAUTHORIZED");
    }

    // Find latest chat for this user
    const existing = schema.chatHasUserId
      ? await getRow<any>(
          `SELECT * FROM quick_buy_chats WHERE userId = ? ORDER BY updatedAt DESC LIMIT 1`,
          [sessionUser.id]
        )
      : await getRow<any>(
          `SELECT * FROM quick_buy_chats WHERE customerPhone = ? ORDER BY updatedAt DESC LIMIT 1`,
          [sessionUser.phone]
        );

    if (existing?.id) {
      return createSuccessResponse({
        chatId: existing.id,
        chat: existing,
      });
    }

    // Migration/claim: if there is an older "guest" chat with same phone, attach it to this user
    const legacy = await getRow<any>(
      `SELECT * FROM quick_buy_chats 
       WHERE (${schema.chatHasUserId ? "(userId IS NULL OR TRIM(userId) = '') AND" : ""} customerPhone = ?)
       ORDER BY updatedAt DESC LIMIT 1`,
      [sessionUser.phone]
    );
    if (legacy?.id) {
      if (schema.chatHasUserId) {
        await runQuery(`UPDATE quick_buy_chats SET userId = ? WHERE id = ?`, [sessionUser.id, legacy.id]);
      }
      const claimed = await getRow<any>(`SELECT * FROM quick_buy_chats WHERE id = ?`, [legacy.id]);
      return createSuccessResponse({
        chatId: legacy.id,
        chat: claimed || legacy,
      });
    }

    const chatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    await runQuery(
      schema.chatHasUserId
        ? `INSERT INTO quick_buy_chats (id, userId, customerName, customerPhone, customerEmail, status, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        : `INSERT INTO quick_buy_chats (id, customerName, customerPhone, customerEmail, status, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
      schema.chatHasUserId
        ? [chatId, sessionUser.id, sessionUser.name, sessionUser.phone, null, "active", now, now]
        : [chatId, sessionUser.name, sessionUser.phone, null, "active", now, now]
    );

    const created = await getRow<any>(`SELECT * FROM quick_buy_chats WHERE id = ?`, [chatId]);
    return createSuccessResponse({
      chatId,
      chat: created,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}


