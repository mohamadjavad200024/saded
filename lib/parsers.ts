/**
 * Data Parsing Utilities
 * Helper functions for safely parsing data from MySQL database
 */

/**
 * Parse product data from database
 */
export function parseProduct(product: any): any {
  if (!product) return null;

  return {
    ...product,
    images: safeParseJSON<any[]>(product.images, []),
    tags: safeParseJSON<any[]>(product.tags, []),
    specifications: safeParseJSON<Record<string, any>>(product.specifications, {}),
    price: safeParseNumber(product.price, 0),
    originalPrice: product.originalPrice ? safeParseNumber(product.originalPrice) : undefined,
    stockCount: safeParseNumber(product.stockCount, 0),
    inStock: Boolean(product.inStock),
    enabled: Boolean(product.enabled),
    vinEnabled: Boolean(product.vinEnabled),
    airShippingEnabled: Boolean(product.airShippingEnabled),
    seaShippingEnabled: Boolean(product.seaShippingEnabled),
    airShippingCost: product.airShippingCost !== null && product.airShippingCost !== undefined 
      ? safeParseNumber(product.airShippingCost) 
      : null,
    seaShippingCost: product.seaShippingCost !== null && product.seaShippingCost !== undefined 
      ? safeParseNumber(product.seaShippingCost) 
      : null,
    createdAt: safeParseDate(product.createdAt),
    updatedAt: safeParseDate(product.updatedAt),
  };
}

/**
 * Parse order data from database
 */
export function parseOrder(order: any): any {
  if (!order) return null;

  return {
    ...order,
    items: safeParseJSON<any[]>(order.items, []),
    shippingAddress: safeParseJSON<Record<string, any>>(order.shippingAddress, {}),
    total: safeParseNumber(order.total, 0),
    shippingCost: safeParseNumber(order.shippingCost, 0),
    createdAt: safeParseDate(order.createdAt),
    updatedAt: safeParseDate(order.updatedAt),
  };
}

/**
 * Safely parse JSON field from database
 */
function safeParseJSON<T = any>(value: unknown, defaultValue: T): T {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  if (Array.isArray(value) || (typeof value === 'object' && value !== null && !(value instanceof Date))) {
    return value as T;
  }
  
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  }
  
  return defaultValue;
}

/**
 * Safely parse number from database
 */
function safeParseNumber(value: unknown, defaultValue: number = 0): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Safely parse date from database
 */
function safeParseDate(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }
  
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? new Date() : date;
  }
  
  return new Date();
}

