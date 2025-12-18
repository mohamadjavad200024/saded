"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  Search,
  User,
  Phone,
  Mail,
  X,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAdminPresence } from "@/hooks/use-admin-presence";
import { OnlineStatusBadge } from "@/components/chat/online-status-badge";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { Badge } from "@/components/ui/badge";
import { useChatUtils } from "@/hooks/use-chat-utils";
import { useChatMessaging, type Message } from "@/hooks/use-chat-messaging";
import { MessageBubble } from "@/components/chat/message-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { logger } from "@/lib/logger-client";

interface Chat {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

interface AdminChatProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminChat({ isOpen, onOpenChange }: AdminChatProps) {
  const { toast } = useToast();
  const { setOnline, isOnline } = useAdminPresence({
    enabled: true,
    heartbeatInterval: 15000,
  });
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const typingPollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  // Use shared hooks
  const chatUtils = useChatUtils();
  const chatMessaging = useChatMessaging({
    chatId: selectedChat?.id || null,
    sender: "support",
    customerInfo: selectedChat ? {
      name: selectedChat.customerName,
      phone: selectedChat.customerPhone,
      email: selectedChat.customerEmail,
    } : undefined,
    onMessageSent: () => {
      loadChats();
      if (selectedChat) {
        loadMessages(selectedChat.id, false);
      }
    },
  });

  // Load chats list
  const loadChats = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const response = await fetch("/api/chat", { credentials: "include" });
      if (!response.ok) {
        const errorText = await response.text();
        logger.error("Failed to load chats:", response.status, errorText);
        throw new Error("خطا در بارگذاری چت‌ها");
      }
      
      const data = await response.json();
      logger.info("Loaded chats:", data.success ? data.data.chats?.length : 0, "chats");
      if (data.success && data.data.chats) {
        const chatsWithLastMessage = await Promise.all(
          data.data.chats.map(async (chat: Chat) => {
            try {
              const msgResponse = await fetch(`/api/chat?chatId=${chat.id}`, { credentials: "include" });
              if (msgResponse.ok) {
                const msgData = await msgResponse.json();
                if (msgData.success && msgData.data.messages) {
                  const msgs = msgData.data.messages;
                  const lastMsg = msgs[msgs.length - 1];
                  return {
                    ...chat,
                    lastMessage: lastMsg?.text || "",
                    lastMessageTime: lastMsg?.createdAt || chat.updatedAt,
                    unreadCount: chat.unreadCount || 0,
                  };
                }
              }
            } catch (error) {
              logger.error("Error loading last message:", error);
            }
            return { ...chat, unreadCount: chat.unreadCount || 0 };
          })
        );
        setChats(chatsWithLastMessage);
      }
    } catch (error) {
      logger.error("Error loading chats:", error);
      if (showLoading) {
        toast({
          title: "خطا",
          description: "خطا در بارگذاری چت‌ها",
          variant: "destructive",
        });
      }
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [toast]);

  // Silent refresh
  const silentRefreshChats = useCallback(async () => {
    try {
      const response = await fetch("/api/chat", { credentials: "include" });
      if (!response.ok) return;
      
      const data = await response.json();
      if (data.success && data.data.chats) {
        const chatPromises = data.data.chats.map(async (chat: Chat) => {
          try {
            const msgResponse = await fetch(`/api/chat?chatId=${chat.id}`, { credentials: "include" });
            if (msgResponse.ok) {
              const msgData = await msgResponse.json();
              if (msgData.success && msgData.data.messages) {
                const msgs = msgData.data.messages;
                const lastMsg = msgs[msgs.length - 1];
                return {
                  ...chat,
                  lastMessage: lastMsg?.text || "",
                  lastMessageTime: lastMsg?.createdAt || chat.updatedAt,
                  unreadCount: chat.unreadCount || 0,
                };
              }
            }
          } catch (error) {
            // Silent fail
          }
          return { ...chat, unreadCount: chat.unreadCount || 0 };
        });
        
        const results = await Promise.allSettled(chatPromises);
        const updatedChats = results
          .filter((r): r is PromiseFulfilledResult<Chat> => r.status === "fulfilled")
          .map((r) => r.value);
        
        setChats((prevChats) => {
          const chatMap = new Map(updatedChats.map((c) => [c.id, c]));
          const existingIds = new Set(prevChats.map((c) => c.id));
          
          const mergedChats = prevChats.map((c) => {
            const updated = chatMap.get(c.id);
            if (updated && (
              updated.unreadCount !== c.unreadCount ||
              updated.lastMessage !== c.lastMessage ||
              updated.lastMessageTime !== c.lastMessageTime
            )) {
              return { ...c, ...updated };
            }
            return c;
          });
          
          updatedChats.forEach((c) => {
            if (!existingIds.has(c.id)) {
              mergedChats.push(c);
            }
          });
          
          return mergedChats;
        });
      }
    } catch (error) {
      // Silent fail
    }
  }, []);

  // Load messages
  const loadMessages = useCallback(async (chatId: string, isInitial = false) => {
    try {
      if (isInitial) setIsLoading(true);
      
      let url = `/api/chat?chatId=${chatId}`;
      if (!isInitial && lastMessageIdRef.current) {
        url += `&lastMessageId=${lastMessageIdRef.current}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("خطا در بارگذاری پیام‌ها");
      
      const data = await response.json();
      if (data.success && data.data.messages) {
        const formattedMessages: Message[] = data.data.messages.map((msg: any) => {
          let attachments: any[] = [];
          if (msg.attachments) {
            if (Array.isArray(msg.attachments)) {
              attachments = msg.attachments;
            } else if (typeof msg.attachments === 'string') {
              try {
                const parsed = JSON.parse(msg.attachments);
                attachments = Array.isArray(parsed) ? parsed : [parsed];
              } catch (e) {
                logger.error("Error parsing attachments:", e);
              }
            }
          }
          
          return {
            id: msg.id,
            text: msg.text || "",
            sender: msg.sender as "user" | "support",
            timestamp: new Date(msg.createdAt),
            attachments: attachments,
            status: msg.status || (msg.sender === "user" ? "sent" : undefined),
          };
        });
        
        if (selectedChat) {
          try {
            const unreadResponse = await fetch(`/api/chat/unread-count?chatId=${selectedChat.id}`);
            if (unreadResponse.ok) {
              const unreadData = await unreadResponse.json();
              if (unreadData.success && unreadData.data) {
                const unreadCount = unreadData.data.unreadCount || 0;
                setChats((prevChats) =>
                  prevChats.map((c) =>
                    c.id === selectedChat.id ? { ...c, unreadCount } : c
                  )
                );
              }
            }
          } catch (error) {
            // Silent fail
          }
        }
        
        if (isInitial) {
          setMessages(formattedMessages);
          if (formattedMessages.length > 0) {
            lastMessageIdRef.current = formattedMessages[formattedMessages.length - 1].id;
          }
        } else {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newMessages = formattedMessages.filter((msg) => !existingIds.has(msg.id));
            if (newMessages.length > 0) {
              lastMessageIdRef.current = newMessages[newMessages.length - 1].id;
              return [...prev, ...newMessages];
            }
            return prev;
          });
        }
      }
    } catch (error) {
      logger.error("Error loading messages:", error);
      if (isInitial) {
        toast({
          title: "خطا",
          description: "خطا در بارگذاری پیام‌ها",
          variant: "destructive",
        });
      }
    } finally {
      if (isInitial) setIsLoading(false);
    }
  }, [selectedChat, toast]);

  // Mark messages as delivered/read
  const markUserMessagesAsDelivered = useCallback(async (chatId: string) => {
    try {
      await fetch("/api/chat/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ chatId, sender: "support", action: "delivered" }),
      });
    } catch (error) {
      // Silent fail
    }
  }, []);

  const markUserMessagesAsRead = useCallback(async (chatId: string) => {
    try {
      await fetch("/api/chat/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ chatId, sender: "support", action: "read" }),
      });
    } catch (error) {
      // Silent fail
    }
  }, []);

  // Handle chat selection
  const handleSelectChat = useCallback(async (chat: Chat) => {
    setSelectedChat(chat);
    lastMessageIdRef.current = null;
    
    if (typeof window !== "undefined") {
      localStorage.setItem('admin_selected_chat_id', chat.id);
      window.dispatchEvent(new CustomEvent('chatOpened', { detail: { chatId: chat.id } }));
    }
    
    markUserMessagesAsRead(chat.id).catch(() => {});
    markUserMessagesAsDelivered(chat.id);
    loadMessages(chat.id, true);
    
    setChats((prevChats) =>
      prevChats.map((c) =>
        c.id === chat.id ? { ...c, unreadCount: 0 } : c
      )
    );
  }, [loadMessages, markUserMessagesAsRead, markUserMessagesAsDelivered]);

  // Check typing status
  const checkUserTyping = useCallback(async () => {
    if (!selectedChat) return;
    try {
      const response = await fetch(`/api/chat/typing?chatId=${selectedChat.id}&sender=user`, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsUserTyping(data.data.isTyping || false);
        }
      }
    } catch (error) {
      // Silent fail
    }
  }, [selectedChat]);

  // Handle reply
  const handleReply = useCallback((message: Message) => {
    setReplyingTo(message);
    setEditingMessage(null);
  }, []);

  // Handle edit
  const handleEdit = useCallback((message: Message) => {
    setEditingMessage(message);
    setReplyingTo(null);
    chatMessaging.handleMessageChange({ target: { value: message.text || "" } } as React.ChangeEvent<HTMLTextAreaElement>);
  }, [chatMessaging]);

  // Handle delete
  const handleDelete = useCallback(async (messageId: string) => {
    if (!selectedChat) return;
    
    try {
      const response = await fetch(`/api/chat/message/${messageId}`, {
        method: "DELETE",
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
  }, [selectedChat, toast]);


  // Handle send message
  const handleSend = useCallback(async () => {
    if (!selectedChat) return;
    
    // If editing, update the message instead of sending new one
    if (editingMessage) {
      try {
        const response = await fetch(`/api/chat/message/${editingMessage.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: chatMessaging.message,
            attachments: chatUtils.attachments,
          }),
        });
        
        if (response.ok) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === editingMessage.id
                ? { ...msg, text: chatMessaging.message, attachments: chatUtils.attachments }
                : msg
            )
          );
          setEditingMessage(null);
          chatMessaging.handleMessageChange({ target: { value: "" } } as React.ChangeEvent<HTMLTextAreaElement>);
          chatUtils.setAttachments([]);
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
    
    const sentMessage = await chatMessaging.handleSend(chatUtils.attachments, replyingTo);
    if (sentMessage) {
      setMessages((prev) => [...prev, sentMessage]);
      chatUtils.setAttachments([]);
      chatUtils.setShowAttachmentOptions(false);
      setReplyingTo(null);
      
      // Scroll to bottom after sending message
      setTimeout(() => {
        scrollToBottom(false);
        // Check position after scroll to hide button
        setTimeout(() => {
          checkScrollPosition();
        }, 500);
      }, 150);
      
      // Save audio recording if exists
      if (chatUtils.audioBlob && chatUtils.audioUrl) {
        const audioAttachment = await chatUtils.saveRecording();
        if (audioAttachment) {
          // Audio will be added to next message
        }
      }
    }
  }, [selectedChat, chatMessaging, chatUtils, editingMessage, replyingTo, toast]);

  // Check if user is scrolled up
  const checkScrollPosition = useCallback(() => {
    if (!messagesContainerRef.current || !selectedChat) {
      setShowScrollToBottom(false);
      return;
    }
    const container = messagesContainerRef.current;
    const threshold = 150; // 150px threshold
    const scrollBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    const isScrolledUp = scrollBottom > threshold;
    setShowScrollToBottom(isScrolledUp);
  }, [selectedChat]);

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
    if (!container || !selectedChat) {
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
  }, [selectedChat, checkScrollPosition, messages.length]);

  // Scroll to bottom when chat is selected (first time)
  const hasScrolledOnSelectRef = useRef<boolean>(false);
  useEffect(() => {
    if (selectedChat && messages.length > 0 && !hasScrolledOnSelectRef.current) {
      hasScrolledOnSelectRef.current = true;
      // Instant scroll when opening a chat
      const timeout = setTimeout(() => {
        scrollToBottom(true);
        // Check position after scroll to hide button
        setTimeout(() => {
          checkScrollPosition();
        }, 500);
      }, 200);
      return () => clearTimeout(timeout);
    } else if (!selectedChat) {
      hasScrolledOnSelectRef.current = false;
    }
  }, [selectedChat, messages.length, scrollToBottom, checkScrollPosition]);

  // Check position when messages change
  useEffect(() => {
    if (messages.length > 0 && selectedChat) {
      const timeout = setTimeout(() => {
        checkScrollPosition();
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [messages.length, checkScrollPosition, selectedChat]);

  // Poll for new messages
  useEffect(() => {
    if (!selectedChat || !isOpen) {
      setIsUserTyping(false);
      if (typingPollIntervalRef.current) {
        clearInterval(typingPollIntervalRef.current);
        typingPollIntervalRef.current = null;
      }
      return;
    }

    markUserMessagesAsDelivered(selectedChat.id);
    markUserMessagesAsRead(selectedChat.id).catch(() => {});

    checkUserTyping();
    // Optimized: Check typing status every 3 seconds (reduced from 2s)
    typingPollIntervalRef.current = setInterval(() => {
      checkUserTyping();
    }, 3000);

    // Optimized: Poll messages every 5 seconds (reduced from 3s to reduce server load)
    const interval = setInterval(() => {
      loadMessages(selectedChat.id, false);
      markUserMessagesAsDelivered(selectedChat.id);
      markUserMessagesAsRead(selectedChat.id).catch(() => {});
    }, 5000);

    return () => {
      clearInterval(interval);
      if (typingPollIntervalRef.current) {
        clearInterval(typingPollIntervalRef.current);
        typingPollIntervalRef.current = null;
      }
    };
  }, [selectedChat, isOpen, checkUserTyping, loadMessages, markUserMessagesAsDelivered, markUserMessagesAsRead]);

  // Load chats on open
  useEffect(() => {
    if (isOpen) {
      loadChats(true);
      setSelectedChat(null);
      setMessages([]);
      if (typeof window !== "undefined") {
        localStorage.removeItem('admin_selected_chat_id');
        window.dispatchEvent(new CustomEvent('chatClosed'));
      }
      setOnline(true);
      
      // Optimized: Refresh chat list every 15 seconds (reduced from 10s)
      const chatListInterval = setInterval(() => {
        silentRefreshChats();
      }, 15000);
      
      return () => {
        clearInterval(chatListInterval);
      };
    } else {
      setOnline(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem('admin_selected_chat_id');
        window.dispatchEvent(new CustomEvent('chatClosed'));
      }
    }
  }, [isOpen, setOnline, silentRefreshChats, loadChats]);

  // Listen for openChat event
  useEffect(() => {
    const handleOpenChat = async (event: Event) => {
      const customEvent = event as CustomEvent<{ chatId: string }>;
      const { chatId } = customEvent.detail;
      if (!chatId) return;

      if (!isOpen) {
        onOpenChange(true);
      }

      setTimeout(async () => {
        if (chats.length === 0) {
          await loadChats();
        }
        const chat = chats.find((c) => c.id === chatId);
        if (chat) {
          handleSelectChat(chat);
        } else {
          try {
            const response = await fetch(`/api/chat?chatId=${chatId}`, { credentials: "include" });
            if (response.ok) {
              const data = await response.json();
              if (data.success && data.data) {
                const chatInfo: Chat = {
                  id: data.data.id,
                  customerName: data.data.customerName || "کاربر",
                  customerPhone: data.data.customerPhone || "",
                  status: data.data.status || "active",
                  createdAt: data.data.createdAt || new Date().toISOString(),
                  updatedAt: data.data.updatedAt || new Date().toISOString(),
                  lastMessage: data.data.lastMessage || "",
                  lastMessageTime: data.data.lastMessageTime,
                };
                handleSelectChat(chatInfo);
              }
            }
          } catch (error) {
            logger.error("Error loading chat:", error);
          }
        }
      }, 300);
    };

    window.addEventListener("openChat", handleOpenChat as EventListener);
    return () => {
      window.removeEventListener("openChat", handleOpenChat as EventListener);
    };
  }, [isOpen, chats, onOpenChange, loadChats, handleSelectChat]);

  // Request notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  const filteredChats = chats.filter((chat) =>
    chat.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.customerPhone.includes(searchQuery)
  );

  return (
    <Sheet 
      open={isOpen} 
      onOpenChange={onOpenChange}
      data-admin-chat-open={isOpen ? "true" : "false"}
      data-selected-chat-id={selectedChat?.id || ""}
    >
      <SheetContent
        side="left"
        className="w-full sm:w-[500px] md:w-[600px] p-0 flex flex-col shadow-2xl !h-screen !max-h-screen overflow-hidden"
      >
        {!selectedChat ? (
          <>
            <SheetHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/40 px-4 sm:px-6 py-2">
              <SheetTitle className="flex items-center gap-2 text-base font-semibold">
                <MessageCircle className="h-5 w-5" />
                چت‌های کاربران
              </SheetTitle>
              <div className="mt-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="جستجوی کاربر..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 h-9 text-sm border rounded-lg"
                  />
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 min-h-0 overflow-y-auto bg-gradient-to-b from-background to-muted/5">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <MessageCircle className="h-14 w-14 text-muted-foreground/50 mb-5" />
                  <p className="text-muted-foreground text-base font-medium leading-relaxed">چتی یافت نشد</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {filteredChats.map((chat) => (
                    <motion.button
                      key={chat.id}
                      onClick={() => handleSelectChat(chat)}
                      className={`w-full p-5 text-right hover:bg-muted/50 transition-all duration-200 rounded-lg ${
                        chat.unreadCount && chat.unreadCount > 0 
                          ? "bg-primary/5 border-r-4 border-primary shadow-md" 
                          : "hover:shadow-sm"
                      }`}
                      whileHover={{ backgroundColor: chat.unreadCount && chat.unreadCount > 0 ? "rgba(var(--primary), 0.1)" : "rgba(0,0,0,0.05)" }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-md border-2 border-primary/30">
                          <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <p className={`font-semibold text-sm sm:text-base truncate leading-tight ${
                                chat.unreadCount && chat.unreadCount > 0 ? "font-bold" : ""
                              }`}>
                                {chat.customerName}
                              </p>
                              {chat.unreadCount && chat.unreadCount > 0 && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                >
                                  <Badge
                                    variant="destructive"
                                    className="h-6 w-6 px-0 text-xs font-bold flex-shrink-0 shadow-lg animate-pulse flex items-center justify-center"
                                  >
                                    !
                                  </Badge>
                                </motion.div>
                              )}
                            </div>
                            {chat.lastMessageTime && (
                              <span className="text-xs text-muted-foreground flex-shrink-0 mr-2 font-medium">
                                {new Date(chat.lastMessageTime).toLocaleDateString("fa-IR", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2.5 text-sm text-muted-foreground mb-1.5">
                            <Phone className="h-4 w-4" />
                            <span className="font-medium">{chat.customerPhone}</span>
                          </div>
                          {chat.lastMessage && (
                            <p className="text-sm text-muted-foreground mt-2 truncate leading-relaxed">
                              {chat.lastMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <SheetHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/40 px-4 sm:px-6 py-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async () => {
                    setSelectedChat(null);
                    setMessages([]);
                    lastMessageIdRef.current = null;
                    if (typeof window !== "undefined") {
                      localStorage.removeItem('admin_selected_chat_id');
                      window.dispatchEvent(new CustomEvent('chatClosed'));
                    }
                    await loadChats();
                  }}
                  className="h-8 w-8 rounded-lg hover:bg-muted/60 transition-all"
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <SheetTitle className="text-base font-semibold truncate">{selectedChat.customerName}</SheetTitle>
                    <OnlineStatusBadge isOnline={isOnline} showText={false} />
                  </div>
                </div>
              </div>
            </SheetHeader>

            <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 bg-gradient-to-b from-background via-background to-muted/5">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <MessageCircle className="h-14 w-14 text-muted-foreground/50 mb-5" />
                  <p className="text-muted-foreground text-base font-medium leading-relaxed">هنوز پیامی ارسال نشده است</p>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      index={index}
                      totalMessages={messages.length}
                      onReply={handleReply}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                  {isUserTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex justify-start items-end gap-2.5"
                    >
                      <TypingIndicator />
                    </motion.div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm border-t border-border/40 flex-shrink-0 relative pb-safe" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
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
              <ChatInput
                message={chatMessaging.message}
              onMessageChange={chatMessaging.handleMessageChange}
              onSend={handleSend}
              isSending={chatMessaging.isSending}
              attachments={chatUtils.attachments}
              onRemoveAttachment={chatUtils.handleRemoveAttachment}
              showAttachmentOptions={chatUtils.showAttachmentOptions}
              onToggleAttachmentOptions={() => chatUtils.setShowAttachmentOptions(!chatUtils.showAttachmentOptions)}
              isRecording={chatUtils.isRecording}
              recordingTime={chatUtils.recordingTime}
              audioUrl={chatUtils.audioUrl}
              onStartRecording={chatUtils.startRecording}
              onStopRecording={chatUtils.stopRecording}
              onCancelRecording={chatUtils.cancelRecording}
              onSaveRecording={async () => {
                const attachment = await chatUtils.saveRecording();
                if (attachment) {
                  chatUtils.setAttachments((prev) => [...prev, attachment]);
                }
              }}
              formatTime={chatUtils.formatTime}
              imageInputRef={chatUtils.imageInputRef}
              fileInputRef={chatUtils.fileInputRef}
              onFileSelect={chatUtils.handleFileSelect}
              onLocationShare={chatUtils.handleLocationShare}
              onCheckMicrophonePermission={chatUtils.checkMicrophonePermission}
              toast={toast}
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
