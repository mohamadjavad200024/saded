import { NextRequest, NextResponse } from "next/server";
import { runQuery, getRow } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";

/**
 * PATCH /api/chat/message/[id] - Edit a message
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    });

    const { text, attachments } = body;

    if (!text && (!attachments || attachments.length === 0)) {
      throw new AppError("text or attachments are required", 400, "MISSING_PARAMS");
    }

    const message = await getRow<any>("SELECT * FROM chat_messages WHERE id = $1", [id]);
    if (!message) {
      throw new AppError("پیام یافت نشد", 404, "MESSAGE_NOT_FOUND");
    }

    await runQuery(
      `UPDATE chat_messages 
       SET text = $1, attachments = $2, "updatedAt" = $3
       WHERE id = $4`,
      [
        text || message.text,
        attachments ? JSON.stringify(attachments) : message.attachments,
        new Date().toISOString(),
        id,
      ]
    );

    return createSuccessResponse({ message: "پیام با موفقیت ویرایش شد" });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * DELETE /api/chat/message/[id] - Delete a message
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const message = await getRow<any>("SELECT * FROM chat_messages WHERE id = $1", [id]);
    if (!message) {
      throw new AppError("پیام یافت نشد", 404, "MESSAGE_NOT_FOUND");
    }

    await runQuery("DELETE FROM chat_messages WHERE id = $1", [id]);

    return createSuccessResponse({ message: "پیام با موفقیت حذف شد" });
  } catch (error) {
    return createErrorResponse(error);
  }
}


