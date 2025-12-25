"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Car, ShoppingCart, LogOut, LogIn } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useNavigationStore } from "@/store/navigation-store";
import { useAdminStore } from "@/store/admin-store";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getIcon } from "@/lib/icon-utils";
import { NavigationGroup } from "@/types/navigation";

const groupLabels: Record<NavigationGroup, string> = {
  main: "اصلی",
  user: "حساب کاربری",
  tools: "ابزارها",
  help: "راهنما",
};

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.getItemCount());
  const { getEnabledItems, getItemsByGroup, groups } = useNavigationStore();
  const { settings } = useAdminStore();
  const enabledItems = getEnabledItems();

  // Use settings directly from admin store (which loads from API)
  // Also sync with localStorage for backward compatibility
  const [siteSettings, setSiteSettings] = useState({
    siteName: settings.siteName || "ساد",
    logoUrl: settings.logoUrl || "",
    siteDescription: settings.siteDescription || "فروشگاه قطعات خودرو",
  });

  useEffect(() => {
    // Update from admin store (which loads from API)
    setSiteSettings({
      siteName: settings.siteName || "ساد",
      logoUrl: settings.logoUrl || "",
      siteDescription: settings.siteDescription || "فروشگاه قطعات خودرو",
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
            siteDescription: parsed.siteDescription || settings.siteDescription || "فروشگاه قطعات خودرو",
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
        siteDescription: settings.siteDescription || "فروشگاه قطعات خودرو",
      });
      loadFromLocalStorage();
    };

    window.addEventListener("settingsUpdated", handleSettingsUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("settingsUpdated", handleSettingsUpdate);
    };
  }, [settings]);

  const NavItem = ({
    item,
    badge,
  }: {
    item: { name: string; href: string; icon: string };
    badge?: number;
  }) => {
    const Icon = getIcon(item.icon);
    const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors group",
          "hover:bg-accent hover:text-accent-foreground",
          isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground")} />
        <span className="flex-1">{item.name}</span>
        {badge !== undefined && badge > 0 && (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/20 text-primary-foreground">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col w-64 border-l border-border/30 bg-background/95 backdrop-blur",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-4 border-b border-border/30">
          <Link href="/" className="flex items-center gap-2">
            {siteSettings.logoUrl ? (
              <div className="relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                <img
                  src={siteSettings.logoUrl}
                  alt={siteSettings.siteName}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                <Car className="h-6 w-6" />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-bold text-primary truncate">{siteSettings.siteName}</span>
              {siteSettings.siteDescription && (
                <span className="text-xs text-muted-foreground truncate">{siteSettings.siteDescription}</span>
              )}
            </div>
          </Link>
        </div>

        {/* Navigation Content */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-6">
            {/* Render navigation groups */}
            {groups
              .filter((group) => group.enabled)
              .sort((a, b) => a.order - b.order)
              .map((group) => {
                const groupItems = getItemsByGroup(group.id);
                if (groupItems.length === 0) return null;

                return (
                  <div key={group.id}>
                    <h3 className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {groupLabels[group.id]}
                    </h3>
                    <nav className="space-y-1">
                      {groupItems.map((item) => {
                        // Special handling for cart
                        if (item.href === "/cart") {
                          return (
                            <NavItem
                              key={item.id}
                              item={{ name: item.name, href: item.href, icon: item.icon }}
                              badge={itemCount}
                            />
                          );
                        }
                        return (
                          <NavItem
                            key={item.id}
                            item={{ name: item.name, href: item.href, icon: item.icon }}
                          />
                        );
                      })}
                    </nav>
                    {group.id !== "help" && <Separator className="mt-4" />}
                  </div>
                );
              })}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border/30 space-y-2">
          <Button variant="outline" className="w-full justify-start gap-2" asChild>
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              ورود / ثبت نام
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
            خروج
          </Button>
        </div>
      </div>
    </aside>
  );
}

