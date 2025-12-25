/**
 * Utility functions for product data normalization
 */

/**
 * Normalize images array from database
 * Handles various formats: string, array, null, undefined
 */
export function normalizeImages(images: any): string[] {
  // اگر null یا undefined است
  if (images == null) {
    return [];
  }

  // اگر قبلاً array است
  if (Array.isArray(images)) {
    return images
      .filter((img): img is string => 
        img != null && 
        typeof img === 'string' && 
        img.trim() !== ''
      )
      .map(img => img.trim());
  }

  // اگر string است، سعی کن parse کن
  if (typeof images === 'string') {
    // اگر string خالی است
    if (images.trim() === '') {
      return [];
    }

    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((img): img is string => 
            img != null && 
            typeof img === 'string' && 
            img.trim() !== ''
          )
          .map(img => img.trim());
      }
      // اگر یک string واحد است
      if (typeof parsed === 'string' && parsed.trim() !== '') {
        return [parsed.trim()];
      }
    } catch (e) {
      // اگر parse ناموفق بود، خود string را به عنوان یک تصویر در نظر بگیر
      return [images.trim()];
    }
  }

  return [];
}

/**
 * Normalize tags array from database
 */
export function normalizeTags(tags: any): string[] {
  if (tags == null) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags
      .filter((tag): tag is string => 
        tag != null && 
        typeof tag === 'string' && 
        tag.trim() !== ''
      )
      .map(tag => tag.trim());
  }

  if (typeof tags === 'string') {
    if (tags.trim() === '') {
      return [];
    }
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((tag): tag is string => 
            tag != null && 
            typeof tag === 'string' && 
            tag.trim() !== ''
          )
          .map(tag => tag.trim());
      }
    } catch (e) {
      return [];
    }
  }

  return [];
}

/**
 * Normalize specifications object from database
 */
export function normalizeSpecifications(specs: any): Record<string, unknown> {
  if (specs == null) {
    return {};
  }

  if (typeof specs === 'object' && specs !== null && !Array.isArray(specs)) {
    return specs;
  }

  if (typeof specs === 'string') {
    if (specs.trim() === '') {
      return {};
    }
    try {
      const parsed = JSON.parse(specs);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      return {};
    }
  }

  return {};
}

