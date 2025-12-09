import { NextRequest } from "next/server";
import { getRow } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import { logger } from "@/lib/logger";

/**
 * GET /api/auth/me - Get current user by ID
 * Query params: ?userId=user_id
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      throw new AppError("شناسه کاربر الزامی است", 400, "MISSING_USER_ID");
    }

    const user = await getRow<{
      id: string;
      name: string;
      phone: string;
      role: string;
      enabled: boolean;
      createdAt: string;
    }>(
      "SELECT id, name, phone, role, enabled, createdAt FROM users WHERE id = ?",
      [userId]
    );

    if (!user) {
      throw new AppError("کاربر یافت نشد", 404, "USER_NOT_FOUND");
    }

    return createSuccessResponse({
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    logger.error("GET /api/auth/me error:", error);
    
    if (error instanceof AppError) {
      return createErrorResponse(error);
    }

    return createErrorResponse(error);
  }
}
