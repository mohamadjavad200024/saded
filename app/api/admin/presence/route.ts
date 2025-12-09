import { NextRequest, NextResponse } from "next/server";
import { getRow, runQuery } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";

/**
 * POST /api/admin/presence - Update admin online status (heartbeat)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    });

    const { adminId, isOnline = true } = body;

    if (!adminId) {
      throw new AppError("adminId is required", 400, "MISSING_ADMIN_ID");
    }

    // Ensure admin_presence table exists
    await runQuery(`
      CREATE TABLE IF NOT EXISTS admin_presence (
        "adminId" VARCHAR(255) PRIMARY KEY,
        "isOnline" BOOLEAN DEFAULT FALSE,
        "lastSeen" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Create index if not exists
    await runQuery(`
      CREATE INDEX IF NOT EXISTS idx_admin_presence_isOnline ON admin_presence("isOnline");
    `);

    const now = new Date().toISOString();

    // Upsert admin presence
    await runQuery(
      `INSERT INTO admin_presence ("adminId", "isOnline", "lastSeen", "updatedAt")
       VALUES ($1, $2, $3, $3)
       ON CONFLICT ("adminId") 
       DO UPDATE SET 
         "isOnline" = $2,
         "lastSeen" = CASE WHEN $2 = TRUE THEN $3 ELSE admin_presence."lastSeen" END,
         "updatedAt" = $3`,
      [adminId, isOnline, now]
    );

    return createSuccessResponse({ adminId, isOnline, lastSeen: now });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * GET /api/admin/presence - Get admin online status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get("adminId");

    // Ensure admin_presence table exists
    await runQuery(`
      CREATE TABLE IF NOT EXISTS admin_presence (
        "adminId" VARCHAR(255) PRIMARY KEY,
        "isOnline" BOOLEAN DEFAULT FALSE,
        "lastSeen" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    if (adminId) {
      // Get specific admin status
      const presence = await getRow<{
        adminId: string;
        isOnline: boolean;
        lastSeen: string;
        updatedAt: string;
      }>(
        `SELECT * FROM admin_presence WHERE "adminId" = $1`,
        [adminId]
      );

      if (!presence) {
        // Admin not found, consider offline
        return createSuccessResponse({
          adminId,
          isOnline: false,
          lastSeen: null,
        });
      }

      // Check if admin is still online (within last 30 seconds)
      const lastSeen = new Date(presence.lastSeen).getTime();
      const now = Date.now();
      const timeSinceLastSeen = now - lastSeen;
      const isActuallyOnline = presence.isOnline && timeSinceLastSeen < 30000; // 30 seconds

      // Update if status changed
      if (presence.isOnline !== isActuallyOnline) {
        await runQuery(
          `UPDATE admin_presence SET "isOnline" = $1, "updatedAt" = NOW() WHERE "adminId" = $2`,
          [isActuallyOnline, adminId]
        );
      }

      return createSuccessResponse({
        adminId: presence.adminId,
        isOnline: isActuallyOnline,
        lastSeen: presence.lastSeen,
      });
    } else {
      // Get all admin presences
      const { getRows } = await import("@/lib/db/index");
      const presences = await getRows<{
        adminId: string;
        isOnline: boolean;
        lastSeen: string;
        updatedAt: string;
      }>(`SELECT * FROM admin_presence ORDER BY "updatedAt" DESC`);

      // Filter out offline admins that haven't been seen in 30 seconds
      const now = Date.now();
      const validPresences = presences
        .map((presence) => {
          const lastSeen = new Date(presence.lastSeen).getTime();
          const timeSinceLastSeen = now - lastSeen;
          const isActuallyOnline = presence.isOnline && timeSinceLastSeen < 30000;
          return {
            adminId: presence.adminId,
            isOnline: isActuallyOnline,
            lastSeen: presence.lastSeen,
          };
        })
        .filter((p) => p.isOnline); // Only return online admins

      return createSuccessResponse({ admins: validPresences });
    }
  } catch (error) {
    return createErrorResponse(error);
  }
}

