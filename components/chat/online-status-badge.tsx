"use client";

import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnlineStatusBadgeProps {
  isOnline: boolean;
  lastSeen?: string | null;
  className?: string;
  showText?: boolean;
}

export function OnlineStatusBadge({
  isOnline,
  lastSeen,
  className,
  showText = false,
}: OnlineStatusBadgeProps) {
  const formatLastSeen = (lastSeenDate: string | null | undefined) => {
    if (!lastSeenDate) return "هرگز";
    
    const date = new Date(lastSeenDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "همین الان";
    if (diffMins < 60) return `${diffMins} دقیقه پیش`;
    if (diffHours < 24) return `${diffHours} ساعت پیش`;
    if (diffDays < 7) return `${diffDays} روز پیش`;
    return date.toLocaleDateString("fa-IR");
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("inline-flex items-center gap-2", className)}
    >
      <span className="relative inline-flex items-center">
        <Circle
          className={cn(
            "h-3 w-3",
            isOnline ? "fill-green-500 text-green-500" : "fill-gray-400 text-gray-400"
          )}
        />
        {isOnline && (
          <motion.span
            className="absolute inset-0 rounded-full bg-green-500 pointer-events-none"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
      </span>
      {showText && (
        <span className={cn(
          "text-sm font-semibold leading-tight",
          isOnline ? "text-green-600 dark:text-green-400" : "text-gray-500"
        )}>
          {isOnline ? "آنلاین" : lastSeen ? `آخرین بازدید: ${formatLastSeen(lastSeen)}` : "آفلاین"}
        </span>
      )}
    </motion.span>
  );
}


