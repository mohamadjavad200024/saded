"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";

/**
 * کامپوننت برای بررسی احراز هویت در لود اولیه اپ
 * این کامپوننت در تمام صفحات اجرا می‌شود و سشن کاربر را از کوکی بررسی می‌کند
 * تا کاربران بدون نیاز به ورود مجدد شناسایی شوند (session نامحدود)
 */
export function AuthInitializer() {
  const { checkAuth, hasCheckedAuth, isCheckingAuth } = useAuthStore();
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Immediately check auth on mount - no delay
    // This runs once per app load to verify session from server
    // همیشه بررسی کن - حتی اگر user در localStorage باشد
    // این اطمینان می‌دهد که session از سرور معتبر است
    if (!hasInitializedRef.current && !isCheckingAuth && !hasCheckedAuth) {
      hasInitializedRef.current = true;
      // Call immediately - cookies are available synchronously
      checkAuth();
    }
  }, [checkAuth, isCheckingAuth, hasCheckedAuth]);

  // این کامپوننت هیچ UI رندر نمی‌کند
  return null;
}

