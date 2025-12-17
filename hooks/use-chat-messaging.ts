"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Attachment } from "./use-chat-utils";
import { logger } from "@/lib/logger-client";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
  attachments?: Attachment[];
  status?: "sending" | "sent" | "delivered" | "read";
}

interface UseChatMessagingOptions {
  chatId: string | null;
  sender: "user" | "support";
  customerInfo?: {
    name: string;
    phone: string;
    email?: string;
  };
  onMessageSent?: () => void;
}

export function useChatMessaging({
  chatId,
  sender,
  customerInfo,
  onMessageSent,
}: UseChatMessagingOptions) {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingPollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const sendTypingStatus = useCallback(async (typing: boolean) => {
    if (!chatId) return;
    
    try {
      await fetch("/api/chat/typing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          sender,
          isTyping: typing,
        }),
      });
    } catch (error) {
      logger.error("Error sending typing status:", error);
    }
  }, [chatId, sender]);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    if (!chatId) return;
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (e.target.value.trim().length > 0) {
      sendTypingStatus(true);
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingStatus(false);
      }, 2000);
    } else {
      sendTypingStatus(false);
    }
  }, [chatId, sendTypingStatus]);

  const checkTypingStatus = useCallback(async () => {
    if (!chatId) return;
    
    try {
      const response = await fetch(`/api/chat/typing?chatId=${chatId}&sender=${sender === "user" ? "support" : "user"}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsTyping(data.data.isTyping || false);
        }
      }
    } catch (error) {
      logger.error("Error checking typing status:", error);
    }
  }, [chatId, sender]);

  useEffect(() => {
    if (!chatId) {
      setIsTyping(false);
      if (typingPollIntervalRef.current) {
        clearInterval(typingPollIntervalRef.current);
        typingPollIntervalRef.current = null;
      }
      return;
    }

    checkTypingStatus();
    typingPollIntervalRef.current = setInterval(() => {
      checkTypingStatus();
    }, 2000);

    return () => {
      if (typingPollIntervalRef.current) {
        clearInterval(typingPollIntervalRef.current);
        typingPollIntervalRef.current = null;
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      sendTypingStatus(false);
    };
  }, [chatId, checkTypingStatus, sendTypingStatus]);

  const sendMessage = useCallback(async (
    text: string,
    attachments: Attachment[] = []
  ): Promise<Message | null> => {
    if ((!text.trim() && attachments.length === 0) || !chatId) return null;

    const validAttachments = attachments.filter(att => {
      const url = att.url;
      return url && 
             !url.startsWith('blob:') && 
             !url.startsWith('data:') &&
             (url.startsWith('http') || url.startsWith('/'));
    });

    if (!text.trim() && validAttachments.length === 0) {
      toast({
        title: "خطا",
        description: "لطفاً یک پیام یا فایل معتبر اضافه کنید",
        variant: "destructive",
      });
      return null;
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      sender,
      timestamp: new Date(),
      attachments: validAttachments.length > 0 ? validAttachments : undefined,
    };

    try {
      setIsSending(true);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      sendTypingStatus(false);

      const body: any = {
        chatId,
        messages: [{
          id: newMessage.id,
          text: newMessage.text,
          sender: newMessage.sender,
          timestamp: newMessage.timestamp.toISOString(),
          attachments: newMessage.attachments || [],
        }],
      };

      if (customerInfo) {
        body.customerInfo = customerInfo;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        const msg =
          errJson?.error ||
          (response.status === 429 ? "درخواست‌های شما زیاد است. لطفاً کمی بعد دوباره تلاش کنید." : null) ||
          "خطا در ارسال پیام";
        throw new Error(msg);
      }

      if (onMessageSent) {
        onMessageSent();
      }

      return newMessage;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        logger.error("Error sending message:", error);
      }
      toast({
        title: "خطا",
        description: error instanceof Error ? error.message : "خطا در ارسال پیام",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSending(false);
    }
  }, [chatId, sender, customerInfo, toast, onMessageSent, sendTypingStatus]);

  const handleSend = useCallback(async (attachments: Attachment[] = [], replyTo?: Message | null) => {
    let messageText = message;
    if (replyTo) {
      messageText = `در پاسخ به: ${replyTo.text}\n\n${message}`;
    }
    const sentMessage = await sendMessage(messageText, attachments);
    if (sentMessage) {
      setMessage("");
      return sentMessage;
    }
    return null;
  }, [message, sendMessage]);

  return {
    message,
    setMessage,
    isSending,
    isTyping,
    handleMessageChange,
    sendMessage,
    handleSend,
  };
}


