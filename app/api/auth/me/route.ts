import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/me - Get current user
 * 
 * Note: Database removed - returns error
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: "دیتابیس در دسترس نیست",
    },
    { status: 503 }
  );
}


