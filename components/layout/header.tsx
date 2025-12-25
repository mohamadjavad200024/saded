"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useAdminStore } from "@/store/admin-store";
import { useProductStore } from "@/store/product-store";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { getItemCount, initializeSession, loadFromDatabase, items } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { settings } = useAdminStore();
  const { setFilters, filters } = useProductStore();
  
  // Use settings directly from admin store (which loads from API)
  // Also sync with localStorage for backward compatibility
  const [siteSettings, setSiteSettings] = useState({
    siteName: settings.siteName || "ساد",
    logoUrl: settings.logoUrl || "",
    siteDescription: settings.siteDescription || "قطعات خودرو وارداتی",
  });

  useEffect(() => {
    // Update from admin store (which loads from API)
    setSiteSettings({
      siteName: settings.siteName || "ساد",
      logoUrl: settings.logoUrl || "",
      siteDescription: settings.siteDescription || "قطعات خودرو وارداتی",
    });
    
    // Also load from localStorage as fallback
    const loadFromLocalStorage = () => {
      const savedSettings = localStorage.getItem("admin_site_settings");
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSiteSettings({
            siteName: parsed.siteName || settings.siteName || "ساد",
            logoUrl: parsed.logoUrl || settings.logoUrl || "",
            siteDescription: parsed.siteDescription || settings.siteDescription || "قطعات خودرو وارداتی",
          });
        } catch (error) {
          console.error("Error loading site settings from localStorage:", error);
        }
      }
    };

    loadFromLocalStorage();

    // Listen for storage changes (when settings are updated in another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "admin_site_settings") {
        loadFromLocalStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom event (for same-tab updates)
    const handleSettingsUpdate = () => {
      // Reload from admin store (which will have latest from API)
      setSiteSettings({
        siteName: settings.siteName || "ساد",
        logoUrl: settings.logoUrl || "",
        siteDescription: settings.siteDescription || "قطعات خودرو وارداتی",
      });
      loadFromLocalStorage();
    };

    window.addEventListener("settingsUpdated", handleSettingsUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("settingsUpdated", handleSettingsUpdate);
    };
  }, [settings]);

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
        if (process.env.NODE_ENV === "development") {
          console.error("Error initializing cart in header:", error);
        }
      }
    };
    initCart();
  }, [initializeSession, loadFromDatabase]);

  // Sync search query with store filter when on products page
  useEffect(() => {
    if (pathname === "/products" && filters.search && filters.search !== searchQuery) {
      setSearchQuery(filters.search);
    }
  }, [filters.search, pathname]);

  // Clear filter when search input is empty
  useEffect(() => {
    if (pathname === "/products" && !searchQuery.trim() && filters.search) {
      // If search input is empty and there's a filter, clear it
      setFilters({ search: undefined });
    }
  }, [searchQuery, pathname, filters.search, setFilters]);

  // Handle search submit
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Apply search filter
    setFilters({ search: searchQuery.trim() || undefined });
    
    // Navigate to products page if not already there
    if (pathname !== "/products") {
      router.push("/products");
    }
    
    // Close mobile search
    setSearchOpen(false);
    
    // Close filter sheet if open (we'll need to expose this from product-grid)
    // For now, we'll dispatch a custom event
    window.dispatchEvent(new CustomEvent("closeFilterSheet"));
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-[0.25px] border-border/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
        {/* Logo - مینیمال برای موبایل */}
        <Link href="/" className="flex items-center space-x-1.5 space-x-reverse min-w-0 flex-shrink-0">
          {siteSettings.logoUrl ? (
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                <img
                  src={siteSettings.logoUrl}
                  alt={siteSettings.siteName}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xl sm:text-2xl font-bold text-primary leading-tight truncate">
                  {siteSettings.siteName}
                </span>
                {siteSettings.siteDescription && (
                  <span className="hidden sm:block text-[10px] sm:text-xs text-muted-foreground leading-tight truncate">
                    {siteSettings.siteDescription}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold text-primary leading-tight">
                {siteSettings.siteName}
              </span>
              {siteSettings.siteDescription && (
                <span className="hidden sm:block text-[10px] sm:text-xs text-muted-foreground leading-tight">
                  {siteSettings.siteDescription}
                </span>
              )}
            </div>
          )}
        </Link>

        {/* Desktop Search Bar */}
        <form className="hidden lg:flex flex-1 max-w-xl mx-8" onSubmit={handleSearchSubmit}>
          <div className="relative w-full">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="جستجوی قطعه، برند یا شماره VIN..."
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                // If input is cleared and we're on products page, clear filter immediately
                if (pathname === "/products" && !value.trim() && filters.search) {
                  setFilters({ search: undefined });
                }
              }}
              onKeyDown={handleKeyDown}
              className="pr-10 w-full h-9"
            />
          </div>
        </form>

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

          {/* Profile Button - Desktop */}
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

          {/* Profile Button - Mobile (replaces hamburger menu) */}
          <Link href={isAuthenticated ? "/profile" : "/auth"}>
            <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
              <User className="h-5 w-5" />
              <span className="sr-only">پروفایل</span>
            </Button>
          </Link>

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

        </div>
      </div>

      {/* Mobile Search Bar - Expandable */}
      {searchOpen && (
        <div className="lg:hidden border-t-[0.25px] border-border/30 px-3 py-2 bg-background animate-in slide-in-from-top">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="جستجو..."
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  // If input is cleared and we're on products page, clear filter immediately
                  if (pathname === "/products" && !value.trim() && filters.search) {
                    setFilters({ search: undefined });
                  }
                }}
                onKeyDown={handleKeyDown}
                className="pr-10 h-9"
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
}

