"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { useProductStore } from "@/store/product-store";
import { useCategoryStore } from "@/store/category-store";

export function ProductFilters() {
  const { setFilters, clearFilters: clearStoreFilters, filters: storeFilters } = useProductStore();
  const { getActiveCategories, loadCategoriesFromDB } = useCategoryStore();
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inStockOnly, setInStockOnly] = useState<boolean | undefined>(undefined);
  const isUpdatingFromStore = useRef(false);
  
  // Get available brands and categories from products
  const { getEnabledProducts } = useProductStore();
  const products = getEnabledProducts();
  // For product filters, show all enabled categories (not just active ones)
  const categories = useCategoryStore((state) => state.getEnabledCategories());

  // Load categories from database when component mounts
  // Load all enabled categories (including inactive ones) for filters
  useEffect(() => {
    const loadCategories = async () => {
      try {
        await loadCategoriesFromDB(true); // true = include inactive but enabled categories
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, [loadCategoriesFromDB]);
  
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [products]);
  
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    categories.forEach((c) => {
      if (c.name) cats.add(c.name);
    });
    return Array.from(cats).sort();
  }, [products, categories]);

  // Initialize from store on mount only
  useEffect(() => {
    if (storeFilters.minPrice !== undefined || storeFilters.maxPrice !== undefined) {
      setPriceRange([
        storeFilters.minPrice || 0,
        storeFilters.maxPrice || 50000000,
      ]);
    }
    if (storeFilters.brands) {
      setSelectedBrands(storeFilters.brands);
    }
    if (storeFilters.categories) {
      setSelectedCategories(storeFilters.categories);
    }
    if (storeFilters.search) {
      setSearchQuery(storeFilters.search);
    }
    if (storeFilters.inStock !== undefined) {
      setInStockOnly(storeFilters.inStock);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Apply filters to store when user changes them (debounced to prevent loops)
  useEffect(() => {
    // Skip if we're syncing from store
    if (isUpdatingFromStore.current) {
      return;
    }

    const timeoutId = setTimeout(() => {
      const filterUpdates: any = {};
      
      if (priceRange[0] > 0) filterUpdates.minPrice = priceRange[0];
      if (priceRange[1] < 50000000) filterUpdates.maxPrice = priceRange[1];
      if (selectedBrands.length > 0) filterUpdates.brands = selectedBrands;
      if (selectedCategories.length > 0) filterUpdates.categories = selectedCategories;
      if (searchQuery.trim()) filterUpdates.search = searchQuery.trim();
      if (inStockOnly !== undefined) filterUpdates.inStock = inStockOnly;
      
      setFilters(filterUpdates);
    }, 150); // Debounce to prevent rapid updates

    return () => clearTimeout(timeoutId);
  }, [priceRange, selectedBrands, selectedCategories, searchQuery, inStockOnly, setFilters]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 50000000]);
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSearchQuery("");
    setInStockOnly(undefined);
    clearStoreFilters();
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">فیلترها</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs sm:text-sm h-8 sm:h-9"
          >
            پاک کردن
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
          {/* Search */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">جستجو</Label>
            <Input
              placeholder="جستجوی محصول..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm"
            />
          </div>

          <Separator />

          {/* Price Range */}
          <div className="space-y-3 sm:space-y-4">
            <Label className="text-sm sm:text-base">محدوده قیمت</Label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={50000000}
              min={0}
              step={100000}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span>{priceRange[0].toLocaleString("fa-IR")} تومان</span>
              <span>{priceRange[1].toLocaleString("fa-IR")} تومان</span>
            </div>
          </div>

          <Separator />

          {/* Brands */}
          <div className="space-y-2 sm:space-y-3">
            <Label className="text-sm sm:text-base">برند</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableBrands.length > 0 ? (
                availableBrands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={brand}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => toggleBrand(brand)}
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor={brand}
                      className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {brand}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">برندی یافت نشد</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Categories */}
          <div className="space-y-2 sm:space-y-3">
            <Label className="text-sm sm:text-base">دسته‌بندی</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableCategories.length > 0 ? (
                availableCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor={category}
                      className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {category}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">دسته‌بندی‌ای یافت نشد</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Stock Status */}
          <div className="space-y-2 sm:space-y-3">
            <Label className="text-sm sm:text-base">وضعیت موجودی</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="in-stock"
                  checked={inStockOnly === true}
                  onCheckedChange={(checked) => setInStockOnly(checked ? true : undefined)}
                  className="h-4 w-4"
                />
                <label
                  htmlFor="in-stock"
                  className="text-xs sm:text-sm font-medium leading-none cursor-pointer"
                >
                  موجود در انبار
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

