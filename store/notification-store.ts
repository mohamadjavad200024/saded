"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { logger } from "@/lib/logger-client";

export type NotificationType = "message" | "order" | "system" | "alert";
export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export interface PersistentNotification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  sender?: string;
  avatar?: string;
  timestamp: number;
  read: boolean;
  dismissed: boolean;
  actions?: {
    label: string;
    action: () => void;
    variant?: "default" | "destructive" | "outline";
  }[];
  onConfirm?: () => void;
  onDismiss?: () => void;
  metadata?: Record<string, any>;
  persistent: boolean; // If true, remains until manually dismissed
  sound?: boolean;
  vibration?: boolean;
}

interface NotificationStore {
  notifications: PersistentNotification[];
  addNotification: (notification: Omit<PersistentNotification, "id" | "timestamp" | "read" | "dismissed">) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  dismissAll: () => void;
  getUnreadCount: () => number;
  getUnreadCountExcludingChat: (chatId: string | null) => number;
  getNotificationsExcludingChat: (chatId: string | null) => PersistentNotification[];
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (notification) => {
        // If notification has a custom ID in metadata, use it; otherwise generate one
        const customId = notification.metadata?.notificationId;
        const id = customId || `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Check if notification with same ID already exists (for chat messages)
        const existing = get().notifications.find((n) => n.id === id);
        if (existing && !existing.dismissed) {
          // Update existing notification instead of creating duplicate
          logger.debug(`[Notification Store] Updating existing notification ${id}`);
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id
                ? {
                    ...n,
                    ...notification,
                    timestamp: Date.now(),
                    read: false,
                    dismissed: false,
                  }
                : n
            ),
          }));
          return id;
        }
        
        const newNotification: PersistentNotification = {
          ...notification,
          id,
          timestamp: Date.now(),
          read: false,
          dismissed: false,
        };

        logger.debug(`[Notification Store] Adding new notification ${id}`, {
          type: newNotification.type,
          title: newNotification.title,
          chatId: newNotification.metadata?.chatId,
          isAdmin: newNotification.metadata?.isAdmin,
        });

        set((state) => ({
          notifications: [newNotification, ...state.notifications.filter((n) => n.id !== id)].slice(0, 50), // Keep max 50 notifications
        }));

        return id;
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      dismissNotification: (id) => {
        const notification = get().notifications.find((n) => n.id === id);
        if (notification?.onDismiss) {
          notification.onDismiss();
        }
        
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      dismissAll: () => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.persistent),
        }));
      },

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read && !n.dismissed).length;
      },

      getUnreadCountExcludingChat: (chatId: string | null) => {
        if (!chatId) {
          return get().getUnreadCount();
        }
        return get().notifications.filter(
          (n) => !n.read && !n.dismissed && !(n.metadata?.chatId === chatId && n.metadata?.isAdmin)
        ).length;
      },

      getNotificationsExcludingChat: (chatId: string | null) => {
        if (!chatId) {
          return get().notifications;
        }
        return get().notifications.filter(
          (n) => !(n.metadata?.chatId === chatId && n.metadata?.isAdmin)
        );
      },

      clearAll: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: "notification-storage",
      partialize: (state) => ({
        notifications: state.notifications.filter((n) => n.read).slice(0, 20), // Only persist read notifications
      }),
    }
  )
);

