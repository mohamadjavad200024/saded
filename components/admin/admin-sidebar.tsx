"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  Truck,
  FolderTree,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

const menuItems = [
  {
    title: "داشبورد",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "محصولات",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "سفارشات",
    href: "/admin/orders",
    icon: ShoppingCart,
    disabled: false,
  },
  {
    title: "کاربران",
    href: "/admin/users",
    icon: Users,
    disabled: false,
  },
  {
    title: "تامین‌کنندگان",
    href: "/admin/suppliers",
    icon: Truck,
    disabled: false,
  },
  {
    title: "دسته‌بندی‌ها",
    href: "/admin/categories",
    icon: FolderTree,
    disabled: false,
  },
  {
    title: "تنظیمات",
    href: "/admin/settings",
    icon: Settings,
    disabled: false,
  },
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border/30 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">پنل مدیریت</h2>
            <p className="text-xs text-muted-foreground">فروشگاه ساد</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
            const isDisabled = item.disabled;

            return (
              <Link
                key={item.href}
                href={isDisabled ? "#" : item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-[-2px]",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.title}</span>
                {isDisabled && (
                  <span className="mr-auto text-xs opacity-60">(به زودی)</span>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-border/30">
        <Link href="/">
          <Button variant="outline" className="w-full justify-start gap-2">
            <X className="h-4 w-4" />
            بازگشت به سایت
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col w-64 border-l border-border/30 bg-background/95 backdrop-blur",
          className
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>منوی مدیریت</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  );
}

