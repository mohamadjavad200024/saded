"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "خانه", href: "/" },
  { name: "محصولات", href: "/products" },
  { name: "دسته‌بندی‌ها", href: "/categories" },
  { name: "خدمات", href: "/services" },
];

interface NavigationProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function Navigation({ mobile = false, onNavigate }: NavigationProps) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <nav className="flex flex-col space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg text-base font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="hidden lg:flex items-center space-x-1 space-x-reverse">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 space-x-reverse px-3 xl:px-4 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

