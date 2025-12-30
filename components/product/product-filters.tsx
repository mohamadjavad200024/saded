"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { X, Search, DollarSign, Folder, Package, RotateCcw, Sparkles } from "lucide-react";
import { useProductStore } from "@/store/product-store";
import { useCategoryStore } from "@/store/category-store";
import { motion, AnimatePresence } from "framer-motion";

export function ProductFilters() {
  const { setFilters, clearFilters: clearStoreFilters, filters: storeFilters } = useProductStore();
  const { getActiveCategories, loadCategoriesFromDB } = useCategoryStore();
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inStockOnly, setInStockOnly] = useState<boolean | undefined>(undefined);
  const isUpdatingFromStore = useRef(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
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
      // Always include search - empty string will clear the filter
      filterUpdates.search = searchQuery.trim() || undefined;
      if (inStockOnly !== undefined) filterUpdates.inStock = inStockOnly;
      
      setFilters(filterUpdates);
    }, 300); // Increased debounce for better UX

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

  const hasActiveFilters = 
    priceRange[0] > 0 || 
    priceRange[1] < 50000000 || 
    selectedBrands.length > 0 || 
    selectedCategories.length > 0 || 
    searchQuery.trim() !== "" || 
    inStockOnly !== undefined;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header with Clear Button */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between pb-3 border-b border-border/30"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">فیلترهای فعال</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs sm:text-sm h-8 sm:h-9 text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5" />
              پاک کردن همه
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-5 sm:space-y-6">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2.5"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Search className="h-4 w-4 text-primary" />
            </div>
            <Label className="text-sm sm:text-base font-semibold">جستجو</Label>
          </div>
          <div className="relative">
            <Input
              ref={searchInputRef}
              placeholder="جستجوی محصول..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 sm:h-11 text-sm border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pr-10"
              autoFocus={false}
              tabIndex={0}
              onFocus={(e) => {
                // Prevent auto-focus on mobile when sheet first opens
                // Only allow focus if user explicitly clicked
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  const wasJustOpened = sessionStorage.getItem('filterSheetJustOpened') === 'true';
                  if (wasJustOpened) {
                    e.target.blur();
                    sessionStorage.removeItem('filterSheetJustOpened');
                  }
                }
              }}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </motion.div>

        <Separator className="bg-border/30" />

        {/* Price Range */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <Label className="text-sm sm:text-base font-semibold">محدوده قیمت</Label>
          </div>
          <div className="px-1">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={50000000}
              min={0}
              step={100000}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1.5 font-medium">حداقل</span>
              <span className="text-sm sm:text-base font-bold text-primary">{priceRange[0].toLocaleString("fa-IR")} تومان</span>
            </div>
            <div className="h-10 w-px bg-primary/30"></div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground mb-1.5 font-medium">حداکثر</span>
              <span className="text-sm sm:text-base font-bold text-primary">{priceRange[1].toLocaleString("fa-IR")} تومان</span>
            </div>
          </div>
        </motion.div>

        <Separator className="bg-border/30" />

        {/* Brands */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <Label className="text-sm sm:text-base font-semibold">برند</Label>
            {selectedBrands.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded-full font-semibold shadow-sm"
              >
                {selectedBrands.length}
              </motion.span>
            )}
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
            {availableBrands.length > 0 ? (
              availableBrands.map((brand, index) => (
                <motion.div
                  key={brand}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.02 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                    selectedBrands.includes(brand)
                      ? "bg-gradient-to-r from-primary/15 to-primary/5 border-2 border-primary/30 shadow-sm"
                      : "hover:bg-muted/50 border-2 border-transparent hover:border-border/50"
                  }`}
                  onClick={() => toggleBrand(brand)}
                  whileTap={{ scale: 0.98 }}
                >
                  <Checkbox
                    id={brand}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => toggleBrand(brand)}
                    className="h-5 w-5"
                  />
                  <label
                    htmlFor={brand}
                    className={`text-sm font-medium leading-none cursor-pointer flex-1 ${
                      selectedBrands.includes(brand) ? "text-primary font-semibold" : "text-foreground"
                    }`}
                  >
                    {brand}
                  </label>
                </motion.div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">برندی یافت نشد</p>
            )}
          </div>
        </motion.div>

        <Separator className="bg-border/30" />

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Folder className="h-4 w-4 text-primary" />
            </div>
            <Label className="text-sm sm:text-base font-semibold">دسته‌بندی</Label>
            {selectedCategories.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded-full font-semibold shadow-sm"
              >
                {selectedCategories.length}
              </motion.span>
            )}
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
            {availableCategories.length > 0 ? (
              availableCategories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.02 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                    selectedCategories.includes(category)
                      ? "bg-gradient-to-r from-primary/15 to-primary/5 border-2 border-primary/30 shadow-sm"
                      : "hover:bg-muted/50 border-2 border-transparent hover:border-border/50"
                  }`}
                  onClick={() => toggleCategory(category)}
                  whileTap={{ scale: 0.98 }}
                >
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                    className="h-5 w-5"
                  />
                  <label
                    htmlFor={category}
                    className={`text-sm font-medium leading-none cursor-pointer flex-1 ${
                      selectedCategories.includes(category) ? "text-primary font-semibold" : "text-foreground"
                    }`}
                  >
                    {category}
                  </label>
                </motion.div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">دسته‌بندی‌ای یافت نشد</p>
            )}
          </div>
        </motion.div>

        <Separator className="bg-border/30" />

        {/* Stock Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <Label className="text-sm sm:text-base font-semibold">وضعیت موجودی</Label>
          </div>
          <motion.div
            className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
              inStockOnly === true
                ? "bg-gradient-to-r from-primary/15 to-primary/5 border-2 border-primary/30 shadow-sm"
                : "hover:bg-muted/50 border-2 border-transparent hover:border-border/50"
            }`}
            onClick={() => setInStockOnly(inStockOnly === true ? undefined : true)}
            whileTap={{ scale: 0.98 }}
          >
            <Checkbox
              id="in-stock"
              checked={inStockOnly === true}
              onCheckedChange={(checked) => setInStockOnly(checked ? true : undefined)}
              className="h-5 w-5"
            />
            <label
              htmlFor="in-stock"
              className={`text-sm font-medium leading-none cursor-pointer flex-1 ${
                inStockOnly === true ? "text-primary font-semibold" : "text-foreground"
              }`}
            >
              موجود در انبار
            </label>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

