"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Paperclip,
  MapPin,
  FileText,
  X,
  Mic,
  Square,
  Pause,
  Loader2,
  ChevronDown,
  Image,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Attachment } from "@/components/chat/chat-types";

interface ChatInputProps {
  message: string;
  // Support both naming conventions
  setMessage?: React.Dispatch<React.SetStateAction<string>>;
  onMessageChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  
  attachments: Attachment[];
  setAttachments?: React.Dispatch<React.SetStateAction<Attachment[]>>;
  onRemoveAttachment?: (id: string) => void;
  handleRemoveAttachment?: (id: string) => void;
  
  showAttachmentOptions: boolean;
  setShowAttachmentOptions?: React.Dispatch<React.SetStateAction<boolean>>;
  onToggleAttachmentOptions?: () => void;
  
  isRecording: boolean;
  recordingTime: number;
  audioUrl: string | null;
  
  // Support both naming conventions for recording
  startRecording?: () => Promise<void>;
  onStartRecording?: () => Promise<void>;
  stopRecording?: () => void;
  onStopRecording?: () => void;
  saveRecording?: () => void;
  onSaveRecording?: () => void | Promise<void>;
  cancelRecording?: () => void;
  onCancelRecording?: () => void;
  
  // Status flags
  isSaving?: boolean;
  isSending?: boolean;
  showScrollToBottom?: boolean;
  showPermissionGuide?: boolean;
  setShowPermissionGuide?: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Refs (optional for admin)
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  imageInputRef?: React.RefObject<HTMLInputElement | null>;
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
  typingTimeoutRef?: React.MutableRefObject<NodeJS.Timeout | null>;
  
  // Handlers (support both naming conventions)
  handleSendMessage?: () => void;
  onSend?: () => void | Promise<void>;
  handleFileSelect?: (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => void;
  onFileSelect?: (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => void;
  handleLocationShare?: () => void;
  onLocationShare?: () => void;
  sendTypingStatus?: (typing: boolean) => void;
  scrollToBottom?: (instant?: boolean) => void;
  onCheckMicrophonePermission?: () => Promise<boolean>;
  
  // Utils
  formatTime: (seconds: number) => string;
  toast: ReturnType<typeof useToast>["toast"];
}

export function ChatInput({
  message,
  setMessage,
  onMessageChange,
  attachments,
  setAttachments,
  onRemoveAttachment,
  showAttachmentOptions,
  setShowAttachmentOptions,
  onToggleAttachmentOptions,
  isRecording,
  recordingTime,
  audioUrl,
  isSaving,
  isSending,
  showScrollToBottom,
  showPermissionGuide,
  setShowPermissionGuide,
  textareaRef,
  imageInputRef,
  fileInputRef,
  typingTimeoutRef,
  handleSendMessage,
  onSend,
  handleFileSelect,
  onFileSelect,
  handleRemoveAttachment,
  onLocationShare,
  handleLocationShare,
  startRecording,
  onStartRecording,
  stopRecording,
  onStopRecording,
  saveRecording,
  onSaveRecording,
  cancelRecording,
  onCancelRecording,
  sendTypingStatus,
  scrollToBottom,
  formatTime,
  toast,
}: ChatInputProps) {
  // Support both prop naming conventions (for backward compatibility)
  const actualSetMessage = setMessage || ((value: string) => {
    if (onMessageChange) {
      const syntheticEvent = {
        target: { value }
      } as React.ChangeEvent<HTMLTextAreaElement>;
      onMessageChange(syntheticEvent);
    }
  });
  
  const actualHandleSendMessage = handleSendMessage || onSend || (() => {});
  const actualHandleFileSelect = handleFileSelect || onFileSelect;
  const actualHandleRemoveAttachment = handleRemoveAttachment || onRemoveAttachment;
  const actualHandleLocationShare = handleLocationShare || onLocationShare;
  const actualStartRecording = startRecording || onStartRecording;
  const actualStopRecording = stopRecording || onStopRecording;
  const actualSaveRecording = saveRecording || onSaveRecording;
  const actualCancelRecording = cancelRecording || onCancelRecording;
  const actualSetShowAttachmentOptions = setShowAttachmentOptions || (() => {
    if (onToggleAttachmentOptions) {
      onToggleAttachmentOptions();
    }
  });
  
  const actualIsSaving = isSaving ?? isSending ?? false;
  return (
    <div className="border-t border-border/40 bg-background p-2 sm:p-3 space-y-2 relative flex-shrink-0">
      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollToBottom && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10"
          >
            <Button
              onClick={() => {
                if (scrollToBottom) {
                  scrollToBottom(false);
                }
              }}
              size="icon"
              className="h-9 w-9 rounded-full shadow-lg hover:shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              title="برو به آخرین پیام"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permission Guide */}
      {showPermissionGuide && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="p-3 bg-destructive/5 border-2 border-destructive/20 rounded-xl shadow-sm"
        >
          <div className="flex items-start gap-2">
            <Mic className="h-3.5 w-3.5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-destructive mb-1.5 leading-tight">
                دسترسی میکروفون نیاز است
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                لطفاً در تنظیمات مرورگر دسترسی میکروفون را فعال کنید
              </p>
            </div>
            <button
              onClick={() => {
                if (setShowPermissionGuide) {
                  setShowPermissionGuide(false);
                }
              }}
              className="p-0.5 rounded hover:bg-destructive/10 transition-colors flex-shrink-0"
            >
              <X className="h-3 w-3 text-destructive" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Recording UI */}
      {(isRecording || audioUrl) && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/30 rounded-lg"
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
                onClick={actualStopRecording}
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
                onClick={actualCancelRecording}
                className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-lg"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
              <Button
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("[Voice Widget] Save button clicked!");
                  if (actualSaveRecording) {
                    await actualSaveRecording();
                  }
                }}
                size="sm"
                className="h-7 px-3 text-xs rounded-lg"
                title="ذخیره و ارسال پیام صوتی"
              >
                ذخیره
              </Button>
            </>
          )}
        </motion.div>
      )}

      {/* Attachment Options */}
      {showAttachmentOptions && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="flex gap-2 p-2 bg-card rounded-lg border border-border/50 shadow-lg"
          onClick={(e) => {
            console.log("[Attachment Options Widget] Container clicked!", e.target);
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              imageInputRef?.current?.click();
              if (onToggleAttachmentOptions) {
                onToggleAttachmentOptions();
              } else if (actualSetShowAttachmentOptions) {
                actualSetShowAttachmentOptions(false);
              }
            }}
            className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
          >
            <Image className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              fileInputRef?.current?.click();
              if (onToggleAttachmentOptions) {
                onToggleAttachmentOptions();
              } else if (actualSetShowAttachmentOptions) {
                actualSetShowAttachmentOptions(false);
              }
            }}
            className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
          >
            <FileText className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("[Location Widget] Button clicked!");
              if (actualHandleLocationShare) {
                actualHandleLocationShare();
              }
              if (onToggleAttachmentOptions) {
                onToggleAttachmentOptions();
              } else if (actualSetShowAttachmentOptions) {
                actualSetShowAttachmentOptions(false);
              }
            }}
            className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
            title="اشتراک‌گذاری موقعیت مکانی"
          >
            <MapPin className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("[Voice Widget] Button clicked!");
              if (onToggleAttachmentOptions) {
                onToggleAttachmentOptions();
              } else if (actualSetShowAttachmentOptions) {
                actualSetShowAttachmentOptions(false);
              }
              if (isRecording) {
                if (actualStopRecording) {
                  actualStopRecording();
                }
              } else {
                toast({
                  title: "در حال درخواست دسترسی...",
                  description: "لطفاً اجازه دسترسی به میکروفون را در مرورگر بدهید",
                  duration: 3000,
                });
                try {
                  if (actualStartRecording) {
                    await actualStartRecording();
                  }
                } catch (error) {
                  console.error("[Voice Widget] Error starting recording:", error);
                }
              }
            }}
            title="ضبط پیام صوتی"
            className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
            disabled={isRecording}
          >
            {isRecording ? (
              <Pause className="h-3.5 w-3.5 text-destructive" />
            ) : (
              <Mic className="h-3.5 w-3.5" />
            )}
          </Button>
        </motion.div>
      )}

      {/* Hidden Inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (actualHandleFileSelect) {
            actualHandleFileSelect(e, "image");
          }
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (actualHandleFileSelect) {
            actualHandleFileSelect(e, "file");
          }
        }}
      />
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
                            <p className="text-[10px] truncate max-w-[50px] font-medium leading-tight">
                              {attachment.name}
                            </p>
                          </div>
                        )}
                        {attachment.type === "location" && (
                          <div className="flex items-center gap-1 px-1.5 py-1">
                            <MapPin className="h-3 w-3 flex-shrink-0 text-primary" />
                            <span className="text-[10px] font-medium whitespace-nowrap leading-tight">
                              موقعیت
                            </span>
                          </div>
                        )}
                        {attachment.type === "audio" && (
                          <div className="flex items-center gap-1 px-1.5 py-1">
                            <Mic className="h-3 w-3 flex-shrink-0 text-primary" />
                            <span className="text-[10px] font-medium whitespace-nowrap leading-tight">
                              {attachment.duration ? formatTime(attachment.duration) : "صدا"}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          if (actualHandleRemoveAttachment) {
                            actualHandleRemoveAttachment(attachment.id);
                          }
                        }}
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
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              if (onMessageChange) {
                onMessageChange(e);
              } else if (actualSetMessage) {
                actualSetMessage(e.target.value);
              }

              // Clear existing timeout
              if (typingTimeoutRef?.current) {
                clearTimeout(typingTimeoutRef.current);
              }

              // Send typing status
              if (sendTypingStatus && e.target.value.trim().length > 0) {
                sendTypingStatus(true);

                // Stop typing after 2 seconds of no input
                if (typingTimeoutRef) {
                  typingTimeoutRef.current = setTimeout(() => {
                    sendTypingStatus(false);
                  }, 2000);
                }
              } else if (sendTypingStatus) {
                sendTypingStatus(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (typingTimeoutRef?.current) {
                  clearTimeout(typingTimeoutRef.current);
                }
                if (sendTypingStatus) {
                  sendTypingStatus(false);
                }
                actualHandleSendMessage();
              }
            }}
            placeholder="پیام خود را بنویسید..."
            className={`min-h-[44px] max-h-[100px] resize-none text-sm leading-relaxed rounded-lg border pr-20 pl-3 py-2 ${
              attachments.length > 0 ? "pt-12" : ""
            }`}
          />

          {/* Buttons - inside input */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            {/* Attachment Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("[Paperclip Widget] Button clicked! showAttachmentOptions:", !showAttachmentOptions);
                if (onToggleAttachmentOptions) {
                  onToggleAttachmentOptions();
                } else if (actualSetShowAttachmentOptions) {
                  actualSetShowAttachmentOptions(!showAttachmentOptions);
                }
              }}
              className={`h-7 w-7 rounded-lg transition-all ${
                showAttachmentOptions
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            {/* Send Button - only show when there's content */}
            {!isRecording && (
              <>
                {actualIsSaving ? (
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                ) : (
                  <Button
                    onClick={actualHandleSendMessage}
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
