"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Check,
  AlertCircle,
  Info,
  Bell,
  User,
  ShoppingCart,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PersistentNotification, NotificationType, NotificationPriority } from "@/store/notification-store";

interface PersistentNotificationProps {
  notification: PersistentNotification;
  onConfirm?: () => void;
  onDismiss?: () => void;
  onMarkAsRead?: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "message":
      return MessageCircle;
    case "order":
      return ShoppingCart;
    case "alert":
      return AlertCircle;
    case "system":
      return Info;
    default:
      return Bell;
  }
};

const getPriorityColor = (priority: NotificationPriority) => {
  switch (priority) {
    case "urgent":
      return "bg-red-500";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-blue-500";
    case "low":
      return "bg-gray-500";
    default:
      return "bg-blue-500";
  }
};

const getPriorityVariant = (priority: NotificationPriority): "default" | "destructive" | "secondary" => {
  switch (priority) {
    case "urgent":
      return "destructive";
    case "high":
      return "secondary";
    default:
      return "default";
  }
};

const formatTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return "همین الان";
  if (minutes < 60) return `${minutes} دقیقه پیش`;
  if (hours < 24) return `${hours} ساعت پیش`;
  
  const date = new Date(timestamp);
  return date.toLocaleDateString("fa-IR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function PersistentNotificationComponent({
  notification,
  onConfirm,
  onDismiss,
  onMarkAsRead,
}: PersistentNotificationProps) {
  const Icon = getNotificationIcon(notification.type);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    if (notification.onConfirm) {
      notification.onConfirm();
    }
    if (onMarkAsRead) {
      onMarkAsRead();
    }
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
    if (notification.onDismiss) {
      notification.onDismiss();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95, x: 20 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95, x: 20, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className={cn(
        "relative w-full max-w-lg sm:max-w-xl pointer-events-auto",
        !notification.read && "ring-2 ring-primary/40 shadow-lg"
      )}
      onAnimationComplete={() => {
        // Auto-expand urgent notifications and message notifications
        if ((notification.priority === "urgent" || notification.type === "message") && !isExpanded) {
          setIsExpanded(true);
        }
      }}
    >
      <motion.div
        className={cn(
          "group relative w-full rounded-lg sm:rounded-xl py-2 px-2.5 sm:py-3 sm:px-4 shadow-sm sm:shadow-lg backdrop-blur-sm sm:backdrop-blur-md transition-all duration-300 cursor-pointer border",
          notification.priority === "urgent"
            ? "bg-gradient-to-br from-red-50/95 via-background to-red-50/60 dark:from-red-950/30 dark:via-background dark:to-red-950/15 border-red-200/50 dark:border-red-800/30 hover:border-red-300 dark:hover:border-red-700"
            : notification.priority === "high"
            ? "bg-gradient-to-br from-orange-50/60 via-background to-orange-50/40 dark:from-orange-950/15 dark:via-background dark:to-orange-950/8 border-orange-200/40 dark:border-orange-800/20 hover:border-orange-300 dark:hover:border-orange-700"
            : "bg-gradient-to-br from-background via-background to-primary/8 border-border/50 hover:border-primary/30",
          !notification.read && "shadow-md hover:shadow-lg"
        )}
        onClick={() => {
          handleConfirm();
        }}
        whileHover={{ 
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
        }}
      >
        {/* Priority indicator bar */}
        <div
          className={cn(
            "absolute top-0 right-0 left-0 h-0.5 sm:h-1 rounded-t-lg sm:rounded-t-xl",
            getPriorityColor(notification.priority)
          )}
        />

        {/* Unread indicator */}
        {!notification.read && (
          <motion.div
            className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary shadow-lg"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/50"
              animate={{ scale: [1, 2, 2], opacity: [0.5, 0, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.div>
        )}

        <div className="flex items-start gap-1.5 sm:gap-3">
          {/* Avatar/Icon */}
          <motion.div
            className="relative flex-shrink-0"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          >
            {notification.avatar ? (
              <motion.div 
                className="relative w-7 h-7 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-primary/30 shadow-md"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <img
                  src={notification.avatar}
                  alt={notification.sender || notification.title}
                  className="w-full h-full object-cover"
                />
                {!notification.read && (
                  <motion.div
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 rounded-full border-2 border-background"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                )}
              </motion.div>
            ) : (
              <motion.div
                className={cn(
                  "w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md ring-2 ring-primary/20",
                  notification.type === "message"
                    ? "bg-gradient-to-br from-primary/25 via-primary/20 to-accent/25"
                    : notification.type === "order"
                    ? "bg-gradient-to-br from-green-500/25 via-green-500/20 to-green-400/25"
                    : "bg-gradient-to-br from-blue-500/25 via-blue-500/20 to-blue-400/25"
                )}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-primary" />
              </motion.div>
            )}
            {notification.priority === "urgent" && (
              <motion.div
                className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full border border-background sm:border-2 shadow-md sm:shadow-lg flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Bell className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
              </motion.div>
            )}
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
            <div className="flex items-start justify-between gap-1 sm:gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-semibold text-foreground truncate">
                    {notification.title}
                  </h4>
                  <Badge
                    variant={getPriorityVariant(notification.priority)}
                    className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0 h-4 sm:h-5"
                  >
                    {notification.priority === "urgent"
                      ? "فوری"
                      : notification.priority === "high"
                      ? "مهم"
                      : notification.priority === "medium"
                      ? "متوسط"
                      : "کم"}
                  </Badge>
                </div>
                {notification.sender && (
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5 sm:mb-1 flex items-center gap-0.5 sm:gap-1">
                    <User className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                    {notification.sender}
                  </p>
                )}
                <motion.p
                  className={cn(
                    "text-[10px] sm:text-xs text-muted-foreground leading-tight sm:leading-relaxed transition-all duration-300",
                    isExpanded ? "line-clamp-none" : "line-clamp-2"
                  )}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {notification.message}
                </motion.p>
                <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] text-muted-foreground">
                  <Clock className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                  <span>{formatTime(notification.timestamp)}</span>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismiss();
                  }}
                  className="h-5 w-5 sm:h-7 sm:w-7 rounded-full hover:bg-destructive/10 hover:text-destructive flex-shrink-0 transition-colors"
                >
                  <X className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                </Button>
              </motion.div>
            </div>

          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 sm:from-primary/5 via-transparent to-accent/3 sm:to-accent/5 pointer-events-none rounded-lg sm:rounded-xl" />

        {/* Pulse effect for urgent notifications */}
        {notification.priority === "urgent" && (
          <motion.div
            className="absolute inset-0 rounded-lg sm:rounded-xl border border-red-500/20 sm:border-2 sm:border-red-500/30"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.02, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

