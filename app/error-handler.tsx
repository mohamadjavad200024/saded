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
    const originalWarn = window.console.warn;
    
    window.console.error = (...args: any[]) => {
      // Filter out browser extension errors
      const errorMessage = args[0]?.toString() || "";
      const fullMessage = args.map(arg => String(arg)).join(' ');
      
      if (
        errorMessage.includes("runtime.lastError") ||
        errorMessage.includes("Receiving end does not exist") ||
        (fullMessage.includes("ERR_CONNECTION_REFUSED") && fullMessage.includes("127.0.0.1:7242")) ||
        fullMessage.includes("Unchecked runtime.lastError")
      ) {
        // Silently ignore browser extension errors
        return;
      }
      // Log other errors normally
      originalError.apply(window.console, args);
    };

    window.console.warn = (...args: any[]) => {
      // Filter out browser extension warnings
      const warningMessage = args[0]?.toString() || "";
      const fullMessage = args.map(arg => String(arg)).join(' ');
      
      if (
        warningMessage.includes("runtime.lastError") ||
        warningMessage.includes("Receiving end does not exist") ||
        (fullMessage.includes("ERR_CONNECTION_REFUSED") && fullMessage.includes("127.0.0.1:7242"))
      ) {
        // Silently ignore browser extension warnings
        return;
      }
      // Log other warnings normally
      originalWarn.apply(window.console, args);
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

    // Suppress network errors from console
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        return await originalFetch.apply(window, args);
      } catch (error: any) {
        // Suppress connection refused errors from dev tools
        if (error?.message?.includes("ERR_CONNECTION_REFUSED") && args[0]?.toString().includes("127.0.0.1:7242")) {
          // Silently fail for dev tool connections
          throw new Error("Connection refused (suppressed)");
        }
        throw error;
      }
    };

    return () => {
      window.console.error = originalError;
      window.console.warn = originalWarn;
      window.fetch = originalFetch;
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}

