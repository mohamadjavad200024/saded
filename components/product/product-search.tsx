"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, X, Package, ArrowUpRight, Car } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/types/product";
import { getPlaceholderImage } from "@/lib/image-utils";
import { SafeImage } from "@/components/ui/safe-image";
import { useVehicleStore } from "@/store/vehicle-store";
import { VehicleLogo } from "@/components/ui/vehicle-logo";

interface ProductSearchProps {
  onProductClick?: (product: Product) => void;
  trigger?: React.ReactNode;
  initialQuery?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProductSearch({ 
  onProductClick, 
  trigger, 
  initialQuery = "",
  isOpen: controlledOpen,
  onOpenChange
}: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use controlled or internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Search products
  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setProducts([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const searchPayload = {
        filters: {
          search: query.trim(),
        },
        page: 1,
        limit: 50,
      };

      if (process.env.NODE_ENV === "development") {
        console.log("Searching products with query:", query.trim());
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchPayload),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          if (process.env.NODE_ENV === "development") {
            console.log("Search results:", result.data.length, "products found");
          }
          setProducts(result.data);
        } else {
          if (process.env.NODE_ENV === "development") {
            console.log("No products found or invalid response");
          }
          setProducts([]);
        }
      } else {
        const errorText = await response.text();
        console.error("Search API error:", response.status, errorText);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-search when query changes (debounced)
  useEffect(() => {
    if (isOpen && searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        searchProducts(searchQuery);
      }, 500); // Debounce 500ms

      return () => clearTimeout(timeoutId);
    } else if (isOpen && !searchQuery.trim()) {
      setProducts([]);
      setHasSearched(false);
    }
  }, [searchQuery, isOpen]);

  // Update searchQuery when initialQuery changes
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  // When sheet opens, search if there's initial query
  useEffect(() => {
    if (isOpen && initialQuery) {
      searchProducts(initialQuery);
    }
  }, [isOpen, initialQuery]);

  // Close sheet when route changes
  const pathname = usePathname();
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [pathname]);

  const handleProductClick = (product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    }
    setIsOpen(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchProducts(searchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      searchProducts(searchQuery);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            جستجو
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[95vh] sm:h-[90vh] flex flex-col p-0 gap-0">
        <SheetTitle className="sr-only">جستجوی محصولات</SheetTitle>
        {/* Ultra Minimal Header with Search - Sticky at Top */}
        <div className="sticky top-0 z-10 bg-background/98 backdrop-blur-sm border-b border-border/15 flex-shrink-0 shadow-sm">
          <div className="px-2.5 sm:px-3 py-2">
            {/* Minimal Search Input - Single Line */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 -mr-0.5 flex-shrink-0 hover:bg-muted/50"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
              <div className="relative flex-1">
                <Search className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 h-3.5 w-3.5 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="جستجو..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-8 pr-9 text-sm border-border/30 focus:border-border/60 bg-muted/30 focus:bg-background transition-colors"
                  autoFocus
                />
              </div>
              {isLoading && (
                <div className="h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0 mr-0.5" />
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Results Area */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-3 pb-2">
          <div className="pt-1.5">
            {/* Results */}
            {hasSearched && (
              <div className="space-y-1.5">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                    <p className="text-[10px] text-muted-foreground">در حال جستجو...</p>
                  </div>
                ) : products.length > 0 ? (
                  <>
                    <div className="text-[10px] text-muted-foreground/70 px-1 pb-0.5">
                      {products.length} محصول
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
                      {products.map((product) => {
                        // Calculate discount percentage
                        const discountPercentage = product.originalPrice && product.originalPrice > product.price
                          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                          : null;

                        return (
                          <Card
                            key={product.id}
                            className="flex flex-col border border-border/25 hover:border-border/50 hover:shadow-sm transition-all cursor-pointer overflow-hidden group"
                            onClick={() => handleProductClick(product)}
                          >
                            <div className="relative h-28 sm:h-36 w-full bg-muted/50 overflow-hidden">
                              <SafeImage
                                src={product.images[0] || getPlaceholderImage(300, 300)}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-200"
                                priority
                                loading="eager"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                productId={product.id}
                              />
                              {discountPercentage && (
                                <div className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm z-10">
                                  {discountPercentage}%
                                </div>
                              )}
                            </div>
                            <CardContent className="p-1.5 flex-1 flex flex-col gap-0.5">
                              <h3 className="font-medium line-clamp-2 text-[10px] sm:text-[11px] leading-tight min-h-[2.5em]">
                                {product.name}
                              </h3>
                              {/* Vehicle Info */}
                              {product.vehicle && (() => {
                                const vehicle = getVehicle(product.vehicle);
                                if (!vehicle) return null;
                                return (
                                  <div className="flex items-center gap-1 text-[8px] sm:text-[9px] text-muted-foreground/70 line-clamp-1">
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
                              {product.brand && (
                                <p className="text-[8px] sm:text-[9px] text-muted-foreground/70 line-clamp-1">
                                  {product.brand}
                                </p>
                              )}
                              <div className="mt-auto pt-1 border-t border-border/15">
                                <div className="flex items-center justify-between mb-0.5 gap-1">
                                  <div className="flex items-center gap-1 flex-1 min-w-0">
                                    {product.originalPrice && product.originalPrice > product.price && (
                                      <span className="text-[8px] text-muted-foreground line-through flex-shrink-0">
                                        {product.originalPrice.toLocaleString("fa-IR")}
                                      </span>
                                    )}
                                    <span className="text-xs sm:text-sm font-bold text-primary leading-none truncate">
                                      {product.price.toLocaleString("fa-IR")}
                                      <span className="text-[8px] mr-0.5 font-normal">ت</span>
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {product.inStock ? (
                                    <span className="text-[8px] text-green-600 font-medium">
                                      موجود
                                    </span>
                                  ) : (
                                    <span className="text-[8px] text-muted-foreground">ناموجود</span>
                                  )}
                                  <Link
                                    href={`/products/${product.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5 -mr-1"
                                    >
                                      <ArrowUpRight className="h-2.5 w-2.5" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Package className="h-8 w-8 text-muted-foreground/50 mb-2" />
                    <p className="text-xs text-muted-foreground/70">محصولی یافت نشد</p>
                  </div>
                )}
              </div>
            )}

            {/* Initial State */}
            {!hasSearched && (
              <div className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-xs text-muted-foreground/50">برای جستجو تایپ کنید</p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

