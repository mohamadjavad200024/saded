import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { getSessionUserFromRequest } from "@/lib/auth/session";

// #region agent log
fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/me/route.ts:8',message:'Route file loaded',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

/**
 * GET /api/auth/me - Get current logged-in user by session cookie
 */
export async function GET(request: NextRequest) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/auth/me/route.ts:12',message:'GET handler called',data:{url:request.url,method:request.method},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  try {
    // Log for debugging
    const cookieHeader = request.headers.get('cookie');
    const cookies = request.cookies.getAll();
    console.log('[GET /api/auth/me] Request:', {
      hasCookieHeader: !!cookieHeader,
      cookieCount: cookies.length,
      cookieNames: cookies.map(c => c.name),
    });
    
    const user = await getSessionUserFromRequest(request);
    
    console.log('[GET /api/auth/me] Session user:', {
      hasUser: !!user,
      userId: user?.id,
      role: user?.role,
      enabled: user?.enabled,
    });
    
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
    // If database is not available, return unauthenticated instead of error
    // This allows the app to continue working even if database is temporarily unavailable
    if (error?.message?.includes("not available") || 
        error?.code === "DATABASE_NOT_AVAILABLE" ||
        error?.code === "ECONNREFUSED" ||
        error?.code === "ETIMEDOUT" ||
        error?.message?.includes("connect") ||
        error?.message?.includes("timeout") ||
        error?.message?.includes("ECONNREFUSED")) {
      // Return unauthenticated instead of error
      return createSuccessResponse({
        authenticated: false,
        user: null,
      });
    }
    return createErrorResponse(error);
  }
}
