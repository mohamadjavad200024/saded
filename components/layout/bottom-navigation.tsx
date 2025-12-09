"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Package, 
  ShoppingCart, 
  ShoppingBag, 
  ChevronRight,
  MessageCircle,
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  X,
  ExternalLink
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState, useMemo } from "react";
import { useOrderStore } from "@/store/order-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navigationItems = [
  { 
    name: "خانه", 
    href: "/", 
    icon: Home,
    exact: true
  },
  { 
    name: "محصولات", 
    href: "/products", 
    icon: Package 
  },
  { 
    name: "سبد خرید", 
    href: "/cart", 
    icon: ShoppingCart 
  },
  { 
    name: "سفارش‌ها", 
    href: "/orders", 
    icon: ShoppingBag 
  },
];

const statusConfig = {
  pending: {
    label: "در انتظار",
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    icon: Clock,
  },
  processing: {
    label: "در حال پردازش",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: Package,
  },
  shipped: {
    label: "ارسال شده",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    icon: Truck,
  },
  delivered: {
    label: "تحویل داده شده",
    color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "لغو شده",
    color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    icon: XCircle,
  },
};

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useCartStore();
  const { orders, loadOrdersFromDB } = useOrderStore();
  const [isMounted, setIsMounted] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [anyChatOpen, setAnyChatOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState<string | null>(null);

  // Get the most recent active order
  const activeOrder = useMemo(() => {
    const activeOrders = orders.filter(
      (order) => order.status !== "delivered" && order.status !== "cancelled"
    );
    
    if (activeOrders.length === 0) return null;
    
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

  // Check if we're in admin section
  const isAdminPage = pathname?.startsWith("/admin");

  // Calculate cart item count
  const itemCount = isMounted 
    ? items.reduce((count, item) => count + item.quantity, 0)
    : 0;

  // Check if browser history allows going back
  useEffect(() => {
    setIsMounted(true);
    // Check if there's history to go back to
    setCanGoBack(window.history.length > 1);
  }, []);

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

  // Poll for order updates every 30 seconds
  useEffect(() => {
    if (!activeOrder) return;

    const interval = setInterval(() => {
      loadOrdersFromDB().catch((error) => {
        console.error("Error polling orders:", error);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [activeOrder, loadOrdersFromDB]);

  // Check if any chat is open (QuickBuyChat or AdminChat)
  useEffect(() => {
    const checkChatStatus = () => {
      if (typeof window === "undefined") return;
      
      // Check for QuickBuyChat
      const quickBuyChatOpen = document.querySelector('[data-chat-open="true"]') !== null;
      
      // Check for AdminChat
      const adminChatOpen = document.querySelector('[data-admin-chat-open="true"]') !== null;
      
      setAnyChatOpen(quickBuyChatOpen || adminChatOpen);
    };

    // Check immediately
    checkChatStatus();

    // Set up interval to check periodically
    const interval = setInterval(checkChatStatus, 200);

    // Also listen for DOM changes
    const observer = new MutationObserver(checkChatStatus);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-chat-open', 'data-admin-chat-open']
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  // Don't show on admin pages, chat page, or when any chat is open
  if (isAdminPage || pathname === "/chat" || anyChatOpen) {
    return null;
  }

  const handleBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const showOrderStatus = activeOrder && isDismissed !== activeOrder.id;
  const statusInfo = activeOrder ? statusConfig[activeOrder.status as keyof typeof statusConfig] || statusConfig.pending : null;
  const StatusIcon = statusInfo?.icon || Clock;

  return (
    <>
      {/* Order Status Bar - Floating above bottom navigation (Mobile only) */}
      <AnimatePresence>
        {showOrderStatus && statusInfo && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[9998] md:hidden pointer-events-none"
            style={{
              paddingBottom: "max(0.5rem, calc(env(safe-area-inset-bottom, 0px) + 0.25rem))",
              paddingLeft: "1rem",
              paddingRight: "1rem",
            }}
          >
            <div className="max-w-sm mx-auto pointer-events-auto">
              <div
                className={cn(
                  "relative overflow-hidden rounded-lg border shadow-md backdrop-blur-xl",
                  "bg-gradient-to-br from-background/95 to-background/90",
                  statusInfo.color,
                  "border"
                )}
              >
                <div className="p-1.5">
                  <div className="flex items-center gap-1.5">
                    {/* Icon - Minimal */}
                    <div className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center",
                      "bg-background/50 backdrop-blur-sm border",
                      statusInfo.color
                    )}>
                      <StatusIcon className="h-3 w-3" />
                    </div>

                    {/* Content - Ultra Minimal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[9px] font-semibold border px-1 py-0 h-4",
                            statusInfo.color
                          )}
                        >
                          {statusInfo.label}
                        </Badge>
                        <p className="text-[9px] text-muted-foreground truncate font-mono">
                          {activeOrder.orderNumber}
                        </p>
                      </div>
                    </div>

                    {/* Actions - Minimal */}
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0"
                      >
                        <Link href={`/order/track?orderNumber=${activeOrder.orderNumber}`}>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0"
                        onClick={() => {
                          if (activeOrder) {
                            setIsDismissed(activeOrder.id);
                            if (typeof window !== "undefined") {
                              localStorage.setItem("dismissedOrderStatusBar", activeOrder.id);
                            }
                          }
                        }}
                      >
                        <X className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar - Sticky/Floating */}
      <div 
        className="sticky bottom-0 left-0 right-0 z-[9999] flex justify-center md:hidden pointer-events-none mt-auto"
        style={{
          paddingBottom: showOrderStatus 
            ? `calc(max(0.5rem, env(safe-area-inset-bottom, 0px) + 0.25rem) + 3.5rem)` 
            : "max(0.5rem, calc(env(safe-area-inset-bottom, 0px) + 0.25rem))",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        <nav 
          className={cn(
            "w-full max-w-sm pointer-events-auto",
            "bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80",
            "border-[0.25px] border-border/30",
            "rounded-[8px]",
            "shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.3)]"
          )}
        >
          <div className="px-1.5 pb-0.5 pt-1">
            <div className="flex items-center justify-between h-10">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className={cn(
                "flex items-center justify-center",
                "h-7 w-7 rounded-full",
                "bg-muted hover:bg-accent",
                "text-foreground",
                "transition-colors duration-200",
                "active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background"
              )}
              aria-label="بازگشت"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

            {/* Navigation Items */}
            <div className="flex items-center justify-center flex-1 gap-0 px-0.5">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname?.startsWith(item.href);
                
                const isCart = item.href === "/cart";
                const isHome = item.href === "/";
                
                return (
                  <>
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex flex-col items-center justify-center",
                        "flex-1 h-8 rounded-md",
                        "transition-all duration-200",
                        "relative",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground",
                        "active:scale-95"
                      )}
                      aria-label={item.name}
                    >
                      <div className="relative">
                        <Icon 
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-200",
                            isActive && "scale-110"
                          )} 
                        />
                        {isCart && itemCount > 0 && (
                          <span 
                            className={cn(
                              "absolute -top-0.5 -right-0.5",
                              "h-3 w-3 rounded-full",
                              "bg-primary text-primary-foreground",
                              "text-[8px] font-bold",
                              "flex items-center justify-center",
                              "min-w-[12px] px-0.5",
                              "border border-background"
                            )}
                            aria-label={`${itemCount} آیتم در سبد خرید`}
                          >
                            {itemCount > 99 ? "99+" : itemCount}
                          </span>
                        )}
                      </div>
                      <span 
                        className={cn(
                          "text-[8px] font-medium mt-0 leading-tight",
                          "transition-colors duration-200",
                          isActive && "font-semibold"
                        )}
                      >
                        {item.name}
                      </span>
                      {isActive && (
                        <div 
                          className={cn(
                            "absolute top-0 left-1/2 -translate-x-1/2",
                            "w-5 h-0.5 rounded-full",
                            "bg-primary",
                            "animate-in fade-in slide-in-from-top-1 duration-200"
                          )}
                        />
                      )}
                    </Link>
                    
                    {/* Chat Button - Right after Home */}
                    {isHome && (
                      <Link
                        key="chat-button"
                        href="/chat"
                        className={cn(
                          "flex flex-col items-center justify-center",
                          "flex-1 h-8 rounded-md",
                          "transition-all duration-200",
                          "relative",
                          pathname === "/chat"
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground",
                          "active:scale-95"
                        )}
                        aria-label="چت"
                      >
                        <div className="relative">
                          <MessageCircle 
                            className={cn(
                              "h-3.5 w-3.5 transition-transform duration-200",
                              pathname === "/chat" && "scale-110"
                            )} 
                          />
                        </div>
                        <span 
                          className={cn(
                            "text-[8px] font-medium mt-0 leading-tight",
                            "transition-colors duration-200",
                            pathname === "/chat" && "font-semibold"
                          )}
                        >
                          چت
                        </span>
                        {pathname === "/chat" && (
                          <div 
                            className={cn(
                              "absolute top-0 left-1/2 -translate-x-1/2",
                              "w-5 h-0.5 rounded-full",
                              "bg-primary",
                              "animate-in fade-in slide-in-from-top-1 duration-200"
                            )}
                          />
                        )}
                      </Link>
                    )}
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      </div>
    </>
  );
}

