/**
 * Simple in-memory rate limiter
 * For production, consider using Redis-based rate limiting
 */

import { NextRequest } from 'next/server';
import crypto from "crypto";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  /**
   * Check if request should be rate limited
   * @param key - Unique identifier (e.g., IP address, user ID)
   * @param maxRequests - Maximum number of requests
   * @param windowMs - Time window in milliseconds
   * @returns true if rate limited, false otherwise
   */
  isRateLimited(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      this.store.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return false;
    }

    if (entry.count >= maxRequests) {
      return true; // Rate limited
    }

    // Increment count
    entry.count++;
    return false;
  }

  /**
   * Get remaining requests for a key
   */
  getRemaining(key: string, maxRequests: number): number {
    const entry = this.store.get(key);
    if (!entry) {
      return maxRequests;
    }
    return Math.max(0, maxRequests - entry.count);
  }

  /**
   * Get reset time for a key
   */
  getResetTime(key: string): number | null {
    const entry = this.store.get(key);
    return entry ? entry.resetTime : null;
  }

  /**
   * Clear expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Start automatic cleanup
   */
  startCleanup(intervalMs: number = 60000): void {
    if (this.cleanupInterval) {
      return;
    }
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, intervalMs);
  }

  /**
   * Stop automatic cleanup
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.store.clear();
  }
}

// Create singleton instance
export const rateLimiter = new RateLimiter();

// Start automatic cleanup every minute
rateLimiter.startCleanup(60000);

/**
 * Get client identifier from request
 */
export function getClientId(request: NextRequest): string {
  // Try to get IP from various headers (for proxies/load balancers)
  const candidates = [
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    request.headers.get("x-real-ip")?.trim(),
    request.headers.get("cf-connecting-ip")?.trim(),
    request.headers.get("true-client-ip")?.trim(),
    request.headers.get("fastly-client-ip")?.trim(),
    request.headers.get("x-client-ip")?.trim(),
  ].filter(Boolean) as string[];

  const ip = candidates[0] || "unknown";

  // If we can't detect an IP, avoid collapsing ALL users into the same "unknown" bucket.
  // This is not a security boundary; it's just to reduce false-positive 429s in hosts that don't pass client IP headers.
  if (ip === "unknown") {
    const ua = request.headers.get("user-agent") || "unknown-ua";
    const uaHash = crypto.createHash("sha256").update(ua).digest("hex").slice(0, 12);
    return `unknown:${uaHash}`;
  }

  return ip;
}

/**
 * Rate limit middleware
 */
export function rateLimit(
  maxRequests: number = 100,
  windowMs: number = 60000, // 1 minute default
  keyGenerator?: (request: NextRequest) => string
) {
  return async (request: NextRequest): Promise<Response | null> => {
    const key = keyGenerator ? keyGenerator(request) : getClientId(request);
    // IMPORTANT:
    // Include HTTP method in the key so GET polling does NOT consume POST quotas on the same path.
    // Example: /api/chat uses GET polling frequently; without method separation, POST /api/chat would hit 429 unexpectedly.
    const fullKey = `${request.nextUrl.pathname}:${request.method}:${key}`;

    if (rateLimiter.isRateLimited(fullKey, maxRequests, windowMs)) {
      const resetTime = rateLimiter.getResetTime(fullKey);
      const remaining = rateLimiter.getRemaining(fullKey, maxRequests);
      
      return new Response(
        JSON.stringify({
          success: false,
          error: "درخواست‌های شما زیاد است. لطفاً کمی بعد دوباره تلاش کنید.",
          code: "RATE_LIMIT_EXCEEDED",
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': resetTime?.toString() || '',
            'Retry-After': Math.ceil((resetTime ? resetTime - Date.now() : windowMs) / 1000).toString(),
          },
        }
      );
    }

    return null; // Not rate limited
  };
}

