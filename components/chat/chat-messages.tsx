"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Check,
  CheckCheck,
  Trash2,
  X,
  FileText,
  MapPin,
  Mic,
} from "lucide-react";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { logger } from "@/lib/logger-client";
import type { Message } from "@/components/chat/chat-types";
import { AudioPlayer } from "@/components/chat/audio-player";

interface ChatMessagesProps {
  messages: Message[];
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  isSupportTyping: boolean;
  onReply: (msg: Message) => void;
  onEdit: (msg: Message) => void;
  onDelete: (messageId: string) => void;
}

export function ChatMessages({
  messages,
  messagesContainerRef,
  messagesEndRef,
  isSupportTyping,
  onDelete,
}: ChatMessagesProps) {
  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 md:p-8 bg-gradient-to-b from-background via-background/95 to-muted/5 scroll-smooth"
    >
      <div className="space-y-3">
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-full min-h-[200px] text-center px-4"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 shadow-lg">
            <svg
              className="h-10 w-10 text-primary/60"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 10h.01M12 10h.01M16 10h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-muted-foreground text-base font-medium leading-relaxed">
            هنوز پیامی ارسال نشده است
          </p>
          <p className="text-muted-foreground/70 text-sm mt-2 leading-relaxed">
            پیام خود را بنویسید...
          </p>
        </motion.div>
      )}
      {messages.map((msg, index) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-end gap-2 group`}
        >
          <div
            className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-lg px-2.5 sm:px-3 py-2 transition-all ${
              msg.sender === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground border border-border/40"
            }`}
          >
            {msg.text && (
              <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words mb-1.5">
                {msg.text}
              </p>
            )}
            {msg.attachments && msg.attachments.length > 0 && (
              <div className={`space-y-2 ${msg.text ? "mt-2" : ""}`}>
                {msg.attachments.map((attachment, attIndex) => (
                  <motion.div
                    key={attachment.id || `att-${index}-${attIndex}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: attIndex * 0.1 }}
                    className="rounded-xl overflow-hidden"
                  >
                    {attachment.type === "image" && attachment.url && (
                      <img
                        src={attachment.url}
                        alt={attachment.name || "تصویر"}
                        className="max-w-full max-h-[150px] sm:max-h-[180px] rounded cursor-pointer hover:opacity-90 transition-all"
                        onClick={() => window.open(attachment.url, "_blank")}
                        onError={(e) => {
                          logger.error("Image load error:", attachment.url);
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    {attachment.type === "file" && (
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={attachment.name}
                        className="flex items-center gap-2 p-2 bg-background/50 rounded hover:bg-background/70 transition-all text-xs"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span className="font-medium truncate">
                          {attachment.name || "فایل"}
                        </span>
                      </a>
                    )}
                    {attachment.type === "location" && (
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-background/50 rounded hover:bg-background/70 transition-all text-xs"
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="font-medium">
                          {attachment.name || "موقعیت"}
                        </span>
                      </a>
                    )}
                    {attachment.type === "audio" && attachment.url && (
                      <AudioPlayer url={attachment.url} duration={attachment.duration} />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
            <div
              className={`flex items-center gap-1.5 mt-1.5 pt-1.5 border-t ${
                msg.sender === "user"
                  ? "border-primary-foreground/20 justify-end"
                  : "border-border/30 justify-start"
              }`}
            >
              <span
                className={`text-[10px] sm:text-xs ${
                  msg.sender === "user"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString("fa-IR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {msg.sender === "user" && (
                <>
                  {msg.status === "sending" && (
                    <Loader2 className="h-3 w-3 text-primary-foreground/50 animate-spin" />
                  )}
                  {msg.status === "sent" && (
                    <Check className="h-3 w-3 text-primary-foreground/40" />
                  )}
                  {msg.status === "delivered" && (
                    <CheckCheck className="h-3 w-3 text-primary-foreground/40" />
                  )}
                  {msg.status === "read" && (
                    <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
                  )}
                  {msg.status === "failed" && (
                    <X className="h-3 w-3 text-destructive" />
                  )}
                  {!msg.status && (
                    <Check className="h-3 w-3 text-primary-foreground/40" />
                  )}
                </>
              )}
              {/* آیکون حذف مستقیم فقط برای پیام‌های ارسالی کاربر - همیشه قابل مشاهده */}
              {msg.sender === "user" && onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-destructive/10 text-destructive hover:text-destructive opacity-70 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      confirm(
                        "آیا مطمئن هستید که می‌خواهید این پیام را حذف کنید؟"
                      )
                    ) {
                      onDelete(msg.id);
                    }
                  }}
                  title="حذف پیام"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
      {isSupportTyping && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="flex justify-start items-end gap-2.5"
        >
          <TypingIndicator />
        </motion.div>
      )}
      <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

