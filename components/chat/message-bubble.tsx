"use client";

import { motion } from "framer-motion";
import { CheckCheck, FileText, MapPin, Mic, Reply, Edit2, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Attachment } from "@/hooks/use-chat-utils";
import type { Message } from "@/hooks/use-chat-messaging";
import { AudioPlayer } from "@/components/chat/audio-player";

interface MessageBubbleProps {
  message: Message;
  index: number;
  totalMessages: number;
  onReply?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
}

export function MessageBubble({ message, index, totalMessages, onReply, onEdit, onDelete }: MessageBubbleProps) {
  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.2,
        ease: "easeOut"
      }}
      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} items-end gap-2 group mb-3`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-lg px-2.5 sm:px-3 py-2 transition-all ${
          message.sender === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground border border-border/40"
        }`}
      >
        {message.text && (
          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words mb-1.5">
            {message.text}
          </p>
        )}
        {message.attachments && message.attachments.length > 0 && (
          <div className={`space-y-2 ${message.text ? "mt-2" : ""}`}>
            {message.attachments.map((attachment: Attachment, idx: number) => (
              <div key={attachment.id || idx} className="rounded overflow-hidden">
                {attachment.type === "image" && attachment.url && (
                  <img
                    src={attachment.url}
                    alt={attachment.name || "تصویر"}
                    className="max-w-full max-h-[150px] sm:max-h-[180px] rounded cursor-pointer hover:opacity-90 transition-all"
                    onClick={() => window.open(attachment.url, "_blank")}
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
                    <span className="font-medium truncate">{attachment.name || "فایل"}</span>
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
                    <span className="font-medium">{attachment.name || "موقعیت"}</span>
                  </a>
                )}
                {attachment.type === "audio" && attachment.url && (
                  <AudioPlayer url={attachment.url} duration={attachment.duration} />
                )}
              </div>
            ))}
          </div>
        )}
        <div className={`flex items-center gap-1.5 mt-1.5 pt-1.5 border-t ${
          message.sender === "user" 
            ? "border-primary-foreground/20 justify-end" 
            : "border-border/30 justify-start"
        }`}>
          <span className={`text-[10px] sm:text-xs ${
            message.sender === "user" 
              ? "text-primary-foreground/70" 
              : "text-muted-foreground"
          }`}>
            {new Date(message.timestamp).toLocaleTimeString("fa-IR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {message.status && message.sender === "user" && (
            <CheckCheck className={`h-3 w-3 ${
              message.status === "read" ? "text-primary-foreground/70" : "text-primary-foreground/40"
            }`} />
          )}
          {/* آیکون حذف مستقیم برای همه پیام‌ها - همیشه قابل مشاهده */}
          {onDelete && (message.sender === "support" || message.sender === "user") && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-destructive/10 text-destructive hover:text-destructive opacity-70 hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("آیا مطمئن هستید که می‌خواهید این پیام را حذف کنید؟")) {
                  onDelete(message.id);
                }
              }}
              title="حذف پیام"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
          {/* منوی 3 نقطه برای سایر گزینه‌ها (پاسخ و ویرایش) */}
          {(onReply || onEdit) && (
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-background/20"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    title="گزینه‌های بیشتر"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align={message.sender === "user" ? "end" : "start"}
                  className="min-w-[140px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {onReply && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onReply(message);
                      }}
                      className="cursor-pointer"
                    >
                      <Reply className="h-4 w-4 ml-2" />
                      <span>پاسخ</span>
                    </DropdownMenuItem>
                  )}
                  {onEdit && message.sender === "user" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(message);
                        }}
                        className="cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4 ml-2" />
                        <span>ویرایش</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}


