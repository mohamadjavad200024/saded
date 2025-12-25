"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminAlerts } from "@/components/admin/admin-alerts";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/error-boundary";
import { AdminChatPolling } from "@/components/admin/admin-chat-polling";
import { NotificationCenter } from "@/components/notifications";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, hasCheckedAuth, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Skip check for login page
    if (pathname === "/admin/login") {
      setIsChecking(false);
      return;
    }

    // Wait for auth check to complete before verifying admin
    if (!hasCheckedAuth) {
      // AuthInitializer will call checkAuth, just wait for it
      return;
    }

    // Auth check is complete, verify admin access
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/admin/login");
      return;
    }

    // User is authenticated and is admin
    setIsChecking(false);
  }, [pathname, hasCheckedAuth, isAuthenticated, user, router]);

  useEffect(() => {
    // Disable body and html scroll when in admin panel
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyHeight = document.body.style.height;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlHeight = document.documentElement.style.height;
    
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100vh";
    
    return () => {
      // Re-enable scroll when leaving admin panel
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.height = originalBodyHeight;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.height = originalHtmlHeight;
    };
  }, []);

  // Show loading while checking auth
  if (isChecking && pathname !== "/admin/login") {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">در حال بررسی دسترسی...</p>
        </div>
      </div>
    );
  }

  // Don't render layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <ErrorBoundary>
      <div className="h-screen w-screen flex overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <AdminHeader />
          <AdminAlerts />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6">
            {children}
          </main>
        </div>
        <Toaster />
        <AdminChatPolling />
        <NotificationCenter position="top-right" maxNotifications={5} />
      </div>
    </ErrorBoundary>
  );
}
