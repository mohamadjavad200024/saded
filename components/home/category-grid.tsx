"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Car, Wrench, Settings, Sparkles, Zap, Shield, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCategories } from "@/services/categories";

const iconMap: Record<string, typeof Car> = {
  "موتور و قطعات": Car,
  "بدنه و شیشه": Shield,
  "الکتریک و برق": Zap,
  "تعلیق و ترمز": Settings,
  "روغن و فیلتر": Sparkles,
  "لاستیک و رینگ": Wrench,
};

const colorMap: Record<number, { color: string; bgGradient: string; iconBg: string }> = {
  0: {
    color: "text-primary",
    bgGradient: "from-primary/20 via-primary/10 to-transparent",
    iconBg: "bg-gradient-to-br from-primary/30 to-primary/10",
  },
  1: {
    color: "text-secondary",
    bgGradient: "from-secondary/20 via-secondary/10 to-transparent",
    iconBg: "bg-gradient-to-br from-secondary/30 to-secondary/10",
  },
  2: {
    color: "text-accent",
    bgGradient: "from-accent/20 via-accent/10 to-transparent",
    iconBg: "bg-gradient-to-br from-accent/30 to-accent/10",
  },
};

export function CategoryGrid() {
  const { data: categories = [], isLoading, isError, error } = useCategories();
  
  const displayCategories = useMemo(() => {
    return (categories || [])
      .filter((cat) => cat.isActive)
      .slice(0, 6)
      .map((category, index) => {
        const Icon = iconMap[category.name] || Car;
        const colors = colorMap[index % 3];
        return {
          ...category,
          Icon,
          ...colors,
          href: `/categories/${category.id}`,
          count: "0+", // Will be updated when we have product counts
        };
      });
  }, [categories]);
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 relative overflow-hidden">

      <div className="container px-3 sm:px-4 relative z-10">
        {/* Minimal Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-12"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold sm:font-extrabold mb-2 sm:mb-3 md:mb-4 text-foreground">
            دسته‌بندی <span className="text-primary sm:text-accent">محصولات</span>
          </h2>
          <p className="hidden sm:block text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl px-2 max-w-2xl mx-auto">
            قطعات خودرو را بر اساس دسته‌بندی پیدا کنید و بهترین انتخاب را داشته باشید
          </p>
        </motion.div>

        {/* Ultra Minimal Grid - 4 columns on mobile */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">در حال بارگذاری دسته‌بندی‌ها...</p>
          </div>
        ) : isError && displayCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              خطا در بارگذاری دسته‌بندی‌ها
            </p>
            <p className="text-xs text-muted-foreground text-center max-w-md px-4">
              {error instanceof Error && error.message.includes('database')
                ? 'خطا در اتصال به دیتابیس. لطفاً مطمئن شوید دیتابیس در حال اجرا است.'
                : 'متأسفانه خطایی در بارگذاری دسته‌بندی‌ها رخ داده است.'}
            </p>
          </div>
        ) : displayCategories.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">دسته‌بندی‌ای یافت نشد</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {displayCategories.map((category, index) => {
              const Icon = category.Icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.08,
                  duration: 0.3,
                  type: "spring",
                  stiffness: 150
                }}
                whileHover={{ 
                  y: -2,
                  scale: 1.02,
                }}
                className="group relative"
              >
                <Link href={category.href}>
                  <Card className="glass-morphism h-full relative overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer group-hover:scale-105">
                    {/* Animated Background Gradient - Only on desktop */}
                    <div className={`hidden sm:block absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Shine Effect - Only on desktop */}
                    <div className="hidden sm:block absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    
                    <CardContent className="p-2 sm:p-3 md:p-4 lg:p-6 relative z-10">
                      {/* Ultra Minimal Icon - Very small on mobile */}
                      <motion.div
                        whileHover={{ 
                          rotate: [0, -3, 3, -3, 0],
                          scale: 1.05
                        }}
                        transition={{ duration: 0.3 }}
                        className={`
                          relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 
                          ${category.iconBg} rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center 
                          mx-auto mb-1.5 sm:mb-2 md:mb-3 lg:mb-4 group-hover:shadow-md sm:group-hover:shadow-lg transition-all duration-300
                        `}
                      >
                        <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-8 xl:w-8 ${category.color} group-hover:scale-105 transition-transform duration-300`} />
                        <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg sm:rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>

                      {/* Category Name - Ultra minimal on mobile */}
                      <h3 className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base 2xl:text-lg font-medium sm:font-semibold md:font-bold mb-0.5 sm:mb-1 md:mb-1.5 text-center text-foreground group-hover:text-primary transition-colors duration-300 leading-tight line-clamp-2">
                        {category.name}
                      </h3>

                      {/* Product Count - Ultra minimal on mobile */}
                      {category.description && (
                        <div className="flex items-center justify-center gap-1">
                          <p className="text-[8px] sm:text-[9px] md:text-xs lg:text-sm text-muted-foreground font-medium">
                            {category.description}
                          </p>
                          <motion.div
                            initial={{ x: -2, opacity: 0 }}
                            whileHover={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="hidden sm:block opacity-0 group-hover:opacity-100"
                          >
                            <ArrowLeft className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
                          </motion.div>
                        </div>
                      )}

                      {/* Hover Indicator - Only on desktop */}
                      <div className="hidden sm:block absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-primary via-accent to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}

