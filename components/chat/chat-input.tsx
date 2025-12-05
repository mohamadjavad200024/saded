"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Image, FileText, MapPin, Mic, Paperclip, X, Square } from "lucide-react";
import type { Attachment } from "@/hooks/use-chat-utils";

interface ChatInputProps {
  message: string;
  onMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  isSending: boolean;
  attachments: Attachment[];
  onRemoveAttachment: (id: string) => void;
  showAttachmentOptions: boolean;
  onToggleAttachmentOptions: () => void;
  isRecording: boolean;
  recordingTime: number;
  audioUrl: string | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancelRecording: () => void;
  onSaveRecording: () => Promise<void>;
  formatTime: (seconds: number) => string;
  imageInputRef: React.RefObject<HTMLInputElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => Promise<void>;
  onLocationShare: () => void;
  onCheckMicrophonePermission: () => Promise<boolean>;
  toast: any;
}

export function ChatInput({
  message,
  onMessageChange,
  onSend,
  isSending,
  attachments,
  onRemoveAttachment,
  showAttachmentOptions,
  onToggleAttachmentOptions,
  isRecording,
  recordingTime,
  audioUrl,
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  onSaveRecording,
  formatTime,
  imageInputRef,
  fileInputRef,
  onFileSelect,
  onLocationShare,
  onCheckMicrophonePermission,
  toast,
}: ChatInputProps) {
  return (
    <div className="border-t border-border/40 p-2 sm:p-3 bg-background">
      {/* Recording UI */}
      {(isRecording || audioUrl) && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="flex items-center gap-2 p-2 mb-2 bg-destructive/10 border border-destructive/30 rounded-lg"
        >
          {isRecording ? (
            <>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="p-1.5 rounded-full bg-destructive/20"
              >
                <Mic className="h-3.5 w-3.5 text-destructive" />
              </motion.div>
              <div className="flex-1">
                <p className="text-xs font-medium text-destructive leading-tight">در حال ضبط</p>
                <p className="text-xs text-muted-foreground font-mono">{formatTime(recordingTime)}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onStopRecording}
                className="h-7 w-7 text-destructive hover:bg-destructive/10 rounded-lg"
              >
                <Square className="h-3 w-3 fill-current" />
              </Button>
            </>
          ) : (
            <>
              <div className="p-1.5 rounded-full bg-primary/20">
                <Mic className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium leading-tight">پیام صوتی آماده است</p>
                <p className="text-xs text-muted-foreground font-mono">{formatTime(recordingTime)}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancelRecording}
                className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-lg"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
              <Button
                onClick={onSaveRecording}
                size="sm"
                className="h-7 px-3 text-xs rounded-lg"
              >
                ذخیره
              </Button>
            </>
          )}
        </motion.div>
      )}


      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          {/* Attachments Preview inside input */}
          {attachments.length > 0 && (
            <div className="absolute top-2 right-2 left-2 z-10 pointer-events-none overflow-hidden">
              <div className="overflow-x-auto overflow-y-hidden scroll-smooth w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex items-center gap-1.5 flex-nowrap">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="relative group pointer-events-auto flex-shrink-0 w-auto"
                    >
                      <div className="bg-card/95 backdrop-blur-sm rounded-md p-1 border border-border/40 shadow-sm">
                        {attachment.type === "image" && attachment.url && (
                          <img
                            src={attachment.url}
                            alt={attachment.name || "تصویر"}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        {attachment.type === "file" && (
                          <div className="flex items-center gap-1 px-1.5 py-1">
                            <FileText className="h-3 w-3 flex-shrink-0 text-primary" />
                            <p className="text-[10px] truncate max-w-[50px] font-medium leading-tight">{attachment.name}</p>
                          </div>
                        )}
                        {attachment.type === "location" && (
                          <div className="flex items-center gap-1 px-1.5 py-1">
                            <MapPin className="h-3 w-3 flex-shrink-0 text-primary" />
                            <span className="text-[10px] font-medium whitespace-nowrap leading-tight">موقعیت</span>
                          </div>
                        )}
                        {attachment.type === "audio" && (
                          <div className="flex items-center gap-1 px-1.5 py-1">
                            <Mic className="h-3 w-3 flex-shrink-0 text-primary" />
                            <span className="text-[10px] font-medium whitespace-nowrap leading-tight">
                              {(attachment as any).duration ? formatTime((attachment as any).duration) : "صدا"}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveAttachment(attachment.id)}
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20 hover:scale-110"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Textarea
            value={message}
            onChange={onMessageChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (message.trim() || attachments.length > 0) {
                  onSend();
                }
              }
            }}
            placeholder="پیام خود را بنویسید..."
            className={`min-h-[44px] max-h-[100px] resize-none text-sm leading-relaxed rounded-lg border pr-20 pl-3 py-2 ${
              attachments.length > 0 ? "pt-12" : ""
            }`}
          />
          
          {/* Attachment Options */}
          <AnimatePresence>
            {showAttachmentOptions && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full right-0 mb-2 flex gap-2 p-2 bg-card rounded-lg border border-border/50 shadow-lg z-10"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    imageInputRef.current?.click();
                    onToggleAttachmentOptions();
                  }}
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
                  disabled={isRecording}
                >
                  <Image className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    fileInputRef.current?.click();
                    onToggleAttachmentOptions();
                  }}
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
                  disabled={isRecording}
                >
                  <FileText className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLocationShare}
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
                  disabled={isRecording}
                >
                  <MapPin className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async () => {
                    onToggleAttachmentOptions();
                    if (isRecording) {
                      onStopRecording();
                    } else {
                      const hasPermission = await onCheckMicrophonePermission();
                      if (!hasPermission) {
                        toast({
                          title: "نیاز به دسترسی میکروفون",
                          description: "برای ضبط صدا، لطفاً دسترسی میکروفون را در تنظیمات مرورگر فعال کنید.",
                          variant: "destructive",
                          duration: 5000,
                        });
                      }
                      onStartRecording();
                    }
                  }}
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
                  disabled={isRecording}
                >
                  {isRecording ? (
                    <Mic className="h-3.5 w-3.5 text-destructive" />
                  ) : (
                    <Mic className="h-3.5 w-3.5" />
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hidden Inputs */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onFileSelect(e, "image")}
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => onFileSelect(e, "file")}
          />
          
          {/* Buttons - inside input */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            {/* Attachment Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleAttachmentOptions}
              className={`h-7 w-7 rounded-lg transition-all ${
                showAttachmentOptions 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            {/* Send Button - only show when there's content */}
            {(message.trim() || attachments.length > 0) && !isRecording && (
              <>
                {isSending ? (
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                ) : (
                  <Button
                    onClick={onSend}
                    size="icon"
                    className="h-7 w-7 rounded-lg transition-all"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


