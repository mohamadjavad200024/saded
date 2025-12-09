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
import { Hash, Search, X, Package, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { getPlaceholderImage } from "@/lib/image-utils";

interface VinSearchProps {
  onProductClick?: (product: Product) => void;
  trigger?: React.ReactNode;
}

export function VinSearch({ onProductClick, trigger }: VinSearchProps) {
  const [vinCode, setVinCode] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Validate VIN format (17 characters, alphanumeric, no I, O, Q)
  const isValidVin = (vin: string): boolean => {
    if (vin.length !== 17) return false;
    return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin.toUpperCase());
  };

  // Search products by VIN
  const searchByVin = async () => {
    const upperVin = vinCode.toUpperCase().trim();
    
    if (!isValidVin(upperVin)) {
      setProducts([]);
      setHasSearched(true);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters: {
            vin: upperVin,
          },
          page: 1,
          limit: 50,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setProducts(result.data);
        } else {
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error searching by VIN:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-search when VIN is complete (17 characters)
  useEffect(() => {
    const upperVin = vinCode.toUpperCase().trim();
    if (upperVin.length === 17 && isValidVin(upperVin)) {
      const timeoutId = setTimeout(() => {
        searchByVin();
      }, 500); // Debounce 500ms

      return () => clearTimeout(timeoutId);
    } else if (upperVin.length === 0) {
      setProducts([]);
      setHasSearched(false);
    }
  }, [vinCode]);

  const handleVinChange = (value: string) => {
    // Only allow valid VIN characters and limit to 17
    const upperValue = value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "").slice(0, 17);
    setVinCode(upperValue);
  };

  const handleProductClick = (product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    }
    setIsOpen(false);
  };

  // Close sheet when route changes
  const pathname = usePathname();
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [pathname]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 h-9"
          >
            <Hash className="h-4 w-4" />
            <span className="hidden sm:inline">جستجو با VIN</span>
            <span className="sm:hidden">VIN</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              جستجوی محصولات با کد VIN
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto mt-6 space-y-4">
          {/* VIN Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">کد VIN</label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="17 کاراکتر (مثال: 1HGBH41JXMN109186)"
                value={vinCode}
                onChange={(e) => handleVinChange(e.target.value)}
                maxLength={17}
                className="font-mono text-base h-12"
                dir="ltr"
              />
              <Button
                onClick={searchByVin}
                disabled={!isValidVin(vinCode) || isLoading}
                className="h-12 px-6"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="h-4 w-4 ml-2" />
                )}
                جستجو
              </Button>
            </div>
            {vinCode.length > 0 && vinCode.length < 17 && (
              <p className="text-xs text-muted-foreground">
                {17 - vinCode.length} کاراکتر باقی مانده
              </p>
            )}
            {vinCode.length === 17 && !isValidVin(vinCode) && (
              <p className="text-xs text-destructive">
                کد VIN نامعتبر است. لطفاً کد صحیح را وارد کنید.
              </p>
            )}
          </div>

          {/* Results */}
          {hasSearched && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-sm text-muted-foreground">در حال جستجو...</p>
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="text-sm text-muted-foreground">
                    {products.length} محصول مرتبط یافت شد
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Card
                        key={product.id}
                        className="flex flex-col border-[0.1px] border-border/2 hover:border-border/4 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => handleProductClick(product)}
                      >
                        <div className="relative h-48 w-full bg-muted rounded-t-lg overflow-hidden">
                          <Image
                            src={product.images[0] || getPlaceholderImage(300, 300)}
                            alt={product.name}
                            fill
                            className="object-cover"
                            loading="lazy"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <CardContent className="p-4 flex-1 flex flex-col">
                          <h3 className="font-semibold mb-2 line-clamp-2 text-sm">
                            {product.name}
                          </h3>
                          {product.brand && (
                            <p className="text-xs text-muted-foreground mb-2">
                              {product.brand}
                            </p>
                          )}
                          <div className="mt-auto pt-2 border-t border-border/30">
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-primary">
                                {product.price.toLocaleString("fa-IR")}
                                <span className="text-xs mr-1">تومان</span>
                              </span>
                              <Link
                                href={`/products/${product.id}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <ArrowUpRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                            {product.inStock ? (
                              <p className="text-xs text-green-600 mt-1">
                                موجود در انبار
                              </p>
                            ) : (
                              <p className="text-xs text-secondary mt-1">ناموجود</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">محصولی یافت نشد</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    متأسفانه محصولی با این کد VIN یافت نشد
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Initial State */}
          {!hasSearched && (
            <div className="flex flex-col items-center justify-center py-12">
              <Hash className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">جستجوی محصولات با VIN</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                کد VIN خودرو خود را وارد کنید تا محصولات مرتبط را پیدا کنید
              </p>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                کد VIN باید دقیقاً 17 کاراکتر باشد
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

