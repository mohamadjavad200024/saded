import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { clearSession, clearSessionCookie } from "@/lib/auth/session";

export const runtime = "nodejs";

/**
 * POST /api/auth/logout - Logout current user (clear session cookie)
 */
export async function POST(request: NextRequest) {
  try {
    await clearSession(request);
    const res = createSuccessResponse({ message: "خروج موفق" });
    clearSessionCookie(res, request);
    return res;
  } catch (error) {
    return createErrorResponse(error);
  }
}


