"use client";

import { useCallback, useEffect } from "react";
import { useNotificationStore, PersistentNotification, NotificationType, NotificationPriority } from "@/store/notification-store";
import { useNotifications } from "./use-notifications";
import { logger } from "@/lib/logger-client";

interface ShowNotificationOptions {
  type?: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message: string;
  sender?: string;
  avatar?: string;
  actions?: {
    label: string;
    action: () => void;
    variant?: "default" | "destructive" | "outline";
  }[];
  onConfirm?: () => void;
  onDismiss?: () => void;
  metadata?: Record<string, any>;
  persistent?: boolean;
  sound?: boolean;
  vibration?: boolean;
}

export function usePersistentNotifications() {
  const {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    getUnreadCount,
  } = useNotificationStore();

  const { showNotification: showBrowserNotification } = useNotifications();

  // Play notification sound
  const playNotificationSound = useCallback((type: NotificationType, priority: NotificationPriority) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different sounds based on priority and type
      if (priority === "urgent" || priority === "high") {
        // Urgent sound: three quick beeps
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.3);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.4);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } else {
        // Normal sound: two-tone beep
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    } catch (error) {
      logger.error("Error playing notification sound:", error);
    }
  }, []);

  // Vibrate device if supported
  const vibrateDevice = useCallback((pattern: number[]) => {
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        logger.error("Error vibrating device:", error);
      }
    }
  }, []);

  const showNotification = useCallback(
    (options: ShowNotificationOptions): string => {
      const {
        type = "message",
        priority = "medium",
        title,
        message,
        sender,
        avatar,
        actions,
        onConfirm,
        onDismiss,
        metadata,
        persistent = true,
        sound = true,
        vibration = false,
      } = options;

      // Play sound if enabled
      if (sound) {
        playNotificationSound(type, priority);
      }

      // Vibrate if enabled
      if (vibration && priority === "urgent") {
        vibrateDevice([200, 100, 200]);
      }

      // Show browser notification if permission granted
      showBrowserNotification({
        title,
        body: message,
        tag: `persistent-${Date.now()}`,
        requireInteraction: persistent,
        sound: false, // We handle sound separately
      }).catch(() => {
        // Ignore if permission not granted
      });

      // Add to persistent notification store
      const id = addNotification({
        type,
        priority,
        title,
        message,
        sender,
        avatar,
        actions,
        onConfirm,
        onDismiss,
        metadata,
        persistent,
        sound,
        vibration,
      });

      return id;
    },
    [addNotification, playNotificationSound, vibrateDevice, showBrowserNotification]
  );

  const showMessageNotification = useCallback(
    (
      sender: string,
      message: string,
      options?: {
        avatar?: string;
        onOpen?: () => void;
        chatId?: string;
        metadata?: Record<string, any>;
      }
    ) => {
      const { avatar, onOpen, chatId, metadata } = options || {};

      // Use chatId as notification ID to update existing notifications for the same chat
      // This ensures we have one notification per chat that gets updated with new messages
      const notificationId = chatId ? `msg-${chatId}` : undefined;

      return showNotification({
        type: "message",
        priority: "high",
        title: `پیام جدید از ${sender}`,
        message,
        sender,
        avatar,
        persistent: true,
        sound: true,
        actions: chatId
          ? [
              {
                label: "مشاهده",
                action: () => {
                  // Dispatch custom event to open chat
                  const event = new CustomEvent("openChat", {
                    detail: {
                      chatId: chatId,
                      isAdmin: metadata?.isAdmin !== false, // Default to true for admin
                    },
                  });
                  window.dispatchEvent(event);
                  
                  // Also call onOpen if provided
                  if (onOpen) {
                    onOpen();
                  }
                  
                  // Mark as read and dismiss notification
                  if (notificationId) {
                    markAsRead(notificationId);
                    dismissNotification(notificationId);
                  }
                },
                variant: "default" as const,
              },
            ]
          : onOpen
          ? [
              {
                label: "مشاهده",
                action: () => {
                  if (onOpen) {
                    onOpen();
                  }
                },
                variant: "default" as const,
              },
            ]
          : undefined,
        onConfirm: onOpen,
        metadata: { chatId, notificationId, ...metadata },
      });
    },
    [showNotification, markAsRead, dismissNotification]
  );

  return {
    notifications: notifications.filter((n) => !n.dismissed),
    showNotification,
    showMessageNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    unreadCount: getUnreadCount(),
  };
}

