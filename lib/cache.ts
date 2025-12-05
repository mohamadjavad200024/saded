/**
 * Simple in-memory cache for API responses
 * Used to reduce database queries and improve performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 1000; // Maximum number of entries

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, data: T, ttl: number = 60000): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Delete value from cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

// Create singleton instance
export const cache = new SimpleCache();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    cache.clearExpired();
  }, 5 * 60 * 1000);
}

/**
 * Cache key generators
 */
export const cacheKeys = {
  chat: (chatId: string) => `chat:${chatId}`,
  chatMessages: (chatId: string, page?: number, limit?: number) => 
    `chat:messages:${chatId}:${page || 1}:${limit || 50}`,
  chatList: (page?: number, limit?: number) => 
    `chat:list:${page || 1}:${limit || 50}`,
  products: (page?: number, limit?: number, filters?: string) => 
    `products:${page || 1}:${limit || 50}:${filters || ''}`,
  product: (productId: string) => `product:${productId}`,
  categories: () => `categories:all`,
  category: (categoryId: string) => `category:${categoryId}`,
  orders: (filters?: string) => `orders:${filters || ''}`,
  order: (orderId: string) => `order:${orderId}`,
};

/**
 * Helper to wrap async function with cache
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = 60000 // Default 1 minute
): Promise<T> {
  // Try to get from cache first
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Execute function and cache result
  const result = await fn();
  cache.set(key, result, ttl);
  return result;
}

