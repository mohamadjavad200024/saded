import { NextRequest } from "next/server";
import { getRows, getRow } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import type { Order, OrderFilters } from "@/types/order";
import { getUserIdFromRequest } from "@/lib/auth/middleware";

/**
 * GET /api/orders - Get orders (filtered by user if not admin)
 * Headers: x-user-id (optional), x-user-role (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    
    // دریافت userId و role از header
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role") || "user";
    const isAdmin = userRole === "admin";

    let query = "SELECT * FROM orders";
    const params: any[] = [];
    const conditions: string[] = [];

    // اگر admin نیست، فقط سفارش‌های خودش را ببیند
    if (!isAdmin && userId && userId !== "guest" && userId.trim() !== "") {
      conditions.push("`userId` = ?");
      params.push(userId.trim());
    }

    if (orderNumber) {
      conditions.push("(\"orderNumber\" = ? OR id = ?)");
      params.push(orderNumber, orderNumber);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY \"createdAt\" DESC";

    const orders = await getRows<any>(query, params.length > 0 ? params : undefined);

    // Parse JSON fields (PostgreSQL JSONB returns objects, not strings)
    const parsedOrders = orders.map((o: any) => ({
      ...o,
      items: Array.isArray(o.items) ? o.items : (typeof o.items === 'string' ? JSON.parse(o.items) : []),
      shippingAddress: typeof o.shippingAddress === 'object' && o.shippingAddress !== null 
        ? o.shippingAddress 
        : (typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : {}),
      total: Number(o.total),
      shippingCost: Number(o.shippingCost),
      createdAt: o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt),
      updatedAt: o.updatedAt instanceof Date ? o.updatedAt : new Date(o.updatedAt),
    }));

    return createSuccessResponse(parsedOrders, 200, {
      page: 1,
      limit: parsedOrders.length,
      total: parsedOrders.length,
      totalPages: 1,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const filters: OrderFilters = body || {};
    
    // دریافت userId و role از header
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role") || "user";
    const isAdmin = userRole === "admin";

    let query = "SELECT * FROM orders WHERE 1=1";
    const params: any[] = [];

    // اگر admin نیست، فقط سفارش‌های خودش را ببیند
    if (!isAdmin && userId && userId !== "guest" && userId.trim() !== "") {
      query += " AND `userId` = ?";
      params.push(userId.trim());
    }

    if (filters.status && filters.status.length > 0) {
      query += ` AND status IN (${filters.status.map(() => "?").join(",")})`;
      params.push(...filters.status);
    }

    if (filters.paymentStatus && filters.paymentStatus.length > 0) {
      query += ` AND \`paymentStatus\` IN (${filters.paymentStatus.map(() => "?").join(",")})`;
      params.push(...filters.paymentStatus);
    }

    if (filters.search) {
      query += " AND (\"orderNumber\" LIKE ? OR \"customerName\" LIKE ? OR \"customerPhone\" LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.dateFrom) {
      query += " AND \"createdAt\" >= ?";
      params.push(filters.dateFrom.toISOString());
    }

    if (filters.dateTo) {
      query += " AND \"createdAt\" <= ?";
      params.push(filters.dateTo.toISOString());
    }

    query += " ORDER BY \"createdAt\" DESC";

    const orders = await getRows<any>(query, params);

    // Parse JSON fields (PostgreSQL JSONB returns objects, not strings)
    const parsedOrders = orders.map((o: any) => ({
      ...o,
      items: Array.isArray(o.items) ? o.items : (typeof o.items === 'string' ? JSON.parse(o.items) : []),
      shippingAddress: typeof o.shippingAddress === 'object' && o.shippingAddress !== null 
        ? o.shippingAddress 
        : (typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : {}),
      total: Number(o.total),
      shippingCost: Number(o.shippingCost),
      createdAt: o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt),
      updatedAt: o.updatedAt instanceof Date ? o.updatedAt : new Date(o.updatedAt),
    }));

    return createSuccessResponse(parsedOrders, 200, {
      page: 1,
      limit: parsedOrders.length,
      total: parsedOrders.length,
      totalPages: 1,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
