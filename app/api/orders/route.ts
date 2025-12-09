import { NextRequest } from "next/server";
import { getRows } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse, safeParseJSON, safeParseNumber, safeParseDate } from "@/lib/api-route-helpers";
import type { Order, OrderFilters } from "@/types/order";
import { logger } from "@/lib/logger";

/**
 * GET /api/orders - Get all orders
 * POST /api/orders - Get filtered orders
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");

    let query = "SELECT * FROM orders";
    const params: any[] = [];

    if (orderNumber) {
      query += " WHERE orderNumber = ? OR id = ?";
      params.push(orderNumber, orderNumber);
    } else {
      query += " ORDER BY createdAt DESC";
    }

    const orders = await getRows<any>(query, params.length > 0 ? params : undefined);

    // Parse JSON fields safely (MySQL JSON returns objects, but may be strings in some cases)
    const parsedOrders = orders.map((o: any) => ({
      ...o,
      items: safeParseJSON<any[]>(o.items, []),
      shippingAddress: safeParseJSON<Record<string, any>>(o.shippingAddress, {}),
      total: safeParseNumber(o.total, 0),
      shippingCost: safeParseNumber(o.shippingCost, 0),
      createdAt: safeParseDate(o.createdAt),
      updatedAt: safeParseDate(o.updatedAt),
    }));

    return createSuccessResponse(parsedOrders, 200, {
      page: 1,
      limit: parsedOrders.length,
      total: parsedOrders.length,
      totalPages: 1,
    });
  } catch (error: any) {
    logger.error("GET /api/orders error:", {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });
    return createErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const filters: OrderFilters = body || {};

    let query = "SELECT * FROM orders WHERE 1=1";
    const params: any[] = [];

    if (filters.status && filters.status.length > 0) {
      query += ` AND status IN (${filters.status.map(() => "?").join(",")})`;
      params.push(...filters.status);
    }

    if (filters.paymentStatus && filters.paymentStatus.length > 0) {
      query += ` AND paymentStatus IN (${filters.paymentStatus.map(() => "?").join(",")})`;
      params.push(...filters.paymentStatus);
    }

    if (filters.search) {
      query += " AND (orderNumber LIKE ? OR customerName LIKE ? OR customerPhone LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.dateFrom) {
      query += " AND createdAt >= ?";
      params.push(filters.dateFrom.toISOString());
    }

    if (filters.dateTo) {
      query += " AND createdAt <= ?";
      params.push(filters.dateTo.toISOString());
    }

    query += " ORDER BY createdAt DESC";

    const orders = await getRows<any>(query, params);

    // Parse JSON fields safely (MySQL JSON returns objects, but may be strings in some cases)
    const parsedOrders = orders.map((o: any) => ({
      ...o,
      items: safeParseJSON<any[]>(o.items, []),
      shippingAddress: safeParseJSON<Record<string, any>>(o.shippingAddress, {}),
      total: safeParseNumber(o.total, 0),
      shippingCost: safeParseNumber(o.shippingCost, 0),
      createdAt: safeParseDate(o.createdAt),
      updatedAt: safeParseDate(o.updatedAt),
    }));

    return createSuccessResponse(parsedOrders, 200, {
      page: 1,
      limit: parsedOrders.length,
      total: parsedOrders.length,
      totalPages: 1,
    });
  } catch (error: any) {
    logger.error("POST /api/orders error:", {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });
    return createErrorResponse(error);
  }
}
