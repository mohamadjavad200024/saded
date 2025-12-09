"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Package, Users, Star, Truck, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Package,
    value: "50,000+",
    label: "قطعه موجود",
    color: "text-primary",
    bgGradient: "from-primary/20 to-primary/10",
    iconBg: "bg-primary/20",
    description: "انواع قطعات خودرو",
  },
  {
    icon: Users,
    value: "25,000+",
    label: "مشتری راضی",
    color: "text-secondary",
    bgGradient: "from-secondary/20 to-secondary/10",
    iconBg: "bg-secondary/20",
    description: "مشتریان خوشنود",
  },
  {
    icon: Star,
    value: "4.8",
    label: "امتیاز مشتریان",
    color: "text-accent",
    bgGradient: "from-accent/20 to-accent/10",
    iconBg: "bg-accent/20",
    description: "از 5 ستاره",
  },
  {
    icon: Truck,
    value: "24h",
    label: "ارسال سریع",
    color: "text-primary",
    bgGradient: "from-primary/20 to-primary/10",
    iconBg: "bg-primary/20",
    description: "تحویل در 24 ساعت",
  },
];

export function FeaturedStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 relative overflow-hidden">

      <div className="container px-3 sm:px-4 relative z-10" ref={ref}>
        {/* Minimal Header - Hidden on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hidden sm:block text-center mb-4 sm:mb-6 md:mb-8 lg:mb-12"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-foreground">
            چرا <span className="text-primary">ساد</span> را انتخاب کنید؟
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
            با اطمینان کامل خرید کنید
          </p>
        </motion.div>

        {/* Ultra Minimal Grid - 4 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ 
                  delay: index * 0.08,
                  duration: 0.3,
                  type: "spring",
                  stiffness: 150
                }}
                whileHover={{ 
                  y: -2,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="group relative"
              >
                {/* Ultra Minimal Card - Glass Morphism */}
                <div className="glass-morphism relative rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-6 text-center transition-all duration-300 hover:shadow-2xl overflow-hidden group-hover:scale-105">
                  {/* Animated Background - Only on desktop */}
                  <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Ultra Minimal Icon - Very small on mobile */}
                  <motion.div
                    whileHover={{ rotate: [0, -3, 3, -3, 0] }}
                    transition={{ duration: 0.3 }}
                    className={`
                      relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 
                      ${stat.iconBg} rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center 
                      mx-auto mb-1.5 sm:mb-2 md:mb-3 lg:mb-4 group-hover:scale-105 transition-transform duration-300
                    `}
                  >
                    <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-8 xl:w-8 ${stat.color}`} />
                    <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg sm:rounded-xl md:rounded-2xl" />
                  </motion.div>

                  {/* Value - Compact on mobile */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: index * 0.08 + 0.15 }}
                    className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold sm:font-extrabold mb-0.5 sm:mb-1 text-foreground leading-tight"
                  >
                    {stat.value}
                  </motion.div>

                  {/* Label - Ultra minimal on mobile */}
                  <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base font-medium sm:font-semibold text-foreground leading-tight line-clamp-2">
                    {stat.label}
                  </div>

                  {/* Description - Hidden on mobile and tablet */}
                  <div className="hidden lg:block text-xs xl:text-sm text-muted-foreground mt-1">
                    {stat.description}
                  </div>

                  {/* Decorative Element - Only on desktop */}
                  <div className="hidden md:block absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA - Hidden on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="hidden sm:block text-center mt-6 sm:mt-8 md:mt-10 lg:mt-12"
        >
          <div className="glass-morphism-light inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="text-xs sm:text-sm md:text-base text-foreground font-medium">
              رشد مستمر در رضایت مشتریان
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

