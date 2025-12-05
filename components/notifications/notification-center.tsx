"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCheck, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PersistentNotificationComponent } from "./persistent-notification";
import { usePersistentNotifications } from "@/hooks/use-persistent-notifications";
import { cn } from "@/lib/utils";

interface NotificationCenterProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  maxNotifications?: number;
  className?: string;
}

export function NotificationCenter({
  position = "top-right",
  maxNotifications = 5,
  className,
}: NotificationCenterProps) {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    unreadCount,
  } = usePersistentNotifications();

  // Track currently open chat
  const [openChatId, setOpenChatId] = React.useState<string | null>(null);

  // Listen for chat open/close events
  React.useEffect(() => {
    const updateOpenChat = () => {
      if (typeof window !== "undefined") {
        const storedChatId = localStorage.getItem('admin_selected_chat_id');
        setOpenChatId(storedChatId);
      }
    };

    // Check on mount
    updateOpenChat();

    // Listen for storage changes (when chat is opened/closed)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_selected_chat_id') {
        updateOpenChat();
      }
    };

    // Listen for custom events
    const handleChatOpen = (e: CustomEvent) => {
      if (e.detail?.chatId) {
        setOpenChatId(e.detail.chatId);
      }
    };

    const handleChatOpened = (e: CustomEvent) => {
      if (e.detail?.chatId) {
        setOpenChatId(e.detail.chatId);
      }
    };

    const handleChatClose = () => {
      setOpenChatId(null);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('openChat', handleChatOpen as EventListener);
    window.addEventListener('chatOpened', handleChatOpened as EventListener);
    window.addEventListener('closeChat', handleChatClose);
    window.addEventListener('chatClosed', handleChatClose);

    // Poll for changes (fallback for same-window updates)
    const interval = setInterval(updateOpenChat, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('openChat', handleChatOpen as EventListener);
      window.removeEventListener('closeChat', handleChatClose);
      clearInterval(interval);
    };
  }, []);

  // Filter persistent notifications, excluding those from the currently open chat
  const persistentNotifications = notifications.filter((n) => {
    if (!n.persistent || n.dismissed) return false;
    
    // For admin notifications: filter out notifications from the currently open chat
    // This allows notifications from other users to show even when chatting with one user
    if (n.metadata?.isAdmin && n.metadata?.chatId && openChatId) {
      const shouldShow = n.metadata.chatId !== openChatId;
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Notification Center] Notification ${n.id} from chat ${n.metadata.chatId}: openChatId=${openChatId}, shouldShow=${shouldShow}`);
      }
      return shouldShow;
    }
    
    // Show all notifications if no chat is open, or if it's not an admin notification
    return true;
  });
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Notification Center] Total notifications: ${notifications.length}, Persistent: ${persistentNotifications.length}, Open chat: ${openChatId || 'none'}`);
  }

  // Sort by priority and timestamp (newest and highest priority first)
  const sortedNotifications = persistentNotifications.sort((a, b) => {
    // First sort by read status (unread first)
    if (a.read !== b.read) {
      return a.read ? 1 : -1;
    }
    // Then by priority
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    if (priorityDiff !== 0) return priorityDiff;
    // Finally by timestamp (newest first)
    return b.timestamp - a.timestamp;
  });

  const visibleNotifications = sortedNotifications.slice(0, maxNotifications);

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed z-[9999] pointer-events-none flex flex-col gap-2 sm:gap-3",
        positionClasses[position],
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {visibleNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            layout
            initial={{ opacity: 0, scale: 0.8, y: -20, x: position.includes('right') ? 20 : -20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              y: -20, 
              x: position.includes('right') ? 20 : -20,
              transition: { duration: 0.2 } 
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: index * 0.05,
            }}
            className="pointer-events-auto"
          >
            <PersistentNotificationComponent
              notification={notification}
              onConfirm={() => {
                // Dispatch custom event to open chat
                if (notification.metadata?.chatId) {
                  const event = new CustomEvent("openChat", {
                    detail: {
                      chatId: notification.metadata.chatId,
                      isAdmin: notification.metadata.isAdmin !== false, // Default to true for admin
                    },
                  });
                  window.dispatchEvent(event);
                }
                
                if (notification.onConfirm) {
                  notification.onConfirm();
                }
                
                // Mark as read and dismiss notification
                markAsRead(notification.id);
                dismissNotification(notification.id);
              }}
              onDismiss={() => {
                dismissNotification(notification.id);
              }}
              onMarkAsRead={() => {
                markAsRead(notification.id);
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Unread count badge - only count visible notifications */}
      {(() => {
        const visibleUnreadCount = visibleNotifications.filter(n => !n.read).length;
        return visibleUnreadCount > 0 ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "fixed pointer-events-none z-[10000]",
              position === "top-right" ? "top-2 right-2" :
              position === "top-left" ? "top-2 left-2" :
              position === "bottom-right" ? "bottom-2 right-2" :
              "bottom-2 left-2"
            )}
          >
            <Badge
              variant="destructive"
              className="h-6 px-2 text-xs font-bold shadow-lg flex items-center gap-1.5 animate-pulse"
            >
              <Bell className="h-3 w-3" />
              {visibleUnreadCount}
            </Badge>
          </motion.div>
        ) : null;
      })()}
    </div>
  );
}

