"use client";

import { usePagePreload } from "@/hooks/use-page-preload";
import { PageLoader } from "@/components/ui/page-loader";

interface PagePreloaderProps {
  children: React.ReactNode;
  showLoader?: boolean;
}

/**
 * Component wrapper که قبل از نمایش children، تمام داده‌های لازم را preload می‌کند
 */
export function PagePreloader({ children, showLoader = true }: PagePreloaderProps) {
  const { isPreloading, preloadError } = usePagePreload();

  // اگر خطا رخ داد، children را نمایش بده (fallback)
  if (preloadError) {
    console.warn("Preload error (continuing anyway):", preloadError);
    return <>{children}</>;
  }

  // اگر در حال preload است و showLoader true است، loader نمایش بده
  if (isPreloading && showLoader) {
    return <PageLoader message="در حال آماده‌سازی صفحه..." fullScreen={false} />;
  }

  // وقتی preload تمام شد، children را نمایش بده
  return <>{children}</>;
}

