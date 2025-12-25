"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useProductStore } from "@/store/product-store";
import { useCategoryStore } from "@/store/category-store";
import { useOrderStore } from "@/store/order-store";
import { useAuthStore } from "@/store/auth-store";

/**
 * Hook برای preload کردن داده‌های لازم قبل از نمایش صفحه
 * این hook تمام داده‌های مورد نیاز را از قبل لود می‌کند تا صفحه سریع و نرم نمایش داده شود
 */
export function usePagePreload() {
  const pathname = usePathname();
  const [isPreloading, setIsPreloading] = useState(true);
  const [preloadError, setPreloadError] = useState<string | null>(null);
  
  const { loadProductsFromDB } = useProductStore();
  const { loadCategoriesFromDB } = useCategoryStore();
  const { loadOrdersFromDB } = useOrderStore();
  const { isAuthenticated, hasCheckedAuth } = useAuthStore();

  useEffect(() => {
    let isMounted = true;
    const preloadData = async () => {
      try {
        setIsPreloading(true);
        setPreloadError(null);

        // Preload مشترک برای همه صفحات
        const commonPromises: Promise<any>[] = [
          loadCategoriesFromDB().catch(err => {
            console.warn("Failed to preload categories:", err);
            return null;
          }),
        ];

        // Preload بر اساس مسیر
        if (pathname.startsWith("/products")) {
          // برای صفحات محصولات، محصولات را هم preload کن
          commonPromises.push(
            loadProductsFromDB(true).catch(err => {
              console.warn("Failed to preload products:", err);
              return null;
            })
          );
        }

        if (pathname.startsWith("/orders") || pathname.startsWith("/order")) {
          // برای صفحات سفارش، فقط اگر کاربر لاگین شده باشد
          if (hasCheckedAuth && isAuthenticated) {
            commonPromises.push(
              loadOrdersFromDB().catch(err => {
                console.warn("Failed to preload orders:", err);
                return null;
              })
            );
          }
        }

        // منتظر بمان تا همه داده‌ها لود شوند
        await Promise.allSettled(commonPromises);

        // یک تاخیر کوچک برای اطمینان از اینکه همه چیز آماده است
        await new Promise(resolve => setTimeout(resolve, 100));

        if (isMounted) {
          setIsPreloading(false);
        }
      } catch (error) {
        console.error("Error during preload:", error);
        if (isMounted) {
          setPreloadError(error instanceof Error ? error.message : "خطا در بارگذاری داده‌ها");
          setIsPreloading(false);
        }
      }
    };

    // فقط بعد از اینکه auth check انجام شد، preload را شروع کن
    // اما اگر auth check خیلی طول بکشد، بعد از 2 ثانیه preload را شروع کن
    if (hasCheckedAuth) {
      preloadData();
    } else {
      // اگر auth check انجام نشده، یک timeout تنظیم کن تا بعد از 2 ثانیه preload را شروع کند
      const timeout = setTimeout(() => {
        if (isMounted) {
          preloadData();
        }
      }, 2000);
      
      return () => {
        isMounted = false;
        clearTimeout(timeout);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [pathname, loadProductsFromDB, loadCategoriesFromDB, loadOrdersFromDB, isAuthenticated, hasCheckedAuth]);

  return { isPreloading, preloadError };
}

