"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Send,
  MessageCircle,
  Phone,
  Mail,
  Image,
  Paperclip,
  MapPin,
  FileText,
  X,
  Mic,
  Square,
  Play,
  Pause,
  Loader2,
  Check,
  CheckCheck,
  Reply,
  Edit2,
  Trash2,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { OnlineStatusBadge } from "@/components/chat/online-status-badge";
import { useAdminPresence } from "@/hooks/use-admin-presence";
import { usePersistentNotifications } from "@/hooks/use-persistent-notifications";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { logger } from "@/lib/logger-client";

type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
  attachments?: Attachment[];
  status?: MessageStatus;
}

interface Attachment {
  id: string;
  type: "image" | "file" | "location" | "audio";
  url?: string;
  name?: string;
  size?: number;
  duration?: number;
}

interface QuickBuyChatProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function QuickBuyChat({ isOpen, onOpenChange, trigger }: QuickBuyChatProps): React.ReactElement {
  const { toast } = useToast();
  const { showNotification, requestPermission } = useNotifications();
  const { showMessageNotification } = usePersistentNotifications();
  const { isOnline, lastSeen, checkStatus } = useAdminPresence({
    enabled: true,
    heartbeatInterval: 20000, // 20 seconds for user side
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "سلام! خوش آمدید. برای خرید سریع لطفاً اطلاعات زیر را وارد کنید:",
      sender: "support",
      timestamp: new Date(),
    },
  ]);
  const [message, setMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  
  // Load customer info from localStorage on mount with expiration check
  const loadCustomerInfo = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quickBuyChat_customerInfo");
      const savedTimestamp = localStorage.getItem("quickBuyChat_customerInfo_timestamp");
      
      if (saved) {
        try {
          const data = JSON.parse(saved);
          // Check if session is still valid (30 days)
          if (savedTimestamp) {
            const timestamp = parseInt(savedTimestamp, 10);
            const daysSinceSaved = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
            
            if (daysSinceSaved > 30) {
              // Session expired, clear old data
              localStorage.removeItem("quickBuyChat_customerInfo");
              localStorage.removeItem("quickBuyChat_customerInfo_timestamp");
              localStorage.removeItem("quickBuyChat_chatId");
              return { name: "", phone: "", email: "" };
            }
          }
          
          return data;
        } catch {
          // Clear corrupted data
          localStorage.removeItem("quickBuyChat_customerInfo");
          localStorage.removeItem("quickBuyChat_customerInfo_timestamp");
          return { name: "", phone: "", email: "" };
        }
      }
    }
    return { name: "", phone: "", email: "" };
  };

  // Load chatId from localStorage
  const loadChatId = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("quickBuyChat_chatId");
    }
    return null;
  };

  const [customerInfo, setCustomerInfo] = useState(loadCustomerInfo);
  const [step, setStep] = useState<"info" | "chat">("info");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [recordingPermission, setRecordingPermission] = useState<boolean | null>(null);
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [chatId, setChatId] = useState<string | null>(loadChatId());
  const [isPolling, setIsPolling] = useState(false);
  const [isSupportTyping, setIsSupportTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingPollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const lastPolledMessageIdRef = useRef<string | null>(null);
  const processedNotificationIdsRef = useRef<Set<string>>(new Set());
  const notificationDebounceRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const lastNotificationTimeRef = useRef<Map<string, number>>(new Map());
  const systemMessageShownRef = useRef<boolean>(false);
  const systemMessageIdRef = useRef<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const hasScrolledOnOpenRef = useRef<boolean>(false);
  const lastUserMessageIdRef = useRef<string | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  // Check if user is scrolled up
  const checkScrollPosition = useCallback(() => {
    if (!messagesContainerRef.current || step !== "chat") {
      setShowScrollToBottom(false);
      return;
    }
    const container = messagesContainerRef.current;
    const threshold = 150; // 150px threshold
    const scrollBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    const isScrolledUp = scrollBottom > threshold;
    setShowScrollToBottom(isScrolledUp);
  }, [step]);

  // Scroll to bottom function
  const scrollToBottom = useCallback((instant = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: instant ? "auto" : "smooth",
        block: "end"
      });
      // Hide button after scrolling
      setTimeout(() => {
        setShowScrollToBottom(false);
      }, 300);
    }
  }, []);

  // Track scroll position
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || step !== "chat") {
      setShowScrollToBottom(false);
      return;
    }

    const handleScroll = () => {
      checkScrollPosition();
    };

    // Check position when messages change
    const checkOnMessagesChange = () => {
      setTimeout(() => {
        checkScrollPosition();
      }, 100);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial position
    checkScrollPosition();
    checkOnMessagesChange();
    
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [step, checkScrollPosition, messages.length]);

  // Scroll to bottom only when chat step is opened (first time)
  useEffect(() => {
    if (step === "chat" && messages.length > 0 && !hasScrolledOnOpenRef.current) {
      // Scroll only once when opening chat
      hasScrolledOnOpenRef.current = true;
      const timeout = setTimeout(() => {
        scrollToBottom(true);
        // Check position after scroll to hide button
        setTimeout(() => {
          checkScrollPosition();
        }, 500);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [step, scrollToBottom, checkScrollPosition]);

  // Reset scroll flag when chat closes
  useEffect(() => {
    if (step !== "chat") {
      hasScrolledOnOpenRef.current = false;
    }
  }, [step]);

  // Scroll to bottom only when user sends a message
  useEffect(() => {
    if (messages.length > 0 && step === "chat") {
      const lastMessage = messages[messages.length - 1];
      const isNewUserMessage = lastMessage.id === lastUserMessageIdRef.current;
      
      // Only scroll if user just sent a message
      if (isNewUserMessage && lastMessage.sender === "user") {
        const timeout = setTimeout(() => {
          scrollToBottom(false);
          // Check position after scroll to hide button
          setTimeout(() => {
            checkScrollPosition();
          }, 500);
        }, 150);
        return () => clearTimeout(timeout);
      } else {
        // Check position when messages change (for new support messages)
        const checkTimeout = setTimeout(() => {
          checkScrollPosition();
        }, 200);
        return () => clearTimeout(checkTimeout);
      }
    }
  }, [messages, step, scrollToBottom, checkScrollPosition]);

  // Save customer info and chatId to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && customerInfo.name && customerInfo.phone) {
      localStorage.setItem("quickBuyChat_customerInfo", JSON.stringify(customerInfo));
      // Save timestamp for expiration check
      localStorage.setItem("quickBuyChat_customerInfo_timestamp", Date.now().toString());
    }
  }, [customerInfo]);

  useEffect(() => {
    if (typeof window !== "undefined" && chatId) {
      localStorage.setItem("quickBuyChat_chatId", chatId);
    }
  }, [chatId]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when chat is closed (but keep customer info in localStorage)
      setStep("info");
      setMessage("");
      setAttachments([]);
      setShowAttachmentOptions(false);
      setIsRecording(false);
      setRecordingTime(0);
      setAudioBlob(null);
      setAudioUrl(null);
      setIsPlayingAudio(null);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      // Stop polling when chat closes
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      setIsPolling(false);
      // Don't reset customerInfo, messages, or chatId - keep them for next time
      // Messages will be loaded from database when chat opens again
    } else {
      // When chat opens, load customer info and chat history
      const savedInfo = loadCustomerInfo();
      const savedChatId = loadChatId();

      if (savedInfo.name && savedInfo.phone) {
        // Auto-restore: if we have saved info, go directly to chat
        setCustomerInfo(savedInfo);
        setStep("chat"); // Set step to chat immediately
        // Load chat history from database
        loadChatHistory(savedInfo, savedChatId);
      } else {
        // No saved info, show info form
        setStep("info");
        setMessages([
          {
            id: "1",
            text: "سلام! خوش آمدید. برای خرید سریع لطفاً اطلاعات زیر را وارد کنید:",
            sender: "support",
            timestamp: new Date(),
          },
        ]);
      }
    }
  }, [isOpen]);

  // Check microphone permission
  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      return false;
    }
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          title: "مرورگر شما پشتیبانی نمی‌کند",
          description: "مرورگر شما از ضبط صدا پشتیبانی نمی‌کند. لطفاً از مرورگر جدیدتری استفاده کنید.",
          variant: "destructive",
        });
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      setRecordingPermission(true);
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm") 
          ? "audio/webm" 
          : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mediaRecorder.mimeType || "audio/webm" 
        });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.onerror = (event) => {
        logger.error("MediaRecorder error:", event);
        toast({
          title: "خطا در ضبط صدا",
          description: "خطایی در هنگام ضبط صدا رخ داد. لطفاً دوباره تلاش کنید.",
          variant: "destructive",
        });
        stopRecording();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      toast({
        title: "ضبط صدا شروع شد",
        description: "در حال ضبط پیام صوتی...",
      });
    } catch (error: any) {
      logger.error("Error starting recording:", error);
      setRecordingPermission(false);
      
      let errorMessage = "دسترسی به میکروفون مجاز نیست.";
      let errorDescription = "";

      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        errorMessage = "دسترسی به میکروفون رد شد";
        errorDescription = "لطفاً در تنظیمات مرورگر خود، دسترسی میکروفون را فعال کنید.";
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        errorMessage = "میکروفون یافت نشد";
        errorDescription = "لطفاً مطمئن شوید که میکروفون به دستگاه شما متصل است.";
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        errorMessage = "میکروفون در حال استفاده است";
        errorDescription = "میکروفون توسط برنامه دیگری استفاده می‌شود. لطفاً آن را ببندید.";
      } else if (error.name === "OverconstrainedError" || error.name === "ConstraintNotSatisfiedError") {
        errorMessage = "تنظیمات میکروفون پشتیبانی نمی‌شود";
        errorDescription = "لطفاً از میکروفون دیگری استفاده کنید.";
      } else {
        errorDescription = "لطفاً دوباره تلاش کنید یا صفحه را رفرش کنید.";
      }

      toast({
        title: errorMessage,
        description: errorDescription,
        variant: "destructive",
        duration: 5000,
      });

      // Show permission guide for permission errors
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setShowPermissionGuide(true);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
        }
        toast({
          title: "ضبط صدا متوقف شد",
          description: "پیام صوتی شما آماده است. می‌توانید آن را ذخیره یا لغو کنید.",
        });
      } catch (error) {
        logger.error("Error stopping recording:", error);
        toast({
          title: "خطا",
          description: "خطایی در توقف ضبط رخ داد.",
          variant: "destructive",
        });
      }
    }
  };

  const cancelRecording = () => {
    stopRecording();
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingTime(0);
  };

  const saveRecording = async () => {
    logger.info("saveRecording called", { hasAudioBlob: !!audioBlob, hasAudioUrl: !!audioUrl });
    console.log("[Voice Widget] saveRecording called", { hasAudioBlob: !!audioBlob, hasAudioUrl: !!audioUrl, audioBlobSize: audioBlob?.size, audioUrl });
    
    if (!audioBlob || !audioUrl) {
      logger.warn("No audio blob or URL available");
      console.log("[Voice Widget] No audio blob or URL available, returning");
      alert("هیچ ضبط صوتی موجود نیست");
      return;
    }

    try {
      console.log("[Voice Widget] Starting upload...");
        // Determine file extension based on MIME type
        let extension = "webm";
        let mimeType = audioBlob.type || "audio/webm";
        
        if (mimeType.includes("mp4") || mimeType.includes("m4a")) {
          extension = "m4a";
        } else if (mimeType.includes("ogg")) {
          extension = "ogg";
        } else if (mimeType.includes("wav")) {
          extension = "wav";
        } else if (mimeType.includes("webm")) {
          extension = "webm";
        }

        // Convert blob to file with correct MIME type
        const audioFile = new File([audioBlob], `audio-${Date.now()}.${extension}`, {
          type: mimeType,
        });

        // Upload audio file
        console.log("[Voice Widget] Uploading audio file...");
        const uploadedUrl = await uploadFile(audioFile, "audio");
        console.log("[Voice Widget] Upload successful, URL:", uploadedUrl);

        const attachment: Attachment = {
          id: Date.now().toString(),
          type: "audio",
          url: uploadedUrl,
          name: `پیام صوتی ${formatTime(recordingTime)}`,
          size: audioBlob.size,
          duration: recordingTime,
        };
        console.log("[Voice Widget] Adding attachment:", attachment);
        setAttachments((prev) => {
          const newAttachments = [...prev, attachment];
          console.log("[Voice Widget] New attachments:", newAttachments);
          return newAttachments;
        });
        setAudioBlob(null);
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        setAudioUrl(null);
        setRecordingTime(0);
        
        // Auto-send message with audio attachment
        console.log("[Voice Widget] Auto-sending message...");
        setTimeout(() => {
          handleSendMessage();
        }, 100);
      } catch (error) {
        // Error already handled in uploadFile
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const loadChatHistory = async (customerInfo: { name: string; phone: string; email?: string }, savedChatId: string | null) => {
    try {
      let url = "/api/chat?";
      
      if (savedChatId) {
        // Try to load by chatId first
        url += `chatId=${savedChatId}`;
      } else {
        // Try session-based chat first (logged-in users)
        try {
          const myRes = await fetch("/api/chat/my", { credentials: "include" });
          const myJson = await myRes.json().catch(() => null);
          if (myRes.ok && myJson?.success && myJson?.data?.chatId) {
            savedChatId = String(myJson.data.chatId);
            url = `/api/chat?chatId=${savedChatId}`;
          }
        } catch {
          // ignore and fallback to legacy lookup
        }

        // Find chat by customer info
        url += `customerPhone=${encodeURIComponent(customerInfo.phone)}`;
        if (customerInfo.name) {
          url += `&customerName=${encodeURIComponent(customerInfo.name)}`;
        }
      }

      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        throw new Error("خطا در بارگذاری تاریخچه چت");
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const { chat, messages } = data.data;
        
        if (chat && messages && messages.length > 0) {
          // Set chatId
          setChatId(chat.id);
          if (typeof window !== "undefined") {
            localStorage.setItem("quickBuyChat_chatId", chat.id);
          }

          // Convert database messages to component messages
          const loadedMessages: Message[] = messages.map((msg: any) => {
            // The API already merges attachments from JSONB and chat_attachments table
            // So msg.attachments should be an array already
            let finalAttachments: any[] = [];
            
            if (msg.attachments) {
              if (Array.isArray(msg.attachments)) {
                // Already an array from API merge
                finalAttachments = msg.attachments.map((att: any) => {
                  const url = att.url || att.fileUrl || att.filePath;
                      // Auto-detect type from URL if not provided
                      let detectedType = att.type;
                      if (!detectedType && url) {
                        if (url.includes("/image-") || url.includes("image-")) {
                          detectedType = "image";
                        } else if (url.includes("/audio-") || url.includes("audio-")) {
                          detectedType = "audio";
                        }
                      }
                  
                  return {
                    id: att.id || `att-${Date.now()}-${Math.random()}`,
                    type: (detectedType || att.type || "file") as "image" | "file" | "location" | "audio",
                    url: url, // Try multiple URL fields
                    name: att.name || att.fileName,
                    size: att.size || att.fileSize,
                    duration: att.duration,
                  };
                });
              } else if (typeof msg.attachments === 'string') {
                // Try to parse JSON string
                try {
                  const parsed = JSON.parse(msg.attachments);
                  if (Array.isArray(parsed)) {
                    finalAttachments = parsed.map((att: any) => {
                      const url = att.url || att.fileUrl || att.filePath;
                      // Auto-detect type from URL if not provided
                      let detectedType = att.type;
                      if (!detectedType && url) {
                        if (url.includes("/image-") || url.includes("image-")) {
                          detectedType = "image";
                        } else if (url.includes("/audio-") || url.includes("audio-")) {
                          detectedType = "audio";
                        }
                      }
                      
                      return {
                        id: att.id || `att-${Date.now()}-${Math.random()}`,
                        type: (detectedType || att.type || "file") as "image" | "file" | "location" | "audio",
                        url: url,
                        name: att.name || att.fileName,
                        size: att.size || att.fileSize,
                        duration: att.duration,
                      };
                    });
                  }
                } catch (e) {
                  logger.error("Error parsing attachments JSON:", e);
                }
              }
            }
            
            // Filter out attachments with temporary URLs (blob/data URLs)
            const validAttachments = finalAttachments.filter(att => {
              const url = att.url;
              // Only keep attachments with valid URLs (not blob or data URLs)
              return url && 
                     !url.startsWith('blob:') && 
                     !url.startsWith('data:') &&
                     (url.startsWith('http') || url.startsWith('/'));
            });
            
            // Debug: log all attachments
            if (finalAttachments.length > 0) {
              logger.debug(`Loaded message ${msg.id} has ${validAttachments.length} valid attachment(s) out of ${finalAttachments.length} total:`, validAttachments.map(att => ({ 
                id: att.id, 
                type: att.type, 
                url: att.url, 
                name: att.name,
                hasUrl: !!att.url 
              })));
            }
            
            return {
              id: msg.id,
              text: msg.text || "",
              sender: msg.sender as "user" | "support",
              timestamp: new Date(msg.createdAt),
              attachments: validAttachments.length > 0 ? validAttachments : undefined,
              status: msg.sender === "user" ? (msg.status as MessageStatus || "sent") : undefined,
            };
          });

          // Ensure all user messages have status from database
          const messagesWithStatus = loadedMessages.map((msg) => {
            if (msg.sender === "user" && !msg.status) {
              return { ...msg, status: "sent" as MessageStatus };
            }
            return msg;
          });
          
          setMessages(messagesWithStatus);
          // Set the last message ID for polling
          if (loadedMessages.length > 0) {
            const lastMessageId = loadedMessages[loadedMessages.length - 1].id;
            lastPolledMessageIdRef.current = lastMessageId;
            // Also save to localStorage for global polling
            if (typeof window !== "undefined") {
              localStorage.setItem("quickBuyChat_lastMessageId", lastMessageId);
            }
            // Check if admin has already replied - if yes, don't show system message
            const hasAdminMessage = messagesWithStatus.some(msg => msg.sender === "support" && msg.id !== "1");
            if (hasAdminMessage) {
              systemMessageShownRef.current = true; // Admin already replied, don't show system message
            } else {
              systemMessageShownRef.current = false; // Reset for new conversation
            }
          } else {
            systemMessageShownRef.current = false; // Reset for new conversation
          }
          setStep("chat");
        } else {
          // No chat found, start new chat
          setStep("chat");
          setMessages([
            {
              id: "1",
              text: `سلام ${customerInfo.name}! خوش آمدید. لطفاً محصول مورد نظر خود را ذکر کنید یا سوال خود را بپرسید.`,
              sender: "support",
              timestamp: new Date(),
            },
          ]);
          systemMessageShownRef.current = false; // Reset for new chat
        }
      } else {
        // No chat found, start new chat
        setStep("chat");
        setMessages([
          {
            id: "1",
            text: `سلام ${customerInfo.name}! خوش آمدید. لطفاً محصول مورد نظر خود را ذکر کنید یا سوال خود را بپرسید.`,
            sender: "support",
            timestamp: new Date(),
          },
        ]);
        systemMessageShownRef.current = false; // Reset for new chat
      }
    } catch (error) {
      logger.error("Error loading chat history:", error);
      // On error, still go to chat step
      setStep("chat");
      setMessages([
        {
          id: "1",
          text: `سلام ${customerInfo.name}! خوش آمدید. لطفاً محصول مورد نظر خود را ذکر کنید یا سوال خود را بپرسید.`,
          sender: "support",
          timestamp: new Date(),
        },
      ]);
      systemMessageShownRef.current = false; // Reset for new chat
    }
  };

  // Mark support messages as delivered (when chat is open)
  const markSupportMessagesAsDelivered = async () => {
    if (!chatId) return;
    
    try {
      await fetch("/api/chat/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          chatId,
          sender: "user",
          action: "delivered", // Mark as delivered when chat is open
        }),
      });
    } catch (error) {
      logger.error("Error marking messages as delivered:", error);
    }
  };

  // Mark support messages as read (when user views messages)
  const markSupportMessagesAsRead = async () => {
    if (!chatId) return;
    
    try {
      await fetch("/api/chat/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          chatId,
          sender: "user", // Mark messages from support as read
          action: "read",
        }),
      });
    } catch (error) {
      logger.error("Error marking messages as read:", error);
    }
  };

  // Poll for new messages
  const pollForNewMessages = async () => {
    if (!chatId || !isOpen || step !== "chat") return;

    try {
      setIsPolling(true);
      const lastMessageId = lastPolledMessageIdRef.current;

      let url = `/api/chat?chatId=${chatId}`;
      if (lastMessageId && lastMessageId !== "1") {
        // Poll for messages after the last one we have
        url += `&lastMessageId=${lastMessageId}`;
      }

      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        throw new Error("خطا در دریافت پیام‌های جدید");
      }

      const data = await response.json();
      
      if (data.success && data.data?.messages && Array.isArray(data.data.messages)) {
        const newMessages = data.data.messages;
        
        // Mark support messages as delivered when new messages arrive (user is online)
        if (newMessages.length > 0) {
          markSupportMessagesAsDelivered();
          // Mark as read after a short delay
          setTimeout(() => {
            markSupportMessagesAsRead();
          }, 1000);
        }
        
        // Don't show notifications when chat is open - user is already viewing
        // Global polling handles notifications when chat is closed
        
        // Convert database messages to component messages
        const formattedMessages: Message[] = newMessages.map((msg: any) => {
            let finalAttachments: any[] = [];
            
            if (msg.attachments) {
              if (Array.isArray(msg.attachments)) {
                finalAttachments = msg.attachments.map((att: any) => {
                  const url = att.url || att.fileUrl || att.filePath;
                      // Auto-detect type from URL if not provided
                      let detectedType = att.type;
                      if (!detectedType && url) {
                        if (url.includes("/image-") || url.includes("image-")) {
                          detectedType = "image";
                        } else if (url.includes("/audio-") || url.includes("audio-")) {
                          detectedType = "audio";
                        }
                      }
                  
                  return {
                    id: att.id || `att-${Date.now()}-${Math.random()}`,
                    type: (detectedType || att.type || "file") as "image" | "file" | "location" | "audio",
                    url: url,
                    name: att.name || att.fileName,
                    size: att.size || att.fileSize,
                    duration: att.duration,
                  };
                });
              }
            }
            
            // Filter out attachments with temporary URLs (blob/data URLs)
            const validAttachments = finalAttachments.filter(att => {
              const url = att.url;
              // Only keep attachments with valid URLs (not blob or data URLs)
              return url && 
                     !url.startsWith('blob:') && 
                     !url.startsWith('data:') &&
                     (url.startsWith('http') || url.startsWith('/'));
            });
            
            return {
              id: msg.id,
              text: msg.text || "",
              sender: msg.sender as "user" | "support",
              timestamp: new Date(msg.createdAt),
              attachments: validAttachments.length > 0 ? validAttachments : undefined,
              status: msg.sender === "user" ? (msg.status as MessageStatus || "sent") : undefined,
            };
          });

        // Add only new messages that we don't already have and update status of existing ones
        setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const uniqueNewMessages = formattedMessages.filter((msg) => !existingIds.has(msg.id));
            
            // Update status of existing messages from database (for user messages)
            // Also remove any system messages (they're not in database)
            const updatedPrev = prev
              .filter((existingMsg) => !existingMsg.id.startsWith("system-")) // Remove system messages
              .map((existingMsg) => {
                const dbMsg = formattedMessages.find((m) => m.id === existingMsg.id);
                if (dbMsg && existingMsg.sender === "user" && dbMsg.status && existingMsg.status !== dbMsg.status) {
                  return { ...existingMsg, status: dbMsg.status as MessageStatus };
                }
                return existingMsg;
              });
            
            if (uniqueNewMessages.length > 0) {
              // Remove system message if admin has replied
              const hasAdminMessage = uniqueNewMessages.some(msg => msg.sender === "support");
              let filteredPrev = updatedPrev;
              if (hasAdminMessage && systemMessageIdRef.current) {
                filteredPrev = updatedPrev.filter(msg => msg.id !== systemMessageIdRef.current);
                systemMessageIdRef.current = null;
                systemMessageShownRef.current = true; // Admin replied, don't show system message again
              }
              
              // Update last polled message ID to the latest message (not just new ones)
              const allMessages = [...filteredPrev, ...uniqueNewMessages];
              const latestMessage = allMessages[allMessages.length - 1];
              if (latestMessage) {
                lastPolledMessageIdRef.current = latestMessage.id;
                // Also save to localStorage for global polling
                if (typeof window !== "undefined") {
                  localStorage.setItem("quickBuyChat_lastMessageId", latestMessage.id);
                }
              }
              
              // Don't auto-scroll on polling updates - user controls scroll manually
              
              return allMessages;
            }
            return updatedPrev;
          });
        }
    } catch (error) {
      logger.error("Error polling for new messages:", error);
      // Don't show error toast for polling failures to avoid spamming
    } finally {
      setIsPolling(false);
    }
  };

  // Check if support is typing
  const checkSupportTyping = async () => {
    if (!chatId) return;
    
    try {
      const response = await fetch(`/api/chat/typing?chatId=${chatId}&sender=support`, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsSupportTyping(data.data.isTyping || false);
        }
      }
    } catch (error) {
      logger.error("Error checking typing status:", error);
    }
  };

  // Send typing status
  const sendTypingStatus = async (typing: boolean) => {
    if (!chatId) return;
    
    try {
      await fetch("/api/chat/typing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          chatId,
          sender: "user",
          isTyping: typing,
        }),
      });
    } catch (error) {
      logger.error("Error sending typing status:", error);
    }
  };

  // Request notification permission on mount
  useEffect(() => {
    requestPermission();
  }, []);

  // Listen for openChat event from notifications
  useEffect(() => {
    const handleOpenChat = (event: Event) => {
      const customEvent = event as CustomEvent<{ chatId: string; isAdmin?: boolean }>;
      const { chatId: eventChatId, isAdmin } = customEvent.detail;
      
      // Only handle if this is for user (not admin)
      if (isAdmin === false || isAdmin === undefined) {
        // Open chat panel
        if (!isOpen) {
          onOpenChange(true);
        }
        
        // Navigate to chat step
        if (step !== "chat") {
          setStep("chat");
        }
        
        // If we have a chatId from localStorage or event, use it
        if (eventChatId && typeof window !== "undefined") {
          const currentChatId = localStorage.getItem("quickBuyChat_chatId");
          if (currentChatId !== eventChatId) {
            localStorage.setItem("quickBuyChat_chatId", eventChatId);
            // Reload chat messages
            setTimeout(() => {
              if (isOpen && step === "chat") {
                pollForNewMessages();
              }
            }, 500);
          }
        }
      }
    };

    window.addEventListener("openChat", handleOpenChat);
    return () => {
      window.removeEventListener("openChat", handleOpenChat);
    };
  }, [isOpen, onOpenChange, chatId, step, pollForNewMessages]);

  // Start/stop polling based on chat state
  useEffect(() => {
    if (isOpen && step === "chat" && chatId) {
      // Mark support messages as delivered when chat opens (user is online)
      markSupportMessagesAsDelivered();
      
      // Mark support messages as read after a short delay (user is viewing)
      const readTimeout = setTimeout(() => {
        markSupportMessagesAsRead();
      }, 2000); // Mark as read after 2 seconds of viewing
      
      // Check typing status periodically
      checkSupportTyping();
      // Optimized: Check typing status every 3 seconds (reduced from 2s)
      typingPollIntervalRef.current = setInterval(() => {
        checkSupportTyping();
      }, 3000);
      
      // Optimized: Poll every 5 seconds for new messages (reduced from 3s to reduce server load)
      pollingIntervalRef.current = setInterval(() => {
        pollForNewMessages();
        // Keep marking as delivered while chat is open (user is online)
        markSupportMessagesAsDelivered();
      }, 5000);

      // Also poll immediately when entering chat
      pollForNewMessages();
      
      // Check admin status when chat opens
      checkStatus();

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        if (typingPollIntervalRef.current) {
          clearInterval(typingPollIntervalRef.current);
          typingPollIntervalRef.current = null;
        }
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }
        clearTimeout(readTimeout);
        sendTypingStatus(false);
      };
    }
  }, [isOpen, step, chatId, checkStatus]);

  const handlePlayAudio = (attachmentId: string, url: string) => {
    if (isPlayingAudio === attachmentId) {
      // Pause
      const audio = audioRefs.current[attachmentId];
      if (audio) {
        audio.pause();
      }
      setIsPlayingAudio(null);
    } else {
      // Play
      if (isPlayingAudio) {
        const currentAudio = audioRefs.current[isPlayingAudio];
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      }
      
      const audio = new Audio(url);
      audioRefs.current[attachmentId] = audio;
      audio.play();
      setIsPlayingAudio(attachmentId);

      audio.onended = () => {
        setIsPlayingAudio(null);
      };
    }
  };

  const saveChatToDatabase = async (showToast = true, retryCount = 0) => {
    if (messages.length === 0) return;

    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second

    try {
      setIsSaving(true);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          chatId: chatId || undefined, // Send chatId if exists
          customerInfo,
          messages: messages.map((msg) => ({
            id: msg.id,
            text: msg.text,
            sender: msg.sender,
            timestamp: msg.timestamp.toISOString(),
            attachments: msg.attachments ? msg.attachments.filter((att: Attachment) => {
              const url = att.url;
              // Only include attachments with valid URLs (not blob or data URLs)
              return url && 
                     !url.startsWith('blob:') && 
                     !url.startsWith('data:') &&
                     (url.startsWith('http') || url.startsWith('/'));
            }) : [],
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "خطا در ذخیره چت" }));
        throw new Error(error.error || "خطا در ذخیره چت");
      }

      const data = await response.json();
      if (data.data.chatId) {
        setChatId(data.data.chatId);
        if (typeof window !== "undefined") {
          localStorage.setItem("quickBuyChat_chatId", data.data.chatId);
        }
      }

      if (showToast) {
        toast({
          title: "ذخیره شد",
          description: "پیام‌های شما با موفقیت ذخیره شدند",
        });
      }
    } catch (error: any) {
      logger.error("Error saving chat:", error);
      
      // Retry logic for network errors or 5xx errors
      if (retryCount < MAX_RETRIES && (
        error.message?.includes("fetch") || 
        error.message?.includes("network") ||
        error.message?.includes("timeout") ||
        error.code === "NETWORK_ERROR"
      )) {
        // Exponential backoff
        const delay = RETRY_DELAY * Math.pow(2, retryCount);
        logger.debug(`Retrying save in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        
        setTimeout(() => {
          saveChatToDatabase(showToast, retryCount + 1);
        }, delay);
        return;
      }

      if (showToast) {
        toast({
          title: "خطا در ذخیره",
          description: error.message || "لطفاً دوباره تلاش کنید",
          variant: "destructive",
        });
      }
    } finally {
      if (retryCount === 0) {
        // Only set saving to false if not retrying
        setIsSaving(false);
      }
    }
  };

  // Handle reply
  const handleReply = (msg: Message) => {
    setReplyingTo(msg);
    setEditingMessage(null);
  };

  // Handle edit
  const handleEdit = (msg: Message) => {
    setEditingMessage(msg);
    setReplyingTo(null);
    setMessage(msg.text || "");
  };

  // Handle delete
  const handleDelete = async (messageId: string) => {
    try {
      const response = await fetch(`/api/chat/message/${messageId}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (response.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        toast({
          title: "موفق",
          description: "پیام با موفقیت حذف شد",
        });
      } else {
        throw new Error("خطا در حذف پیام");
      }
    } catch (error) {
      logger.error("Error deleting message:", error);
      toast({
        title: "خطا",
        description: "خطا در حذف پیام",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    // IMPORTANT: Read from textarea ref first (IME/composition can make React state lag behind)
    const currentText = (textareaRef.current?.value ?? message) as string;
    if (!currentText.trim() && attachments.length === 0) return;

    // If editing, update the message instead of sending new one
    if (editingMessage) {
      try {
        const response = await fetch(`/api/chat/message/${editingMessage.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            text: currentText,
            attachments: attachments,
          }),
        });
        
        if (response.ok) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === editingMessage.id
                ? { ...msg, text: currentText, attachments: attachments }
                : msg
            )
          );
          setEditingMessage(null);
          setMessage("");
          setAttachments([]);
          toast({
            title: "موفق",
            description: "پیام ویرایش شد",
          });
        }
      } catch (error) {
        logger.error("Error editing message:", error);
        toast({
          title: "خطا",
          description: "خطا در ویرایش پیام",
          variant: "destructive",
        });
      }
      return;
    }

    // Filter out attachments with temporary URLs (only keep valid uploaded URLs)
    const validAttachments = attachments.filter(att => {
      const url = att.url;
      // Only keep attachments with valid URLs (not blob or data URLs)
      return url && 
             !url.startsWith('blob:') && 
             !url.startsWith('data:') &&
             (url.startsWith('http') || url.startsWith('/'));
    });

    // Don't send message if no valid attachments and no text
    if (!currentText.trim() && validAttachments.length === 0) {
      toast({
        title: "خطا",
        description: "لطفاً یک پیام یا فایل معتبر اضافه کنید",
        variant: "destructive",
      });
      return;
    }

    let messageText = currentText;
    if (replyingTo) {
      messageText = `در پاسخ به: ${replyingTo.text}\n\n${currentText}`;
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: messageText,
      sender: "user",
      timestamp: new Date(),
      attachments: validAttachments.length > 0 ? validAttachments : undefined,
      status: "sending",
    };

    // Add message to state IMMEDIATELY (optimistic update)
    setMessages((prev) => {
      const updated = [...prev, newMessage];
      // Update last polled message ID
      lastPolledMessageIdRef.current = newMessage.id;
      // Track user message for scroll behavior
      lastUserMessageIdRef.current = newMessage.id;
      // Also save to localStorage for global polling
      if (typeof window !== "undefined") {
        localStorage.setItem("quickBuyChat_lastMessageId", newMessage.id);
      }
      return updated;
    });
    
    // Scroll to bottom after adding message (force scroll for user messages)
    setTimeout(() => {
      scrollToBottom(false);
    }, 150);
    
    // Clear input immediately for better UX
    const messageAttachments = [...attachments];
    setMessage("");
    setAttachments([]);
    setShowAttachmentOptions(false);
    setReplyingTo(null);

    // Save to database
    try {
      setIsSaving(true);
      
      // Only send the NEW message (avoid re-sending whole history and triggering limits)
      const messageToSave = {
        id: newMessage.id,
        text: newMessage.text,
        sender: newMessage.sender,
        timestamp: newMessage.timestamp.toISOString(),
        status: "sent",
        attachments: (messageAttachments || []).filter((att: Attachment) => {
          const url = att.url;
          return (
            url &&
            !url.startsWith("blob:") &&
            !url.startsWith("data:") &&
            (url.startsWith("http") || url.startsWith("/"))
          );
        }),
      };
      
      // Log the new message being sent
      if (newMessage.attachments && newMessage.attachments.length > 0) {
        logger.debug(`📤 Sending new message with ${newMessage.attachments.length} attachment(s):`, 
          newMessage.attachments.map(att => ({ 
            id: att.id, 
            type: att.type, 
            url: att.url,
            name: att.name 
          }))
        );
      }
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          chatId: chatId || undefined,
          customerInfo,
          messages: [messageToSave],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "خطا در ذخیره پیام");
      }

      const data = await response.json();
      
      // Update chatId if provided
      if (data.data?.chatId) {
        setChatId(data.data.chatId);
        if (typeof window !== "undefined") {
          localStorage.setItem("quickBuyChat_chatId", data.data.chatId);
        }
      }
      
      // Get the actual saved message from response to get real status from database
      const savedMessage = data.data?.messages?.find((m: any) => m.id === newMessage.id);
      const actualStatus = savedMessage?.status || "sent";
      
      // Update message status from database response immediately
      setMessages((prev) => {
        return prev.map((msg) => 
          msg.id === newMessage.id 
            ? { ...msg, status: actualStatus as MessageStatus }
            : msg
        );
      });
      
      // Check admin status after sending message
      try {
        const adminStatusResponse = await fetch("/api/admin/presence");
        if (adminStatusResponse.ok) {
          const adminStatusData = await adminStatusResponse.json();
          if (adminStatusData.success && adminStatusData.data?.admins) {
            const isAdminOnline = Array.isArray(adminStatusData.data.admins) && adminStatusData.data.admins.length > 0;
            if (!isAdminOnline) {
              // Show persistent notification that admin is offline
              showMessageNotification("پشتیبانی", "پشتیبان در حال حاضر آنلاین نیست. پیام شما دریافت شده و در اسرع وقت پاسخ داده خواهد شد.", {
                onOpen: () => {
                  if (!isOpen) {
                    onOpenChange(true);
                  }
                },
                chatId: chatId || undefined,
                metadata: {
                  isAdminOffline: true,
                  isAdmin: false, // This is for user
                },
              });
            }
          }
        }
      } catch (adminError) {
        // Ignore admin status check errors
        logger.error("Error checking admin status:", adminError);
      }

      // Note: Status will be updated to "delivered" by admin when they open the chat (admin is online)
      // and to "read" when they view the messages. Status updates come from polling.
    } catch (error: any) {
      logger.error("Error saving message:", error);
      
      // Mark as failed so user sees it did NOT send
      setMessages((prev) => {
        return prev.map((msg) => 
          msg.id === newMessage.id 
            ? { ...msg, status: "failed" as MessageStatus }
            : msg
        );
      });
      
      // Restore input on error
      setMessage(messageText);
      setAttachments(messageAttachments);
      
      toast({
        title: "خطا",
        description: error.message || "خطا در ذخیره پیام. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }

    // پاسخ خودکار - فقط یک بار و فقط اگر قبلاً نمایش داده نشده
    if (!systemMessageShownRef.current) {
      setTimeout(async () => {
        const systemMessageId = `system-${Date.now()}`;
        systemMessageIdRef.current = systemMessageId;
        systemMessageShownRef.current = true;
        
        const autoReply: Message = {
          id: systemMessageId,
          text: "متشکرم! پیام شما دریافت شد. همکاران ما در اسرع وقت با شما تماس خواهند گرفت.",
          sender: "support",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, autoReply]);
        
        // Don't save system message to database - it's temporary
      }, 1000);
    }
  };

  const uploadFile = async (file: File, type: "image" | "file" | "audio", retryCount = 0): Promise<string> => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000; // 2 seconds

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/chat/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "خطا در آپلود فایل" }));
        throw new Error(error.error || "خطا در آپلود فایل");
      }

      const data = await response.json();
      return data.data.url;
    } catch (error: any) {
      logger.error("Error uploading file:", error);
      
      // Retry logic for network errors
      if (retryCount < MAX_RETRIES && (
        error.message?.includes("fetch") || 
        error.message?.includes("network") ||
        error.message?.includes("timeout") ||
        error.code === "NETWORK_ERROR" ||
        error.name === "TypeError"
      )) {
        const delay = RETRY_DELAY * Math.pow(2, retryCount);
        logger.debug(`Retrying file upload in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        
        // Show toast only on first failure
        if (retryCount === 0) {
          toast({
            title: "در حال تلاش مجدد...",
            description: "خطا در آپلود فایل. در حال تلاش مجدد...",
            duration: 2000,
          });
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return uploadFile(file, type, retryCount + 1);
      }

      toast({
        title: "خطا در آپلود فایل",
        description: error.message || "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        // Upload file to server
        const fileUrl = await uploadFile(file, type);
        
        const attachment: Attachment = {
          id: Date.now().toString() + Math.random(),
          type,
          name: file.name,
          size: file.size,
          url: fileUrl,
        };
        setAttachments((prev) => [...prev, attachment]);
      } catch (error) {
        // Error already handled in uploadFile
      }
    }

    e.target.value = "";
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => {
      const attachment = prev.find((a) => a.id === id);
      if (attachment?.url) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter((a) => a.id !== id);
    });
  };

  const handleLocationShare = () => {
    logger.info("handleLocationShare called");
    console.log("[Location Widget] handleLocationShare called");
    
    if (!navigator.geolocation) {
      logger.warn("Geolocation not supported");
      console.log("[Location Widget] Geolocation not supported");
      alert("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند");
      return;
    }

    // Check if we're on a secure origin (HTTPS or localhost)
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    console.log("[Location Widget] Protocol:", window.location.protocol, "Hostname:", window.location.hostname, "IsSecure:", isSecure);
    if (!isSecure) {
      logger.warn("Not on secure origin");
      console.log("[Location Widget] Not on secure origin");
      alert("برای استفاده از موقعیت‌یابی باید از HTTPS استفاده کنید. لطفاً از آدرس امن سایت استفاده کنید.");
      return;
    }

    logger.info("Requesting geolocation...");
    console.log("[Location Widget] Requesting geolocation...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        logger.info("Location received:", position.coords);
        console.log("[Location Widget] Position received:", position.coords);
        const attachment: Attachment = {
          id: Date.now().toString(),
          type: "location",
          url: `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`,
          name: "موقعیت مکانی",
        };
        console.log("[Location Widget] Adding attachment:", attachment);
        setAttachments((prev) => {
          const newAttachments = [...prev, attachment];
          console.log("[Location Widget] New attachments:", newAttachments);
          return newAttachments;
        });
        setShowAttachmentOptions(false);
        
        // Auto-send message with location attachment
        console.log("[Location Widget] Auto-sending message...");
        setTimeout(() => {
          handleSendMessage();
        }, 100);
      },
      (error) => {
        logger.error("Error getting location:", error);
        let errorMessage = "خطا در دریافت موقعیت مکانی";
        if (error.code === 1) {
          errorMessage = "دسترسی به موقعیت رد شد. لطفاً در تنظیمات مرورگر اجازه دسترسی به موقعیت را فعال کنید.";
        } else if (error.code === 2) {
          errorMessage = "موقعیت در دسترس نیست. لطفاً مطمئن شوید که GPS فعال است.";
        } else if (error.code === 3) {
          errorMessage = "دریافت موقعیت زمان‌بر شد. لطفاً دوباره تلاش کنید.";
        }
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSubmitInfo = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      return;
    }

    // Save customer info to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("quickBuyChat_customerInfo", JSON.stringify(customerInfo));
    }

    // Reset system message flag for new chat
    systemMessageShownRef.current = false;
    systemMessageIdRef.current = null;

    setStep("chat");
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: `سلام ${customerInfo.name}! اطلاعات شما ثبت شد. لطفاً محصول مورد نظر خود را ذکر کنید یا سوال خود را بپرسید.`,
      sender: "support",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, welcomeMessage]);

    // Save initial chat to database
    await saveChatToDatabase(false); // Don't show toast for welcome message
  };


  const renderContent = () => (
    <>
      <SheetHeader className="px-4 sm:px-6 py-2 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <SheetTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              خرید سریع
              {step === "chat" && (
                <OnlineStatusBadge isOnline={isOnline} lastSeen={lastSeen} showText={false} />
              )}
            </SheetTitle>
          </div>
          {step === "chat" && customerInfo.name && customerInfo.phone && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setStep("info");
                setMessages([
                  {
                    id: "1",
                    text: "سلام! خوش آمدید. برای خرید سریع لطفاً اطلاعات زیر را وارد کنید:",
                    sender: "support",
                    timestamp: new Date(),
                  },
                ]);
              }}
              className="h-8 w-8 rounded-lg hover:bg-primary/10 transition-colors"
              title="تغییر اطلاعات"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          )}
        </div>
      </SheetHeader>

      {step === "info" ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-gradient-to-b from-background via-background to-muted/10">
          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center pb-2"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-3 shadow-lg">
              <svg
                className="h-8 w-8 text-primary"
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
            <p className="text-sm text-muted-foreground leading-relaxed">
              لطفاً اطلاعات زیر را برای شروع خرید سریع وارد کنید
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                نام و نام خانوادگی
                <span className="text-destructive text-xs">*</span>
              </label>
              <div className="relative group">
                <Input
                  type="text"
                  placeholder="مثال: علی احمدی"
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, name: e.target.value })
                  }
                  className="pr-12 h-12 text-base border-2 border-border/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all bg-background/50 hover:bg-background"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-muted-foreground/60 group-focus-within:text-primary transition-colors"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                شماره تماس
                <span className="text-destructive text-xs">*</span>
              </label>
              <div className="relative group">
                <Input
                  type="tel"
                  placeholder="09123456789"
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }
                  className="pr-12 h-12 text-base border-2 border-border/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all bg-background/50 hover:bg-background"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Phone className="h-5 w-5 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                ایمیل
                <span className="text-xs text-muted-foreground font-normal">(اختیاری)</span>
              </label>
              <div className="relative group">
                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={customerInfo.email}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, email: e.target.value })
                  }
                  className="pr-12 h-12 text-base border-2 border-border/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all bg-background/50 hover:bg-background"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="pt-2"
          >
            <Button
              onClick={handleSubmitInfo}
              disabled={!customerInfo.name || !customerInfo.phone}
              className="w-full h-13 text-base font-semibold bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed rounded-xl"
            >
              <span className="flex items-center justify-center gap-2">
                ادامه
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                >
                  →
                </motion.div>
              </span>
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              با ادامه، شما شرایط و قوانین ما را می‌پذیرید
            </p>
          </motion.div>
        </div>
      ) : (
        <>
          <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6 bg-gradient-to-b from-background via-background/95 to-muted/5 scroll-smooth">
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
                <p className="text-muted-foreground text-base font-medium leading-relaxed">هنوز پیامی ارسال نشده است</p>
                <p className="text-muted-foreground/70 text-sm mt-2 leading-relaxed">پیام خود را بنویسید...</p>
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
                  ease: "easeOut"
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
                              <div className="flex items-center gap-2 p-2 bg-background/50 rounded">
                                <Mic className="h-3.5 w-3.5" />
                                <audio controls className="flex-1 h-7 text-xs">
                                  <source src={attachment.url} />
                                </audio>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                    <div className={`flex items-center gap-1.5 mt-1.5 pt-1.5 border-t ${
                      msg.sender === "user" 
                        ? "border-primary-foreground/20 justify-end" 
                        : "border-border/30 justify-start"
                    }`}>
                      <span className={`text-[10px] sm:text-xs ${
                          msg.sender === "user" 
                          ? "text-primary-foreground/70" 
                          : "text-muted-foreground"
                      }`}>
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
                            align={msg.sender === "user" ? "end" : "start"}
                            className="min-w-[140px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReply(msg);
                              }}
                              className="cursor-pointer"
                            >
                              <Reply className="h-4 w-4 ml-2" />
                              <span>پاسخ</span>
                            </DropdownMenuItem>
                            {msg.sender === "user" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(msg);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Edit2 className="h-4 w-4 ml-2" />
                                  <span>ویرایش</span>
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm("آیا مطمئن هستید که می‌خواهید این پیام را حذف کنید؟")) {
                                  handleDelete(msg.id);
                                }
                              }}
                              className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4 ml-2" />
                              <span>حذف</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
                    onClick={() => scrollToBottom(false)}
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
                    onClick={() => setShowPermissionGuide(false)}
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
                        onClick={stopRecording}
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
                        onClick={cancelRecording}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-lg"
                      >
                      <X className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("[Voice Widget] Save button clicked!");
                          alert("دکمه ذخیره ویس کلیک شد!");
                          saveRecording();
                        }}
                        size="sm"
                      className="h-7 px-3 text-xs rounded-lg"
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
                      imageInputRef.current?.click();
                      setShowAttachmentOptions(false);
                    }}
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
                  >
                  <Image className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowAttachmentOptions(false);
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
                      alert("دکمه لوکیشن کلیک شد!");
                      handleLocationShare();
                      setShowAttachmentOptions(false);
                    }}
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
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
                      alert("دکمه ویس کلیک شد!");
                      setShowAttachmentOptions(false);
                      if (isRecording) {
                        stopRecording();
                      } else {
                        const hasPermission = await checkMicrophonePermission();
                        if (!hasPermission) {
                          toast({
                            title: "نیاز به دسترسی میکروفون",
                            description: "برای ضبط صدا، لطفاً دسترسی میکروفون را در تنظیمات مرورگر فعال کنید.",
                            variant: "destructive",
                            duration: 5000,
                          });
                        }
                        startRecording();
                      }
                    }}
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
              onChange={(e) => handleFileSelect(e, "image")}
            />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e, "file")}
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
                                    {attachment.duration ? formatTime(attachment.duration) : "صدا"}
                                  </span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemoveAttachment(attachment.id)}
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
                    setMessage(e.target.value);
                    
                    // Clear existing timeout
                    if (typingTimeoutRef.current) {
                      clearTimeout(typingTimeoutRef.current);
                    }
                    
                    // Send typing status
                    if (e.target.value.trim().length > 0) {
                      sendTypingStatus(true);
                      
                      // Stop typing after 2 seconds of no input
                      typingTimeoutRef.current = setTimeout(() => {
                        sendTypingStatus(false);
                      }, 2000);
                    } else {
                      sendTypingStatus(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                      }
                      sendTypingStatus(false);
                      handleSendMessage();
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
                      setShowAttachmentOptions(!showAttachmentOptions);
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
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 text-primary animate-spin" />
                      ) : (
                    <Button
                      onClick={handleSendMessage}
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
        </>
      )}
    </>
  );

  return (
    <>
      <div data-chat-open={isOpen && step === "chat" ? "true" : "false"} style={{ display: "none" }} />
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
        <SheetContent
          side="left"
          className="w-full sm:w-[420px] md:w-[480px] p-0 flex flex-col border-l-2 border-border/40 bg-background shadow-2xl"
        >
          {renderContent()}
        </SheetContent>
      </Sheet>
    </>
  );
}
