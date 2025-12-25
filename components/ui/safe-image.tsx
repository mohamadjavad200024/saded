"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { 
  getPlaceholderImage, 
  validateImageUrl, 
  validateBase64Image,
  normalizeImageUrl,
  preloadImage,
  addCacheBusting,
  needsCacheBusting
} from "@/lib/image-utils";
import { Package } from "lucide-react";
import { useProductStore } from "@/store/product-store";

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  sizes?: string;
  onError?: () => void;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  productId?: string;
}

/**
 * کامپوننت SafeImage بهبود یافته با قابلیت‌های پیشرفته
 * - اعتبارسنجی تصاویر
 * - Retry mechanism بهبود یافته
 * - پیش‌بارگذاری تصاویر
 * - مدیریت بهتر خطا
 */
export function SafeImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  priority = false,
  loading = "eager",
  sizes,
  onError,
  placeholder = "empty",
  blurDataURL,
  productId,
}: SafeImageProps) {
  // استفاده از store بدون قرار دادن در dependency array
  const productStore = useProductStore();
  const placeholderUrl = useMemo(() => getPlaceholderImage(width || 600, height || 600), [width, height]);
  
  // دریافت URL تصویر با useCallback برای جلوگیری از re-render
  const getImageUrl = useCallback((): string => {
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('[SafeImage] getImageUrl called:', {
        src: src ? src.substring(0, 100) : null,
        productId,
        hasProductStore: !!productStore,
      });
    }
    
    // 1. از src prop
    if (src && typeof src === 'string' && src.trim() !== '') {
      const normalized = normalizeImageUrl(src.trim());
      const isValid = normalized && validateImageUrl(normalized);
      if (process.env.NODE_ENV === 'development') {
        console.log('[SafeImage] Checking src prop:', {
          original: src.substring(0, 100),
          normalized: normalized?.substring(0, 100),
          isValid,
        });
      }
      if (isValid) {
        return normalized;
      }
    }
    
    // 2. از product store
    if (productId) {
      const product = productStore.getProduct(productId);
      if (process.env.NODE_ENV === 'development') {
        console.log('[SafeImage] Checking product store:', {
          productId,
          hasProduct: !!product,
          productImages: product?.images,
          imagesLength: product?.images?.length || 0,
        });
      }
      if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
        // سعی کن اولین تصویر معتبر را پیدا کن
        for (const img of product.images) {
          if (img && typeof img === 'string' && img.trim() !== '') {
            const normalized = normalizeImageUrl(img.trim());
            const isValid = normalized && validateImageUrl(normalized);
            if (process.env.NODE_ENV === 'development') {
              console.log('[SafeImage] Checking product image:', {
                original: img.substring(0, 100),
                normalized: normalized?.substring(0, 100),
                isValid,
              });
            }
            if (isValid) {
              return normalized;
            }
          }
        }
      }
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('[SafeImage] No valid image found, using placeholder');
    }
    return placeholderUrl;
  }, [src, productId, placeholderUrl, productStore]);

  // محاسبه URL تصویر با useMemo
  const imageUrl = useMemo(() => getImageUrl(), [getImageUrl]);

  const [imageSrc, setImageSrc] = useState<string>(imageUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!loading || loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);
  const retryCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const maxRetries = 3;
  const loadTimeout = 30000; // 30 seconds timeout

  // Intersection Observer برای lazy loading
  useEffect(() => {
    if (loading === 'lazy' && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '50px', // شروع بارگذاری 50px قبل از ورود به viewport
          threshold: 0.01,
        }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
        intersectionObserverRef.current = observer;
      }

      return () => {
        if (intersectionObserverRef.current) {
          intersectionObserverRef.current.disconnect();
        }
      };
    } else {
      setIsInView(true);
    }
  }, [loading]);

  // پیش‌بارگذاری تصویر برای priority images
  useEffect(() => {
    if (priority && imageUrl && imageUrl !== placeholderUrl && isInView) {
      preloadImage(imageUrl).catch(() => {
        // اگر پیش‌بارگذاری ناموفق بود، تصویر به صورت عادی لود می‌شود
      });
    }
  }, [priority, imageUrl, placeholderUrl, isInView]);

  // Update image source when URL changes
  useEffect(() => {
    if (imageUrl !== imageSrc) {
      setImageSrc(imageUrl);
      setIsLoading(true);
      setHasError(false);
      retryCountRef.current = 0;
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [imageUrl, imageSrc]);

  // Timeout برای بارگذاری تصویر
  useEffect(() => {
    if (isLoading && imageSrc && imageSrc !== placeholderUrl && isInView) {
      timeoutRef.current = setTimeout(() => {
        if (isLoading) {
          handleError();
        }
      }, loadTimeout);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [isLoading, imageSrc, placeholderUrl, isInView]);

  const handleLoad = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLoading(false);
    setHasError(false);
    retryCountRef.current = 0;
  }, []);

  const handleError = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const currentUrl = imageSrc || imageUrl;
    
    // اگر placeholder است، دیگر retry نکن
    if (currentUrl === placeholderUrl) {
      setIsLoading(false);
      setHasError(true);
      onError?.();
      return;
    }

    // Retry logic با exponential backoff
    if (retryCountRef.current < maxRetries) {
      retryCountRef.current += 1;
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, retryCountRef.current - 1) * 1000;
      
      // اگر URL نیاز به cache busting دارد، اضافه کن
      let retryUrl = currentUrl;
      if (needsCacheBusting(currentUrl)) {
        retryUrl = addCacheBusting(currentUrl);
      } else {
        // اگر قبلاً cache busting دارد، timestamp را به‌روز کن
        const separator = currentUrl.includes('?') ? '&' : '?';
        retryUrl = `${currentUrl.split('&_t=')[0].split('?_t=')[0]}${separator}_retry=${retryCountRef.current}&_t=${Date.now()}`;
      }
      
      timeoutRef.current = setTimeout(() => {
        if (imgRef.current) {
          // Reset image to force reload
          imgRef.current.src = '';
          setTimeout(() => {
            if (imgRef.current) {
              imgRef.current.src = retryUrl;
            }
          }, 100);
        }
      }, delay);
    } else {
      // اگر همه retry ها ناموفق بودند
      setIsLoading(false);
      setHasError(true);
      
      // از product store fallback کن
      if (productId) {
        const product = productStore.getProduct(productId);
        if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
          // سعی کن تصویر دیگری پیدا کن
          const fallbackImage = product.images.find(
            img => {
              if (!img || typeof img !== 'string' || img.trim() === '') return false;
              const normalized = normalizeImageUrl(img.trim());
              return normalized && validateImageUrl(normalized) && normalized !== currentUrl && normalized !== imageSrc;
            }
          );
          
          if (fallbackImage) {
            const normalized = normalizeImageUrl(fallbackImage.trim());
            if (normalized && validateImageUrl(normalized)) {
              retryCountRef.current = 0;
              setImageSrc(normalized);
              setIsLoading(true);
              setHasError(false);
              return;
            }
          }
        }
      }
      
      // در آخر placeholder
      setImageSrc(placeholderUrl);
      onError?.();
    }
  }, [imageSrc, imageUrl, placeholderUrl, productId, productStore, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, []);

  // مطمئن شو که imageSrc هرگز empty string نباشد
  const finalSrc = useMemo(() => {
    if (!imageSrc || imageSrc.trim() === '') {
      return placeholderUrl;
    }
    return imageSrc;
  }, [imageSrc, placeholderUrl]);

  // اعتبارسنجی نهایی
  const isValidSrc = useMemo(() => {
    return validateImageUrl(finalSrc);
  }, [finalSrc]);

  const imgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
    src: isValidSrc ? finalSrc : placeholderUrl,
    alt,
    onLoad: handleLoad,
    onError: handleError,
    loading: isInView ? loading : 'lazy',
    className: "object-cover w-full h-full",
    style: { objectFit: 'cover' },
    fetchPriority: priority ? 'high' : 'auto',
    decoding: 'async',
    crossOrigin: typeof window !== 'undefined' && finalSrc.startsWith('http') && !finalSrc.includes(window.location.origin) ? 'anonymous' : undefined,
  };

  if (fill) {
    return (
      <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
        <img {...imgProps} ref={imgRef} />
        {isLoading && !hasError && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center z-10">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <img {...imgProps} ref={imgRef} />
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center z-10">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
