/**
 * Image utility functions
 */

/**
 * Get placeholder image URL
 * Uses external service for Next.js Image component compatibility
 * @param width - Image width in pixels (default: 600)
 * @param height - Image height in pixels (default: 600)
 * @returns Placeholder image URL
 */
export function getPlaceholderImage(width: number = 600, height: number = 600): string {
  // Use placehold.co service for Next.js Image compatibility
  const text = encodeURIComponent(`${width}x${height}`);
  return `https://placehold.co/${width}x${height}/f3f4f6/9ca3af?text=${text}`;
}

/**
 * Validate if a string is a valid image URL
 * @param url - URL to validate
 * @returns true if valid, false otherwise
 */
export function validateImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false;
  }

  const trimmedUrl = url.trim();

  // Check if it's a base64 data URL (be more lenient)
  if (trimmedUrl.startsWith('data:image') || trimmedUrl.startsWith('data:')) {
    // For base64, be more lenient - just check basic structure
    // The browser will handle actual image validation
    if (trimmedUrl.includes(';base64,') && trimmedUrl.length > 50) {
      // Basic validation - let the browser handle the rest
      return true;
    }
    // Even if it doesn't have ;base64,, if it's a data: URL and long enough, accept it
    if (trimmedUrl.startsWith('data:image') && trimmedUrl.length > 50) {
      return true;
    }
    // Fallback to strict validation
    return validateBase64Image(trimmedUrl);
  }

  // Check if it's a blob URL
  if (trimmedUrl.startsWith('blob:')) {
    return true;
  }

  // Check if it's a relative path
  if (trimmedUrl.startsWith('/')) {
    return true;
  }

  // Check if it's a valid HTTP/HTTPS URL
  try {
    const urlObj = new URL(trimmedUrl);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate and check if base64 image is valid
 * @param base64 - Base64 string to validate
 * @returns true if valid, false otherwise
 */
export function validateBase64Image(base64: string): boolean {
  if (!base64 || typeof base64 !== 'string') {
    return false;
  }

  // Check if it starts with data:image
  if (!base64.startsWith('data:image/')) {
    return false;
  }

  // Check if it has the base64 prefix
  if (!base64.includes(';base64,')) {
    return false;
  }

  // Extract the base64 part
  const base64Part = base64.split(';base64,')[1];
  if (!base64Part || base64Part.trim() === '') {
    return false;
  }

  // Check if base64 string is valid (basic check)
  // Base64 should only contain A-Z, a-z, 0-9, +, /, and = characters
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(base64Part)) {
    return false;
  }

  // Check if it's not too large (more than 15MB base64 is problematic)
  // But allow up to 15MB to handle high-quality product images
  if (base64.length > 15 * 1024 * 1024) {
    return false;
  }

  // Additional check: ensure the base64 part is not empty after trimming
  if (base64Part.trim().length === 0) {
    return false;
  }

  return true;
}

/**
 * Normalize image URL (convert relative to absolute, validate, etc.)
 * @param url - URL to normalize
 * @param baseUrl - Base URL for relative paths (default: current origin)
 * @returns Normalized URL or empty string if invalid
 */
export function normalizeImageUrl(
  url: string | null | undefined,
  baseUrl?: string
): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return '';
  }

  const trimmedUrl = url.trim();

  // If it's already a valid absolute URL or base64, return as is
  if (trimmedUrl.startsWith('http://') || 
      trimmedUrl.startsWith('https://') || 
      trimmedUrl.startsWith('data:image') ||
      trimmedUrl.startsWith('data:') || // More lenient - accept any data: URL
      trimmedUrl.startsWith('blob:')) {
    return trimmedUrl;
  }

  // Check if it might be a base64 string without the data: prefix
  // Base64 strings are typically very long and contain only base64 characters
  if (trimmedUrl.length > 100 && /^[A-Za-z0-9+/=]+$/.test(trimmedUrl)) {
    // It might be a raw base64 string, but we can't use it without the data:image prefix
    // Return empty string - the caller should handle this
    return '';
  }

  // If it's a relative path starting with /
  if (trimmedUrl.startsWith('/')) {
    // If baseUrl is provided, use it; otherwise use current origin
    if (baseUrl) {
      return `${baseUrl}${trimmedUrl}`;
    }
    // In browser, use window.location.origin
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${trimmedUrl}`;
    }
    // In server, return relative path (will be handled by Next.js)
    return trimmedUrl;
  }

  // If it doesn't start with /, try to construct a full URL
  // This handles cases where URL might be missing protocol
  try {
    const urlObj = new URL(trimmedUrl);
    return urlObj.toString();
  } catch {
    // If URL construction fails, return empty string
    return '';
  }
}

/**
 * Preload an image
 * @param url - Image URL to preload
 * @returns Promise that resolves when image is loaded or rejects on error
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!validateImageUrl(url)) {
      reject(new Error('Invalid image URL'));
      return;
    }

    // For base64 images, we can't use Image object, so just resolve
    if (url.startsWith('data:image') || url.startsWith('blob:')) {
      resolve();
      return;
    }

    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

/**
 * Get cache key for an image URL
 * Removes query parameters that are used for cache busting
 * @param url - Image URL
 * @returns Cache key
 */
export function getImageCacheKey(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Remove cache busting parameters
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.delete('_retry');
    urlObj.searchParams.delete('_t');
    urlObj.searchParams.delete('_cache');
    return urlObj.toString();
  } catch {
    // If URL parsing fails, remove common cache busting patterns manually
    return url
      .replace(/[?&]_retry=\d+/g, '')
      .replace(/[?&]_t=\d+/g, '')
      .replace(/[?&]_cache=\d+/g, '');
  }
}

/**
 * Check if image URL needs cache busting
 * @param url - Image URL
 * @returns true if cache busting is needed
 */
export function needsCacheBusting(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Base64 and blob URLs don't need cache busting
  if (url.startsWith('data:image') || url.startsWith('blob:')) {
    return false;
  }

  // Check if URL already has cache busting parameters
  return !url.includes('_t=') && !url.includes('_retry=');
}

/**
 * Add cache busting to URL
 * @param url - Image URL
 * @returns URL with cache busting parameter
 */
export function addCacheBusting(url: string): string {
  if (!url || typeof url !== 'string') {
    return url;
  }

  // Don't add cache busting to base64 or blob URLs
  if (url.startsWith('data:image') || url.startsWith('blob:')) {
    return url;
  }

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${Date.now()}`;
}

