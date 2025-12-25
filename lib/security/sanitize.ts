/**
 * Sanitize HTML content to prevent XSS attacks
 * Simple implementation without external dependencies
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== "string") {
    return "";
  }

  // Remove script tags and event handlers
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");

  // Allow only safe tags (keep the tag with attributes if it's allowed)
  const allowedTags = ["b", "i", "em", "strong", "a", "p", "br"];
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  
  sanitized = sanitized.replace(tagRegex, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      // For anchor tags, only allow href attribute
      if (tagName.toLowerCase() === "a") {
        return match.replace(/href=['"]([^'"]*)['"]/gi, 'href="$1"');
      }
      return match;
    }
    return "";
  });

  return sanitized;
}

/**
 * Sanitize string input (remove potentially dangerous characters)
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  // Remove null bytes
  let sanitized = input.replace(/\0/g, "");

  // Remove control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "");

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Sanitize number input
 */
export function sanitizeNumber(input: unknown): number {
  if (typeof input === "number") {
    return isFinite(input) ? input : 0;
  }

  if (typeof input === "string") {
    const parsed = parseFloat(input);
    return isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

/**
 * Sanitize array input
 */
export function sanitizeArray<T>(input: unknown, validator?: (item: unknown) => item is T): T[] {
  if (!Array.isArray(input)) {
    return [];
  }

  if (validator) {
    return input.filter(validator);
  }

  return input as T[];
}

/**
 * Sanitize object input
 */
export function sanitizeObject<T extends Record<string, any>>(
  input: unknown,
  allowedKeys: string[]
): Partial<T> {
  if (typeof input !== "object" || input === null) {
    return {};
  }

  const sanitized: Partial<T> = {};
  const obj = input as Record<string, unknown>;

  for (const key of allowedKeys) {
    if (key in obj) {
      sanitized[key as keyof T] = obj[key] as T[keyof T];
    }
  }

  return sanitized;
}

