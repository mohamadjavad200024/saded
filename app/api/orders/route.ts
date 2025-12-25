import { NextRequest } from "next/server";
import { getRows, getRow } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import type { Order, OrderFilters } from "@/types/order";
import { getSessionUserFromRequest } from "@/lib/auth/session";

/**
 * GET /api/orders - Get orders (filtered by user if not admin)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    
    let sessionUser = await getSessionUserFromRequest(request);
    let isAdmin = sessionUser?.role === "admin";
    let userId = sessionUser?.id || null;

    // Log for debugging - more detailed
    const cookieHeader = request.headers.get('cookie');
    const cookies = request.cookies.getAll();
    console.log('[GET /api/orders] Session check:', {
      hasSessionUser: !!sessionUser,
      userId,
      isAdmin,
      role: sessionUser?.role,
      sessionUserId: sessionUser?.id,
      sessionUserRole: sessionUser?.role,
      enabled: sessionUser?.enabled,
      cookieHeader: cookieHeader ? cookieHeader.substring(0, 200) : 'no cookie header',
      cookieCount: cookies.length,
      cookieNames: cookies.map(c => c.name),
    });

    // Fallback: اگر session پیدا نشد اما userId در header ارسال شده
    // این برای development و همچنین برای اطمینان از کارکرد صحیح در production استفاده می‌شود
    if (!sessionUser) {
      const userIdHeader = request.headers.get('x-user-id');
      if (userIdHeader) {
        console.log('[GET /api/orders] Using userId from header (fallback):', userIdHeader);
        // Get user from database
        const user = await getRow<{
          id: string;
          name: string;
          phone: string;
          role: string;
          enabled: any;
          createdAt: string;
        }>(
          "SELECT id, name, phone, role, enabled, createdAt FROM users WHERE id = ?",
          [userIdHeader]
        );
        if (user && user.enabled) {
          sessionUser = {
            id: user.id,
            name: user.name,
            phone: user.phone,
            role: user.role || "user",
            enabled: Boolean(user.enabled),
            createdAt: user.createdAt || new Date().toISOString(),
          };
          isAdmin = sessionUser.role === "admin";
          userId = sessionUser.id;
          console.log('[GET /api/orders] Fallback user found:', userId);
        }
      }
    }

    let query = "SELECT * FROM orders";
    const params: any[] = [];
    const conditions: string[] = [];

    // اگر orderNumber وجود دارد، اجازه جستجو را بده (حتی برای مهمان‌ها)
    // این برای صفحه track order است که کاربر باید بتواند سفارش خود را با orderNumber پیدا کند
    if (orderNumber) {
      // اگر orderNumber وجود دارد، فقط بر اساس آن جستجو کن (بدون فیلتر userId)
      conditions.push("(`orderNumber` = ? OR id = ?)");
      params.push(orderNumber, orderNumber);
    } else {
      // منطق ساده برای لیست سفارشات:
      // 1. اگر ادمین است → تمام سفارشات (بدون فیلتر)
      // 2. اگر کاربر لاگین شده است → فقط سفارشات با userId او
      // 3. اگر مهمان است → خطا (احراز هویت الزامی است)
      if (!isAdmin) {
        if (userId) {
          // کاربر لاگین شده: فقط سفارشات با userId او
          conditions.push("`userId` = ?");
          params.push(String(userId));
        } else {
          // مهمان: خطا - احراز هویت الزامی است
          throw new AppError("برای مشاهده سفارش‌ها باید وارد حساب کاربری خود شوید", 401, "UNAUTHORIZED");
        }
      }
      // اگر ادمین است، هیچ فیلتری اضافه نمی‌کنیم (تمام سفارشات)
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY `createdAt` DESC";

    // Log query for debugging
    console.log('[GET /api/orders] Query:', query);
    console.log('[GET /api/orders] Params:', params);
    console.log('[GET /api/orders] User context:', { userId, isAdmin, hasSession: !!sessionUser });

    // برای دیباگ: بررسی تمام سفارش‌ها (بدون فیلتر)
    const allOrdersDebug = await getRows<any>("SELECT id, orderNumber, userId, customerName, customerPhone, status, paymentStatus, createdAt FROM orders ORDER BY createdAt DESC LIMIT 10");
    console.log('[GET /api/orders] DEBUG - All orders in DB (first 10):', allOrdersDebug.length);
    allOrdersDebug.forEach((o, idx) => {
      console.log(`  [${idx + 1}] Order ${o.orderNumber}: userId=${o.userId === null ? 'NULL' : `"${o.userId}"`} (type: ${typeof o.userId}), customer=${o.customerName}, phone=${o.customerPhone}`);
    });

    const orders = await getRows<any>(query, params.length > 0 ? params : undefined);
    
    console.log('[GET /api/orders] Found orders after filter:', orders.length);
    if (orders.length > 0) {
      console.log('[GET /api/orders] First order userId:', orders[0]?.userId, 'type:', typeof orders[0]?.userId);
    } else if (allOrdersDebug.length > 0 && userId) {
      console.log('[GET /api/orders] ⚠️ WARNING: Orders exist in DB but none match userId filter!');
      console.log('[GET /api/orders] ⚠️ Searching userId:', userId, 'type:', typeof userId);
      console.log('[GET /api/orders] ⚠️ Session user phone:', sessionUser?.phone);
      allOrdersDebug.forEach(o => {
        if (o.userId) {
          const userIdMatch = String(o.userId) === String(userId);
          const phoneMatch = sessionUser?.phone && o.customerPhone && String(o.customerPhone).replace(/\D/g, '') === String(sessionUser.phone).replace(/\D/g, '');
          console.log(`  - Order ${o.orderNumber}: userId="${o.userId}" (match: ${userIdMatch}), phone="${o.customerPhone}" (match: ${phoneMatch})`);
        } else if (sessionUser?.phone) {
          const phoneMatch = o.customerPhone && String(o.customerPhone).replace(/\D/g, '') === String(sessionUser.phone).replace(/\D/g, '');
          console.log(`  - Order ${o.orderNumber}: userId=NULL, phone="${o.customerPhone}" (match: ${phoneMatch})`);
        }
      });
    }

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
    
    let sessionUser = await getSessionUserFromRequest(request);
    let isAdmin = sessionUser?.role === "admin";
    let userId = sessionUser?.id || null;

    // Log for debugging
    console.log('[POST /api/orders] Session check:', {
      hasSessionUser: !!sessionUser,
      userId,
      isAdmin,
      role: sessionUser?.role,
      sessionUserId: sessionUser?.id,
      sessionUserRole: sessionUser?.role,
    });

    // Fallback: اگر session پیدا نشد اما userId در header ارسال شده (برای development)
    if (!sessionUser && process.env.NODE_ENV === 'development') {
      const userIdHeader = request.headers.get('x-user-id');
      if (userIdHeader) {
        console.log('[POST /api/orders] Using userId from header (development fallback):', userIdHeader);
        const user = await getRow<{
          id: string;
          name: string;
          phone: string;
          role: string;
          enabled: any;
          createdAt: string;
        }>(
          "SELECT id, name, phone, role, enabled, createdAt FROM users WHERE id = ?",
          [userIdHeader]
        );
        if (user && user.enabled) {
          sessionUser = {
            id: user.id,
            name: user.name,
            phone: user.phone,
            role: user.role || "user",
            enabled: Boolean(user.enabled),
            createdAt: user.createdAt || new Date().toISOString(),
          };
          isAdmin = sessionUser.role === "admin";
          userId = sessionUser.id;
          console.log('[POST /api/orders] Fallback user found:', userId);
        }
      }
    }

    let query = "SELECT * FROM orders WHERE 1=1";
    const params: any[] = [];

    // منطق ساده:
    // 1. اگر ادمین است → تمام سفارشات (بدون فیلتر userId)
    // 2. اگر کاربر لاگین شده است → فقط سفارشات با userId او
    // 3. اگر مهمان است → خطا (احراز هویت الزامی است)
    if (!isAdmin) {
      if (userId) {
        // کاربر لاگین شده: فقط سفارشات با userId او
        query += " AND `userId` = ?";
        params.push(String(userId));
      } else {
        // مهمان: خطا - احراز هویت الزامی است
        throw new AppError("برای مشاهده سفارش‌ها باید وارد حساب کاربری خود شوید", 401, "UNAUTHORIZED");
      }
    }
    // اگر ادمین است، هیچ فیلتری اضافه نمی‌کنیم (تمام سفارشات)

    if (filters.status && filters.status.length > 0) {
      query += ` AND status IN (${filters.status.map(() => "?").join(",")})`;
      params.push(...filters.status);
    }

    if (filters.paymentStatus && filters.paymentStatus.length > 0) {
      query += ` AND \`paymentStatus\` IN (${filters.paymentStatus.map(() => "?").join(",")})`;
      params.push(...filters.paymentStatus);
    }

    if (filters.search) {
      query += " AND (`orderNumber` LIKE ? OR `customerName` LIKE ? OR `customerPhone` LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.dateFrom) {
      query += " AND `createdAt` >= ?";
      params.push(filters.dateFrom.toISOString());
    }

    if (filters.dateTo) {
      query += " AND `createdAt` <= ?";
      params.push(filters.dateTo.toISOString());
    }

    query += " ORDER BY `createdAt` DESC";

    // Log query for debugging
    console.log('[POST /api/orders] Query:', query);
    console.log('[POST /api/orders] Params:', params);
    console.log('[POST /api/orders] User context:', { userId, isAdmin, hasSession: !!sessionUser });

    const orders = await getRows<any>(query, params);
    
    console.log('[POST /api/orders] Found orders:', orders.length);
    if (orders.length > 0) {
      console.log('[POST /api/orders] First order userId:', orders[0]?.userId, 'type:', typeof orders[0]?.userId);
    }

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
