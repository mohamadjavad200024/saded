import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/login - Login user
 * 
 * Note: Database removed - returns error
 */
export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: "دیتابیس در دسترس نیست",
    },
    { status: 503 }
  );
}


