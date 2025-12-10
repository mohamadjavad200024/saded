import { NextRequest, NextResponse } from "next/server";
import { getRow, runQuery, getRows } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import type { CartItem } from "@/store/cart-store";
import { logger } from "@/lib/logger";

/**
 * GET /api/cart - Get cart for current session
 * POST /api/cart - Save/Update cart for current session
 */
export async function GET(request: NextRequest) {
  try {
    // Get session ID from cookie or header
    const sessionId = request.headers.get("x-cart-session-id") ||
                     request.cookies.get("cart-session-id")?.value ||
                     null;

    if (!sessionId) {
      // Return empty cart if no session
      return createSuccessResponse({
        items: [],
        shippingMethod: null,
      });
    }

    try {
      // Ensure table exists (will be created if it doesn't exist)
      try {
        await runQuery(`
          CREATE TABLE IF NOT EXISTS carts (
            id VARCHAR(255) PRIMARY KEY,
            \`sessionId\` VARCHAR(255) NOT NULL,
            \`userId\` VARCHAR(255),
            items JSON NOT NULL DEFAULT '[]',
            \`shippingMethod\` VARCHAR(50),
            \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE(\`sessionId\`)
          );
          CREATE INDEX IF NOT EXISTS idx_carts_sessionId ON carts(\`sessionId\`);
          CREATE INDEX IF NOT EXISTS idx_carts_userId ON carts(\`userId\`);
        `);
      } catch (createError: any) {
        // Ignore if table already exists
        if (createError?.code !== "42P07" && !createError?.message?.includes("already exists")) {
          logger.error("Error creating carts table:", createError);
        }
      }
      
      const cart = await getRow<any>(
        "SELECT * FROM carts WHERE \"sessionId\" = ?",
        [sessionId]
      );

      if (!cart) {
        const emptyResponse = createSuccessResponse({
          items: [],
          shippingMethod: null,
        });
        // Set cookie even for empty cart
        emptyResponse.cookies.set("cart-session-id", sessionId, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 365,
          path: "/",
        });
        return emptyResponse;
      }

      // Parse items from JSONB
      const items: CartItem[] = Array.isArray(cart.items)
        ? cart.items
        : typeof cart.items === "string"
        ? JSON.parse(cart.items)
        : [];

      // Log items for debugging
      if (items.length > 0) {
        logger.debug("Loading cart items from DB:", {
          itemCount: items.length,
          firstItem: {
            id: items[0].id,
            name: items[0].name,
            hasImage: !!items[0].image,
            imageLength: items[0].image?.length || 0,
            imageType: items[0].image?.startsWith("data:") ? "base64" : items[0].image?.startsWith("http") ? "url" : "other",
          },
        });
      }

      const response = NextResponse.json({
        success: true,
        data: {
          items,
          shippingMethod: cart.shippingMethod || null,
        },
      });
      
      // Set cookie for session ID
      response.cookies.set("cart-session-id", sessionId, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      });
      
      return response;
    } catch (dbError: any) {
      logger.error("Error fetching cart:", dbError);
      if (
        dbError?.message?.includes("not available") ||
        dbError?.code === "DATABASE_NOT_AVAILABLE" ||
        dbError?.code === "ECONNREFUSED" ||
        dbError?.message?.includes("connect") ||
        dbError?.message?.includes("timeout")
      ) {
        // If database is not available, return empty cart (fallback to localStorage)
        const fallbackResponse = createSuccessResponse({
          items: [],
          shippingMethod: null,
        });
        if (sessionId) {
          fallbackResponse.cookies.set("cart-session-id", sessionId, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365,
            path: "/",
          });
        }
        return fallbackResponse;
      }
      throw dbError;
    }
  } catch (error: any) {
    logger.error("GET /api/cart error:", error);
    return createErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    });

    const { items, shippingMethod, sessionId } = body;

    if (!sessionId || typeof sessionId !== "string") {
      throw new AppError("Session ID is required", 400, "MISSING_SESSION_ID");
    }

    if (!Array.isArray(items)) {
      throw new AppError("Items must be an array", 400, "INVALID_ITEMS");
    }

    // Validate items
    for (const item of items) {
      if (!item.id || !item.name || typeof item.price !== "number" || typeof item.quantity !== "number") {
        throw new AppError("Invalid cart item", 400, "INVALID_ITEM");
      }
      // Log image info for debugging
      logger.debug("Saving cart item to DB:", {
        id: item.id,
        name: item.name,
        hasImage: !!item.image,
        imageLength: item.image?.length || 0,
        imageType: item.image?.startsWith("data:") ? "base64" : item.image?.startsWith("http") ? "url" : "other",
      });
    }

    const now = new Date().toISOString();

    try {
      // Ensure table exists (will be created if it doesn't exist)
      try {
        await runQuery(`
          CREATE TABLE IF NOT EXISTS carts (
            id VARCHAR(255) PRIMARY KEY,
            \`sessionId\` VARCHAR(255) NOT NULL,
            \`userId\` VARCHAR(255),
            items JSON NOT NULL DEFAULT '[]',
            \`shippingMethod\` VARCHAR(50),
            \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE(\`sessionId\`)
          );
          CREATE INDEX IF NOT EXISTS idx_carts_sessionId ON carts(\`sessionId\`);
          CREATE INDEX IF NOT EXISTS idx_carts_userId ON carts(\`userId\`);
        `);
      } catch (createError: any) {
        // Ignore if table already exists
        if (createError?.code !== "42P07" && !createError?.message?.includes("already exists")) {
          logger.error("Error creating carts table:", createError);
        }
      }
      
      // Check if cart exists
      const existingCart = await getRow<any>(
        "SELECT * FROM carts WHERE \"sessionId\" = ?",
        [sessionId]
      );

      if (existingCart) {
        // Update existing cart
        const updateResult = await runQuery(
          `UPDATE carts SET items = ?, \`shippingMethod\` = ?, \`updatedAt\` = ? WHERE \`sessionId\` = ?`,
          [JSON.stringify(items), shippingMethod || null, now, sessionId]
        );
        logger.debug("Cart updated in database:", { sessionId, itemCount: items.length });
      } else {
        // Create new cart
        const cartId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const insertResult = await runQuery(
          `INSERT INTO carts (id, \`sessionId\`, items, \`shippingMethod\`, \`createdAt\`, \`updatedAt\`)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [cartId, sessionId, JSON.stringify(items), shippingMethod || null, now, now]
        );
        logger.debug("Cart created in database:", { cartId, sessionId, itemCount: items.length });
      }

      const response = NextResponse.json({
        success: true,
        message: "Cart saved successfully",
      });
      
      // Set cookie for session ID
      response.cookies.set("cart-session-id", sessionId, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      });
      
      return response;
    } catch (dbError: any) {
      logger.error("Error saving cart:", {
        message: dbError?.message,
        code: dbError?.code,
        detail: dbError?.detail,
        hint: dbError?.hint,
        sessionId,
      });
      
      // Check if table doesn't exist
      if (dbError?.message?.includes("does not exist") || dbError?.code === "42P01") {
        logger.error("Carts table does not exist. Please restart the server to create it.");
        return createErrorResponse(
          new AppError("جدول سبد خرید در دیتابیس وجود ندارد. لطفاً سرور را restart کنید.", 500, "TABLE_NOT_EXISTS")
        );
      }
      
      if (
        dbError?.message?.includes("not available") ||
        dbError?.code === "DATABASE_NOT_AVAILABLE" ||
        dbError?.code === "ECONNREFUSED" ||
        dbError?.message?.includes("connect") ||
        dbError?.message?.includes("timeout")
      ) {
        // If database is not available, return success but cart won't be saved
        // Client will fallback to localStorage
        return createSuccessResponse({
          success: false,
          message: "Database not available, cart saved to local storage only",
        });
      }
      throw dbError;
    }
  } catch (error: any) {
    logger.error("POST /api/cart error:", error);
    return createErrorResponse(error);
  }
}

