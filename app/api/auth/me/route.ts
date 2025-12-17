import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import { getSessionUserFromRequest } from "@/lib/auth/session";

/**
 * GET /api/auth/me - Get current logged-in user by session cookie
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(request);
    if (!user || !user.enabled) {
      throw new AppError("لطفاً دوباره وارد شوید", 401, "UNAUTHORIZED");
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
    return createErrorResponse(error instanceof AppError ? error : error);
  }
}
