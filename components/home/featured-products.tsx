"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, TrendingUp, Check, ArrowLeft, Package } from "lucide-react";
import Image from "next/image";
import { useProductStore } from "@/store/product-store";
import { useProducts } from "@/services/products";
import { getPlaceholderImage } from "@/lib/image-utils";
import type { Product } from "@/types/product";

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const getEnabledProducts = useProductStore((state) => state.getEnabledProducts);
  const { data: apiProducts, isLoading } = useProducts(undefined, 1, 7);
  const addProduct = useProductStore((state) => state.addProduct);

  // Sync API products to store
  useEffect(() => {
    if (apiProducts && apiProducts.length > 0) {
      apiProducts.forEach((product: Product) => {
        const existing = useProductStore.getState().getProduct(product.id);
        if (!existing) {
          addProduct(product);
        }
      });
    }
  }, [apiProducts, addProduct]);

  // Use API products if available, otherwise fallback to store
  useEffect(() => {
    setIsHydrated(true);
    if (apiProducts && apiProducts.length > 0) {
      setFeaturedProducts(apiProducts.slice(0, 7));
    } else if (!isLoading) {
      // Only use store if API is not loading
      const products = getEnabledProducts().slice(0, 7);
      setFeaturedProducts(products);
    }
  }, [apiProducts, isLoading, getEnabledProducts]);

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 relative overflow-hidden">

      <div className="container px-4 sm:px-4 relative z-10">
        {/* Minimal Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16"
        >
          {/* Badge - Hidden on mobile */}
          <div className="glass-morphism-light hidden sm:inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
            <span className="text-xs sm:text-sm font-medium text-accent">محصولات ویژه</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold sm:font-extrabold mb-2 sm:mb-3 md:mb-4 text-foreground">
            محصولات <span className="text-primary sm:text-accent">پرفروش</span>
          </h2>
          <p className="hidden sm:block text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl px-2 max-w-2xl mx-auto">
            بهترین و پرفروش‌ترین قطعات خودرو با کیفیت تضمینی
          </p>
        </motion.div>

        {/* Minimal Grid - Clean on mobile */}
        {(!isHydrated || isLoading) ? (
          // Show loading skeleton during hydration to match server render
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4" suppressHydrationWarning>
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <Card className="h-full flex flex-col border-[0.1px] border-border/2">
                  <CardHeader className="p-0">
                    <div className="relative h-20 sm:h-24 md:h-28 w-full bg-muted rounded-t-lg" />
                  </CardHeader>
                  <CardContent className="p-1.5 sm:p-2">
                    <div className="h-3 bg-muted rounded mb-2" />
                    <div className="h-2 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
            <Package className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">محصولی یافت نشد</h3>
            <p className="text-sm sm:text-base text-muted-foreground text-center">
              در حال حاضر محصولی برای نمایش وجود ندارد
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
            {featuredProducts.map((product, index) => {
              const discount = product.originalPrice && product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.08,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 120
                }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group"
              >
                <Card className="glass-morphism h-full flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-2xl group-hover:scale-105">
                  {/* Shine Effect - Only on desktop */}
                  <div className="hidden sm:block absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" />
                  
                  <CardHeader className="p-0 relative">
                    <div className="relative h-20 sm:h-24 md:h-28 w-full bg-gradient-to-br from-primary/10 sm:from-primary/20 to-primary/5 sm:to-primary/10 rounded-t-lg sm:rounded-t-xl overflow-hidden">
                      <Image
                        src={product.images[0] || getPlaceholderImage(300, 300)}
                        alt={`${product.name}${product.brand ? ` - برند ${product.brand}` : ''} - محصول پرفروش`}
                        fill
                        className="object-cover group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-500"
                        loading={index < 3 ? "eager" : "lazy"}
                        priority={index < 3}
                        sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, (max-width: 1280px) 16vw, 14vw"
                      />
                      
                      {/* Discount Badge - Smaller on mobile */}
                      {product.originalPrice && product.originalPrice > product.price && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-red-500 text-white text-[8px] sm:text-[9px] font-bold px-1 sm:px-1.5 py-0.5 rounded shadow-sm z-20"
                        >
                          {discount}%
                        </motion.div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 p-1.5 sm:p-2 relative z-10">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-medium mb-1 sm:mb-1.5 hover:text-primary transition-colors line-clamp-2 text-[10px] sm:text-xs leading-tight text-foreground group-hover:text-primary">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {/* Price - Minimal on mobile */}
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
                  </CardContent>
                  
                  {/* Arrow Button - Link to product */}
                  <Link href={`/products/${product.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute bottom-0 left-0 w-5 h-5 sm:w-6 sm:h-6 rounded-tl-md rounded-tr-none rounded-br-md rounded-bl-none flex items-center justify-center backdrop-blur-md border-t-[0.1px] border-r-[0.1px] border-b-0 border-l-0 border-border/2 transition-all z-20 bg-foreground/15 sm:bg-foreground/20 text-foreground hover:bg-foreground/25 sm:hover:bg-foreground/30"
                    >
                      <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </motion.button>
                  </Link>
                  
                  {/* Hover Border Effect - Only on desktop */}
                  <div className="hidden sm:block absolute inset-0 border-[0.1px] border-primary/0 group-hover:border-primary/15 rounded-lg transition-all duration-300 pointer-events-none" />
                </Card>
              </motion.div>
            );
          })}
          </div>
        )}

        {/* View All Button - Minimal on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6 sm:mt-8 md:mt-12 lg:mt-16"
        >
          <Link href="/products">
            <Button 
              size="lg" 
              variant="outline" 
              className="glass-morphism-light h-10 sm:h-12 md:h-14 px-6 sm:px-8 md:px-10 text-sm sm:text-base md:text-lg rounded-lg sm:rounded-xl text-foreground hover:bg-foreground/10 sm:hover:bg-foreground/20 transition-all active:scale-95 sm:hover:scale-105 group"
            >
              <span className="hidden sm:inline">مشاهده همه محصولات</span>
              <span className="sm:hidden">همه محصولات</span>
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1.5 sm:mr-2 group-hover:translate-x-1 transition-transform hidden sm:inline" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

