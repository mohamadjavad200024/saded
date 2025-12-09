import { NextRequest } from "next/server";
import { getRow, runQuery } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import { logger } from "@/lib/logger";
import { parseProduct } from "@/lib/parsers";
import type { Product } from "@/types/product";

/**
 * GET /api/products/[id] - Get product by ID
 * PUT /api/products/[id] - Update product
 * DELETE /api/products/[id] - Delete product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await getRow<any>(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (!product) {
      throw new AppError("محصول یافت نشد", 404, "PRODUCT_NOT_FOUND");
    }

    // Parse product data safely
    const parsedProduct: Product = parseProduct(product);

    return createSuccessResponse(parsedProduct);
  } catch (error: any) {
    logger.error("GET /api/products/[id] error:", {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });
    return createErrorResponse(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json().catch(() => {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    });

    const product = await getRow<any>("SELECT * FROM products WHERE id = ?", [id]);
    if (!product) {
      throw new AppError("محصول یافت نشد", 404, "PRODUCT_NOT_FOUND");
    }

    const updates: any = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    // Convert arrays/objects to JSON strings
    if (updates.images) updates.images = JSON.stringify(updates.images);
    if (updates.tags) updates.tags = JSON.stringify(updates.tags);
    if (updates.specifications) updates.specifications = JSON.stringify(updates.specifications);
    
    // Ensure boolean values are properly converted
    if (updates.airShippingEnabled !== undefined) {
      updates.airShippingEnabled = typeof updates.airShippingEnabled === "boolean" 
        ? updates.airShippingEnabled 
        : (updates.airShippingEnabled === true || updates.airShippingEnabled === "true" || updates.airShippingEnabled === 1);
    }
    if (updates.seaShippingEnabled !== undefined) {
      updates.seaShippingEnabled = typeof updates.seaShippingEnabled === "boolean" 
        ? updates.seaShippingEnabled 
        : (updates.seaShippingEnabled === true || updates.seaShippingEnabled === "true" || updates.seaShippingEnabled === 1);
    }
    // Ensure shipping cost values are properly converted
    if (updates.airShippingCost !== undefined) {
      updates.airShippingCost = updates.airShippingCost !== null && updates.airShippingCost !== undefined 
        ? Math.max(0, Math.round(Number(updates.airShippingCost))) 
        : null;
    }
    if (updates.seaShippingCost !== undefined) {
      updates.seaShippingCost = updates.seaShippingCost !== null && updates.seaShippingCost !== undefined 
        ? Math.max(0, Math.round(Number(updates.seaShippingCost))) 
        : null;
    }
    // MySQL accepts boolean values directly, no need to convert to 1/0
    // Keep boolean values as-is for MySQL

    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);
    values.push(id);

    await runQuery(`UPDATE products SET ${setClause} WHERE id = ?`, values);

    const updatedProduct = await getRow<any>("SELECT * FROM products WHERE id = ?", [id]);
    
    // Parse product data safely
    const parsedProduct: Product = parseProduct(updatedProduct);

    return createSuccessResponse(parsedProduct);
  } catch (error: any) {
    logger.error("PUT /api/products/[id] error:", {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });
    return createErrorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await getRow<any>("SELECT * FROM products WHERE id = ?", [id]);
    if (!product) {
      throw new AppError("محصول یافت نشد", 404, "PRODUCT_NOT_FOUND");
    }

    await runQuery("DELETE FROM products WHERE id = ?", [id]);

    return createSuccessResponse({ message: "محصول با موفقیت حذف شد" });
  } catch (error: any) {
    logger.error("DELETE /api/products/[id] error:", {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });
    return createErrorResponse(error);
  }
}
