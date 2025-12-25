"use client";

import { useEffect, useRef, useCallback } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { usePersistentNotifications } from "@/hooks/use-persistent-notifications";
import { logger } from "@/lib/logger-client";

interface UseGlobalChatPollingOptions {
  isUser?: boolean; // true for user chat, false for admin
  chatId?: string | null;
  onNewMessage?: (message: any, chatInfo?: any) => void;
}

export function useGlobalChatPolling({
  isUser = false,
  chatId,
  onNewMessage,
}: UseGlobalChatPollingOptions) {
  const { showNotification } = useNotifications();
  const { showMessageNotification } = usePersistentNotifications();
  const adminStatusRef = useRef<{ isOnline: boolean; lastChecked: number }>({
    isOnline: false,
    lastChecked: 0,
  });
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPolledMessageIdRef = useRef<string | null>(null);
  const lastPolledTimeRef = useRef<number>(0); // Start at 0, will be set on first poll
  const processedMessageIdsRef = useRef<Set<string>>(new Set());
  const notificationDebounceRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const lastNotificationTimeRef = useRef<Map<string, number>>(new Map());

  // Load last message ID from localStorage for user
  useEffect(() => {
    if (isUser && typeof window !== "undefined") {
      const savedChatId = localStorage.getItem("quickBuyChat_chatId");
      if (savedChatId && !chatId) {
        // Load last message ID from localStorage
        const savedLastMessageId = localStorage.getItem("quickBuyChat_lastMessageId");
        if (savedLastMessageId) {
          lastPolledMessageIdRef.current = savedLastMessageId;
        }
      }
    }
  }, [isUser, chatId]);

  // Check admin status
  const checkAdminStatus = useCallback(async (): Promise<boolean> => {
    try {
      const now = Date.now();
      // Cache admin status for 5 seconds
      if (now - adminStatusRef.current.lastChecked < 5000) {
        return adminStatusRef.current.isOnline;
      }

      const response = await fetch("/api/admin/presence");
      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      if (data.success && data.data?.admins && Array.isArray(data.data.admins)) {
        const isOnline = data.data.admins.length > 0;
        adminStatusRef.current = {
          isOnline,
          lastChecked: now,
        };
        return isOnline;
      }
      return false;
    } catch (error) {
      logger.error("Error checking admin status:", error);
      return false;
    }
  }, []);

  // Poll for new messages
  const pollForNewMessages = useCallback(async () => {
    try {
      let url = "";
      let currentChatId = chatId;

      if (isUser) {
        // For user: poll their own chat
        if (typeof window !== "undefined") {
          currentChatId = currentChatId || localStorage.getItem("quickBuyChat_chatId");
        }
        if (!currentChatId) {
          // No chat ID yet, skip polling
          return;
        }

        url = `/api/chat?chatId=${currentChatId}`;
        if (lastPolledMessageIdRef.current && lastPolledMessageIdRef.current !== "1") {
          url += `&lastMessageId=${lastPolledMessageIdRef.current}`;
        }
      } else {
        // For admin: poll all chats and find new messages
        url = `/api/chat`;
      }

      let response;
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        response = await fetch(url, {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
      } catch (fetchError) {
        // Network error or timeout - silently fail and retry next time
        if (fetchError instanceof Error) {
          // Only log non-abort errors
          if (fetchError.name !== 'AbortError') {
            logger.warn("[Chat Polling] Network error (will retry):", fetchError.message);
          }
        }
        return;
      }

      if (!response.ok) {
        // Handle rate limiting (429) gracefully - back off and retry later
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const retrySeconds = retryAfter ? parseInt(retryAfter, 10) : 10;
          // Only log in development to avoid console spam
          if (process.env.NODE_ENV === 'development') {
            logger.warn(`[Chat Polling] Rate limited (429), will retry after ${retrySeconds}s`);
          }
          // Don't poll for a while - the interval will handle retry
          return;
        }
        // Don't log error for 401 (unauthorized) - user is not logged in, this is expected
        if (response.status === 401) {
          // Silently return - user needs to log in first
          return;
        }
        // Don't log error for 404 (chat not found) - this is expected for new chats
        if (response.status !== 404) {
          // Only log in development to avoid console spam
          if (process.env.NODE_ENV === 'development') {
            logger.error("Failed to fetch chat messages:", response.status);
          }
        }
        return;
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        logger.error("Error parsing chat response:", parseError);
        return;
      }

      if (isUser) {
        // Handle user polling - always check, but only show notification when chat is closed
        // Check if chat is open by checking if chat component is mounted
        const chatIsOpen = typeof window !== "undefined" && 
          document.querySelector('[data-chat-open="true"]') !== null;
        
        if (data.success && data.data?.messages && Array.isArray(data.data.messages)) {
          const allMessages = data.data.messages;
          
          // Filter for new support messages that haven't been processed
          const newMessages = allMessages.filter(
            (msg: any) => 
              msg.sender === "support" && 
              !processedMessageIdsRef.current.has(msg.id)
          );

          if (newMessages.length > 0) {
            const latestMessage = newMessages[newMessages.length - 1];
            const messageText = latestMessage.text || "پیام جدید دریافت شد";
            const previewText = messageText.length > 50 
              ? messageText.substring(0, 50) + "..." 
              : messageText;

            // Mark as processed
            newMessages.forEach((msg: any) => {
              processedMessageIdsRef.current.add(msg.id);
            });

            // Update last message ID to the latest message (not just new ones)
            // This ensures we don't miss messages
            const allMessageIds = allMessages.map((m: any) => m.id);
            if (allMessageIds.length > 0) {
              lastPolledMessageIdRef.current = allMessageIds[allMessageIds.length - 1];
              if (typeof window !== "undefined" && lastPolledMessageIdRef.current) {
                localStorage.setItem("quickBuyChat_lastMessageId", lastPolledMessageIdRef.current);
              }
            }

            // Check admin status before showing notification
            const isAdminOnline = await checkAdminStatus();

            // Only show notification if chat is closed
            if (!chatIsOpen) {
              // Prevent duplicate notifications with debouncing
              const notificationKey = `user-${currentChatId}-${latestMessage.id}`;
              const now = Date.now();
              const lastNotificationTime = lastNotificationTimeRef.current.get(notificationKey) || 0;
              
              // Skip if notification was shown recently (within 5 seconds)
              if (now - lastNotificationTime < 5000) {
                logger.debug(`[User Notification] ⏭️ Skipping duplicate notification for ${currentChatId}`);
                // Still call callback
                if (onNewMessage) {
                  onNewMessage(latestMessage, data.data.chat);
                }
                return;
              }

              // Clear existing debounce timeout if any
              const existingTimeout = notificationDebounceRef.current.get(notificationKey);
              if (existingTimeout) {
                clearTimeout(existingTimeout);
              }

              // Debounce notification to prevent spam
              const timeoutId = setTimeout(() => {
                logger.debug("New support message detected, showing notification:", previewText);
                
                // Update last notification time
                lastNotificationTimeRef.current.set(notificationKey, Date.now());
              
                // Show browser notification
                showNotification({
                  title: "پیام جدید از پشتیبانی",
                  body: previewText,
                  tag: `support-${latestMessage.id}`,
                  requireInteraction: false,
                  sound: true,
                }).catch((error) => {
                  logger.error("[User Notification] Error showing browser notification:", error);
                });

                // Show persistent notification
                showMessageNotification("پشتیبانی", previewText, {
                  onOpen: () => {
                    if (onNewMessage) {
                      onNewMessage(latestMessage);
                    }
                  },
                  chatId: currentChatId || undefined,
                  metadata: {
                    messageId: latestMessage.id,
                    chatId: currentChatId,
                    isAdminOffline: !isAdminOnline,
                    isAdmin: false, // This is for user
                  },
                });

                // Clean up timeout reference
                notificationDebounceRef.current.delete(notificationKey);
              }, 300); // 300ms debounce

              notificationDebounceRef.current.set(notificationKey, timeoutId);
            } else {
              logger.debug("New support message detected but chat is open, skipping notification");
            }

            // Call callback if provided
            if (onNewMessage) {
              onNewMessage(latestMessage, data.data.chat);
            }
          } else {
            // Update last message ID even if no new messages (to keep track)
            if (allMessages.length > 0) {
              const latestMessageId = allMessages[allMessages.length - 1].id;
              if (latestMessageId !== lastPolledMessageIdRef.current) {
                lastPolledMessageIdRef.current = latestMessageId;
                if (typeof window !== "undefined") {
                  localStorage.setItem("quickBuyChat_lastMessageId", latestMessageId);
                }
              }
            }
          }
        }
      } else {
        // Handle admin polling - check all chats for new user messages
        if (data.success && data.data?.chats && Array.isArray(data.data.chats)) {
          const chats = data.data.chats;
          logger.debug(`[Admin Polling] ✅ Polling active - Checking ${chats.length} chats for new messages`);

          // Check each chat for new messages
          for (const chat of chats) {
            try {
              // Use a time window of last 1 minute for initial polling, then use lastPolledTime
              const sinceTime = lastPolledTimeRef.current > 0 
                ? lastPolledTimeRef.current 
                : Date.now() - 60000; // 1 minute ago for first poll
              
              const sinceISO = new Date(sinceTime).toISOString();
              let chatResponse;
              try {
                // Create abort controller for timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout per chat
                
                chatResponse = await fetch(`/api/chat?chatId=${chat.id}&since=${sinceISO}`, {
                  signal: controller.signal,
                });
                
                clearTimeout(timeoutId);
              } catch (fetchError) {
                // Network error - skip this chat and continue with others
                if (process.env.NODE_ENV === 'development' && fetchError instanceof Error && fetchError.name !== 'AbortError') {
                  logger.warn(`[Admin Polling] Network error for chat ${chat.id} (will retry):`, fetchError.message);
                }
                continue;
              }
              
              if (!chatResponse.ok) {
                // Handle rate limiting (429) gracefully - skip this chat and continue with others
                if (chatResponse.status === 429) {
                  if (process.env.NODE_ENV === 'development') {
                    logger.warn(`[Admin Polling] Rate limited (429) for chat ${chat.id}, skipping this cycle`);
                  }
                  continue;
                }
                if (process.env.NODE_ENV === 'development') {
                  logger.warn(`[Admin Polling] Failed to fetch chat ${chat.id}:`, chatResponse.status);
                }
                continue;
              }

              const chatData = await chatResponse.json();
              if (chatData.success && chatData.data?.messages && Array.isArray(chatData.data.messages)) {
                const allMessages = chatData.data.messages;
                logger.debug(`[Admin Polling] Chat ${chat.id} (${chat.customerName}): Found ${allMessages.length} total messages`);

                // Filter for new user messages that haven't been processed
                // IMPORTANT: Only show notifications for messages FROM users (received messages), not FROM admin (sent messages)
                const newUserMessages = allMessages.filter(
                  (msg: any) => {
                    const isUserMessage = msg.sender === "user"; // Only messages from user, not from support/admin
                    const notProcessed = !processedMessageIdsRef.current.has(msg.id);
                    const isNew = new Date(msg.createdAt).getTime() > sinceTime;
                    
                    // Log for debugging
                    if (isNew && !isUserMessage) {
                      logger.debug(`[Admin Polling] Skipping message from ${msg.sender} (only user messages trigger notifications)`);
                    }
                    
                    return isUserMessage && notProcessed && isNew;
                  }
                );

                logger.debug(`[Admin Polling] Chat ${chat.id}: Found ${newUserMessages.length} new user messages (received from user)`);
                
                // Log if there are messages from admin/support that are being filtered out
                const adminMessages = allMessages.filter(
                  (msg: any) => msg.sender === "support" && new Date(msg.createdAt).getTime() > sinceTime
                );
                if (adminMessages.length > 0 && process.env.NODE_ENV === 'development') {
                  logger.debug(`[Admin Polling] Chat ${chat.id}: Found ${adminMessages.length} messages from admin/support (these will NOT trigger notifications)`);
                }

                if (newUserMessages.length > 0) {
                  // Only show notification for the latest message (minimal notifications)
                  const latestMessage = newUserMessages[newUserMessages.length - 1];
                  
                  // Double-check: Ensure this is a message FROM user (received), not FROM admin (sent)
                  if (latestMessage.sender !== "user") {
                    logger.warn(`[Admin Notification] ⚠️ Skipping notification - message sender is "${latestMessage.sender}", expected "user"`);
                    processedMessageIdsRef.current.add(latestMessage.id);
                    continue;
                  }
                  
                  // Check if we already processed this message
                  if (processedMessageIdsRef.current.has(latestMessage.id)) {
                    logger.debug(`[Admin Notification] Message ${latestMessage.id} already processed, skipping`);
                    continue;
                  }

                  // Check if this specific chat is currently selected/opened
                  // Similar to user: only show notification if this specific chat is NOT currently open
                  let thisChatIsOpen = false;
                  if (typeof window !== "undefined") {
                    // Method 1: Check localStorage (most reliable)
                    const storedSelectedChatId = localStorage.getItem('admin_selected_chat_id');
                    if (storedSelectedChatId) {
                      thisChatIsOpen = storedSelectedChatId === chat.id;
                    }
                    
                    // Method 2: Check data attribute as fallback
                    if (!thisChatIsOpen) {
                      const sheetElement = document.querySelector('[data-admin-chat-open="true"]');
                      if (sheetElement) {
                        const selectedChatId = sheetElement.getAttribute('data-selected-chat-id');
                        // Only consider chat open if selectedChatId matches AND is not empty
                        if (selectedChatId && selectedChatId !== "" && selectedChatId === chat.id) {
                          thisChatIsOpen = true;
                        }
                      }
                    }
                  }

                  logger.debug(`[Admin Notification] Chat ${chat.id} (${chat.customerName}): isOpen=${thisChatIsOpen}, messageId=${latestMessage.id}`);

                  // Always create notifications for admin, but mark them with the chat status
                  // The Notification Center will filter out notifications from the currently open chat
                  // This ensures notifications from other users always show, even when chatting with one user
                  
                  // Prevent duplicate notifications with debouncing
                  const notificationKey = `admin-${chat.id}-${latestMessage.id}`;
                  const now = Date.now();
                  const lastNotificationTime = lastNotificationTimeRef.current.get(notificationKey) || 0;
                  
                  // Skip if notification was shown recently (within 5 seconds)
                  if (now - lastNotificationTime < 5000) {
                    logger.debug(`[Admin Notification] ⏭️ Skipping duplicate notification for chat ${chat.id} (shown ${Math.round((now - lastNotificationTime) / 1000)}s ago)`);
                    // Still mark as processed and call callback
                    processedMessageIdsRef.current.add(latestMessage.id);
                    if (onNewMessage) {
                      onNewMessage(latestMessage, chat);
                    }
                    continue;
                  }

                  // Mark as processed immediately to prevent duplicate processing
                  processedMessageIdsRef.current.add(latestMessage.id);

                  // Notifications disabled for admin - only call callback
                  // Call callback if provided
                  if (onNewMessage) {
                    onNewMessage(latestMessage, chat);
                  }
                }
              } else {
                logger.warn(`[Admin Polling] Chat ${chat.id}: Invalid response format`, chatData);
              }
            } catch (error) {
              logger.error(`[Admin Polling] Error polling chat ${chat.id}:`, error);
            }
          }

          // Update last polled time
          lastPolledTimeRef.current = Date.now();
          logger.debug(`[Admin Polling] ✅ Polling completed, next poll in 3 seconds`);
        } else {
          logger.warn("[Admin Polling] Invalid response format or no chats found", data);
        }
      }
    } catch (error) {
      // Silently handle errors - polling will retry on next interval
      // Only log in development to avoid console spam
      if (process.env.NODE_ENV === 'development') {
        logger.error("Error polling for new messages:", error);
      }
    }
  }, [isUser, chatId, showNotification, showMessageNotification, onNewMessage, checkAdminStatus]);

  // Start polling
  useEffect(() => {
    // Only start polling if we have a chatId (for users) or if admin
    if (isUser) {
      const currentChatId = chatId || (typeof window !== "undefined" ? localStorage.getItem("quickBuyChat_chatId") : null);
      if (!currentChatId) {
        // No chat ID yet, don't start polling
        logger.debug("Global polling: No chatId found, skipping polling");
        return;
      }
      logger.debug("Global polling: Starting polling for chatId:", currentChatId);
    } else {
      logger.debug("Global polling: Starting admin polling");
    }

    // Start polling immediately
    logger.debug("[Admin Polling] Starting initial poll...");
    pollForNewMessages();

    // Optimized: Poll every 5 seconds (reduced from 3s to reduce server load)
    // When chat is open, it will poll more frequently (handled in chat component)
    pollingIntervalRef.current = setInterval(() => {
      pollForNewMessages();
    }, 5000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      // Clean up notification debounce timers
      notificationDebounceRef.current.forEach((timeout) => clearTimeout(timeout));
      notificationDebounceRef.current.clear();
    };
  }, [pollForNewMessages, isUser, chatId]);


  return {
    stopPolling: () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      // Clean up notification debounce timers
      notificationDebounceRef.current.forEach((timeout) => clearTimeout(timeout));
      notificationDebounceRef.current.clear();
    },
  };
}

