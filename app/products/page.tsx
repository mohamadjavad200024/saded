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
    
    // Remove any stuck overlays (Radix UI Dialog/Sheet overlays)
    const overlays = document.querySelectorAll('[data-radix-dialog-overlay], [data-radix-portal]');
    overlays.forEach((overlay) => {
      const element = overlay as HTMLElement;
      // Check if overlay is actually visible (not just in DOM)
      if (element.style.display !== 'none' && !element.hasAttribute('data-state-closed')) {
        // Force remove if it's stuck
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.display !== 'none' && computedStyle.opacity !== '0') {
          // Only remove if it seems stuck (visible but should be closed)
          const parent = element.parentElement;
          if (parent && parent.getAttribute('data-state') === 'closed') {
            element.remove();
          }
        }
      }
    });

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
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

