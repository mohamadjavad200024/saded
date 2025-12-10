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
  MessageCircle
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";

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

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [anyChatOpen, setAnyChatOpen] = useState(false);

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

  return (
    <>
      {/* Bottom Navigation Bar - Fixed/Floating */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-[9999] flex justify-center items-end md:hidden pointer-events-none"
        style={{
          paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))",
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
          <div className="px-2 pb-1 pt-1.5">
            <div className="flex items-center justify-between h-14">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className={cn(
                "flex items-center justify-center",
                "h-9 w-9 rounded-full",
                "bg-muted hover:bg-accent",
                "text-foreground",
                "transition-colors duration-200",
                "active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background"
              )}
              aria-label="بازگشت"
            >
              <ChevronRight className="h-5 w-5" />
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
                        "flex-1 h-12 rounded-md",
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
                            "h-5 w-5 transition-transform duration-200",
                            isActive && "scale-110"
                          )} 
                        />
                        {isCart && itemCount > 0 && (
                          <span 
                            className={cn(
                              "absolute -top-0.5 -right-0.5",
                              "h-4 w-4 rounded-full",
                              "bg-primary text-primary-foreground",
                              "text-[9px] font-bold",
                              "flex items-center justify-center",
                              "min-w-[16px] px-0.5",
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
                          "text-[10px] font-medium mt-1 leading-tight",
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
                            "w-6 h-0.5 rounded-full",
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
                          "flex-1 h-12 rounded-md",
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
                              "h-5 w-5 transition-transform duration-200",
                              pathname === "/chat" && "scale-110"
                            )} 
                          />
                        </div>
                        <span 
                          className={cn(
                            "text-[10px] font-medium mt-1 leading-tight",
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
                              "w-6 h-0.5 rounded-full",
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

