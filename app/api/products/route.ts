import { NextRequest } from "next/server";
import { getRows, getRow, runQuery } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import type { Product, ProductFilters } from "@/types/product";
import { cache, cacheKeys, withCache } from "@/lib/cache";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

/**
 * GET /api/products - Get all products with pagination
 * Query params: page (default: 1), limit (default: 50)
 */
export async function GET(request: NextRequest) {
  // Rate limiting: 100 requests per minute per IP
  const rateLimitResponse = await rateLimit(100, 60000)(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Parse pagination parameters from query string
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(1000, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const offset = (page - 1) * limit;
    
    // Check if we need all products (for admin pages)
    const includeAll = searchParams.get("all") === "true";

    // Get total count first
    let countResult: { count: number }[];
    let total = 0;
    let products: any[] = [];

    try {
      // Test database connection first
      const { testConnection } = await import("@/lib/db/index");
      const isConnected = await testConnection();
      
      if (!isConnected) {
        logger.warn("⚠️ Database connection test failed - returning empty products");
        // Return empty response instead of error
        return createSuccessResponse([], 200, {
          page,
          limit,
          total: 0,
          totalPages: 0,
        });
      }
    } catch (connectionTestError) {
      logger.warn("⚠️ Database connection test error - returning empty products:", connectionTestError);
      // Return empty response instead of error
      return createSuccessResponse([], 200, {
        page,
        limit,
        total: 0,
        totalPages: 0,
      });
    }

    try {
      // Generate cache key
      const cacheKey = cacheKeys.products(page, limit, includeAll ? 'all' : 'enabled');
      
      // Try to get from cache first (cache for 30 seconds)
      const cached = cache.get<{ products: Product[]; total: number }>(cacheKey);
      if (cached) {
        return createSuccessResponse(cached.products, 200, {
          page,
          limit,
          total: cached.total,
          totalPages: Math.ceil(cached.total / limit),
        });
      }

      // If all=true, count all products, otherwise only enabled ones
      const countQuery = includeAll 
        ? `SELECT COUNT(*) as count FROM products`
        : `SELECT COUNT(*) as count FROM products WHERE enabled = TRUE`;
      
      countResult = await getRows<{ count: number }>(countQuery);
      total = countResult[0]?.count || 0;

      // If all=true, get all products, otherwise only enabled ones
      const productsQuery = includeAll
        ? `SELECT * FROM products ORDER BY \`createdAt\` DESC LIMIT ? OFFSET ?`
        : `SELECT * FROM products WHERE enabled = TRUE ORDER BY \`createdAt\` DESC LIMIT ? OFFSET ?`;
      
      // Get paginated products (wrapper converts ? to $1, $2 for PostgreSQL)
      products = await getRows<Product>(productsQuery, [limit, offset]);
      
      // Cache the result for 5 minutes (increased from 30 seconds for better performance)
      cache.set(cacheKey, { products, total }, 5 * 60 * 1000);
    } catch (dbError: any) {
      logger.error("Database error in GET /api/products:", {
        message: dbError?.message,
        code: dbError?.code,
        stack: dbError?.stack,
      });
      
      // Check for specific database connection errors
      const isConnectionError = 
        dbError?.code === "ECONNREFUSED" ||
        dbError?.code === "ETIMEDOUT" ||
        dbError?.code === "ENOTFOUND" ||
        dbError?.message?.includes("connection") ||
        dbError?.message?.includes("timeout");
      
      if (isConnectionError) {
        throw new AppError(
          "خطا در اتصال به دیتابیس. لطفاً مطمئن شوید که دیتابیس در حال اجرا است.",
          503,
          "DATABASE_CONNECTION_ERROR",
          process.env.NODE_ENV === "development" ? dbError : undefined
        );
      }
      
      throw new AppError(
        `خطا در دریافت محصولات: ${dbError?.message || "خطای نامشخص"}`,
        500,
        "DATABASE_ERROR",
        process.env.NODE_ENV === "development" ? dbError : undefined
      );
    }

    // Parse JSON fields (PostgreSQL JSONB returns objects, not strings)
    const parsedProducts = products.map((p: any) => ({
      ...p,
      images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : []),
      tags: Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? JSON.parse(p.tags) : []),
      specifications: typeof p.specifications === 'object' && p.specifications !== null 
        ? p.specifications 
        : (typeof p.specifications === 'string' ? JSON.parse(p.specifications) : {}),
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
      stockCount: Number(p.stockCount),
      inStock: Boolean(p.inStock),
      enabled: Boolean(p.enabled),
      vinEnabled: Boolean(p.vinEnabled),
      airShippingEnabled: Boolean(p.airShippingEnabled),
      seaShippingEnabled: Boolean(p.seaShippingEnabled),
      airShippingCost: p.airShippingCost !== null && p.airShippingCost !== undefined ? Number(p.airShippingCost) : null,
      seaShippingCost: p.seaShippingCost !== null && p.seaShippingCost !== undefined ? Number(p.seaShippingCost) : null,
      createdAt: p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt),
      updatedAt: p.updatedAt instanceof Date ? p.updatedAt : new Date(p.updatedAt),
    }));

    const totalPages = Math.ceil(total / limit);

    return createSuccessResponse(parsedProducts, 200, {
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * POST /api/products - Create new product OR Get filtered products with pagination
 * Body for create: { name, description, price, brand, category, ... }
 * Body for filter: { filters: ProductFilters, page?: number, limit?: number }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    });

    // Check if this is a create request (has name and price) or filter request (has filters property)
    if (body.name && body.price !== undefined && !body.filters) {
      // This is a create request
      const {
        name,
        description,
        price,
        originalPrice,
        brand,
        category,
        vin,
        vinEnabled,
        airShippingEnabled,
        seaShippingEnabled,
        airShippingCost,
        seaShippingCost,
        stockCount,
        inStock,
        enabled,
        images,
        tags,
        specifications,
      } = body;

      // Validation
      if (!name || typeof name !== "string" || name.trim() === "") {
        throw new AppError("نام محصول الزامی است", 400, "MISSING_NAME");
      }
      if (!description || typeof description !== "string" || description.trim() === "") {
        throw new AppError("توضیحات محصول الزامی است", 400, "MISSING_DESCRIPTION");
      }
      if (price === undefined || typeof price !== "number" || price < 0) {
        throw new AppError("قیمت محصول الزامی است و باید مثبت باشد", 400, "INVALID_PRICE");
      }
      if (!brand || typeof brand !== "string" || brand.trim() === "") {
        throw new AppError("برند محصول الزامی است", 400, "MISSING_BRAND");
      }
      if (!category || typeof category !== "string" || category.trim() === "") {
        throw new AppError("دسته‌بندی محصول الزامی است", 400, "MISSING_CATEGORY");
      }
      if (!images || !Array.isArray(images) || images.length === 0) {
        throw new AppError("حداقل یک تصویر الزامی است", 400, "MISSING_IMAGES");
      }

      const id = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      // Prepare data for database
      const productData: any = {
        id,
        name: name.trim(),
        description: description.trim(),
        price: Math.round(price),
        originalPrice: originalPrice ? Math.round(originalPrice) : null,
        brand: brand.trim(),
        category: category.trim(),
        vin: vin && vinEnabled ? vin.trim() : null,
        vinEnabled: vinEnabled ? true : false,
        airShippingEnabled: typeof airShippingEnabled === "boolean" ? airShippingEnabled : (airShippingEnabled === true || airShippingEnabled === "true" || airShippingEnabled === 1),
        seaShippingEnabled: typeof seaShippingEnabled === "boolean" ? seaShippingEnabled : (seaShippingEnabled === true || seaShippingEnabled === "true" || seaShippingEnabled === 1),
        airShippingCost: airShippingCost !== undefined && airShippingCost !== null ? Math.max(0, Math.round(airShippingCost)) : null,
        seaShippingCost: seaShippingCost !== undefined && seaShippingCost !== null ? Math.max(0, Math.round(seaShippingCost)) : null,
        stockCount: Math.max(0, Math.round(stockCount || 0)),
        inStock: inStock !== false,
        enabled: enabled !== false,
        images: images, // PostgreSQL JSONB accepts arrays directly
        tags: tags && Array.isArray(tags) ? tags : [],
        specifications: specifications && typeof specifications === "object" ? specifications : {},
        createdAt: now,
        updatedAt: now,
      };

      // Insert into database (wrapper will convert ? to $1, $2, etc. for PostgreSQL)
      try {
        const insertResult = await runQuery(
        `INSERT INTO products (id, name, description, price, \`originalPrice\`, brand, category, vin, \`vinEnabled\`, \`airShippingEnabled\`, \`seaShippingEnabled\`, \`airShippingCost\`, \`seaShippingCost\`, \`stockCount\`, \`inStock\`, enabled, images, tags, specifications, \`createdAt\`, \`updatedAt\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productData.id,
          productData.name,
          productData.description,
          productData.price,
          productData.originalPrice,
          productData.brand,
          productData.category,
          productData.vin,
          productData.vinEnabled,
          productData.airShippingEnabled,
          productData.seaShippingEnabled,
          productData.airShippingCost,
          productData.seaShippingCost,
          productData.stockCount,
          productData.inStock,
          productData.enabled,
          JSON.stringify(productData.images),
          JSON.stringify(productData.tags),
          JSON.stringify(productData.specifications),
          productData.createdAt,
          productData.updatedAt,
        ]
      );
        logger.debug("Product inserted successfully:", { id, changes: insertResult.changes });
      } catch (insertError: any) {
        logger.error("Error inserting product:", insertError);
        throw new AppError(
          `خطا در ذخیره محصول: ${insertError?.message || "خطای نامشخص"}`,
          500,
          "INSERT_ERROR",
          process.env.NODE_ENV === "development" ? insertError : undefined
        );
      }

      // Get the created product
      const newProduct = await getRow<any>("SELECT * FROM products WHERE id = ?", [id]);
      
      if (!newProduct) {
        logger.error("Product not found after insert:", id);
        throw new AppError("محصول ایجاد شد اما پیدا نشد", 500, "PRODUCT_NOT_FOUND");
      }

      // Parse JSON fields (PostgreSQL JSONB returns objects, not strings)
      const parsedProduct: Product = {
        ...newProduct,
        images: Array.isArray(newProduct.images) ? newProduct.images : (typeof newProduct.images === 'string' ? JSON.parse(newProduct.images) : []),
        tags: Array.isArray(newProduct.tags) ? newProduct.tags : (typeof newProduct.tags === 'string' ? JSON.parse(newProduct.tags) : []),
        specifications: typeof newProduct.specifications === 'object' && newProduct.specifications !== null 
          ? newProduct.specifications 
          : (typeof newProduct.specifications === 'string' ? JSON.parse(newProduct.specifications) : {}),
        price: Number(newProduct.price),
        originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
        stockCount: Number(newProduct.stockCount),
        inStock: Boolean(newProduct.inStock),
        enabled: Boolean(newProduct.enabled),
        vinEnabled: Boolean(newProduct.vinEnabled),
        airShippingEnabled: Boolean(newProduct.airShippingEnabled),
        seaShippingEnabled: Boolean(newProduct.seaShippingEnabled),
        airShippingCost: newProduct.airShippingCost !== null && newProduct.airShippingCost !== undefined ? Number(newProduct.airShippingCost) : null,
        seaShippingCost: newProduct.seaShippingCost !== null && newProduct.seaShippingCost !== undefined ? Number(newProduct.seaShippingCost) : null,
        createdAt: newProduct.createdAt instanceof Date ? newProduct.createdAt : new Date(newProduct.createdAt),
        updatedAt: newProduct.updatedAt instanceof Date ? newProduct.updatedAt : new Date(newProduct.updatedAt),
      };

      return createSuccessResponse(parsedProduct, 201);
    }

    // This is a filter request
    const filters: ProductFilters = body.filters || body || {};
    const page = Math.max(1, parseInt(body.page || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(body.limit || "50", 10)));
    const offset = (page - 1) * limit;

    // Build WHERE clause for filters
    let whereClause = "WHERE enabled = TRUE";
    const params: any[] = [];

    // Apply filters
    if (filters.vin) {
      // VIN search - exact match and case-insensitive
      whereClause += " AND vinEnabled = TRUE AND UPPER(vin) = UPPER(?)";
      params.push(filters.vin.trim());
    } else if (filters.search) {
      // Search in multiple fields - case-insensitive
      const searchTerm = `%${filters.search.trim()}%`;
      whereClause += " AND (UPPER(name) LIKE UPPER(?) OR UPPER(description) LIKE UPPER(?) OR UPPER(brand) LIKE UPPER(?) OR UPPER(category) LIKE UPPER(?) OR UPPER(vin) LIKE UPPER(?))";
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (filters.minPrice !== undefined) {
      whereClause += " AND price >= ?";
      params.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      whereClause += " AND price <= ?";
      params.push(filters.maxPrice);
    }

    if (filters.brands && filters.brands.length > 0) {
      whereClause += ` AND brand IN (${filters.brands.map(() => "?").join(",")})`;
      params.push(...filters.brands);
    }

    if (filters.categories && filters.categories.length > 0) {
      whereClause += ` AND category IN (${filters.categories.map(() => "?").join(",")})`;
      params.push(...filters.categories);
    }

    if (filters.inStock !== undefined) {
      whereClause += " AND inStock = ?";
      params.push(filters.inStock ? true : false);
    }

    // Get total count with filters
    const countQuery = `SELECT COUNT(*) as count FROM products ${whereClause}`;
    const countResult = await getRows<{ count: number }>(countQuery, params);
    const total = countResult[0]?.count || 0;

    // Get paginated products
    const dataQuery = `SELECT * FROM products ${whereClause} ORDER BY \`createdAt\` DESC LIMIT ? OFFSET ?`;
    const products = await getRows<any>(dataQuery, [...params, limit, offset]);

    // Parse JSON fields (PostgreSQL JSONB returns objects, not strings)
    const parsedProducts = products.map((p: any) => ({
      ...p,
      images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : []),
      tags: Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? JSON.parse(p.tags) : []),
      specifications: typeof p.specifications === 'object' && p.specifications !== null 
        ? p.specifications 
        : (typeof p.specifications === 'string' ? JSON.parse(p.specifications) : {}),
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
      stockCount: Number(p.stockCount),
      inStock: Boolean(p.inStock),
      enabled: Boolean(p.enabled),
      vinEnabled: Boolean(p.vinEnabled),
      airShippingEnabled: Boolean(p.airShippingEnabled),
      seaShippingEnabled: Boolean(p.seaShippingEnabled),
      airShippingCost: p.airShippingCost !== null && p.airShippingCost !== undefined ? Number(p.airShippingCost) : null,
      seaShippingCost: p.seaShippingCost !== null && p.seaShippingCost !== undefined ? Number(p.seaShippingCost) : null,
      createdAt: p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt),
      updatedAt: p.updatedAt instanceof Date ? p.updatedAt : new Date(p.updatedAt),
    }));

    const totalPages = Math.ceil(total / limit);

    return createSuccessResponse(parsedProducts, 200, {
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
