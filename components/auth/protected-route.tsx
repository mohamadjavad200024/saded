"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

/**
 * کامپوننت برای محافظت از صفحات
 * اگر کاربر لاگین نشده باشد، به صفحه لاگین redirect می‌کند
 */
export function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, checkAuth, isCheckingAuth, hasCheckedAuth } = useAuthStore();

  useEffect(() => {
    // Ensure we check cookie-based session before redirecting
    if (requireAuth && !hasCheckedAuth && !isCheckingAuth) {
      checkAuth();
    }
  }, [requireAuth, hasCheckedAuth, isCheckingAuth, checkAuth]);

  useEffect(() => {
    if (!requireAuth) return;
    if (!hasCheckedAuth || isCheckingAuth) return;

    if (!isAuthenticated) {
      router.push("/auth?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }

    if (requireAdmin && user?.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, user, requireAuth, requireAdmin, router, hasCheckedAuth, isCheckingAuth]);

  // نمایش loading در حال بررسی
  if (requireAuth && (!hasCheckedAuth || isCheckingAuth)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">در حال بررسی دسترسی...</p>
        </div>
      </div>
    );
  }

  // بررسی دسترسی admin
  if (requireAdmin && (!isAuthenticated || user?.role !== "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-destructive">شما دسترسی به این بخش را ندارید</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

