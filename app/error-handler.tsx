"use client";

import { useEffect } from "react";

/**
 * Global error handler to suppress browser extension errors
 * These errors are harmless and come from browser extensions
 */
export function ErrorHandler() {
  useEffect(() => {
    // Suppress runtime.lastError from browser extensions
    const originalError = window.console.error;
    window.console.error = (...args: any[]) => {
      // Filter out browser extension errors
      const errorMessage = args[0]?.toString() || "";
      if (
        errorMessage.includes("runtime.lastError") ||
        errorMessage.includes("Receiving end does not exist") ||
        errorMessage.includes("ERR_CONNECTION_REFUSED") && errorMessage.includes("127.0.0.1:7242")
      ) {
        // Silently ignore browser extension errors
        return;
      }
      // Log other errors normally
      originalError.apply(window.console, args);
    };

    // Suppress unhandled promise rejections from extensions
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.toString() || "";
      if (
        reason.includes("runtime.lastError") ||
        reason.includes("Receiving end does not exist") ||
        (reason.includes("ERR_CONNECTION_REFUSED") && reason.includes("127.0.0.1:7242"))
      ) {
        event.preventDefault();
        return;
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.console.error = originalError;
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}

