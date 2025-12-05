"use client";

import { useEffect } from "react";
import { useGlobalChatPolling } from "@/hooks/use-global-chat-polling";

/**
 * Global chat polling component for admin
 * This component polls for new user messages even when admin chat is closed
 * Notifications are handled by the persistent notification system
 */
export function AdminChatPolling() {
  useEffect(() => {
    console.log("[AdminChatPolling] Component mounted, starting polling...");
    return () => {
      console.log("[AdminChatPolling] Component unmounted, stopping polling...");
    };
  }, []);

  useGlobalChatPolling({
    isUser: false,
    onNewMessage: (message, chatInfo) => {
      console.log("[AdminChatPolling] New message received:", message, chatInfo);
      // Message handling is done in the hook
      // This callback can be used for additional actions if needed
    },
  });

  return null;
}


