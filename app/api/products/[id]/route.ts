import { NextRequest } from "next/server";
import { getRow, runQuery } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
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

    // Parse JSON fields (PostgreSQL JSONB returns objects, not strings)
    const parsedProduct: Product = {
      ...product,
      images: Array.isArray(product.images) ? product.images : (typeof product.images === 'string' ? JSON.parse(product.images) : []),
      tags: Array.isArray(product.tags) ? product.tags : (typeof product.tags === 'string' ? JSON.parse(product.tags) : []),
      specifications: typeof product.specifications === 'object' && product.specifications !== null 
        ? product.specifications 
        : (typeof product.specifications === 'string' ? JSON.parse(product.specifications) : {}),
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
      stockCount: Number(product.stockCount),
      inStock: Boolean(product.inStock),
      enabled: Boolean(product.enabled),
      vinEnabled: Boolean(product.vinEnabled),
      airShippingEnabled: Boolean(product.airShippingEnabled),
      seaShippingEnabled: Boolean(product.seaShippingEnabled),
      airShippingCost: product.airShippingCost !== null && product.airShippingCost !== undefined ? Number(product.airShippingCost) : null,
      seaShippingCost: product.seaShippingCost !== null && product.seaShippingCost !== undefined ? Number(product.seaShippingCost) : null,
      createdAt: product.createdAt instanceof Date ? product.createdAt : new Date(product.createdAt),
      updatedAt: product.updatedAt instanceof Date ? product.updatedAt : new Date(product.updatedAt),
    };

    return createSuccessResponse(parsedProduct);
  } catch (error) {
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
    // PostgreSQL accepts boolean values directly, no need to convert to 1/0
    // Keep boolean values as-is for PostgreSQL

    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);
    values.push(id);

    await runQuery(`UPDATE products SET ${setClause} WHERE id = ?`, values);

    const updatedProduct = await getRow<any>("SELECT * FROM products WHERE id = ?", [id]);
    
    // Parse JSON fields (PostgreSQL JSONB returns objects, not strings)
    const parsedProduct: Product = {
      ...updatedProduct,
      images: Array.isArray(updatedProduct.images) ? updatedProduct.images : (typeof updatedProduct.images === 'string' ? JSON.parse(updatedProduct.images) : []),
      tags: Array.isArray(updatedProduct.tags) ? updatedProduct.tags : (typeof updatedProduct.tags === 'string' ? JSON.parse(updatedProduct.tags) : []),
      specifications: typeof updatedProduct.specifications === 'object' && updatedProduct.specifications !== null 
        ? updatedProduct.specifications 
        : (typeof updatedProduct.specifications === 'string' ? JSON.parse(updatedProduct.specifications) : {}),
      price: Number(updatedProduct.price),
      originalPrice: updatedProduct.originalPrice ? Number(updatedProduct.originalPrice) : undefined,
      stockCount: Number(updatedProduct.stockCount),
      inStock: Boolean(updatedProduct.inStock),
      enabled: Boolean(updatedProduct.enabled),
      vinEnabled: Boolean(updatedProduct.vinEnabled),
      airShippingEnabled: Boolean(updatedProduct.airShippingEnabled),
      seaShippingEnabled: Boolean(updatedProduct.seaShippingEnabled),
      airShippingCost: updatedProduct.airShippingCost !== null && updatedProduct.airShippingCost !== undefined ? Number(updatedProduct.airShippingCost) : null,
      seaShippingCost: updatedProduct.seaShippingCost !== null && updatedProduct.seaShippingCost !== undefined ? Number(updatedProduct.seaShippingCost) : null,
      createdAt: updatedProduct.createdAt instanceof Date ? updatedProduct.createdAt : new Date(updatedProduct.createdAt),
      updatedAt: updatedProduct.updatedAt instanceof Date ? updatedProduct.updatedAt : new Date(updatedProduct.updatedAt),
    };

    return createSuccessResponse(parsedProduct);
  } catch (error) {
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
  } catch (error) {
    return createErrorResponse(error);
  }
}
