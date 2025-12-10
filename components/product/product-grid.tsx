"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid, List, Package, ChevronRight, ChevronLeft, Filter, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useProductStore } from "@/store/product-store";
import { useProducts } from "@/services/products";
import { getPlaceholderImage } from "@/lib/image-utils";
import type { Product } from "@/types/product";
import { ProductFilters } from "@/components/product/product-filters";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const PRODUCTS_PER_PAGE = 50;

// Wrapper component to always render ProductFilters (for consistent hooks)
function AlwaysRenderedFilters() {
  return <ProductFilters />;
}

export function ProductGrid() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { getFilteredProducts, filters, getEnabledProducts } = useProductStore();
  
  // Check if we have active filters
  const hasActiveFilters = filters && (
    filters.search ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    (filters.brands && filters.brands.length > 0) ||
    (filters.categories && filters.categories.length > 0) ||
    filters.inStock !== undefined
  );
  
  // Fetch products from API with pagination
  const { data: apiProducts, pagination, isLoading } = useProducts(
    hasActiveFilters ? filters : undefined,
    currentPage,
    PRODUCTS_PER_PAGE
  );
  
  // Use store data only for first page when no filters (for instant display)
  const storeProducts = useMemo(() => {
    if (currentPage === 1 && !hasActiveFilters) {
      return getEnabledProducts().slice(0, PRODUCTS_PER_PAGE);
    }
    return [];
  }, [currentPage, hasActiveFilters, getEnabledProducts]);
  
  // Sync API data to store (synchronous, but non-blocking due to React's batching)
  useEffect(() => {
    if (apiProducts && apiProducts.length > 0) {
      const state = useProductStore.getState();
      apiProducts.forEach((product: Product) => {
        const existing = state.getProduct(product.id);
        if (!existing) {
          state.addProduct(product);
        }
      });
    }
  }, [apiProducts]);
  
  // Use API products if available, otherwise fallback to store (only for first page, no filters)
  const finalProducts = useMemo(() => {
    if (apiProducts && apiProducts.length > 0) {
      return apiProducts.filter(p => p.enabled);
    }
    // Only use store if API is not loading and we're on first page with no filters
    if (!isLoading && currentPage === 1 && !hasActiveFilters && storeProducts.length > 0) {
      return storeProducts;
    }
    // Show empty if API is loading or no data
    if (isLoading) {
      return [];
    }
    return [];
  }, [apiProducts, storeProducts, currentPage, hasActiveFilters, isLoading]);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [hasActiveFilters ? JSON.stringify(filters) : ""]);
  
  const totalPages = pagination?.totalPages || 1;
  const total = pagination?.total || finalProducts.length;

  // Show loading state
  if (isLoading && finalProducts.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <Card className="h-full flex flex-col">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full bg-muted rounded-t-lg" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  if (finalProducts.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
        <Package className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold mb-2">محصولی یافت نشد</h3>
        <p className="text-sm sm:text-base text-muted-foreground text-center">
          {hasActiveFilters 
            ? "هیچ محصولی با فیلترهای انتخابی یافت نشد"
            : "در حال حاضر محصولی برای نمایش وجود ندارد"}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Always render ProductFilters to maintain consistent hook count, but hide it */}
      <div className="lg:hidden fixed -left-[9999px] -top-[9999px] opacity-0 pointer-events-none">
        <AlwaysRenderedFilters />
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        {/* Mobile Filter Button and View Toggle */}
        <div className="flex items-center justify-between px-1 sm:px-0 mb-3 sm:mb-4">
          <div className="text-xs sm:text-sm text-muted-foreground">
            {isLoading ? (
              "در حال بارگذاری..."
            ) : (
              `نمایش ${finalProducts.length} از ${total} محصول`
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Filter Button */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden flex items-center gap-2 h-9 w-auto sm:h-10 px-3 sm:px-4 text-xs sm:text-sm"
                >
                  <Filter className="h-4 w-4 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">فیلترها</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:w-[400px] overflow-y-auto max-h-screen">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    <span>فیلتر محصولات</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setFiltersOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <AlwaysRenderedFilters />
                </div>
              </SheetContent>
            </Sheet>
          {/* View Toggle Buttons */}
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            className="h-9 w-9 sm:h-10 sm:w-10"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            className="h-9 w-9 sm:h-10 sm:w-10"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {finalProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="flex flex-col border border-border/30 hover:border-border/50 hover:shadow-lg transition-all active:scale-95 relative overflow-hidden cursor-pointer h-full">
                <CardHeader className="p-0 relative">
                  <div className="relative h-32 sm:h-36 md:h-40 lg:h-44 w-full bg-muted rounded-t-lg overflow-hidden">
                    <Image
                      src={product.images[0] || getPlaceholderImage(300, 300)}
                      alt={`${product.name}${product.brand ? ` - برند ${product.brand}` : ''}${product.category ? ` - دسته‌بندی ${product.category}` : ''}`}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    />
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded shadow-sm">
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}%
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-2 sm:p-3 md:p-4">
                  <h3 className="font-medium mb-2 sm:mb-2.5 hover:text-primary transition-colors line-clamp-2 text-xs sm:text-sm md:text-base leading-snug">
                    {product.name}
                  </h3>
                  <div className="flex flex-col gap-1 sm:gap-1.5">
                    <span className="text-xs sm:text-sm md:text-base font-bold text-primary">
                      {product.price.toLocaleString("fa-IR")} <span className="text-[10px] sm:text-xs">تومان</span>
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                        {product.originalPrice.toLocaleString("fa-IR")}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {finalProducts.map((product) => (
            <Card key={product.id} className="flex flex-row hover:shadow-lg transition-all active:scale-[0.98]">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-muted rounded-r-lg overflow-hidden flex-shrink-0">
                <Image
                  src={product.images[0] || "/api/placeholder/300/300"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 192px"
                />
              </div>
              <div className="flex-1 p-3 sm:p-4 md:p-6 flex flex-col justify-between min-w-0">
                <div className="min-w-0">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-sm sm:text-base md:text-xl font-semibold mb-2 sm:mb-3 hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] sm:text-xs font-bold text-primary">
                    {product.price.toLocaleString("fa-IR")} <span className="text-[8px] sm:text-[9px]">تومان</span>
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-[8px] sm:text-[9px] text-muted-foreground line-through">
                      {product.originalPrice.toLocaleString("fa-IR")}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 sm:mt-8 px-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 sm:h-10 text-xs sm:text-sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronRight className="h-4 w-4 ml-1" />
            قبلی
          </Button>
          
          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className="h-9 sm:h-10 text-xs sm:text-sm min-w-[2.5rem]"
                  onClick={() => setCurrentPage(pageNum)}
                  disabled={isLoading}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="h-9 sm:h-10 text-xs sm:text-sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isLoading}
          >
            بعدی
            <ChevronLeft className="h-4 w-4 mr-1" />
          </Button>
        </div>
      )}
      </div>
    </>
  );
}

