"use client";

import { motion } from "framer-motion";

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`flex items-center gap-2 px-5 py-3 bg-muted/60 rounded-2xl shadow-sm border border-border/30 ${className || ""}`}
    >
      <motion.div
        className="w-2.5 h-2.5 bg-muted-foreground/70 rounded-full"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: 0,
        }}
      />
      <motion.div
        className="w-2.5 h-2.5 bg-muted-foreground/70 rounded-full"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: 0.2,
        }}
      />
      <motion.div
        className="w-2.5 h-2.5 bg-muted-foreground/70 rounded-full"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: 0.4,
        }}
      />
    </motion.div>
  );
}


