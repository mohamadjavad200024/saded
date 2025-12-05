"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { logger } from "@/lib/logger-client";

interface AdminPresence {
  adminId: string;
  isOnline: boolean;
  lastSeen: string | null;
}

interface UseAdminPresenceOptions {
  adminId?: string;
  enabled?: boolean;
  heartbeatInterval?: number; // milliseconds
}

interface UseAdminPresenceReturn {
  isOnline: boolean;
  lastSeen: string | null;
  checkStatus: () => Promise<void>;
  setOnline: (online: boolean) => Promise<void>;
}

const DEFAULT_ADMIN_ID = "admin-1"; // Default admin ID
const DEFAULT_HEARTBEAT_INTERVAL = 15000; // 15 seconds

export function useAdminPresence({
  adminId = DEFAULT_ADMIN_ID,
  enabled = true,
  heartbeatInterval = DEFAULT_HEARTBEAT_INTERVAL,
}: UseAdminPresenceOptions = {}): UseAdminPresenceReturn {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Check admin status
  const checkStatus = useCallback(async () => {
    if (!enabled || !isMountedRef.current) return;

    try {
      const response = await fetch(`/api/admin/presence?adminId=${adminId}`);
      if (!response.ok) {
        // Try to parse error response for better error messages
        let errorMessage = `Failed to check admin status (${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = `Failed to check admin status: ${errorData.error}`;
          }
        } catch {
          // If we can't parse the error response, use the default message
        }
        logger.error(errorMessage, { status: response.status, adminId });
        return;
      }

      const data = await response.json();
      if (data.success && data.data) {
        setIsOnline(data.data.isOnline || false);
        setLastSeen(data.data.lastSeen || null);
      } else if (!data.success) {
        // API returned success: false but with 200 status
        logger.error("Failed to check admin status:", data.error || "Unknown error", { adminId });
      }
    } catch (error) {
      logger.error("Error checking admin status:", error, { adminId });
    }
  }, [adminId, enabled]);

  // Set online status
  const setOnline = useCallback(async (online: boolean) => {
    if (!enabled || !isMountedRef.current) return;

    try {
      const response = await fetch("/api/admin/presence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId,
          isOnline: online,
        }),
      });

      if (!response.ok) {
        // Try to parse error response for better error messages
        let errorMessage = `Failed to update admin status (${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = `Failed to update admin status: ${errorData.error}`;
          }
        } catch {
          // If we can't parse the error response, use the default message
        }
        logger.error(errorMessage, { status: response.status, adminId });
        return;
      }

      const data = await response.json();
      if (data.success && data.data) {
        setIsOnline(data.data.isOnline || false);
        setLastSeen(data.data.lastSeen || null);
      } else if (!data.success) {
        // API returned success: false but with 200 status
        logger.error("Failed to update admin status:", data.error || "Unknown error", { adminId });
      }
    } catch (error) {
      logger.error("Error updating admin status:", error, { adminId });
    }
  }, [adminId, enabled]);

  // Initial status check
  useEffect(() => {
    if (enabled) {
      checkStatus();
    }
  }, [enabled, checkStatus]);

  // Set up heartbeat when online
  useEffect(() => {
    if (!enabled || !isOnline) {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      return;
    }

    // Send heartbeat immediately
    setOnline(true);

    // Set up interval for heartbeat
    heartbeatIntervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        setOnline(true);
      }
    }, heartbeatInterval);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
  }, [enabled, isOnline, heartbeatInterval, setOnline]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      // Mark as offline when component unmounts
      if (enabled) {
        setOnline(false).catch((err) => logger.error("Error setting offline status:", err));
      }
    };
  }, [enabled, setOnline]);

  return {
    isOnline,
    lastSeen,
    checkStatus,
    setOnline,
  };
}


