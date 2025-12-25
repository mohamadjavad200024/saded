import { NextRequest } from "next/server";
import { getRow, runQuery } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import type { Product } from "@/types/product";
import { normalizeImages, normalizeTags, normalizeSpecifications } from "@/lib/product-utils";

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

    // Parse JSON fields with normalization
    const parsedProduct: Product = {
      ...product,
      images: normalizeImages(product.images),
      tags: normalizeTags(product.tags),
      specifications: normalizeSpecifications(product.specifications),
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

    // #region agent log
    fetch(logEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:47',message:'GET product parsed',data:{productId:parsedProduct.id,airShippingEnabledRaw:product.airShippingEnabled,airShippingEnabledType:typeof product.airShippingEnabled,airShippingEnabledParsed:parsedProduct.airShippingEnabled,airShippingEnabledParsedType:typeof parsedProduct.airShippingEnabled,seaShippingEnabledRaw:product.seaShippingEnabled,seaShippingEnabledType:typeof product.seaShippingEnabled,seaShippingEnabledParsed:parsedProduct.seaShippingEnabled,seaShippingEnabledParsedType:typeof parsedProduct.seaShippingEnabled},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    return createSuccessResponse(parsedProduct);
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // #region agent log
  const logEndpoint = 'http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615';
  fetch(logEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:55',message:'PUT handler entry',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  try {
    const { id } = await params;
    // #region agent log
    fetch(logEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:60',message:'Params extracted',data:{id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    const body = await request.json().catch(() => {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    });
    // #region agent log
    fetch(logEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:65',message:'Request body parsed',data:{bodyKeys:Object.keys(body),airShippingCost:body.airShippingCost,seaShippingCost:body.seaShippingCost,airShippingCostType:typeof body.airShippingCost,seaShippingCostType:typeof body.seaShippingCost,specsType:typeof body.specifications,tagsType:typeof body.tags},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    const product = await getRow<any>("SELECT * FROM products WHERE id = ?", [id]);
    if (!product) {
      throw new AppError("محصول یافت نشد", 404, "PRODUCT_NOT_FOUND");
    }

    // Define allowed fields that can be updated (exclude id, createdAt, etc.)
    const allowedFields = [
      'name', 'description', 'price', 'originalPrice', 'brand', 
      'category', 'vehicle', 'model', 'vin', 'vinEnabled',
      'airShippingEnabled', 'seaShippingEnabled', 'airShippingCost', 
      'seaShippingCost', 'stockCount', 'inStock', 'enabled',
      'images', 'tags', 'specifications'
    ];

    // Filter out undefined values and non-updatable fields
    const filteredUpdates: any = {
      updatedAt: new Date().toISOString(),
    };

    // Only include allowed fields that are not undefined
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        filteredUpdates[key] = body[key];
      }
    }

    // Convert arrays/objects to JSON strings
    if (filteredUpdates.images !== undefined) {
      filteredUpdates.images = JSON.stringify(filteredUpdates.images);
    }
    if (filteredUpdates.tags !== undefined) {
      filteredUpdates.tags = JSON.stringify(filteredUpdates.tags);
    }
    if (filteredUpdates.specifications !== undefined) {
      filteredUpdates.specifications = JSON.stringify(filteredUpdates.specifications);
    }
    
    // Ensure boolean values are properly converted
    if (filteredUpdates.airShippingEnabled !== undefined) {
      filteredUpdates.airShippingEnabled = typeof filteredUpdates.airShippingEnabled === "boolean" 
        ? filteredUpdates.airShippingEnabled 
        : (filteredUpdates.airShippingEnabled === true || filteredUpdates.airShippingEnabled === "true" || filteredUpdates.airShippingEnabled === 1);
    }
    if (filteredUpdates.seaShippingEnabled !== undefined) {
      filteredUpdates.seaShippingEnabled = typeof filteredUpdates.seaShippingEnabled === "boolean" 
        ? filteredUpdates.seaShippingEnabled 
        : (filteredUpdates.seaShippingEnabled === true || filteredUpdates.seaShippingEnabled === "true" || filteredUpdates.seaShippingEnabled === 1);
    }
    // Ensure shipping cost values are properly converted
    if (filteredUpdates.airShippingCost !== undefined) {
      filteredUpdates.airShippingCost = filteredUpdates.airShippingCost !== null && filteredUpdates.airShippingCost !== undefined 
        ? Math.max(0, Math.round(Number(filteredUpdates.airShippingCost))) 
        : null;
    }
    if (filteredUpdates.seaShippingCost !== undefined) {
      filteredUpdates.seaShippingCost = filteredUpdates.seaShippingCost !== null && filteredUpdates.seaShippingCost !== undefined 
        ? Math.max(0, Math.round(Number(filteredUpdates.seaShippingCost))) 
        : null;
    }

    // Build SQL query only with fields that have values
    const setClause = Object.keys(filteredUpdates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(filteredUpdates);
    values.push(id);

    // #region agent log
    fetch(logEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:130',message:'Before database update',data:{setClause,valuesCount:values.length,filteredUpdatesKeys:Object.keys(filteredUpdates),airShippingCost:filteredUpdates.airShippingCost,seaShippingCost:filteredUpdates.seaShippingCost},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion

    await runQuery(`UPDATE products SET ${setClause} WHERE id = ?`, values);
    
    // #region agent log
    fetch(logEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:133',message:'Database update completed',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion

    const updatedProduct = await getRow<any>("SELECT * FROM products WHERE id = ?", [id]);
    
    // Parse JSON fields with normalization
    const parsedProduct: Product = {
      ...updatedProduct,
      images: normalizeImages(updatedProduct.images),
      tags: normalizeTags(updatedProduct.tags),
      specifications: normalizeSpecifications(updatedProduct.specifications),
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

    // #region agent log
    fetch(logEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:175',message:'PUT handler success',data:{productId:parsedProduct.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    return createSuccessResponse(parsedProduct);
  } catch (error) {
    // #region agent log
    fetch(logEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:177',message:'PUT handler error',data:{errorMessage:error instanceof Error ? error.message : String(error),errorType:error?.constructor?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
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
