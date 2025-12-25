"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ChevronRight, ChevronLeft, Filter, X, ShoppingBag } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";
import Link from "next/link";
import { useProductStore } from "@/store/product-store";
import { useVehicleStore } from "@/store/vehicle-store";
import { useAdminStore } from "@/store/admin-store";
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
import { VehicleLogo } from "@/components/ui/vehicle-logo";

// Wrapper component to always render ProductFilters (for consistent hooks)
function AlwaysRenderedFilters() {
  return <ProductFilters />;
}

export function ProductGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [columns, setColumns] = useState<2 | 3>(2);
  const { getFilteredProducts, filters, getEnabledProducts } = useProductStore();
  const { vehicles, getVehicle, loadVehiclesFromDB } = useVehicleStore();
  const { settings, updateSettings } = useAdminStore();
  const [vehicleMap, setVehicleMap] = useState<Map<string, any>>(new Map());
  
  // Load settings from API on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/site-settings");
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Pass saveToAPI=false to prevent PUT request when loading settings
            updateSettings(result.data, false);
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    loadSettings();
  }, [updateSettings]);
  
  // Get itemsPerPage from admin settings, default to 50
  const PRODUCTS_PER_PAGE = settings.itemsPerPage || 50;

  // Load vehicles on mount and create a map for quick lookup
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        if (vehicles.length === 0) {
          await loadVehiclesFromDB();
        }
        // Create a map for quick vehicle lookup
        const map = new Map();
        vehicles.forEach(v => {
          if (v.id) {
            map.set(v.id, v);
          }
        });
        setVehicleMap(map);
      } catch (error) {
        console.error('[ProductGrid] Error loading vehicles:', error);
      }
    };
    loadVehicles();
  }, [vehicles, loadVehiclesFromDB]);

  // Listen for close filter sheet event from header
  useEffect(() => {
    const handleCloseFilterSheet = () => {
      setFiltersOpen(false);
    };
    
    window.addEventListener("closeFilterSheet", handleCloseFilterSheet);
    return () => {
      window.removeEventListener("closeFilterSheet", handleCloseFilterSheet);
    };
  }, []);
  
  // Check if we have active filters
  const hasActiveFilters = filters && (
    filters.search ||
    filters.vehicle ||
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
  }, [currentPage, hasActiveFilters, getEnabledProducts, PRODUCTS_PER_PAGE]);
  
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
            ) : finalProducts.length === 0 ? (
              "محصولی یافت نشد"
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
              <SheetContent 
                side="bottom" 
                className="h-[85vh] sm:h-[90vh] overflow-y-auto rounded-t-2xl border-t-2 border-border"
              >
                <SheetHeader className="pb-4 border-b border-border/30">
                  <SheetTitle className="text-right">
                    <span className="text-lg sm:text-xl font-bold">فیلتر محصولات</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 pb-6">
                  <AlwaysRenderedFilters />
                </div>
              </SheetContent>
            </Sheet>
            {/* Two Columns Button */}
            <Button
              variant={columns === 2 ? "default" : "outline"}
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setColumns(2)}
              title="دو ستون"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Two columns representing product cards */}
                {/* Left column */}
                <rect x="2.5" y="2.5" width="9" height="5.5" rx="1.2" fill="none" />
                <rect x="2.5" y="9.5" width="9" height="5.5" rx="1.2" fill="none" />
                <rect x="2.5" y="16.5" width="9" height="5" rx="1.2" fill="none" />
                {/* Right column */}
                <rect x="12.5" y="2.5" width="9" height="5.5" rx="1.2" fill="none" />
                <rect x="12.5" y="9.5" width="9" height="5.5" rx="1.2" fill="none" />
                <rect x="12.5" y="16.5" width="9" height="5" rx="1.2" fill="none" />
              </svg>
            </Button>
            {/* Three Columns Button */}
            <Button
              variant={columns === 3 ? "default" : "outline"}
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setColumns(3)}
              title="سه ستون"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Three columns representing product cards */}
                {/* Left column */}
                <rect x="1.5" y="2.5" width="6" height="5.5" rx="1.2" fill="none" />
                <rect x="1.5" y="9.5" width="6" height="5.5" rx="1.2" fill="none" />
                <rect x="1.5" y="16.5" width="6" height="5" rx="1.2" fill="none" />
                {/* Middle column */}
                <rect x="9" y="2.5" width="6" height="5.5" rx="1.2" fill="none" />
                <rect x="9" y="9.5" width="6" height="5.5" rx="1.2" fill="none" />
                <rect x="9" y="16.5" width="6" height="5" rx="1.2" fill="none" />
                {/* Right column */}
                <rect x="16.5" y="2.5" width="6" height="5.5" rx="1.2" fill="none" />
                <rect x="16.5" y="9.5" width="6" height="5.5" rx="1.2" fill="none" />
                <rect x="16.5" y="16.5" width="6" height="5" rx="1.2" fill="none" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Products Display - Based on columns */}
        {isLoading && finalProducts.length === 0 ? (
          <div className={`grid ${columns === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-1 sm:gap-1.5 md:gap-2 w-full max-w-full overflow-x-hidden`}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <Card className="h-full flex flex-col">
                  <CardHeader className="p-0">
                    <div className="relative h-32 sm:h-36 md:h-40 lg:h-44 w-full bg-muted rounded-t-lg" />
                  </CardHeader>
                  <CardContent className="p-2 sm:p-3 md:p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : finalProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4">
            <Package className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">محصولی یافت نشد</h3>
            <p className="text-sm sm:text-base text-muted-foreground text-center mb-6">
              {hasActiveFilters 
                ? "هیچ محصولی با فیلترهای انتخابی یافت نشد"
                : "در حال حاضر محصولی برای نمایش وجود ندارد"}
            </p>
            <div className="flex justify-center w-full max-w-md">
              <Link href="/chat" className="w-full sm:w-auto">
                <Button 
                  variant="default"
                  className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
                >
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                  ثبت سفارش مستقیم
                </Button>
              </Link>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center mt-4 max-w-md">
              می‌توانید قطعه درخواستی خود را برای ما ارسال کنید تا برایتان تهیه و ارسال کنیم
            </p>
          </div>
        ) : (
          <div className={`grid ${columns === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-1 sm:gap-1.5 md:gap-2 w-full max-w-full overflow-x-hidden`}>
            {finalProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="flex flex-col border border-border/30 hover:border-border/50 hover:shadow-lg transition-all active:scale-95 relative overflow-hidden cursor-pointer h-full">
                  <CardHeader className="p-0 relative">
                    <div className="relative h-32 sm:h-36 md:h-40 lg:h-44 w-full bg-muted rounded-t-lg overflow-hidden">
                      <SafeImage
                        src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null}
                        alt={`${product.name}${product.brand ? ` - برند ${product.brand}` : ''}${product.category ? ` - دسته‌بندی ${product.category}` : ''}`}
                        fill
                        className="w-full h-full"
                        priority
                        loading="eager"
                        sizes={columns === 2 ? "(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 50vw" : "(max-width: 640px) 33vw, (max-width: 768px) 33vw, (max-width: 1024px) 33vw, 33vw"}
                        productId={product.id}
                      />
                      {/* Discount Badge - Top Right */}
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded shadow-sm z-10">
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
                    <h3 className="font-medium mb-1.5 sm:mb-2 hover:text-primary transition-colors line-clamp-2 text-xs sm:text-sm md:text-base leading-snug">
                      {product.name}
                    </h3>
                    {/* Vehicle Info */}
                    {product.vehicle && (() => {
                      const vehicle = vehicleMap.get(product.vehicle) || getVehicle(product.vehicle);
                      if (!vehicle) return null;
                      
                      return (
                        <div className="flex items-center gap-1 mb-0.5 sm:mb-1 text-[8px] sm:text-[9px] text-muted-foreground line-clamp-1">
                          <VehicleLogo
                            logo={vehicle.logo}
                            alt={vehicle.name}
                            size="sm"
                            fallbackIcon={false}
                            className="flex-shrink-0"
                          />
                          <span className="font-medium truncate">{vehicle.name}</span>
                          {product.model && (
                            <>
                              <span className="text-[7px]">•</span>
                              <span className="truncate">{product.model}</span>
                            </>
                          )}
                        </div>
                      );
                    })()}
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

