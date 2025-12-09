"use client";

import { useState, useEffect, useMemo } from "react";
import { useOrderStore } from "@/store/order-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowLeft,
  X,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const statusConfig = {
  pending: {
    label: "در انتظار",
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    icon: Clock,
    progress: 25,
  },
  processing: {
    label: "در حال پردازش",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: Package,
    progress: 50,
  },
  shipped: {
    label: "ارسال شده",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    icon: Truck,
    progress: 75,
  },
  delivered: {
    label: "تحویل داده شده",
    color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    icon: CheckCircle2,
    progress: 100,
  },
  cancelled: {
    label: "لغو شده",
    color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    icon: XCircle,
    progress: 0,
  },
};

export function OrderStatusBar() {
  const { orders, loadOrdersFromDB } = useOrderStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState<string | null>(null);

  // Get the most recent active order (not delivered or cancelled)
  const activeOrder = useMemo(() => {
    const activeOrders = orders.filter(
      (order) => order.status !== "delivered" && order.status !== "cancelled"
    );
    
    if (activeOrders.length === 0) return null;
    
    // Sort by createdAt (most recent first)
    return activeOrders.sort((a, b) => {
      const aTime = a.createdAt instanceof Date 
        ? a.createdAt.getTime() 
        : new Date(a.createdAt).getTime();
      const bTime = b.createdAt instanceof Date 
        ? b.createdAt.getTime() 
        : new Date(b.createdAt).getTime();
      return bTime - aTime;
    })[0];
  }, [orders]);

  // Load dismissed order ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissedId = localStorage.getItem("dismissedOrderStatusBar");
      if (dismissedId) {
        setIsDismissed(dismissedId);
      }
    }
  }, []);

  // Load orders on mount
  useEffect(() => {
    loadOrdersFromDB().catch((error) => {
      console.error("Error loading orders for status bar:", error);
    });
  }, [loadOrdersFromDB]);

  // Show bar if there's an active order and it's not dismissed
  useEffect(() => {
    if (activeOrder) {
      // Show if this is a different order than the dismissed one
      if (isDismissed !== activeOrder.id) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    } else {
      setIsVisible(false);
    }
  }, [activeOrder, isDismissed]);

  // Poll for order updates every 30 seconds
  useEffect(() => {
    if (!activeOrder) return;

    const interval = setInterval(() => {
      loadOrdersFromDB().catch((error) => {
        console.error("Error polling orders:", error);
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [activeOrder, loadOrdersFromDB]);

  if (!activeOrder || !isVisible) return null;

  const statusInfo = statusConfig[activeOrder.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-1.5 sm:p-3 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <div
              className={cn(
                "relative overflow-hidden rounded-md sm:rounded-lg border shadow-md backdrop-blur-xl",
                "bg-gradient-to-br from-background/95 to-background/90",
                statusInfo.color,
                "border"
              )}
            >
              {/* Progress bar - Hidden on mobile, shown on desktop */}
              <div className="hidden sm:block absolute top-0 left-0 right-0 h-0.5 bg-muted/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${statusInfo.progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary/60"
                />
              </div>

              <div className="p-1.5 sm:p-3">
                <div className="flex items-center gap-1.5 sm:gap-3">
                  {/* Icon - Very minimal on mobile */}
                  <div className={cn(
                    "flex-shrink-0 w-6 h-6 sm:w-10 sm:h-10 rounded-md sm:rounded-lg flex items-center justify-center",
                    "bg-background/50 backdrop-blur-sm border",
                    statusInfo.color
                  )}>
                    <StatusIcon className="h-3 w-3 sm:h-5 sm:w-5" />
                  </div>

                  {/* Content - Ultra minimal on mobile */}
                  <div className="flex-1 min-w-0">
                    {/* Mobile: Ultra minimal - single line */}
                    <div className="sm:hidden flex items-center gap-1.5">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[9px] font-semibold border px-1 py-0 h-4 leading-none",
                          statusInfo.color
                        )}
                      >
                        {statusInfo.label}
                      </Badge>
                      <p className="text-[9px] text-muted-foreground truncate font-mono">
                        {activeOrder.orderNumber}
                      </p>
                    </div>

                    {/* Desktop: Normal content */}
                    <div className="hidden sm:flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs font-semibold border",
                          statusInfo.color
                        )}
                      >
                        {statusInfo.label}
                      </Badge>
                      <p className="text-xs text-muted-foreground truncate">
                        <span className="font-mono font-semibold">{activeOrder.orderNumber}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions - Very minimal on mobile */}
                  <div className="flex items-center gap-0.5 sm:gap-1.5 flex-shrink-0">
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 sm:h-8 sm:w-8 p-0 rounded-md"
                    >
                      <Link href={`/order/track?orderNumber=${activeOrder.orderNumber}`}>
                        <ExternalLink className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 sm:h-8 sm:w-8 p-0 rounded-md"
                      onClick={() => {
                        if (activeOrder) {
                          setIsDismissed(activeOrder.id);
                          setIsVisible(false);
                          // Save to localStorage
                          if (typeof window !== "undefined") {
                            localStorage.setItem("dismissedOrderStatusBar", activeOrder.id);
                          }
                        }
                      }}
                    >
                      <X className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

