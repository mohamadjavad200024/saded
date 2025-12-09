"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "./navigation";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { getItemCount, initializeSession, loadFromDatabase, items } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  // Calculate item count - this will automatically update when items change
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  // Subscribe to items changes to update count
  // This ensures the count updates when cart changes

  // Prevent hydration mismatch by only showing cart count after mount
  // Also load cart from database on mount
  useEffect(() => {
    setIsMounted(true);
    
    // Initialize cart session and load from database
    const initCart = async () => {
      try {
        initializeSession();
        await loadFromDatabase();
      } catch (error) {
        console.error("Error initializing cart in header:", error);
      }
    };
    initCart();
  }, [initializeSession, loadFromDatabase]);

  return (
    <header className="sticky top-0 z-50 w-full border-b-[0.25px] border-border/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
        {/* Logo - مینیمال برای موبایل */}
        <Link href="/" className="flex items-center space-x-1.5 space-x-reverse min-w-0 flex-shrink-0">
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-primary leading-tight">ساد</span>
            <span className="hidden sm:block text-[10px] sm:text-xs text-muted-foreground leading-tight">
              قطعات خودرو وارداتی
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <Navigation />
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="جستجوی قطعه، برند یا شماره VIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 w-full h-9"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 space-x-reverse flex-shrink-0">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">جستجو</span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Desktop User */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex h-9 w-9">
                  <User className="h-5 w-5" />
                  <span className="sr-only">حساب کاربری</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.phone}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="ml-2 h-4 w-4" />
                    پروفایل
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                  }}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="ml-2 h-4 w-4" />
                  خروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button variant="ghost" size="icon" className="hidden md:flex h-9 w-9">
                <User className="h-5 w-5" />
                <span className="sr-only">حساب کاربری</span>
              </Button>
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart" aria-label={isMounted ? `سبد خرید با ${itemCount} آیتم` : "سبد خرید"}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9"
              aria-label={isMounted && itemCount > 0 ? `سبد خرید (${itemCount} آیتم)` : "سبد خرید"}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">سبد خرید</span>
              {isMounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-secondary text-secondary-foreground text-[10px] sm:text-xs font-bold flex items-center justify-center"
                  aria-label={`${itemCount} آیتم در سبد خرید`}
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">منو</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle>منو</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <Navigation mobile onNavigate={() => setMobileMenuOpen(false)} />
                <div className="pt-4 border-t-[0.25px] border-border/30 space-y-2">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-sm text-muted-foreground">تم</span>
                    <ThemeToggle />
                  </div>
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-2 py-1.5 border-b border-border/30">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.phone}</p>
                      </div>
                      <Link href="/profile">
                        <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                          <User className="h-4 w-4 ml-2" />
                          پروفایل
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 ml-2" />
                        خروج
                      </Button>
                    </>
                  ) : (
                    <Link href="/auth">
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                        <User className="h-4 w-4 ml-2" />
                        حساب کاربری
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar - Expandable */}
      {searchOpen && (
        <div className="lg:hidden border-t-[0.25px] border-border/30 px-3 py-2 bg-background animate-in slide-in-from-top">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="جستجو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 h-9"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

