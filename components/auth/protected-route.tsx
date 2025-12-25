"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

/**
 * کامپوننت برای محافظت از صفحات
 * منتظر تأیید سرور می‌ماند و فقط از useAuthStore استفاده می‌کند
 */
export function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, hasCheckedAuth, isCheckingAuth } = useAuthStore();
  const hasRedirectedRef = useRef(false);

  // Check and redirect only once after auth check is complete
  useEffect(() => {
    if (!hasCheckedAuth) return; // Wait for auth check to complete
    if (!requireAuth) return;
    if (hasRedirectedRef.current) return; // Prevent multiple redirects
    if (pathname === "/auth") return; // Don't redirect if already on auth page
    
    if (!isAuthenticated || !user) {
      // No user - redirect to auth
      hasRedirectedRef.current = true;
      router.replace("/auth?redirect=" + encodeURIComponent(pathname));
      return;
    }

    // Check admin access
    if (requireAdmin && user.role !== "admin") {
      hasRedirectedRef.current = true;
      router.replace("/");
    }
  }, [hasCheckedAuth, isAuthenticated, user, requireAuth, requireAdmin, router, pathname]);

  // Show loading while checking auth
  if (isCheckingAuth || !hasCheckedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // If no user and require auth, show loading (redirect is happening)
  if (requireAuth && (!isAuthenticated || !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">در حال هدایت...</p>
        </div>
      </div>
    );
  }

  // Check admin access
  if (requireAdmin && user && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-destructive">شما دسترسی به این بخش را ندارید</p>
        </div>
      </div>
    );
  }

  // Allow access
  return <>{children}</>;
}

