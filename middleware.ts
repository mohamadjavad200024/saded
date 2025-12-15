import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for Next.js
 * This is an empty middleware that just passes through requests
 */
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Empty matcher - no routes are matched, so middleware won't run
// This is intentional to avoid any performance impact
export const config = {
  matcher: [],
};


