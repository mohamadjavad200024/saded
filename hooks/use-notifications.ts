"use client";

import { useEffect, useRef, useState } from "react";
import { logger } from "@/lib/logger-client";

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  sound?: boolean;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const lastNotificationRef = useRef<string | null>(null);

  useEffect(() => {
    // Check if browser supports notifications
    if (typeof window === "undefined" || !("Notification" in window)) {
      return;
    }

    // Get current permission
    setPermission(Notification.permission);

    // Request permission if not granted
    if (Notification.permission === "default") {
      Notification.requestPermission().then((perm) => {
        setPermission(perm);
      });
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    const perm = await Notification.requestPermission();
    setPermission(perm);
    return perm === "granted";
  };

  // Play notification sound using Web Audio API
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Create a pleasant notification sound (two-tone beep)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      logger.error("Error playing notification sound:", error);
    }
  };

  const showNotification = async (
    options: NotificationOptions,
    preventDuplicate = true
  ) => {
    // Check if browser supports notifications
    if (typeof window === "undefined" || !("Notification" in window)) {
      return;
    }

    // Request permission if needed
    if (Notification.permission !== "granted") {
      const granted = await requestPermission();
      if (!granted) {
        return;
      }
    }

    // Prevent duplicate notifications
    if (preventDuplicate && lastNotificationRef.current === options.tag) {
      return;
    }

    // Play sound if enabled (default: true)
    if (options.sound !== false) {
      playNotificationSound();
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || "/favicon.ico",
        badge: options.badge || "/favicon.ico",
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
        dir: "rtl",
        lang: "fa",
      });

      // Update last notification tag
      if (options.tag) {
        lastNotificationRef.current = options.tag;
      }

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      logger.error("Error showing notification:", error);
    }
  };

  return {
    permission,
    requestPermission,
    showNotification,
    isSupported: typeof window !== "undefined" && "Notification" in window,
  };
}


