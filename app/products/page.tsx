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
      // First, force remove all Radix overlays regardless of state
      const allOverlays = document.querySelectorAll('[data-radix-dialog-overlay], [data-radix-portal]');
      allOverlays.forEach((overlay) => {
        const element = overlay as HTMLElement;
        if (!element) return;
        
        const computedStyle = window.getComputedStyle(element);
        const bgColor = computedStyle.backgroundColor;
        
        // Check if it's a black/dark overlay
        const isDarkOverlay = (
          bgColor.includes('rgba(0, 0, 0') || 
          bgColor.includes('rgb(0, 0, 0') ||
          bgColor.includes('rgba(0,0,0') ||
          element.classList.contains('bg-black') ||
          element.classList.contains('bg-black/80') ||
          element.classList.contains('bg-black/50')
        );
        
        // If it's a dark overlay, remove it immediately
        if (isDarkOverlay) {
          element.style.cssText = 'display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; z-index: -1 !important;';
          if (element.parentNode) {
            element.remove();
          }
        }
      });
      
      // Remove any fixed elements with high z-index that might be blocking
      const allFixedElements = document.querySelectorAll('*');
      allFixedElements.forEach((el) => {
        const element = el as HTMLElement;
        if (!element) return;
        
        const computedStyle = window.getComputedStyle(element);
        const position = computedStyle.position;
        const zIndex = parseInt(computedStyle.zIndex) || 0;
        const bgColor = computedStyle.backgroundColor;
        
        // Check if it's a blocking overlay
        if (position === 'fixed' && zIndex >= 30) {
          const isDarkOverlay = (
            bgColor.includes('rgba(0, 0, 0') || 
            bgColor.includes('rgb(0, 0, 0') ||
            bgColor.includes('rgba(0,0,0')
          );
          
          if (isDarkOverlay) {
            element.style.cssText = 'display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; z-index: -1 !important;';
            if (element.parentNode) {
              element.remove();
            }
          }
        }
      });
      
      // Force remove any body classes that might be blocking
      document.body.classList.remove('overflow-hidden', 'pointer-events-none', 'fixed');
      document.documentElement.classList.remove('overflow-hidden', 'pointer-events-none', 'fixed');
      
      // Reset all inline styles that might block
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.position = '';
      document.documentElement.style.height = '';
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

