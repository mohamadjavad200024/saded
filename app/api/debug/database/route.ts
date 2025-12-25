import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { getRows, runQuery } from "@/lib/db/index";
import { getSessionUserFromRequest } from "@/lib/auth/session";
import { logger } from "@/lib/logger";

/**
 * GET /api/debug/database - View all database data (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // In development, allow access without admin check
    // In production, require admin access
    const isDevelopment = process.env.NODE_ENV === "development";
    
    if (!isDevelopment) {
      // Check if user is admin (only in production)
      const sessionUser = await getSessionUserFromRequest(request);
      if (!sessionUser || sessionUser.role !== "admin") {
        return createErrorResponse(new Error("Unauthorized - Admin access required"), 403);
      }
    }

    const results: any = {
      tables: [],
      summary: {},
      timestamp: new Date().toISOString(),
    };

    try {
      // Get all tables
      const tables = await getRows<{ [key: string]: string }>("SHOW TABLES");
      const tableNames = tables.map(row => Object.values(row)[0] as string);

      results.tables = tableNames;

      // Get data from each table
      for (const tableName of tableNames) {
        try {
          // Get table structure
          const columns = await getRows<any>(`DESCRIBE ${tableName}`);
          
          // Get row count
          const countResult = await getRows<{ count: number }>(`SELECT COUNT(*) as count FROM ${tableName}`);
          const rowCount = countResult[0]?.count || 0;

          // Get sample data (limit to 100 rows)
          // Try to order by createdAt or id, fallback to no ordering
          let data: any[] = [];
          const limit = rowCount > 100 ? 100 : rowCount;
          if (rowCount > 0) {
            try {
              data = await getRows<any>(`SELECT * FROM ${tableName} ORDER BY createdAt DESC, id DESC LIMIT ${limit}`);
            } catch (orderError) {
              // If ordering fails, try without order
              try {
                data = await getRows<any>(`SELECT * FROM ${tableName} LIMIT ${limit}`);
              } catch (limitError) {
                // If limit fails, get all data
                data = await getRows<any>(`SELECT * FROM ${tableName}`);
              }
            }
          }

          results.summary[tableName] = {
            columns: columns.map((col: any) => ({
              name: col.Field,
              type: col.Type,
              nullable: col.Null === 'YES',
              key: col.Key || null,
            })),
            rowCount,
            sampleData: data,
            hasMore: rowCount > limit,
          };
        } catch (error: any) {
          results.summary[tableName] = {
            error: error?.message || 'Unknown error',
          };
        }
      }

      return createSuccessResponse(results);
    } catch (error: any) {
      logger.error("Error in debug/database:", error);
      return createErrorResponse(error);
    }
  } catch (error: any) {
    logger.error("Error in debug/database:", error);
    return createErrorResponse(error);
  }
}

