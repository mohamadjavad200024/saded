import { NextRequest } from "next/server";
import { checkoutFormSchema } from "@/lib/validations/checkout";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import { runQuery, getRow } from "@/lib/db/index";
import { logger } from "@/lib/logger";

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
      if (price <= 0 || price > 100000000) {
        throw new AppError(
          `قیمت محصول "${item.name}" نامعتبر است (${price})`,
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
    const maxOrderAmount = 100000000; // 100 میلیون تومان
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
      lastName: sanitizeString(formData.lastName),
      phone: sanitizeString(formData.phone).replace(/\D/g, ""),
      email: sanitizeString(formData.email).toLowerCase(),
      address: sanitizeString(formData.address),
      city: sanitizeString(formData.city),
      postalCode: formData.postalCode ? sanitizeString(formData.postalCode).replace(/\D/g, "") : undefined,
      province: formData.province ? sanitizeString(formData.province) : "",
      notes: formData.notes ? sanitizeString(formData.notes) : undefined,
    };

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
      customerName: `${sanitizedFormData.firstName} ${sanitizedFormData.lastName}`.trim(),
      customerPhone: sanitizedFormData.phone,
      customerEmail: sanitizedFormData.email || undefined,
      shippingAddress: {
        province: sanitizedFormData.province,
        city: sanitizedFormData.city,
        address: sanitizedFormData.address,
        postalCode: sanitizedFormData.postalCode || undefined,
      },
      notes: sanitizedFormData.notes || undefined,
      userId: "guest",
      orderNumber: generateOrderNumber(),
    };

    // Save order to database
    const id = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    await runQuery(
      `INSERT INTO orders (id, "orderNumber", "userId", "customerName", "customerPhone", "customerEmail", items, total, "shippingCost", "shippingMethod", "shippingAddress", status, "paymentStatus", notes, "createdAt", "updatedAt")
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        orderData.orderNumber,
        orderData.userId,
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

    // Fetch the saved order
    const savedOrder = await getRow<any>("SELECT * FROM orders WHERE id = ?", [id]);

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
