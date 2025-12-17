import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { getSessionUserFromRequest } from "@/lib/auth/session";

/**
 * GET /api/auth/me - Get current logged-in user by session cookie
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(request);
    // IMPORTANT:
    // This endpoint is used for "check auth" on the client.
    // Returning 401 here creates noisy console/network errors for normal visitors.
    // So we always return 200 with { authenticated: false } when not logged-in.
    if (!user || !user.enabled) {
      return createSuccessResponse({
        authenticated: false,
        user: null,
      });
    }

    return createSuccessResponse({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    return createErrorResponse(error);
  }
}
