"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { useCategoryStore } from "@/store/category-store";
import { useEffect } from "react";

export default function ProductsPage() {
  const { loadCategoriesFromDB } = useCategoryStore();

  // Load categories from database on mount
  useEffect(() => {
    loadCategoriesFromDB();
  }, [loadCategoriesFromDB]);

  // Fix mobile black screen issue: Ensure body overflow is reset and no overlays are stuck
  useEffect(() => {
    // Reset body and html overflow on mount (in case it was set by another page)
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.body.style.position = "";
    document.documentElement.style.position = "";
    
    // Remove ALL stuck overlays (Radix UI Dialog/Sheet overlays) - more aggressive approach
    const removeStuckOverlays = () => {
      // Find all overlay elements
      const overlays = document.querySelectorAll('[data-radix-dialog-overlay], [data-radix-portal], [role="dialog"]');
      overlays.forEach((overlay) => {
        const element = overlay as HTMLElement;
        const computedStyle = window.getComputedStyle(element);
        
        // Check if overlay is visible and blocking
        if (
          computedStyle.display !== 'none' && 
          computedStyle.opacity !== '0' &&
          computedStyle.visibility !== 'hidden' &&
          (computedStyle.zIndex === '50' || computedStyle.zIndex === '40' || computedStyle.zIndex === '30')
        ) {
          // Check if it's a stuck overlay (has bg-black/80 or similar)
          const bgColor = computedStyle.backgroundColor;
          const isBlackOverlay = bgColor.includes('rgba(0, 0, 0') || bgColor.includes('rgb(0, 0, 0');
          
          if (isBlackOverlay) {
            // Force remove stuck overlay
            element.style.display = 'none';
            element.style.opacity = '0';
            element.style.visibility = 'hidden';
            element.remove();
          }
        }
      });
      
      // Also remove any fixed elements with high z-index that might be blocking
      const fixedElements = document.querySelectorAll('[style*="position: fixed"][style*="z-index"]');
      fixedElements.forEach((el) => {
        const element = el as HTMLElement;
        const zIndex = window.getComputedStyle(element).zIndex;
        if (parseInt(zIndex) >= 40) {
          const bgColor = window.getComputedStyle(element).backgroundColor;
          if (bgColor.includes('rgba(0, 0, 0') || bgColor.includes('rgb(0, 0, 0')) {
            element.remove();
          }
        }
      });
    };
    
    // Remove immediately
    removeStuckOverlays();
    
    // Also remove after a short delay (in case they're added dynamically)
    const timeout = setTimeout(removeStuckOverlays, 100);
    
    // Cleanup on unmount
    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.documentElement.style.position = "";
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-4 sm:py-6 md:py-8 px-3 sm:px-4">
        <div className="mb-4 sm:mb-6 md:mb-8 hidden lg:block">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">محصولات</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                بیش از 50,000 قطعه خودرو از برندهای معتبر
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* Desktop Filters - Hidden on mobile */}
          <aside className="hidden lg:block lg:col-span-1">
            <ProductFilters />
          </aside>
          <div className="lg:col-span-3">
            <ProductGrid />
            {/* Alternative: <ProductList /> for list view */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

