"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, ArrowLeft, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ProductSearch } from "@/components/product/product-search";
import { MinimalCategoryGrid } from "@/components/home/category-grid";
import { useProductStore } from "@/store/product-store";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { setFilters, filters } = useProductStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close search when route changes
  useEffect(() => {
    if (searchOpen) {
      setSearchOpen(false);
    }
  }, [pathname]);

  // Sync search query with store filter when on products page
  useEffect(() => {
    if (pathname === "/products" && filters.search && filters.search !== searchQuery) {
      setSearchQuery(filters.search);
    }
  }, [filters.search, pathname]);

  const handleSearchSubmit = () => {
    const trimmedQuery = searchQuery.trim();
    
    // Apply search filter first
    setFilters({ search: trimmedQuery || undefined });
    
    // Use setTimeout to ensure filter is applied before navigation
    setTimeout(() => {
      // Navigate to products page with search query in URL
      if (trimmedQuery) {
        router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
      } else {
        router.push("/products");
      }
      
      // Close search modal if open
      setSearchOpen(false);
      
      // Close filter sheet if open
      window.dispatchEvent(new CustomEvent("closeFilterSheet"));
    }, 50);
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      handleSearchSubmit();
    } else {
      // If no query, just navigate to products page
      router.push("/products");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <section className="relative -mt-[20%] sm:-mt-[20%] md:-mt-[20%] lg:-mt-[20%] flex items-end justify-center overflow-visible pointer-events-none">
      {/* Main Content - Overlay on bottom 20% of video */}
      <div className="container relative z-10 px-3 sm:px-4 py-4 sm:py-6 md:py-8 pointer-events-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4 sm:space-y-6 md:space-y-8"
        >
          {/* Minimal Search - Main focus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto"
          >
            <div className="glass-morphism-strong rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-2xl">
              <div className="flex gap-2 sm:gap-3">
                <ProductSearch
                  initialQuery={searchQuery}
                  isOpen={searchOpen}
                  onOpenChange={setSearchOpen}
                  trigger={
                    <Button 
                      size="default"
                      onClick={handleSearchClick}
                      className="bg-foreground hover:bg-foreground/90 text-background h-10 sm:h-11 md:h-12 px-3 sm:px-4 md:px-5 text-xs sm:text-sm md:text-base rounded-lg sm:rounded-xl font-medium whitespace-nowrap flex-shrink-0"
                    >
                      <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5 sm:ml-2" />
                      <span>جستجو</span>
                    </Button>
                  }
                />
                <div className="flex-1 relative group">
                  <Search className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 transition-colors group-focus-within:text-accent" />
                  <Input
                    type="text"
                    placeholder="جستجو..."
                    value={searchQuery}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchQuery(value);
                      // If input is cleared, clear filter
                      if (!value.trim() && filters.search) {
                        setFilters({ search: undefined });
                      }
                    }}
                    onKeyDown={handleSearchKeyDown}
                    className="pr-8 sm:pr-10 md:pr-12 bg-background border-border/30 text-foreground placeholder:text-muted-foreground h-10 sm:h-11 md:h-12 text-xs sm:text-sm md:text-base rounded-lg sm:rounded-xl focus:border-accent/30 focus:ring-1 focus:ring-accent/20 transition-all"
                  />
                </div>
              </div>

              {/* Minimal Category Grid - 2 rows, 3 columns */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="mt-3 sm:mt-4"
              >
                <MinimalCategoryGrid />
              </motion.div>
            </div>
          </motion.div>

          {/* CTA Buttons - Horizontal and Minimal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-row gap-2 sm:gap-3 justify-center mt-4 sm:mt-6"
          >
            <Link href="/products">
              <Button 
                size="default"
                className="bg-foreground text-background hover:bg-foreground/90 h-9 sm:h-10 md:h-11 px-4 sm:px-5 md:px-6 text-xs sm:text-sm rounded-lg sm:rounded-xl font-medium transition-all whitespace-nowrap"
              >
                مشاهده محصولات
              </Button>
            </Link>
            <Link href="/guide">
              <Button 
                size="default"
                variant="outline" 
                className="glass-morphism-light h-9 sm:h-10 md:h-11 px-4 sm:px-5 md:px-6 text-xs sm:text-sm rounded-lg sm:rounded-xl text-foreground hover:bg-foreground/10 transition-all whitespace-nowrap"
              >
                راهنمای خرید
              </Button>
            </Link>
            <Link href="/chat">
              <Button 
                size="default"
                variant="outline" 
                className="glass-morphism-light h-9 sm:h-10 md:h-11 px-4 sm:px-5 md:px-6 text-xs sm:text-sm rounded-lg sm:rounded-xl text-foreground hover:bg-foreground/10 transition-all whitespace-nowrap flex items-center gap-1.5"
              >
                <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                خرید سریع
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
