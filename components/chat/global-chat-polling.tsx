"use client";

import { useEffect } from "react";
import { useGlobalChatPolling } from "@/hooks/use-global-chat-polling";

/**
 * Global chat polling component for regular users
 * This component polls for new support messages even when chat is closed
 * Notifications are handled by the persistent notification system
 */
export function GlobalChatPolling() {
  useGlobalChatPolling({
    isUser: true,
    onNewMessage: (message, chatInfo) => {
      // Message handling is done in the hook
      // This callback can be used for additional actions if needed
    },
  });

  return null;
}


