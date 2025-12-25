import { NextRequest } from "next/server";
import { checkoutFormSchema } from "@/lib/validations/checkout";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import { runQuery, getRow } from "@/lib/db/index";
import { logger } from "@/lib/logger";
import { getSessionUserFromRequest } from "@/lib/auth/session";

/**
 * Sanitize و اعتبارسنجی ورودی‌ها
 */
function sanitizeString(value: any): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function sanitizeNumber(value: any): number {
  const num = typeof value === "number" ? value : parseFloat(value);
  return isNaN(num) ? 0 : num;
}

export async function POST(request: NextRequest) {
  try {
    // Ensure orders table exists
    try {
      await runQuery(`
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(255) PRIMARY KEY,
          \`orderNumber\` VARCHAR(255) UNIQUE NOT NULL,
          \`userId\` VARCHAR(255),
          \`customerName\` VARCHAR(255) NOT NULL,
          \`customerPhone\` VARCHAR(255) NOT NULL,
          \`customerEmail\` VARCHAR(255),
          items JSON NOT NULL DEFAULT ('[]'),
          total BIGINT NOT NULL,
          \`shippingCost\` BIGINT NOT NULL,
          \`shippingMethod\` VARCHAR(50) NOT NULL,
          \`shippingAddress\` JSON NOT NULL DEFAULT ('{}'),
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          \`paymentStatus\` VARCHAR(50) NOT NULL DEFAULT 'pending',
          notes TEXT,
          \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      logger.debug("Orders table ensured");
    } catch (tableError: any) {
      // Log but don't fail - table might already exist
      logger.warn("Error ensuring orders table (might already exist):", tableError?.message);
    }

    // Authentication required - no guest orders allowed
    let sessionUser = await getSessionUserFromRequest(request);
    
    // Log for debugging
    console.log('[POST /api/orders/create] Session check:', {
      hasSessionUser: !!sessionUser,
      userId: sessionUser?.id,
      sessionUserId: sessionUser?.id,
      sessionUserRole: sessionUser?.role,
    });
    
    // Fallback: اگر session پیدا نشد اما userId در header ارسال شده (برای development)
    if (!sessionUser && process.env.NODE_ENV === 'development') {
      const userIdHeader = request.headers.get('x-user-id');
      if (userIdHeader) {
        console.log('[POST /api/orders/create] Using userId from header (development fallback):', userIdHeader);
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
          console.log('[POST /api/orders/create] Fallback user found:', sessionUser.id);
        }
      }
    }
    
    if (!sessionUser || !sessionUser.id) {
      throw new AppError("برای ثبت سفارش باید وارد حساب کاربری خود شوید", 401, "UNAUTHORIZED");
    }
    
    const finalUserId = sessionUser.id;
    
    logger.info(`📦 Creating order with userId: ${finalUserId}`);

    const body = await request.json().catch(() => {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    });
    const {
      items,
      formData,
      total,
      shippingCost,
      shippingMethod,
    } = body;

    // اعتبارسنجی سبد خرید
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new AppError("سبد خرید خالی است", 400, "EMPTY_CART");
    }

    // Log items for debugging
    logger.debug("Received items for order creation:", items.map(item => ({
      id: item?.id,
      name: item?.name,
      price: item?.price,
      quantity: item?.quantity,
      hasImage: !!item?.image,
    })));

    // بررسی محدودیت تعداد محصولات
    if (items.length > 50) {
      throw new AppError("حداکثر 50 محصول در هر سفارش مجاز است", 400, "CART_LIMIT_EXCEEDED");
    }

    // اعتبارسنجی هر آیتم
    for (const item of items) {
      // بررسی وجود فیلدهای ضروری
      if (!item || typeof item !== "object") {
        throw new AppError("آیتم سفارش نامعتبر است", 400, "INVALID_ITEM");
      }

      if (!item.id || typeof item.id !== "string" || item.id.trim() === "") {
        throw new AppError(
          `شناسه محصول نامعتبر است. آیتم: ${JSON.stringify(item)}`,
          400,
          "INVALID_ITEM_ID"
        );
      }

      if (!item.name || typeof item.name !== "string" || item.name.trim() === "") {
        throw new AppError(
          `نام محصول نامعتبر است. شناسه: ${item.id}`,
          400,
          "INVALID_ITEM_NAME"
        );
      }

      // بررسی قیمت
      if (item.price === undefined || item.price === null) {
        throw new AppError(
          `قیمت محصول "${item.name || item.id}" مشخص نشده است`,
          400,
          "MISSING_PRICE"
        );
      }

      const price = sanitizeNumber(item.price);
      // افزایش محدودیت قیمت به 1 میلیارد تومان برای محصولات گران قیمت
      if (price <= 0 || price > 1000000000) {
        throw new AppError(
          `قیمت محصول "${item.name}" نامعتبر است (${price}) - حداکثر قیمت مجاز: 1,000,000,000 تومان`,
          400,
          "INVALID_PRICE"
        );
      }

      // بررسی تعداد
      if (item.quantity === undefined || item.quantity === null) {
        throw new AppError(
          `تعداد محصول "${item.name || item.id}" مشخص نشده است`,
          400,
          "MISSING_QUANTITY"
        );
      }

      const quantity = sanitizeNumber(item.quantity);
      if (quantity <= 0 || quantity > 1000) {
        throw new AppError(
          `تعداد محصول "${item.name}" نامعتبر است (${quantity}) - باید بین 1 تا 1000 باشد`,
          400,
          "INVALID_QUANTITY"
        );
      }

      // تصویر اختیاری است - اگر وجود نداشته باشد، مقدار پیش‌فرض می‌گذاریم
      if (item.image !== undefined && item.image !== null && typeof item.image !== "string") {
        throw new AppError(
          `تصویر محصول "${item.name}" نامعتبر است`,
          400,
          "INVALID_IMAGE"
        );
      }
    }

    // اعتبارسنجی فرم با zod
    try {
      await checkoutFormSchema.parseAsync(formData);
    } catch (validationError: any) {
      throw new AppError(
        "اطلاعات فرم نامعتبر است",
        400,
        "VALIDATION_ERROR",
        validationError.errors || validationError.message
      );
    }

    // اعتبارسنجی مبلغ
    const sanitizedTotal = sanitizeNumber(total);
    const sanitizedShippingCost = sanitizeNumber(shippingCost || 0);

    if (sanitizedTotal <= 0 || !isFinite(sanitizedTotal)) {
      throw new AppError("مبلغ سفارش نامعتبر است", 400, "INVALID_TOTAL");
    }

    if (sanitizedShippingCost < 0 || !isFinite(sanitizedShippingCost)) {
      throw new AppError("هزینه ارسال نامعتبر است", 400, "INVALID_SHIPPING_COST");
    }

    // بررسی محدودیت مبلغ کل
    const maxOrderAmount = 10000000000; // 10 میلیارد تومان (برای سفارشات بزرگ)
    if (sanitizedTotal > maxOrderAmount) {
      throw new AppError(
        `مبلغ سفارش نمی‌تواند بیشتر از ${maxOrderAmount.toLocaleString("fa-IR")} تومان باشد`,
        400,
        "ORDER_AMOUNT_EXCEEDED"
      );
    }

    // اعتبارسنجی روش ارسال
    if (shippingMethod && shippingMethod !== "air" && shippingMethod !== "sea") {
      throw new AppError("روش ارسال نامعتبر است", 400, "INVALID_SHIPPING_METHOD");
    }

    // بررسی اینکه روش ارسال انتخاب شده برای تمام محصولات در سفارش معتبر است
    if (shippingMethod) {
      for (const item of items) {
        try {
          const product = await getRow<any>("SELECT \"airShippingEnabled\", \"seaShippingEnabled\" FROM products WHERE id = ?", [item.id]);
          if (product) {
            if (shippingMethod === "air" && !product.airShippingEnabled) {
              throw new AppError(
                `روش ارسال هوایی برای محصول "${item.name}" فعال نیست`,
                400,
                "SHIPPING_METHOD_NOT_AVAILABLE"
              );
            }
            if (shippingMethod === "sea" && !product.seaShippingEnabled) {
              throw new AppError(
                `روش ارسال دریایی برای محصول "${item.name}" فعال نیست`,
                400,
                "SHIPPING_METHOD_NOT_AVAILABLE"
              );
            }
          }
        } catch (error: any) {
          // اگر خطای AppError است، آن را throw کن
          if (error instanceof AppError) {
            throw error;
          }
          // در غیر این صورت، اگر محصول پیدا نشد، ادامه بده (ممکن است محصول حذف شده باشد)
          logger.warn(`Product ${item.id} not found, skipping shipping method validation`);
        }
      }
    }

    // تولید شماره سفارش
    const generateOrderNumber = () => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
      return `ORD-${timestamp}-${random}`;
    };

    // Sanitize داده‌های فرم
    const sanitizedFormData = {
      firstName: sanitizeString(formData.firstName),
      lastName: sanitizeString(formData.lastName || ""),
      phone: sanitizeString(formData.phone).replace(/\D/g, ""),
      email: formData.email ? sanitizeString(formData.email).toLowerCase() : undefined,
      addressType: formData.addressType || "address",
      location: formData.location ? sanitizeString(formData.location) : undefined,
      address: formData.address ? sanitizeString(formData.address) : undefined,
      city: formData.city ? sanitizeString(formData.city) : undefined,
      postalCode: formData.postalCode ? sanitizeString(formData.postalCode).replace(/\D/g, "") : undefined,
      province: formData.province ? sanitizeString(formData.province) : "",
      notes: formData.notes ? sanitizeString(formData.notes) : undefined,
    };

    // ساخت shippingAddress بر اساس addressType
    let shippingAddress: any = {
      addressType: sanitizedFormData.addressType,
      province: sanitizedFormData.province || undefined,
    };

    if (sanitizedFormData.addressType === "location") {
      shippingAddress.location = sanitizedFormData.location;
    } else if (sanitizedFormData.addressType === "postalCode") {
      shippingAddress.postalCode = sanitizedFormData.postalCode;
    } else {
      // address type
      shippingAddress.address = sanitizedFormData.address;
      shippingAddress.city = sanitizedFormData.city;
      if (sanitizedFormData.postalCode) {
        shippingAddress.postalCode = sanitizedFormData.postalCode;
      }
    }

    // ساخت داده‌های سفارش با داده‌های sanitize شده
    const orderData = {
      items: items.map((item: any) => ({
        id: sanitizeString(item.id),
        productId: sanitizeString(item.id),
        name: sanitizeString(item.name),
        price: sanitizeNumber(item.price),
        quantity: Math.floor(sanitizeNumber(item.quantity)),
        image: item.image ? sanitizeString(item.image) : "",
      })),
      total: Math.round(sanitizedTotal - sanitizedShippingCost),
      shippingCost: Math.round(sanitizedShippingCost),
      shippingMethod: (shippingMethod || "air") as "air" | "sea",
      status: "pending" as const,
      paymentStatus: "paid" as const,
      customerName: `${sanitizedFormData.firstName}${sanitizedFormData.lastName ? ` ${sanitizedFormData.lastName}` : ""}`.trim(),
      customerPhone: sanitizedFormData.phone,
      customerEmail: sanitizedFormData.email || undefined,
      shippingAddress,
      notes: sanitizedFormData.notes || undefined,
      userId: finalUserId,
      orderNumber: generateOrderNumber(),
    };

    // Save order to database
    const id = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    // اطمینان از اینکه userId به صورت string ذخیره می‌شود
    const userIdToSave = String(finalUserId);

    // Log before insert
    logger.info(`📦 Attempting to insert order: ${orderData.orderNumber}`, {
      id,
      userId: userIdToSave,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      total: orderData.total,
      itemsCount: orderData.items.length,
    });

    try {
      const insertResult = await runQuery(
        `INSERT INTO orders (id, \`orderNumber\`, \`userId\`, \`customerName\`, \`customerPhone\`, \`customerEmail\`, items, total, \`shippingCost\`, \`shippingMethod\`, \`shippingAddress\`, status, \`paymentStatus\`, notes, \`createdAt\`, \`updatedAt\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          orderData.orderNumber,
          userIdToSave,
          orderData.customerName,
          orderData.customerPhone,
          orderData.customerEmail || null,
          JSON.stringify(orderData.items),
          orderData.total,
          orderData.shippingCost,
          orderData.shippingMethod,
          JSON.stringify(orderData.shippingAddress),
          orderData.status,
          orderData.paymentStatus,
          orderData.notes || null,
          now,
          now,
        ]
      );
      
      logger.info(`✅ Order inserted successfully: ${orderData.orderNumber}`, {
        id,
        affectedRows: insertResult.changes,
        insertId: insertResult.lastInsertRowid,
      });
    } catch (insertError: any) {
      logger.error(`❌ Error inserting order: ${orderData.orderNumber}`, {
        id,
        error: insertError?.message,
        code: insertError?.code,
        sqlState: insertError?.sqlState,
        errno: insertError?.errno,
        stack: insertError?.stack,
      });
      
      // Re-throw with more context
      throw new AppError(
        `خطا در ذخیره سفارش در دیتابیس: ${insertError?.message || 'خطای نامشخص'}`,
        500,
        "ORDER_INSERT_ERROR",
        { originalError: insertError?.code, orderNumber: orderData.orderNumber }
      );
    }
    
    // Log successful order creation with userId
    logger.info(`✅ Order created successfully: ${orderData.orderNumber} with userId: ${userIdToSave}`);

    // Fetch the saved order
    let savedOrder;
    try {
      savedOrder = await getRow<any>("SELECT * FROM orders WHERE id = ?", [id]);
      
      if (!savedOrder) {
        logger.error(`❌ Order not found after insert: ${id}`, {
          orderNumber: orderData.orderNumber,
        });
        throw new AppError("سفارش ثبت شد اما بازیابی نشد", 500, "ORDER_NOT_FOUND_AFTER_INSERT");
      }
      
      logger.info(`✅ Order fetched successfully: ${orderData.orderNumber}`, {
        id: savedOrder.id,
        userId: savedOrder.userId,
      });
    } catch (fetchError: any) {
      logger.error(`❌ Error fetching order after insert: ${id}`, {
        error: fetchError?.message,
        code: fetchError?.code,
      });
      throw new AppError(
        `خطا در بازیابی سفارش: ${fetchError?.message || 'خطای نامشخص'}`,
        500,
        "ORDER_FETCH_ERROR"
      );
    }

    // Parse JSON fields (PostgreSQL JSONB returns objects, not strings)
    const parsedOrder = {
      ...savedOrder,
      items: Array.isArray(savedOrder.items) ? savedOrder.items : (typeof savedOrder.items === 'string' ? JSON.parse(savedOrder.items) : []),
      shippingAddress: typeof savedOrder.shippingAddress === 'object' && savedOrder.shippingAddress !== null 
        ? savedOrder.shippingAddress 
        : (typeof savedOrder.shippingAddress === 'string' ? JSON.parse(savedOrder.shippingAddress) : {}),
      total: Number(savedOrder.total),
      shippingCost: Number(savedOrder.shippingCost),
      createdAt: savedOrder.createdAt instanceof Date ? savedOrder.createdAt : new Date(savedOrder.createdAt),
      updatedAt: savedOrder.updatedAt instanceof Date ? savedOrder.updatedAt : new Date(savedOrder.updatedAt),
    };

    return createSuccessResponse({
      order: parsedOrder,
    }, 201);
  } catch (error) {
    return createErrorResponse(error);
  }
}
