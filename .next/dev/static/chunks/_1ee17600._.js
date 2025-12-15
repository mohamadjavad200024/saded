(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/logger-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Client-side logger utility
 * For use in React components and hooks (browser environment)
 * Disables console.log in production for better performance
 */ __turbopack_context__.s([
    "logger",
    ()=>logger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
class ClientLogger {
    isDevelopment = ("TURBOPACK compile-time value", "object") !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || ("TURBOPACK compile-time value", "development") === 'development');
    shouldLog(level) {
        // Always log errors and warnings
        if (level === 'error' || level === 'warn') {
            return true;
        }
        // Only log other levels in development
        return this.isDevelopment;
    }
    log(...args) {
        if (this.shouldLog('log')) {
            console.log(...args);
        }
    }
    error(...args) {
        console.error(...args);
    }
    warn(...args) {
        console.warn(...args);
    }
    info(...args) {
        if (this.shouldLog('info')) {
            console.info(...args);
        }
    }
    debug(...args) {
        if (this.shouldLog('debug')) {
            console.debug(...args);
        }
    }
}
const logger = new ClientLogger();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-notifications.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useNotifications",
    ()=>useNotifications
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger-client.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function useNotifications() {
    _s();
    const [permission, setPermission] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("default");
    const lastNotificationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useNotifications.useEffect": ()=>{
            // Check if browser supports notifications
            if (("TURBOPACK compile-time value", "object") === "undefined" || !("Notification" in window)) {
                return;
            }
            // Get current permission
            setPermission(Notification.permission);
            // Request permission if not granted
            if (Notification.permission === "default") {
                Notification.requestPermission().then({
                    "useNotifications.useEffect": (perm)=>{
                        setPermission(perm);
                    }
                }["useNotifications.useEffect"]);
            }
        }
    }["useNotifications.useEffect"], []);
    const requestPermission = async ()=>{
        if (("TURBOPACK compile-time value", "object") === "undefined" || !("Notification" in window)) {
            return false;
        }
        if (Notification.permission === "granted") {
            return true;
        }
        const perm = await Notification.requestPermission();
        setPermission(perm);
        return perm === "granted";
    };
    // Play notification sound using Web Audio API
    const playNotificationSound = ()=>{
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            // Create a pleasant notification sound (two-tone beep)
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error playing notification sound:", error);
        }
    };
    const showNotification = async (options, preventDuplicate = true)=>{
        // Check if browser supports notifications
        if (("TURBOPACK compile-time value", "object") === "undefined" || !("Notification" in window)) {
            return;
        }
        // Request permission if needed
        if (Notification.permission !== "granted") {
            const granted = await requestPermission();
            if (!granted) {
                return;
            }
        }
        // Prevent duplicate notifications
        if (preventDuplicate && lastNotificationRef.current === options.tag) {
            return;
        }
        // Play sound if enabled (default: true)
        if (options.sound !== false) {
            playNotificationSound();
        }
        try {
            const notification = new Notification(options.title, {
                body: options.body,
                icon: options.icon || "/favicon.ico",
                badge: options.badge || "/favicon.ico",
                tag: options.tag,
                requireInteraction: options.requireInteraction || false,
                dir: "rtl",
                lang: "fa"
            });
            // Update last notification tag
            if (options.tag) {
                lastNotificationRef.current = options.tag;
            }
            // Auto close after 5 seconds
            setTimeout(()=>{
                notification.close();
            }, 5000);
            // Handle click
            notification.onclick = ()=>{
                window.focus();
                notification.close();
            };
            return notification;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error showing notification:", error);
        }
    };
    return {
        permission,
        requestPermission,
        showNotification,
        isSupported: ("TURBOPACK compile-time value", "object") !== "undefined" && "Notification" in window
    };
}
_s(useNotifications, "RbG9DDXAK3u1tfDIpPeloHlPTwQ=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/store/notification-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useNotificationStore",
    ()=>useNotificationStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger-client.ts [app-client] (ecmascript)");
"use client";
;
;
;
const useNotificationStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        notifications: [],
        addNotification: (notification)=>{
            // If notification has a custom ID in metadata, use it; otherwise generate one
            const customId = notification.metadata?.notificationId;
            const id = customId || `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            // Check if notification with same ID already exists (for chat messages)
            const existing = get().notifications.find((n)=>n.id === id);
            if (existing && !existing.dismissed) {
                // Update existing notification instead of creating duplicate
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug(`[Notification Store] Updating existing notification ${id}`);
                set((state)=>({
                        notifications: state.notifications.map((n)=>n.id === id ? {
                                ...n,
                                ...notification,
                                timestamp: Date.now(),
                                read: false,
                                dismissed: false
                            } : n)
                    }));
                return id;
            }
            const newNotification = {
                ...notification,
                id,
                timestamp: Date.now(),
                read: false,
                dismissed: false
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug(`[Notification Store] Adding new notification ${id}`, {
                type: newNotification.type,
                title: newNotification.title,
                chatId: newNotification.metadata?.chatId,
                isAdmin: newNotification.metadata?.isAdmin
            });
            set((state)=>({
                    notifications: [
                        newNotification,
                        ...state.notifications.filter((n)=>n.id !== id)
                    ].slice(0, 50)
                }));
            return id;
        },
        removeNotification: (id)=>{
            set((state)=>({
                    notifications: state.notifications.filter((n)=>n.id !== id)
                }));
        },
        markAsRead: (id)=>{
            set((state)=>({
                    notifications: state.notifications.map((n)=>n.id === id ? {
                            ...n,
                            read: true
                        } : n)
                }));
        },
        markAllAsRead: ()=>{
            set((state)=>({
                    notifications: state.notifications.map((n)=>({
                            ...n,
                            read: true
                        }))
                }));
        },
        dismissNotification: (id)=>{
            const notification = get().notifications.find((n)=>n.id === id);
            if (notification?.onDismiss) {
                notification.onDismiss();
            }
            set((state)=>({
                    notifications: state.notifications.filter((n)=>n.id !== id)
                }));
        },
        dismissAll: ()=>{
            set((state)=>({
                    notifications: state.notifications.filter((n)=>n.persistent)
                }));
        },
        getUnreadCount: ()=>{
            return get().notifications.filter((n)=>!n.read && !n.dismissed).length;
        },
        getUnreadCountExcludingChat: (chatId)=>{
            if (!chatId) {
                return get().getUnreadCount();
            }
            return get().notifications.filter((n)=>!n.read && !n.dismissed && !(n.metadata?.chatId === chatId && n.metadata?.isAdmin)).length;
        },
        getNotificationsExcludingChat: (chatId)=>{
            if (!chatId) {
                return get().notifications;
            }
            return get().notifications.filter((n)=>!(n.metadata?.chatId === chatId && n.metadata?.isAdmin));
        },
        clearAll: ()=>{
            set({
                notifications: []
            });
        }
    }), {
    name: "notification-storage",
    partialize: (state)=>({
            notifications: state.notifications.filter((n)=>n.read).slice(0, 20)
        })
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-persistent-notifications.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePersistentNotifications",
    ()=>usePersistentNotifications
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$notification$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/notification-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-notifications.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger-client.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function usePersistentNotifications() {
    _s();
    const { notifications, addNotification, removeNotification, markAsRead, markAllAsRead, dismissNotification, getUnreadCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$notification$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotificationStore"])();
    const { showNotification: showBrowserNotification } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotifications"])();
    // Play notification sound
    const playNotificationSound = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePersistentNotifications.useCallback[playNotificationSound]": (type, priority)=>{
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                // Different sounds based on priority and type
                if (priority === "urgent" || priority === "high") {
                    // Urgent sound: three quick beeps
                    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
                    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.3);
                    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.4);
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.5);
                } else {
                    // Normal sound: two-tone beep
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.3);
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error playing notification sound:", error);
            }
        }
    }["usePersistentNotifications.useCallback[playNotificationSound]"], []);
    // Vibrate device if supported
    const vibrateDevice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePersistentNotifications.useCallback[vibrateDevice]": (pattern)=>{
            if ("vibrate" in navigator) {
                try {
                    navigator.vibrate(pattern);
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error vibrating device:", error);
                }
            }
        }
    }["usePersistentNotifications.useCallback[vibrateDevice]"], []);
    const showNotification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePersistentNotifications.useCallback[showNotification]": (options)=>{
            const { type = "message", priority = "medium", title, message, sender, avatar, actions, onConfirm, onDismiss, metadata, persistent = true, sound = true, vibration = false } = options;
            // Play sound if enabled
            if (sound) {
                playNotificationSound(type, priority);
            }
            // Vibrate if enabled
            if (vibration && priority === "urgent") {
                vibrateDevice([
                    200,
                    100,
                    200
                ]);
            }
            // Show browser notification if permission granted
            showBrowserNotification({
                title,
                body: message,
                tag: `persistent-${Date.now()}`,
                requireInteraction: persistent,
                sound: false
            }).catch({
                "usePersistentNotifications.useCallback[showNotification]": ()=>{
                // Ignore if permission not granted
                }
            }["usePersistentNotifications.useCallback[showNotification]"]);
            // Add to persistent notification store
            const id = addNotification({
                type,
                priority,
                title,
                message,
                sender,
                avatar,
                actions,
                onConfirm,
                onDismiss,
                metadata,
                persistent,
                sound,
                vibration
            });
            return id;
        }
    }["usePersistentNotifications.useCallback[showNotification]"], [
        addNotification,
        playNotificationSound,
        vibrateDevice,
        showBrowserNotification
    ]);
    const showMessageNotification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePersistentNotifications.useCallback[showMessageNotification]": (sender, message, options)=>{
            const { avatar, onOpen, chatId, metadata } = options || {};
            // Use chatId as notification ID to update existing notifications for the same chat
            // This ensures we have one notification per chat that gets updated with new messages
            const notificationId = chatId ? `msg-${chatId}` : undefined;
            return showNotification({
                type: "message",
                priority: "high",
                title: `پیام جدید از ${sender}`,
                message,
                sender,
                avatar,
                persistent: true,
                sound: true,
                actions: chatId ? [
                    {
                        label: "مشاهده",
                        action: {
                            "usePersistentNotifications.useCallback[showMessageNotification]": ()=>{
                                // Dispatch custom event to open chat
                                const event = new CustomEvent("openChat", {
                                    detail: {
                                        chatId: chatId,
                                        isAdmin: metadata?.isAdmin !== false
                                    }
                                });
                                window.dispatchEvent(event);
                                // Also call onOpen if provided
                                if (onOpen) {
                                    onOpen();
                                }
                                // Mark as read and dismiss notification
                                if (notificationId) {
                                    markAsRead(notificationId);
                                    dismissNotification(notificationId);
                                }
                            }
                        }["usePersistentNotifications.useCallback[showMessageNotification]"],
                        variant: "default"
                    }
                ] : onOpen ? [
                    {
                        label: "مشاهده",
                        action: {
                            "usePersistentNotifications.useCallback[showMessageNotification]": ()=>{
                                if (onOpen) {
                                    onOpen();
                                }
                            }
                        }["usePersistentNotifications.useCallback[showMessageNotification]"],
                        variant: "default"
                    }
                ] : undefined,
                onConfirm: onOpen,
                metadata: {
                    chatId,
                    notificationId,
                    ...metadata
                }
            });
        }
    }["usePersistentNotifications.useCallback[showMessageNotification]"], [
        showNotification,
        markAsRead,
        dismissNotification
    ]);
    return {
        notifications: notifications.filter((n)=>!n.dismissed),
        showNotification,
        showMessageNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        unreadCount: getUnreadCount()
    };
}
_s(usePersistentNotifications, "3vTtvgL1IZHvsZ/q9lqRTzuz4k4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$notification$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotificationStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotifications"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-global-chat-polling.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useGlobalChatPolling",
    ()=>useGlobalChatPolling
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-notifications.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$persistent$2d$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-persistent-notifications.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger-client.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function useGlobalChatPolling({ isUser = false, chatId, onNewMessage }) {
    _s();
    const { showNotification } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotifications"])();
    const { showMessageNotification } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$persistent$2d$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePersistentNotifications"])();
    const adminStatusRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        isOnline: false,
        lastChecked: 0
    });
    const pollingIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastPolledMessageIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastPolledTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0); // Start at 0, will be set on first poll
    const processedMessageIdsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    const notificationDebounceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const lastNotificationTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    // Load last message ID from localStorage for user
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useGlobalChatPolling.useEffect": ()=>{
            if (isUser && ("TURBOPACK compile-time value", "object") !== "undefined") {
                const savedChatId = localStorage.getItem("quickBuyChat_chatId");
                if (savedChatId && !chatId) {
                    // Load last message ID from localStorage
                    const savedLastMessageId = localStorage.getItem("quickBuyChat_lastMessageId");
                    if (savedLastMessageId) {
                        lastPolledMessageIdRef.current = savedLastMessageId;
                    }
                }
            }
        }
    }["useGlobalChatPolling.useEffect"], [
        isUser,
        chatId
    ]);
    // Check admin status
    const checkAdminStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useGlobalChatPolling.useCallback[checkAdminStatus]": async ()=>{
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
                        lastChecked: now
                    };
                    return isOnline;
                }
                return false;
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error checking admin status:", error);
                return false;
            }
        }
    }["useGlobalChatPolling.useCallback[checkAdminStatus]"], []);
    // Poll for new messages
    const pollForNewMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useGlobalChatPolling.useCallback[pollForNewMessages]": async ()=>{
            try {
                let url = "";
                let currentChatId = chatId;
                if (isUser) {
                    // For user: poll their own chat
                    if ("TURBOPACK compile-time truthy", 1) {
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
                    const timeoutId = setTimeout({
                        "useGlobalChatPolling.useCallback[pollForNewMessages].timeoutId": ()=>controller.abort()
                    }["useGlobalChatPolling.useCallback[pollForNewMessages].timeoutId"], 10000); // 10 second timeout
                    response = await fetch(url, {
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);
                } catch (fetchError) {
                    // Network error or timeout - silently fail and retry next time
                    if (fetchError instanceof Error) {
                        // Only log non-abort errors
                        if (fetchError.name !== 'AbortError') {
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn("[Chat Polling] Network error (will retry):", fetchError.message);
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
                        if ("TURBOPACK compile-time truthy", 1) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn(`[Chat Polling] Rate limited (429), will retry after ${retrySeconds}s`);
                        }
                        // Don't poll for a while - the interval will handle retry
                        return;
                    }
                    // Don't log error for 404 (chat not found) - this is expected for new chats
                    if (response.status !== 404) {
                        // Only log in development to avoid console spam
                        if ("TURBOPACK compile-time truthy", 1) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Failed to fetch chat messages:", response.status);
                        }
                    }
                    return;
                }
                let data;
                try {
                    data = await response.json();
                } catch (parseError) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error parsing chat response:", parseError);
                    return;
                }
                if (isUser) {
                    // Handle user polling - always check, but only show notification when chat is closed
                    // Check if chat is open by checking if chat component is mounted
                    const chatIsOpen = ("TURBOPACK compile-time value", "object") !== "undefined" && document.querySelector('[data-chat-open="true"]') !== null;
                    if (data.success && data.data?.messages && Array.isArray(data.data.messages)) {
                        const allMessages = data.data.messages;
                        // Filter for new support messages that haven't been processed
                        const newMessages = allMessages.filter({
                            "useGlobalChatPolling.useCallback[pollForNewMessages].newMessages": (msg)=>msg.sender === "support" && !processedMessageIdsRef.current.has(msg.id)
                        }["useGlobalChatPolling.useCallback[pollForNewMessages].newMessages"]);
                        if (newMessages.length > 0) {
                            const latestMessage = newMessages[newMessages.length - 1];
                            const messageText = latestMessage.text || "پیام جدید دریافت شد";
                            const previewText = messageText.length > 50 ? messageText.substring(0, 50) + "..." : messageText;
                            // Mark as processed
                            newMessages.forEach({
                                "useGlobalChatPolling.useCallback[pollForNewMessages]": (msg)=>{
                                    processedMessageIdsRef.current.add(msg.id);
                                }
                            }["useGlobalChatPolling.useCallback[pollForNewMessages]"]);
                            // Update last message ID to the latest message (not just new ones)
                            // This ensures we don't miss messages
                            const allMessageIds = allMessages.map({
                                "useGlobalChatPolling.useCallback[pollForNewMessages].allMessageIds": (m)=>m.id
                            }["useGlobalChatPolling.useCallback[pollForNewMessages].allMessageIds"]);
                            if (allMessageIds.length > 0) {
                                lastPolledMessageIdRef.current = allMessageIds[allMessageIds.length - 1];
                                if (("TURBOPACK compile-time value", "object") !== "undefined" && lastPolledMessageIdRef.current) {
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
                                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug(`[User Notification] ⏭️ Skipping duplicate notification for ${currentChatId}`);
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
                                const timeoutId = setTimeout({
                                    "useGlobalChatPolling.useCallback[pollForNewMessages].timeoutId": ()=>{
                                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug("New support message detected, showing notification:", previewText);
                                        // Update last notification time
                                        lastNotificationTimeRef.current.set(notificationKey, Date.now());
                                        // Show browser notification
                                        showNotification({
                                            title: "پیام جدید از پشتیبانی",
                                            body: previewText,
                                            tag: `support-${latestMessage.id}`,
                                            requireInteraction: false,
                                            sound: true
                                        }).catch({
                                            "useGlobalChatPolling.useCallback[pollForNewMessages].timeoutId": (error)=>{
                                                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("[User Notification] Error showing browser notification:", error);
                                            }
                                        }["useGlobalChatPolling.useCallback[pollForNewMessages].timeoutId"]);
                                        // Show persistent notification
                                        showMessageNotification("پشتیبانی", previewText, {
                                            onOpen: {
                                                "useGlobalChatPolling.useCallback[pollForNewMessages].timeoutId": ()=>{
                                                    if (onNewMessage) {
                                                        onNewMessage(latestMessage);
                                                    }
                                                }
                                            }["useGlobalChatPolling.useCallback[pollForNewMessages].timeoutId"],
                                            chatId: currentChatId || undefined,
                                            metadata: {
                                                messageId: latestMessage.id,
                                                chatId: currentChatId,
                                                isAdminOffline: !isAdminOnline,
                                                isAdmin: false
                                            }
                                        });
                                        // Clean up timeout reference
                                        notificationDebounceRef.current.delete(notificationKey);
                                    }
                                }["useGlobalChatPolling.useCallback[pollForNewMessages].timeoutId"], 300); // 300ms debounce
                                notificationDebounceRef.current.set(notificationKey, timeoutId);
                            } else {
                                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug("New support message detected but chat is open, skipping notification");
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
                                    if ("TURBOPACK compile-time truthy", 1) {
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
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug(`[Admin Polling] ✅ Polling active - Checking ${chats.length} chats for new messages`);
                        // Check each chat for new messages
                        for (const chat of chats){
                            try {
                                // Use a time window of last 1 minute for initial polling, then use lastPolledTime
                                const sinceTime = lastPolledTimeRef.current > 0 ? lastPolledTimeRef.current : Date.now() - 60000; // 1 minute ago for first poll
                                const sinceISO = new Date(sinceTime).toISOString();
                                let chatResponse;
                                try {
                                    // Create abort controller for timeout
                                    const controller = new AbortController();
                                    const timeoutId = setTimeout({
                                        "useGlobalChatPolling.useCallback[pollForNewMessages].timeoutId": ()=>controller.abort()
                                    }["useGlobalChatPolling.useCallback[pollForNewMessages].timeoutId"], 5000); // 5 second timeout per chat
                                    chatResponse = await fetch(`/api/chat?chatId=${chat.id}&since=${sinceISO}`, {
                                        signal: controller.signal
                                    });
                                    clearTimeout(timeoutId);
                                } catch (fetchError) {
                                    // Network error - skip this chat and continue with others
                                    if (("TURBOPACK compile-time value", "development") === 'development' && fetchError instanceof Error && fetchError.name !== 'AbortError') {
                                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn(`[Admin Polling] Network error for chat ${chat.id} (will retry):`, fetchError.message);
                                    }
                                    continue;
                                }
                                if (!chatResponse.ok) {
                                    // Handle rate limiting (429) gracefully - skip this chat and continue with others
                                    if (chatResponse.status === 429) {
                                        if ("TURBOPACK compile-time truthy", 1) {
                                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn(`[Admin Polling] Rate limited (429) for chat ${chat.id}, skipping this cycle`);
                                        }
                                        continue;
                                    }
                                    if ("TURBOPACK compile-time truthy", 1) {
                                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn(`[Admin Polling] Failed to fetch chat ${chat.id}:`, chatResponse.status);
                                    }
                                    continue;
                                }
                                const chatData = await chatResponse.json();
                                if (chatData.success && chatData.data?.messages && Array.isArray(chatData.data.messages)) {
                                    const allMessages = chatData.data.messages;
                                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug(`[Admin Polling] Chat ${chat.id} (${chat.customerName}): Found ${allMessages.length} total messages`);
                                    // Filter for new user messages that haven't been processed
                                    // IMPORTANT: Only show notifications for messages FROM users (received messages), not FROM admin (sent messages)
                                    const newUserMessages = allMessages.filter({
                                        "useGlobalChatPolling.useCallback[pollForNewMessages].newUserMessages": (msg)=>{
                                            const isUserMessage = msg.sender === "user"; // Only messages from user, not from support/admin
                                            const notProcessed = !processedMessageIdsRef.current.has(msg.id);
                                            const isNew = new Date(msg.createdAt).getTime() > sinceTime;
                                            // Log for debugging
                                            if (isNew && !isUserMessage) {
                                                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug(`[Admin Polling] Skipping message from ${msg.sender} (only user messages trigger notifications)`);
                                            }
                                            return isUserMessage && notProcessed && isNew;
                                        }
                                    }["useGlobalChatPolling.useCallback[pollForNewMessages].newUserMessages"]);
                                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug(`[Admin Polling] Chat ${chat.id}: Found ${newUserMessages.length} new user messages (received from user)`);
                                    // Log if there are messages from admin/support that are being filtered out
                                    const adminMessages = allMessages.filter({
                                        "useGlobalChatPolling.useCallback[pollForNewMessages].adminMessages": (msg)=>msg.sender === "support" && new Date(msg.createdAt).getTime() > sinceTime
                                    }["useGlobalChatPolling.useCallback[pollForNewMessages].adminMessages"]);
                                    if (adminMessages.length > 0 && ("TURBOPACK compile-time value", "development") === 'development') {
                                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug(`[Admin Polling] Chat ${chat.id}: Found ${adminMessages.length} messages from admin/support (these will NOT trigger notifications)`);
                                    }
                                    if (newUserMessages.length > 0) {
                                        // Only show notification for the latest message (minimal notifications)
                                        const latestMessage = newUserMessages[newUserMessages.length - 1];
                                        // Double-check: Ensure this is a message FROM user (received), not FROM admin (sent)
                                        if (latestMessage.sender !== "user") {
                                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn(`[Admin Notification] ⚠️ Skipping notification - message sender is "${latestMessage.sender}", expected "user"`);
                                            processedMessageIdsRef.current.add(latestMessage.id);
                                            continue;
                                        }
                                        // Check if we already processed this message
                                        if (processedMessageIdsRef.current.has(latestMessage.id)) {
                                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug(`[Admin Notification] Message ${latestMessage.id} already processed, skipping`);
                                            continue;
                                        }
                                        // Check if this specific chat is currently selected/opened
                                        // Similar to user: only show notification if this specific chat is NOT currently open
                                        let thisChatIsOpen = false;
                                        if ("TURBOPACK compile-time truthy", 1) {
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
                                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug(`[Admin Notification] Chat ${chat.id} (${chat.customerName}): isOpen=${thisChatIsOpen}, messageId=${latestMessage.id}`);
                                        // Always create notifications for admin, but mark them with the chat status
                                        // The Notification Center will filter out notifications from the currently open chat
                                        // This ensures notifications from other users always show, even when chatting with one user
                                        // Prevent duplicate notifications with debouncing
                                        const notificationKey = `admin-${chat.id}-${latestMessage.id}`;
                                        const now = Date.now();
                                        const lastNotificationTime = lastNotificationTimeRef.current.get(notificationKey) || 0;
                                        // Skip if notification was shown recently (within 5 seconds)
                                        if (now - lastNotificationTime < 5000) {
                                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug(`[Admin Notification] ⏭️ Skipping duplicate notification for chat ${chat.id} (shown ${Math.round((now - lastNotificationTime) / 1000)}s ago)`);
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
                                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn(`[Admin Polling] Chat ${chat.id}: Invalid response format`, chatData);
                                }
                            } catch (error) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error(`[Admin Polling] Error polling chat ${chat.id}:`, error);
                            }
                        }
                        // Update last polled time
                        lastPolledTimeRef.current = Date.now();
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug(`[Admin Polling] ✅ Polling completed, next poll in 3 seconds`);
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn("[Admin Polling] Invalid response format or no chats found", data);
                    }
                }
            } catch (error) {
                // Silently handle errors - polling will retry on next interval
                // Only log in development to avoid console spam
                if ("TURBOPACK compile-time truthy", 1) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error polling for new messages:", error);
                }
            }
        }
    }["useGlobalChatPolling.useCallback[pollForNewMessages]"], [
        isUser,
        chatId,
        showNotification,
        showMessageNotification,
        onNewMessage,
        checkAdminStatus
    ]);
    // Start polling
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useGlobalChatPolling.useEffect": ()=>{
            // Only start polling if we have a chatId (for users) or if admin
            if (isUser) {
                const currentChatId = chatId || (("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("quickBuyChat_chatId") : "TURBOPACK unreachable");
                if (!currentChatId) {
                    // No chat ID yet, don't start polling
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug("Global polling: No chatId found, skipping polling");
                    return;
                }
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug("Global polling: Starting polling for chatId:", currentChatId);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug("Global polling: Starting admin polling");
            }
            // Start polling immediately
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug("[Admin Polling] Starting initial poll...");
            pollForNewMessages();
            // Optimized: Poll every 5 seconds (reduced from 3s to reduce server load)
            // When chat is open, it will poll more frequently (handled in chat component)
            pollingIntervalRef.current = setInterval({
                "useGlobalChatPolling.useEffect": ()=>{
                    pollForNewMessages();
                }
            }["useGlobalChatPolling.useEffect"], 5000);
            return ({
                "useGlobalChatPolling.useEffect": ()=>{
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                        pollingIntervalRef.current = null;
                    }
                    // Clean up notification debounce timers
                    notificationDebounceRef.current.forEach({
                        "useGlobalChatPolling.useEffect": (timeout)=>clearTimeout(timeout)
                    }["useGlobalChatPolling.useEffect"]);
                    notificationDebounceRef.current.clear();
                }
            })["useGlobalChatPolling.useEffect"];
        }
    }["useGlobalChatPolling.useEffect"], [
        pollForNewMessages,
        isUser,
        chatId
    ]);
    return {
        stopPolling: ()=>{
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
            // Clean up notification debounce timers
            notificationDebounceRef.current.forEach((timeout)=>clearTimeout(timeout));
            notificationDebounceRef.current.clear();
        }
    };
}
_s(useGlobalChatPolling, "4Sg/OvnY4WrLtyVmpbx4nJEzX3E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotifications"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$persistent$2d$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePersistentNotifications"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/chat/global-chat-polling.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GlobalChatPolling",
    ()=>GlobalChatPolling
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$global$2d$chat$2d$polling$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-global-chat-polling.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function GlobalChatPolling() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$global$2d$chat$2d$polling$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGlobalChatPolling"])({
        isUser: true,
        onNewMessage: {
            "GlobalChatPolling.useGlobalChatPolling": (message, chatInfo)=>{
            // Message handling is done in the hook
            // This callback can be used for additional actions if needed
            }
        }["GlobalChatPolling.useGlobalChatPolling"]
    });
    return null;
}
_s(GlobalChatPolling, "1hqNLqGV91FmDEqQna4ox+GggNQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$global$2d$chat$2d$polling$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGlobalChatPolling"]
    ];
});
_c = GlobalChatPolling;
var _c;
__turbopack_context__.k.register(_c, "GlobalChatPolling");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "getPlaceholderImage",
    ()=>getPlaceholderImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
const getPlaceholderImage = (width = 600, height = 600)=>{
    // Use placehold.co service for Next.js Image compatibility
    const text = encodeURIComponent(`${width}x${height}`);
    return `https://placehold.co/${width}x${height}/f3f4f6/9ca3af?text=${text}`;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90 border-[0.25px] border-primary/30",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border-[0.25px] border-foreground/30 bg-background text-foreground hover:bg-foreground hover:text-background",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-[0.25px] border-secondary/30",
            ghost: "hover:bg-foreground/10 text-foreground",
            link: "text-foreground underline-offset-4 hover:underline"
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 45,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center rounded-full border-[0.25px] px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
            secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
            destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
            outline: "text-foreground border-border/30",
            success: "border-transparent bg-green-500 text-white hover:bg-green-600",
            warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge({ className, variant, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/badge.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/notifications/persistent-notification.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PersistentNotificationComponent",
    ()=>PersistentNotificationComponent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const getNotificationIcon = (type)=>{
    switch(type){
        case "message":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"];
        case "order":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"];
        case "alert":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"];
        case "system":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"];
        default:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"];
    }
};
const getPriorityColor = (priority)=>{
    switch(priority){
        case "urgent":
            return "bg-red-500";
        case "high":
            return "bg-orange-500";
        case "medium":
            return "bg-blue-500";
        case "low":
            return "bg-gray-500";
        default:
            return "bg-blue-500";
    }
};
const getPriorityVariant = (priority)=>{
    switch(priority){
        case "urgent":
            return "destructive";
        case "high":
            return "secondary";
        default:
            return "default";
    }
};
const formatTime = (timestamp)=>{
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (seconds < 60) return "همین الان";
    if (minutes < 60) return `${minutes} دقیقه پیش`;
    if (hours < 24) return `${hours} ساعت پیش`;
    const date = new Date(timestamp);
    return date.toLocaleDateString("fa-IR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};
function PersistentNotificationComponent({ notification, onConfirm, onDismiss, onMarkAsRead }) {
    _s();
    const Icon = getNotificationIcon(notification.type);
    const [isExpanded, setIsExpanded] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const handleConfirm = ()=>{
        if (onConfirm) {
            onConfirm();
        }
        if (notification.onConfirm) {
            notification.onConfirm();
        }
        if (onMarkAsRead) {
            onMarkAsRead();
        }
    };
    const handleDismiss = ()=>{
        if (onDismiss) {
            onDismiss();
        }
        if (notification.onDismiss) {
            notification.onDismiss();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: -50,
            scale: 0.95,
            x: 20
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            x: 0
        },
        exit: {
            opacity: 0,
            y: -20,
            scale: 0.95,
            x: 20,
            transition: {
                duration: 0.2
            }
        },
        whileHover: {
            scale: 1.02,
            y: -2
        },
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 25
        },
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative w-full max-w-lg sm:max-w-xl pointer-events-auto", !notification.read && "ring-2 ring-primary/40 shadow-lg"),
        onAnimationComplete: ()=>{
            // Auto-expand urgent notifications and message notifications
            if ((notification.priority === "urgent" || notification.type === "message") && !isExpanded) {
                setIsExpanded(true);
            }
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group relative w-full rounded-lg sm:rounded-xl py-2 px-2.5 sm:py-3 sm:px-4 shadow-sm sm:shadow-lg backdrop-blur-sm sm:backdrop-blur-md transition-all duration-300 cursor-pointer border", notification.priority === "urgent" ? "bg-gradient-to-br from-red-50/95 via-background to-red-50/60 dark:from-red-950/30 dark:via-background dark:to-red-950/15 border-red-200/50 dark:border-red-800/30 hover:border-red-300 dark:hover:border-red-700" : notification.priority === "high" ? "bg-gradient-to-br from-orange-50/60 via-background to-orange-50/40 dark:from-orange-950/15 dark:via-background dark:to-orange-950/8 border-orange-200/40 dark:border-orange-800/20 hover:border-orange-300 dark:hover:border-orange-700" : "bg-gradient-to-br from-background via-background to-primary/8 border-border/50 hover:border-primary/30", !notification.read && "shadow-md hover:shadow-lg"),
            onClick: ()=>{
                handleConfirm();
            },
            whileHover: {
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute top-0 right-0 left-0 h-0.5 sm:h-1 rounded-t-lg sm:rounded-t-xl", getPriorityColor(notification.priority))
                }, void 0, false, {
                    fileName: "[project]/components/notifications/persistent-notification.tsx",
                    lineNumber: 160,
                    columnNumber: 9
                }, this),
                !notification.read && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    className: "absolute top-1.5 left-1.5 sm:top-2 sm:left-2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary shadow-lg",
                    animate: {
                        scale: [
                            1,
                            1.3,
                            1
                        ],
                        opacity: [
                            1,
                            0.7,
                            1
                        ]
                    },
                    transition: {
                        repeat: Infinity,
                        duration: 2
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: "absolute inset-0 rounded-full bg-primary/50",
                        animate: {
                            scale: [
                                1,
                                2,
                                2
                            ],
                            opacity: [
                                0.5,
                                0,
                                0
                            ]
                        },
                        transition: {
                            repeat: Infinity,
                            duration: 2
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/notifications/persistent-notification.tsx",
                        lineNumber: 177,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/notifications/persistent-notification.tsx",
                    lineNumber: 169,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start gap-1.5 sm:gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: "relative flex-shrink-0",
                            initial: {
                                scale: 0,
                                rotate: -180
                            },
                            animate: {
                                scale: 1,
                                rotate: 0
                            },
                            transition: {
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                                delay: 0.1
                            },
                            children: [
                                notification.avatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: "relative w-7 h-7 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-primary/30 shadow-md",
                                    whileHover: {
                                        scale: 1.1
                                    },
                                    transition: {
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 17
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: notification.avatar,
                                            alt: notification.sender || notification.title,
                                            className: "w-full h-full object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/components/notifications/persistent-notification.tsx",
                                            lineNumber: 199,
                                            columnNumber: 17
                                        }, this),
                                        !notification.read && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                            className: "absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 rounded-full border-2 border-background",
                                            initial: {
                                                scale: 0
                                            },
                                            animate: {
                                                scale: 1
                                            },
                                            transition: {
                                                delay: 0.2
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/notifications/persistent-notification.tsx",
                                            lineNumber: 205,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/notifications/persistent-notification.tsx",
                                    lineNumber: 194,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md ring-2 ring-primary/20", notification.type === "message" ? "bg-gradient-to-br from-primary/25 via-primary/20 to-accent/25" : notification.type === "order" ? "bg-gradient-to-br from-green-500/25 via-green-500/20 to-green-400/25" : "bg-gradient-to-br from-blue-500/25 via-blue-500/20 to-blue-400/25"),
                                    whileHover: {
                                        scale: 1.1,
                                        rotate: 5
                                    },
                                    transition: {
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 17
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        className: "h-3.5 w-3.5 sm:h-5 sm:w-5 text-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/components/notifications/persistent-notification.tsx",
                                        lineNumber: 226,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/notifications/persistent-notification.tsx",
                                    lineNumber: 214,
                                    columnNumber: 15
                                }, this),
                                notification.priority === "urgent" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: "absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full border border-background sm:border-2 shadow-md sm:shadow-lg flex items-center justify-center",
                                    animate: {
                                        scale: [
                                            1,
                                            1.2,
                                            1
                                        ]
                                    },
                                    transition: {
                                        repeat: Infinity,
                                        duration: 1
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                        className: "h-2.5 w-2.5 sm:h-3 sm:w-3 text-white"
                                    }, void 0, false, {
                                        fileName: "[project]/components/notifications/persistent-notification.tsx",
                                        lineNumber: 235,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/notifications/persistent-notification.tsx",
                                    lineNumber: 230,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/notifications/persistent-notification.tsx",
                            lineNumber: 187,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 min-w-0 space-y-1 sm:space-y-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between gap-1 sm:gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1 flex-wrap",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-xs sm:text-sm font-semibold text-foreground truncate",
                                                        children: notification.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/notifications/persistent-notification.tsx",
                                                        lineNumber: 245,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                        variant: getPriorityVariant(notification.priority),
                                                        className: "text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0 h-4 sm:h-5",
                                                        children: notification.priority === "urgent" ? "فوری" : notification.priority === "high" ? "مهم" : notification.priority === "medium" ? "متوسط" : "کم"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/notifications/persistent-notification.tsx",
                                                        lineNumber: 248,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/notifications/persistent-notification.tsx",
                                                lineNumber: 244,
                                                columnNumber: 17
                                            }, this),
                                            notification.sender && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[9px] sm:text-[10px] text-muted-foreground mb-0.5 sm:mb-1 flex items-center gap-0.5 sm:gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                        className: "h-2 w-2 sm:h-2.5 sm:w-2.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/notifications/persistent-notification.tsx",
                                                        lineNumber: 263,
                                                        columnNumber: 21
                                                    }, this),
                                                    notification.sender
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/notifications/persistent-notification.tsx",
                                                lineNumber: 262,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].p, {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-[10px] sm:text-xs text-muted-foreground leading-tight sm:leading-relaxed transition-all duration-300", isExpanded ? "line-clamp-none" : "line-clamp-2"),
                                                initial: {
                                                    opacity: 0.8
                                                },
                                                animate: {
                                                    opacity: 1
                                                },
                                                transition: {
                                                    delay: 0.1
                                                },
                                                children: notification.message
                                            }, void 0, false, {
                                                fileName: "[project]/components/notifications/persistent-notification.tsx",
                                                lineNumber: 267,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] text-muted-foreground",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                        className: "h-2 w-2 sm:h-2.5 sm:w-2.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/notifications/persistent-notification.tsx",
                                                        lineNumber: 279,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: formatTime(notification.timestamp)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/notifications/persistent-notification.tsx",
                                                        lineNumber: 280,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/notifications/persistent-notification.tsx",
                                                lineNumber: 278,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/notifications/persistent-notification.tsx",
                                        lineNumber: 243,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                        whileHover: {
                                            scale: 1.1
                                        },
                                        whileTap: {
                                            scale: 0.9
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "icon",
                                            onClick: (e)=>{
                                                e.stopPropagation();
                                                handleDismiss();
                                            },
                                            className: "h-5 w-5 sm:h-7 sm:w-7 rounded-full hover:bg-destructive/10 hover:text-destructive flex-shrink-0 transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "h-2.5 w-2.5 sm:h-3.5 sm:w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/components/notifications/persistent-notification.tsx",
                                                lineNumber: 296,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/notifications/persistent-notification.tsx",
                                            lineNumber: 287,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/notifications/persistent-notification.tsx",
                                        lineNumber: 283,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/notifications/persistent-notification.tsx",
                                lineNumber: 242,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/notifications/persistent-notification.tsx",
                            lineNumber: 241,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/notifications/persistent-notification.tsx",
                    lineNumber: 185,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 bg-gradient-to-br from-primary/3 sm:from-primary/5 via-transparent to-accent/3 sm:to-accent/5 pointer-events-none rounded-lg sm:rounded-xl"
                }, void 0, false, {
                    fileName: "[project]/components/notifications/persistent-notification.tsx",
                    lineNumber: 305,
                    columnNumber: 9
                }, this),
                notification.priority === "urgent" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    className: "absolute inset-0 rounded-lg sm:rounded-xl border border-red-500/20 sm:border-2 sm:border-red-500/30",
                    animate: {
                        opacity: [
                            0.5,
                            1,
                            0.5
                        ],
                        scale: [
                            1,
                            1.02,
                            1
                        ]
                    },
                    transition: {
                        repeat: Infinity,
                        duration: 2
                    }
                }, void 0, false, {
                    fileName: "[project]/components/notifications/persistent-notification.tsx",
                    lineNumber: 309,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/notifications/persistent-notification.tsx",
            lineNumber: 142,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/notifications/persistent-notification.tsx",
        lineNumber: 121,
        columnNumber: 5
    }, this);
}
_s(PersistentNotificationComponent, "FPNvbbHVlWWR4LKxxNntSxiIS38=");
_c = PersistentNotificationComponent;
var _c;
__turbopack_context__.k.register(_c, "PersistentNotificationComponent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/notifications/notification-center.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationCenter",
    ()=>NotificationCenter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$notifications$2f$persistent$2d$notification$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/notifications/persistent-notification.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$persistent$2d$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-persistent-notifications.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function NotificationCenter({ position = "top-right", maxNotifications = 5, className }) {
    _s();
    const { notifications, markAsRead, markAllAsRead, dismissNotification, unreadCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$persistent$2d$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePersistentNotifications"])();
    // Track currently open chat
    const [openChatId, setOpenChatId] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    // Listen for chat open/close events
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "NotificationCenter.useEffect": ()=>{
            const updateOpenChat = {
                "NotificationCenter.useEffect.updateOpenChat": ()=>{
                    if ("TURBOPACK compile-time truthy", 1) {
                        const storedChatId = localStorage.getItem('admin_selected_chat_id');
                        setOpenChatId(storedChatId);
                    }
                }
            }["NotificationCenter.useEffect.updateOpenChat"];
            // Check on mount
            updateOpenChat();
            // Listen for storage changes (when chat is opened/closed)
            const handleStorageChange = {
                "NotificationCenter.useEffect.handleStorageChange": (e)=>{
                    if (e.key === 'admin_selected_chat_id') {
                        updateOpenChat();
                    }
                }
            }["NotificationCenter.useEffect.handleStorageChange"];
            // Listen for custom events
            const handleChatOpen = {
                "NotificationCenter.useEffect.handleChatOpen": (e)=>{
                    if (e.detail?.chatId) {
                        setOpenChatId(e.detail.chatId);
                    }
                }
            }["NotificationCenter.useEffect.handleChatOpen"];
            const handleChatOpened = {
                "NotificationCenter.useEffect.handleChatOpened": (e)=>{
                    if (e.detail?.chatId) {
                        setOpenChatId(e.detail.chatId);
                    }
                }
            }["NotificationCenter.useEffect.handleChatOpened"];
            const handleChatClose = {
                "NotificationCenter.useEffect.handleChatClose": ()=>{
                    setOpenChatId(null);
                }
            }["NotificationCenter.useEffect.handleChatClose"];
            window.addEventListener('storage', handleStorageChange);
            window.addEventListener('openChat', handleChatOpen);
            window.addEventListener('chatOpened', handleChatOpened);
            window.addEventListener('closeChat', handleChatClose);
            window.addEventListener('chatClosed', handleChatClose);
            // Poll for changes (fallback for same-window updates)
            const interval = setInterval(updateOpenChat, 500);
            return ({
                "NotificationCenter.useEffect": ()=>{
                    window.removeEventListener('storage', handleStorageChange);
                    window.removeEventListener('openChat', handleChatOpen);
                    window.removeEventListener('closeChat', handleChatClose);
                    clearInterval(interval);
                }
            })["NotificationCenter.useEffect"];
        }
    }["NotificationCenter.useEffect"], []);
    // Filter persistent notifications, excluding those from the currently open chat
    const persistentNotifications = notifications.filter((n)=>{
        if (!n.persistent || n.dismissed) return false;
        // For admin notifications: filter out notifications from the currently open chat
        // This allows notifications from other users to show even when chatting with one user
        if (n.metadata?.isAdmin && n.metadata?.chatId && openChatId) {
            const shouldShow = n.metadata.chatId !== openChatId;
            if ("TURBOPACK compile-time truthy", 1) {
                console.log(`[Notification Center] Notification ${n.id} from chat ${n.metadata.chatId}: openChatId=${openChatId}, shouldShow=${shouldShow}`);
            }
            return shouldShow;
        }
        // Show all notifications if no chat is open, or if it's not an admin notification
        return true;
    });
    if ("TURBOPACK compile-time truthy", 1) {
        console.log(`[Notification Center] Total notifications: ${notifications.length}, Persistent: ${persistentNotifications.length}, Open chat: ${openChatId || 'none'}`);
    }
    // Sort by priority and timestamp (newest and highest priority first)
    const sortedNotifications = persistentNotifications.sort((a, b)=>{
        // First sort by read status (unread first)
        if (a.read !== b.read) {
            return a.read ? 1 : -1;
        }
        // Then by priority
        const priorityOrder = {
            urgent: 4,
            high: 3,
            medium: 2,
            low: 1
        };
        const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        if (priorityDiff !== 0) return priorityDiff;
        // Finally by timestamp (newest first)
        return b.timestamp - a.timestamp;
    });
    const visibleNotifications = sortedNotifications.slice(0, maxNotifications);
    const positionClasses = {
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4"
    };
    if (visibleNotifications.length === 0) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed z-[9999] pointer-events-none flex flex-col gap-2 sm:gap-3", positionClasses[position], className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                mode: "popLayout",
                children: visibleNotifications.map((notification, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        layout: true,
                        initial: {
                            opacity: 0,
                            scale: 0.8,
                            y: -20,
                            x: position.includes('right') ? 20 : -20
                        },
                        animate: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            x: 0
                        },
                        exit: {
                            opacity: 0,
                            scale: 0.8,
                            y: -20,
                            x: position.includes('right') ? 20 : -20,
                            transition: {
                                duration: 0.2
                            }
                        },
                        transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                            delay: index * 0.05
                        },
                        className: "pointer-events-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$notifications$2f$persistent$2d$notification$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PersistentNotificationComponent"], {
                            notification: notification,
                            onConfirm: ()=>{
                                // Dispatch custom event to open chat
                                if (notification.metadata?.chatId) {
                                    const event = new CustomEvent("openChat", {
                                        detail: {
                                            chatId: notification.metadata.chatId,
                                            isAdmin: notification.metadata.isAdmin !== false
                                        }
                                    });
                                    window.dispatchEvent(event);
                                }
                                if (notification.onConfirm) {
                                    notification.onConfirm();
                                }
                                // Mark as read and dismiss notification
                                markAsRead(notification.id);
                                dismissNotification(notification.id);
                            },
                            onDismiss: ()=>{
                                dismissNotification(notification.id);
                            },
                            onMarkAsRead: ()=>{
                                markAsRead(notification.id);
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/notifications/notification-center.tsx",
                            lineNumber: 167,
                            columnNumber: 13
                        }, this)
                    }, notification.id, false, {
                        fileName: "[project]/components/notifications/notification-center.tsx",
                        lineNumber: 147,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/notifications/notification-center.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this),
            (()=>{
                const visibleUnreadCount = visibleNotifications.filter((n)=>!n.read).length;
                return visibleUnreadCount > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        scale: 0,
                        rotate: -180
                    },
                    animate: {
                        scale: 1,
                        rotate: 0
                    },
                    exit: {
                        scale: 0,
                        rotate: 180
                    },
                    transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                    },
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed pointer-events-none z-[10000]", position === "top-right" ? "top-2 right-2" : position === "top-left" ? "top-2 left-2" : position === "bottom-right" ? "bottom-2 right-2" : "bottom-2 left-2"),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                        variant: "destructive",
                        className: "h-6 px-2 text-xs font-bold shadow-lg flex items-center gap-1.5 animate-pulse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                className: "h-3 w-3"
                            }, void 0, false, {
                                fileName: "[project]/components/notifications/notification-center.tsx",
                                lineNumber: 221,
                                columnNumber: 15
                            }, this),
                            visibleUnreadCount
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/notifications/notification-center.tsx",
                        lineNumber: 217,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/notifications/notification-center.tsx",
                    lineNumber: 204,
                    columnNumber: 11
                }, this) : null;
            })()
        ]
    }, void 0, true, {
        fileName: "[project]/components/notifications/notification-center.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
_s(NotificationCenter, "0blKkDmGjT64RnLOOJcjLY973nw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$persistent$2d$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePersistentNotifications"]
    ];
});
_c = NotificationCenter;
var _c;
__turbopack_context__.k.register(_c, "NotificationCenter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/notifications/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$notifications$2f$persistent$2d$notification$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/notifications/persistent-notification.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$notifications$2f$notification$2d$center$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/notifications/notification-center.tsx [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$chat$2f$global$2d$chat$2d$polling$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/chat/global-chat-polling.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$notifications$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/notifications/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$notifications$2f$notification$2d$center$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/notifications/notification-center.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function Providers({ children }) {
    _s();
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Providers.useState": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
                defaultOptions: {
                    queries: {
                        staleTime: 10 * 60 * 1000,
                        gcTime: 30 * 60 * 1000,
                        refetchOnWindowFocus: false,
                        refetchOnMount: false,
                        refetchOnReconnect: false,
                        retry: 1,
                        retryDelay: {
                            "Providers.useState": (attemptIndex)=>Math.min(1000 * 2 ** attemptIndex, 3000)
                        }["Providers.useState"],
                        // Network mode: prefer cache over network
                        networkMode: "online"
                    },
                    mutations: {
                        retry: 0,
                        networkMode: "online"
                    }
                }
            })
    }["Providers.useState"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        attribute: "class",
        defaultTheme: "light",
        enableSystem: false,
        storageKey: "saded-theme",
        disableTransitionOnChange: false,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
            client: queryClient,
            children: [
                children,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$chat$2f$global$2d$chat$2d$polling$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GlobalChatPolling"], {}, void 0, false, {
                    fileName: "[project]/components/providers.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$notifications$2f$notification$2d$center$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotificationCenter"], {
                    position: "top-right",
                    maxNotifications: 5
                }, void 0, false, {
                    fileName: "[project]/components/providers.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/providers.tsx",
            lineNumber: 41,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/providers.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_s(Providers, "d6lDeV0y8l8uPfZu5h5v7MrKRwE=");
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/alert.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Alert",
    ()=>Alert,
    "AlertDescription",
    ()=>AlertDescription,
    "AlertTitle",
    ()=>AlertTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const alertVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("relative w-full rounded-lg border p-4 [&>svg~*]:pr-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:right-4 [&>svg]:top-4 [&>svg]:text-foreground", {
    variants: {
        variant: {
            default: "bg-background text-foreground",
            destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/10",
            warning: "border-yellow-500/50 text-yellow-700 dark:text-yellow-400 dark:border-yellow-400 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
const Alert = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        role: "alert",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(alertVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert.tsx",
        lineNumber: 27,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Alert;
Alert.displayName = "Alert";
const AlertTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mb-1 font-medium leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert.tsx",
        lineNumber: 40,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = AlertTitle;
AlertTitle.displayName = "AlertTitle";
const AlertDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm [&_p]:leading-relaxed", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert.tsx",
        lineNumber: 52,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = AlertDescription;
AlertDescription.displayName = "AlertDescription";
;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "Alert$React.forwardRef");
__turbopack_context__.k.register(_c1, "Alert");
__turbopack_context__.k.register(_c2, "AlertTitle$React.forwardRef");
__turbopack_context__.k.register(_c3, "AlertTitle");
__turbopack_context__.k.register(_c4, "AlertDescription$React.forwardRef");
__turbopack_context__.k.register(_c5, "AlertDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/logger.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Centralized logging utility
 * Disables console.log in production for better performance
 */ __turbopack_context__.s([
    "logger",
    ()=>logger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
class Logger {
    isDevelopment = ("TURBOPACK compile-time value", "development") === 'development';
    isProduction = ("TURBOPACK compile-time value", "development") === 'production';
    shouldLog(level) {
        // Always log errors and warnings
        if (level === 'error' || level === 'warn') {
            return true;
        }
        // Only log other levels in development
        return this.isDevelopment;
    }
    log(...args) {
        if (this.shouldLog('log')) {
            console.log(...args);
        }
    }
    error(...args) {
        console.error(...args);
    }
    warn(...args) {
        console.warn(...args);
    }
    info(...args) {
        if (this.shouldLog('info')) {
            console.info(...args);
        }
    }
    debug(...args) {
        if (this.shouldLog('debug')) {
            console.debug(...args);
        }
    }
    /**
   * Log database query (only in development)
   */ dbQuery(query, params) {
        if (this.isDevelopment) {
            console.log('[DB Query]', query.substring(0, 100), params ? `[${params.length} params]` : '');
        }
    }
    /**
   * Log API request (only in development)
   */ apiRequest(method, path, statusCode) {
        if (this.isDevelopment) {
            console.log(`[API] ${method} ${path}${statusCode ? ` ${statusCode}` : ''}`);
        }
    }
}
const logger = new Logger();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api-error-handler.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Centralized Error Handler
 * Provides consistent error handling and logging across the application
 */ __turbopack_context__.s([
    "AppError",
    ()=>AppError,
    "NetworkError",
    ()=>NetworkError,
    "NetworkErrorType",
    ()=>NetworkErrorType,
    "getUserFriendlyMessage",
    ()=>getUserFriendlyMessage,
    "logError",
    ()=>logError,
    "parseError",
    ()=>parseError
]);
/**
 * Import centralized logger
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger.ts [app-client] (ecmascript)");
class AppError extends Error {
    status;
    code;
    details;
    constructor(message, status, code, details){
        super(message);
        this.name = "AppError";
        this.status = status;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
var NetworkErrorType = /*#__PURE__*/ function(NetworkErrorType) {
    NetworkErrorType["TIMEOUT"] = "TIMEOUT";
    NetworkErrorType["NETWORK"] = "NETWORK";
    NetworkErrorType["ABORTED"] = "ABORTED";
    NetworkErrorType["UNKNOWN"] = "UNKNOWN";
    return NetworkErrorType;
}({});
class NetworkError extends Error {
    type;
    originalError;
    constructor(message, type = "UNKNOWN", originalError){
        super(message);
        this.name = "NetworkError";
        this.type = type;
        this.originalError = originalError;
        Object.setPrototypeOf(this, NetworkError.prototype);
    }
}
;
function parseError(error) {
    if (error instanceof AppError) {
        return {
            message: error.message,
            status: error.status,
            code: error.code,
            details: error.details
        };
    }
    if (error instanceof NetworkError) {
        return {
            message: error.message,
            code: error.type,
            details: error.originalError
        };
    }
    if (error instanceof Error) {
        return {
            message: error.message
        };
    }
    if (typeof error === "string") {
        return {
            message: error
        };
    }
    return {
        message: "خطای نامشخص رخ داد"
    };
}
function getUserFriendlyMessage(error) {
    const parsed = parseError(error);
    // Network errors
    if (parsed.code === "TIMEOUT") {
        return "درخواست شما به دلیل طولانی شدن زمان پاسخ لغو شد. لطفاً دوباره تلاش کنید.";
    }
    if (parsed.code === "NETWORK") {
        return "خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.";
    }
    if (parsed.code === "ABORTED") {
        return "درخواست لغو شد.";
    }
    // HTTP status codes
    if (parsed.status) {
        switch(parsed.status){
            case 400:
                return parsed.message || "درخواست نامعتبر است.";
            case 401:
                return "لطفاً دوباره وارد شوید.";
            case 403:
                return "شما دسترسی به این منبع ندارید.";
            case 404:
                return "منبع مورد نظر یافت نشد.";
            case 429:
                return "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید.";
            case 500:
                return "خطای سرور. لطفاً بعداً تلاش کنید.";
            case 502:
            case 503:
            case 504:
                return "سرور در دسترس نیست. لطفاً بعداً تلاش کنید.";
            default:
                return parsed.message || "خطایی رخ داد.";
        }
    }
    return parsed.message || "خطای نامشخص رخ داد.";
}
function logError(error, context) {
    const parsed = parseError(error);
    const contextMsg = context ? `[${context}] ` : "";
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error(`${contextMsg}${parsed.message}`, {
        status: parsed.status,
        code: parsed.code,
        details: parsed.details
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/error-boundary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorBoundary",
    ()=>ErrorBoundary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-error-handler.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Component {
    constructor(props){
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }
    componentDidCatch(error, errorInfo) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])(error, "ErrorBoundary");
        if ("TURBOPACK compile-time truthy", 1) {
            // Log additional error info in development
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])(errorInfo, "ErrorBoundary - ErrorInfo");
        }
    }
    handleReset = ()=>{
        this.setState({
            hasError: false,
            error: null
        });
    };
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen flex items-center justify-center p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
                    variant: "destructive",
                    className: "max-w-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/components/error-boundary.tsx",
                            lineNumber: 53,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertTitle"], {
                            children: "خطایی رخ داد"
                        }, void 0, false, {
                            fileName: "[project]/components/error-boundary.tsx",
                            lineNumber: 54,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDescription"], {
                            className: "mt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-4",
                                    children: "متأسفانه خطایی در سیستم رخ داده است. لطفاً صفحه را رفرش کنید."
                                }, void 0, false, {
                                    fileName: "[project]/components/error-boundary.tsx",
                                    lineNumber: 56,
                                    columnNumber: 15
                                }, this),
                                ("TURBOPACK compile-time value", "development") === "development" && this.state.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                    className: "mt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                            className: "cursor-pointer text-sm font-medium",
                                            children: "جزئیات خطا (فقط در حالت توسعه)"
                                        }, void 0, false, {
                                            fileName: "[project]/components/error-boundary.tsx",
                                            lineNumber: 61,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                            className: "mt-2 text-xs overflow-auto bg-muted p-2 rounded",
                                            children: [
                                                this.state.error.toString(),
                                                this.state.error.stack && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-2",
                                                    children: this.state.error.stack
                                                }, void 0, false, {
                                                    fileName: "[project]/components/error-boundary.tsx",
                                                    lineNumber: 67,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/error-boundary.tsx",
                                            lineNumber: 64,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/error-boundary.tsx",
                                    lineNumber: 60,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: this.handleReset,
                                    className: "mt-4",
                                    variant: "outline",
                                    children: "تلاش مجدد"
                                }, void 0, false, {
                                    fileName: "[project]/components/error-boundary.tsx",
                                    lineNumber: 72,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/error-boundary.tsx",
                            lineNumber: 55,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/error-boundary.tsx",
                    lineNumber: 52,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/error-boundary.tsx",
                lineNumber: 51,
                columnNumber: 9
            }, this);
        }
        return this.props.children;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/store/cart-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCartStore",
    ()=>useCartStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger-client.ts [app-client] (ecmascript)");
"use client";
;
;
;
// Helper function to optimize image URL (truncate if too long, remove base64 data)
function optimizeImageUrl(url) {
    if (!url || typeof url !== "string") {
        return "";
    }
    // If it's a base64 data URL, only keep if it's small
    if (url.startsWith("data:image")) {
        // Keep small base64 images (under 50KB to avoid quota issues)
        if (url.length < 50000) {
            return url;
        }
        // For large base64, return empty - we'll fetch from product when displaying
        return "";
    }
    // For regular URLs (http/https), always keep them - they're usually short
    // URLs are typically under 500 chars, so we can keep them as-is
    // Only truncate extremely long URLs (keep first 2000 chars)
    if (url.length > 2000) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn("Very long image URL detected, truncating:", url.substring(0, 100));
        return url.substring(0, 2000);
    }
    return url;
}
// Helper function to optimize cart items before storing
function optimizeCartItems(items) {
    // Limit to 100 items max
    const limitedItems = items.slice(0, 100);
    // Optimize image URLs
    return limitedItems.map((item)=>({
            ...item,
            image: optimizeImageUrl(item.image)
        }));
}
// Custom storage with error handling
const customStorage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>{
    const baseStorage = {
        getItem: (name)=>{
            // Check if we're in browser environment
            if (("TURBOPACK compile-time value", "object") === "undefined" || typeof localStorage === "undefined") {
                return null;
            }
            try {
                return localStorage.getItem(name);
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error reading from localStorage:", error);
                return null;
            }
        },
        setItem: (name, value)=>{
            // Check if we're in browser environment
            if (("TURBOPACK compile-time value", "object") === "undefined" || typeof localStorage === "undefined") {
                return;
            }
            try {
                // Check if data is too large (localStorage limit is usually 5-10MB)
                const sizeInBytes = new Blob([
                    value
                ]).size;
                const maxSize = 4 * 1024 * 1024; // 4MB limit (leave some room)
                if (sizeInBytes > maxSize) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn("Cart data too large, clearing old items");
                    // Try to reduce by removing oldest items
                    try {
                        const data = JSON.parse(value);
                        if (data.state?.items && Array.isArray(data.state.items)) {
                            // Keep only last 50 items
                            data.state.items = data.state.items.slice(-50);
                            const optimized = JSON.stringify(data);
                            const optimizedSize = new Blob([
                                optimized
                            ]).size;
                            if (optimizedSize < maxSize) {
                                localStorage.setItem(name, optimized);
                                return;
                            }
                        }
                    } catch (e) {
                    // If parsing fails, clear the storage
                    }
                    // If still too large, clear it
                    localStorage.removeItem(name);
                    throw new Error("QUOTA_EXCEEDED");
                }
                localStorage.setItem(name, value);
            } catch (error) {
                if (error?.name === "QuotaExceededError" || error?.message === "QUOTA_EXCEEDED") {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("localStorage quota exceeded. Clearing cart data.");
                    // Clear old cart data and try again with empty cart
                    try {
                        localStorage.removeItem(name);
                        const emptyCart = JSON.stringify({
                            state: {
                                items: [],
                                shippingMethod: null
                            },
                            version: 0
                        });
                        localStorage.setItem(name, emptyCart);
                    } catch (e) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Failed to clear localStorage:", e);
                    }
                    throw error;
                }
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error writing to localStorage:", error);
            }
        },
        removeItem: (name)=>{
            // Check if we're in browser environment
            if (("TURBOPACK compile-time value", "object") === "undefined" || typeof localStorage === "undefined") {
                return;
            }
            try {
                localStorage.removeItem(name);
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error removing from localStorage:", error);
            }
        }
    };
    return baseStorage;
});
// Helper function to get or create session ID
function getSessionId() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    let sessionId = localStorage.getItem("cart-session-id");
    if (!sessionId) {
        sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("cart-session-id", sessionId);
    }
    return sessionId;
}
const useCartStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        items: [],
        shippingMethod: null,
        sessionId: null,
        initializeSession: ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const sessionId = getSessionId();
                set({
                    sessionId
                });
            }
        },
        syncToDatabase: async ()=>{
            try {
                const state = get();
                const sessionId = state.sessionId || getSessionId();
                if (!sessionId) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn("No session ID, skipping database sync");
                    return;
                }
                // For database sync, we want to keep images as-is (don't optimize)
                // Only optimize for localStorage to avoid quota issues
                // Database can handle larger data, so we keep original images
                const itemsForDB = state.items.map((item)=>{
                    // Log for debugging
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug("Syncing item to DB:", {
                        id: item.id,
                        name: item.name,
                        hasImage: !!item.image,
                        imageLength: item.image?.length || 0,
                        imageType: item.image?.startsWith("data:") ? "base64" : "url"
                    });
                    return {
                        ...item
                    };
                });
                const response = await fetch("/api/cart", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        items: itemsForDB,
                        shippingMethod: state.shippingMethod,
                        sessionId
                    })
                });
                if (!response.ok) {
                    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                    try {
                        const errorData = await response.json();
                        if (errorData && typeof errorData === 'object') {
                            errorMessage = errorData.error || errorData.message || errorMessage;
                        }
                    } catch (parseError) {
                        // If JSON parsing fails, use the status text
                        const text = await response.text().catch(()=>'');
                        if (text) {
                            errorMessage = `${errorMessage} - ${text.substring(0, 100)}`;
                        }
                    }
                    // Only log if it's a real error (not 200-299 range)
                    if (response.status >= 400) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Failed to sync cart to database:", {
                            status: response.status,
                            statusText: response.statusText,
                            error: errorMessage,
                            sessionId,
                            itemCount: itemsForDB.length
                        });
                    }
                } else {
                    try {
                        const result = await response.json();
                        if (result && result.success) {
                            if ("TURBOPACK compile-time truthy", 1) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug("Cart synced to database successfully", {
                                    sessionId,
                                    itemCount: itemsForDB.length
                                });
                            }
                        }
                    } catch (parseError) {
                    // If response is ok but JSON parsing fails, it might be empty response
                    // This is not necessarily an error, so we don't log it
                    }
                }
            } catch (error) {
                // Only log if it's a real error (not network errors that are expected)
                if (error instanceof Error) {
                    // Don't log network errors in production (they're expected when offline)
                    if (("TURBOPACK compile-time value", "development") === "development" || !error.message.includes("fetch") && !error.message.includes("network")) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error syncing cart to database:", {
                            message: error.message,
                            name: error.name,
                            sessionId: get().sessionId || getSessionId()
                        });
                    }
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error syncing cart to database:", error);
                }
            // Don't throw - allow app to continue with localStorage
            }
        },
        loadFromDatabase: async ()=>{
            try {
                const sessionId = getSessionId();
                if (!sessionId) {
                    return;
                }
                const response = await fetch("/api/cart", {
                    headers: {
                        "x-cart-session-id": sessionId
                    }
                });
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug("Cart loaded from database:", {
                            itemCount: result.data.items?.length || 0,
                            sessionId
                        });
                        // Ensure all items have images - if image is empty, we'll fetch from product store
                        const itemsWithImages = (result.data.items || []).map((item)=>{
                            // If image is empty or invalid, keep it empty - will be fetched from product store
                            if (!item.image || item.image.trim() === "") {
                                return item; // Keep as is, will be handled in component
                            }
                            return item;
                        });
                        set({
                            items: itemsWithImages,
                            shippingMethod: result.data.shippingMethod || null,
                            sessionId
                        });
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug("No cart data in response or empty cart");
                    }
                } else {
                    let errorMessage = `HTTP ${response.status}`;
                    try {
                        const errorData = await response.json();
                        if (errorData && typeof errorData === 'object') {
                            errorMessage = errorData.error || errorData.message || errorMessage;
                        }
                    } catch (parseError) {
                        // If JSON parsing fails, try to get text
                        const text = await response.text().catch(()=>'');
                        if (text) {
                            errorMessage = `${errorMessage} - ${text.substring(0, 100)}`;
                        }
                    }
                    // Only log if it's a real error (not 200-299 range)
                    if (response.status >= 400) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Failed to load cart from database:", {
                            status: response.status,
                            error: errorMessage,
                            sessionId
                        });
                    }
                }
            } catch (error) {
                // Only log if it's a real error (not network errors that are expected)
                if (error instanceof Error) {
                    // Don't log network errors in production (they're expected when offline)
                    if (("TURBOPACK compile-time value", "development") === "development" || !error.message.includes("fetch") && !error.message.includes("network")) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error loading cart from database:", {
                            message: error.message,
                            name: error.name,
                            sessionId: getSessionId()
                        });
                    }
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error loading cart from database:", error);
                }
            // Don't throw - allow app to continue with localStorage
            }
        },
        addItem: (item)=>{
            try {
                set((state)=>{
                    // Limit cart to 100 items
                    if (state.items.length >= 100) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn("Cart limit reached (100 items). Please remove some items.");
                        return state;
                    }
                    const existingItem = state.items.find((i)=>i.id === item.id);
                    if (existingItem) {
                        // Update quantity if item already exists
                        return {
                            items: state.items.map((i)=>i.id === item.id ? {
                                    ...i,
                                    quantity: i.quantity + (item.quantity || 1)
                                } : i)
                        };
                    }
                    // Add new item - keep original image (don't optimize here)
                    // Optimization only happens in partialize for localStorage
                    const newState = {
                        items: [
                            ...state.items,
                            {
                                ...item,
                                image: item.image || "",
                                quantity: item.quantity || 1
                            }
                        ]
                    };
                    // Sync to database after state update
                    setTimeout(()=>{
                        get().syncToDatabase();
                    }, 100);
                    return newState;
                });
            } catch (error) {
                if (error?.name === "QuotaExceededError") {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Storage quota exceeded. Please clear your cart.");
                // Optionally show a toast notification to the user
                }
                throw error;
            }
        },
        updateQuantity: (id, quantity)=>{
            try {
                set((state)=>{
                    if (quantity <= 0) {
                        // Remove item if quantity is 0 or less
                        return {
                            items: state.items.filter((i)=>i.id !== id)
                        };
                    }
                    // Update quantity
                    const newState = {
                        items: state.items.map((i)=>i.id === id ? {
                                ...i,
                                quantity
                            } : i)
                    };
                    // Sync to database after state update
                    setTimeout(()=>{
                        get().syncToDatabase();
                    }, 100);
                    return newState;
                });
            } catch (error) {
                if (error?.name === "QuotaExceededError") {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Storage quota exceeded. Please clear your cart.");
                }
                throw error;
            }
        },
        removeItem: (id)=>{
            set((state)=>{
                const newState = {
                    items: state.items.filter((i)=>i.id !== id)
                };
                // Sync to database after state update
                setTimeout(()=>{
                    get().syncToDatabase();
                }, 100);
                return newState;
            });
        },
        clearCart: ()=>{
            set({
                items: [],
                shippingMethod: null
            });
            // Sync to database after clearing
            setTimeout(()=>{
                get().syncToDatabase();
            }, 100);
        },
        getTotal: ()=>{
            const state = get();
            return state.items.reduce((total, item)=>total + item.price * item.quantity, 0);
        },
        getItemCount: ()=>{
            const state = get();
            return state.items.reduce((count, item)=>count + item.quantity, 0);
        },
        setShippingMethod: (method)=>{
            set({
                shippingMethod: method
            });
            // Sync to database after updating shipping method
            setTimeout(()=>{
                get().syncToDatabase();
            }, 100);
        }
    }), {
    name: "cart-storage",
    storage: customStorage,
    partialize: (state)=>{
        // Optimize items before storing
        const optimizedItems = optimizeCartItems(state.items);
        return {
            items: optimizedItems,
            shippingMethod: state.shippingMethod,
            sessionId: state.sessionId
        };
    }
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/sheet.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sheet",
    ()=>Sheet,
    "SheetClose",
    ()=>SheetClose,
    "SheetContent",
    ()=>SheetContent,
    "SheetDescription",
    ()=>SheetDescription,
    "SheetHeader",
    ()=>SheetHeader,
    "SheetOverlay",
    ()=>SheetOverlay,
    "SheetPortal",
    ()=>SheetPortal,
    "SheetTitle",
    ()=>SheetTitle,
    "SheetTrigger",
    ()=>SheetTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
;
const Sheet = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const SheetTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const SheetClose = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"];
const SheetPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"];
const SheetOverlay = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
        ...props,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 17,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c = SheetOverlay;
SheetOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const sheetVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500", {
    variants: {
        side: {
            top: "inset-x-0 top-0 border-b-[0.25px] border-border/30 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
            bottom: "inset-x-0 bottom-0 border-t-[0.25px] border-border/30 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            right: "inset-y-0 right-0 h-full w-3/4 border-l-[0.25px] border-border/30 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
            left: "inset-y-0 left-0 h-full w-3/4 border-r-[0.25px] border-border/30 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm"
        }
    },
    defaultVariants: {
        side: "right"
    }
});
const SheetContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c1 = ({ side = "right", className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SheetPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SheetOverlay, {}, void 0, false, {
                fileName: "[project]/components/ui/sheet.tsx",
                lineNumber: 56,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(sheetVariants({
                    side
                }), className),
                ...props,
                children: [
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                        className: "absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/sheet.tsx",
                                lineNumber: 64,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/sheet.tsx",
                                lineNumber: 65,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/sheet.tsx",
                        lineNumber: 63,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/sheet.tsx",
                lineNumber: 57,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 55,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c2 = SheetContent;
SheetContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const SheetHeader = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-2 text-center sm:text-right", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 76,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c3 = SheetHeader;
SheetHeader.displayName = "SheetHeader";
const SheetTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold text-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 90,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = SheetTitle;
SheetTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const SheetDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 102,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = SheetDescription;
SheetDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "SheetOverlay");
__turbopack_context__.k.register(_c1, "SheetContent$React.forwardRef");
__turbopack_context__.k.register(_c2, "SheetContent");
__turbopack_context__.k.register(_c3, "SheetHeader");
__turbopack_context__.k.register(_c4, "SheetTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "SheetTitle");
__turbopack_context__.k.register(_c6, "SheetDescription$React.forwardRef");
__turbopack_context__.k.register(_c7, "SheetDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/textarea.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Textarea = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex min-h-[80px] w-full rounded-md border-[0.25px] border-input/30 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/textarea.tsx",
        lineNumber: 10,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Textarea;
Textarea.displayName = "Textarea";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Textarea$React.forwardRef");
__turbopack_context__.k.register(_c1, "Textarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, type, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-full rounded-md border-[0.25px] border-input/30 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/input.tsx",
        lineNumber: 10,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Input;
Input.displayName = "Input";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Input$React.forwardRef");
__turbopack_context__.k.register(_c1, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/dropdown-menu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DropdownMenu",
    ()=>DropdownMenu,
    "DropdownMenuCheckboxItem",
    ()=>DropdownMenuCheckboxItem,
    "DropdownMenuContent",
    ()=>DropdownMenuContent,
    "DropdownMenuGroup",
    ()=>DropdownMenuGroup,
    "DropdownMenuItem",
    ()=>DropdownMenuItem,
    "DropdownMenuLabel",
    ()=>DropdownMenuLabel,
    "DropdownMenuPortal",
    ()=>DropdownMenuPortal,
    "DropdownMenuRadioGroup",
    ()=>DropdownMenuRadioGroup,
    "DropdownMenuRadioItem",
    ()=>DropdownMenuRadioItem,
    "DropdownMenuSeparator",
    ()=>DropdownMenuSeparator,
    "DropdownMenuShortcut",
    ()=>DropdownMenuShortcut,
    "DropdownMenuSub",
    ()=>DropdownMenuSub,
    "DropdownMenuSubContent",
    ()=>DropdownMenuSubContent,
    "DropdownMenuSubTrigger",
    ()=>DropdownMenuSubTrigger,
    "DropdownMenuTrigger",
    ()=>DropdownMenuTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as Circle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const DropdownMenu = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const DropdownMenuTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const DropdownMenuGroup = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"];
const DropdownMenuPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"];
const DropdownMenuSub = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sub"];
const DropdownMenuRadioGroup = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroup"];
const DropdownMenuSubTrigger = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, inset, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubTrigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent", inset && "pr-8", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                className: "mr-auto h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/components/ui/dropdown-menu.tsx",
                lineNumber: 36,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 26,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = DropdownMenuSubTrigger;
DropdownMenuSubTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubTrigger"].displayName;
const DropdownMenuSubContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubContent"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("z-50 min-w-[8rem] overflow-hidden rounded-md border-[0.25px] border-border/30 bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 46,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = DropdownMenuSubContent;
DropdownMenuSubContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubContent"].displayName;
const DropdownMenuContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, sideOffset = 4, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            sideOffset: sideOffset,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("z-50 min-w-[8rem] overflow-hidden rounded-md border-[0.25px] border-border/30 bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/components/ui/dropdown-menu.tsx",
            lineNumber: 63,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = DropdownMenuContent;
DropdownMenuContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const DropdownMenuItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, inset, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", inset && "pr-8", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 82,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = DropdownMenuItem;
DropdownMenuItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"].displayName;
const DropdownMenuCheckboxItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, children, checked, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckboxItem"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        checked: checked,
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/dropdown-menu.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/ui/dropdown-menu.tsx",
                    lineNumber: 108,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/ui/dropdown-menu.tsx",
                lineNumber: 107,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 98,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = DropdownMenuCheckboxItem;
DropdownMenuCheckboxItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckboxItem"].displayName;
const DropdownMenuRadioItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioItem"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"], {
                        className: "h-2 w-2 fill-current"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/dropdown-menu.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/ui/dropdown-menu.tsx",
                    lineNumber: 131,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/ui/dropdown-menu.tsx",
                lineNumber: 130,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 122,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = DropdownMenuRadioItem;
DropdownMenuRadioItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioItem"].displayName;
const DropdownMenuLabel = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c12 = ({ className, inset, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2 py-1.5 text-sm font-semibold", inset && "pr-8", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 146,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c13 = DropdownMenuLabel;
DropdownMenuLabel.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"].displayName;
const DropdownMenuSeparator = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c14 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-mx-1 my-1 h-px bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 162,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c15 = DropdownMenuSeparator;
DropdownMenuSeparator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"].displayName;
const DropdownMenuShortcut = ({ className, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mr-auto text-xs tracking-widest opacity-60", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 175,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c16 = DropdownMenuShortcut;
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15, _c16;
__turbopack_context__.k.register(_c, "DropdownMenuSubTrigger$React.forwardRef");
__turbopack_context__.k.register(_c1, "DropdownMenuSubTrigger");
__turbopack_context__.k.register(_c2, "DropdownMenuSubContent$React.forwardRef");
__turbopack_context__.k.register(_c3, "DropdownMenuSubContent");
__turbopack_context__.k.register(_c4, "DropdownMenuContent$React.forwardRef");
__turbopack_context__.k.register(_c5, "DropdownMenuContent");
__turbopack_context__.k.register(_c6, "DropdownMenuItem$React.forwardRef");
__turbopack_context__.k.register(_c7, "DropdownMenuItem");
__turbopack_context__.k.register(_c8, "DropdownMenuCheckboxItem$React.forwardRef");
__turbopack_context__.k.register(_c9, "DropdownMenuCheckboxItem");
__turbopack_context__.k.register(_c10, "DropdownMenuRadioItem$React.forwardRef");
__turbopack_context__.k.register(_c11, "DropdownMenuRadioItem");
__turbopack_context__.k.register(_c12, "DropdownMenuLabel$React.forwardRef");
__turbopack_context__.k.register(_c13, "DropdownMenuLabel");
__turbopack_context__.k.register(_c14, "DropdownMenuSeparator$React.forwardRef");
__turbopack_context__.k.register(_c15, "DropdownMenuSeparator");
__turbopack_context__.k.register(_c16, "DropdownMenuShortcut");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-toast.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "reducer",
    ()=>reducer,
    "toast",
    ()=>toast,
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST"
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case "DISMISS_TOAST":
            {
                const { toastId } = action;
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: "UPDATE_TOAST",
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: "DISMISS_TOAST",
            toastId: id
        });
    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    _s();
    const [state, setState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](memoryState);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useToast.useEffect": ()=>{
            listeners.push(setState);
            return ({
                "useToast.useEffect": ()=>{
                    const index = listeners.indexOf(setState);
                    if (index > -1) {
                        listeners.splice(index, 1);
                    }
                }
            })["useToast.useEffect"];
        }
    }["useToast.useEffect"], [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: "DISMISS_TOAST",
                toastId
            })
    };
}
_s(useToast, "SPWE98mLGnlsnNfIwu/IAKTSZtk=");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/chat/online-status-badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OnlineStatusBadge",
    ()=>OnlineStatusBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as Circle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function OnlineStatusBadge({ isOnline, lastSeen, className, showText = false }) {
    const formatLastSeen = (lastSeenDate)=>{
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
        initial: {
            opacity: 0,
            scale: 0.8
        },
        animate: {
            opacity: 1,
            scale: 1
        },
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center gap-2", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "relative inline-flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"], {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-3 w-3", isOnline ? "fill-green-500 text-green-500" : "fill-gray-400 text-gray-400")
                    }, void 0, false, {
                        fileName: "[project]/components/chat/online-status-badge.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    isOnline && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
                        className: "absolute inset-0 rounded-full bg-green-500 pointer-events-none",
                        animate: {
                            scale: [
                                1,
                                1.5,
                                1
                            ],
                            opacity: [
                                1,
                                0,
                                1
                            ]
                        },
                        transition: {
                            duration: 2,
                            repeat: Infinity
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/chat/online-status-badge.tsx",
                        lineNumber: 51,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/chat/online-status-badge.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            showText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm font-semibold leading-tight", isOnline ? "text-green-600 dark:text-green-400" : "text-gray-500"),
                children: isOnline ? "آنلاین" : lastSeen ? `آخرین بازدید: ${formatLastSeen(lastSeen)}` : "آفلاین"
            }, void 0, false, {
                fileName: "[project]/components/chat/online-status-badge.tsx",
                lineNumber: 65,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/chat/online-status-badge.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c = OnlineStatusBadge;
var _c;
__turbopack_context__.k.register(_c, "OnlineStatusBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-admin-presence.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAdminPresence",
    ()=>useAdminPresence
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger-client.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const DEFAULT_ADMIN_ID = "admin-1"; // Default admin ID
const DEFAULT_HEARTBEAT_INTERVAL = 15000; // 15 seconds
function useAdminPresence({ adminId = DEFAULT_ADMIN_ID, enabled = true, heartbeatInterval = DEFAULT_HEARTBEAT_INTERVAL } = {}) {
    _s();
    const [isOnline, setIsOnline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastSeen, setLastSeen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const heartbeatIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isMountedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(true);
    // Check admin status
    const checkStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAdminPresence.useCallback[checkStatus]": async ()=>{
            if (!enabled || !isMountedRef.current) return;
            try {
                const response = await fetch(`/api/admin/presence?adminId=${adminId}`);
                if (!response.ok) {
                    // Try to parse error response for better error messages
                    let errorMessage = `Failed to check admin status (${response.status})`;
                    try {
                        const errorData = await response.json();
                        if (errorData.error) {
                            errorMessage = `Failed to check admin status: ${errorData.error}`;
                        }
                    } catch  {
                    // If we can't parse the error response, use the default message
                    }
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error(errorMessage, {
                        status: response.status,
                        adminId
                    });
                    return;
                }
                const data = await response.json();
                if (data.success && data.data) {
                    setIsOnline(data.data.isOnline || false);
                    setLastSeen(data.data.lastSeen || null);
                } else if (!data.success) {
                    // API returned success: false but with 200 status
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Failed to check admin status:", data.error || "Unknown error", {
                        adminId
                    });
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error checking admin status:", error, {
                    adminId
                });
            }
        }
    }["useAdminPresence.useCallback[checkStatus]"], [
        adminId,
        enabled
    ]);
    // Set online status
    const setOnline = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAdminPresence.useCallback[setOnline]": async (online)=>{
            if (!enabled || !isMountedRef.current) return;
            try {
                const response = await fetch("/api/admin/presence", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        adminId,
                        isOnline: online
                    })
                });
                if (!response.ok) {
                    // Try to parse error response for better error messages
                    let errorMessage = `Failed to update admin status (${response.status})`;
                    try {
                        const errorData = await response.json();
                        if (errorData.error) {
                            errorMessage = `Failed to update admin status: ${errorData.error}`;
                        }
                    } catch  {
                    // If we can't parse the error response, use the default message
                    }
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error(errorMessage, {
                        status: response.status,
                        adminId
                    });
                    return;
                }
                const data = await response.json();
                if (data.success && data.data) {
                    setIsOnline(data.data.isOnline || false);
                    setLastSeen(data.data.lastSeen || null);
                } else if (!data.success) {
                    // API returned success: false but with 200 status
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Failed to update admin status:", data.error || "Unknown error", {
                        adminId
                    });
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error updating admin status:", error, {
                    adminId
                });
            }
        }
    }["useAdminPresence.useCallback[setOnline]"], [
        adminId,
        enabled
    ]);
    // Initial status check
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAdminPresence.useEffect": ()=>{
            if (enabled) {
                checkStatus();
            }
        }
    }["useAdminPresence.useEffect"], [
        enabled,
        checkStatus
    ]);
    // Set up heartbeat when online
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAdminPresence.useEffect": ()=>{
            if (!enabled || !isOnline) {
                if (heartbeatIntervalRef.current) {
                    clearInterval(heartbeatIntervalRef.current);
                    heartbeatIntervalRef.current = null;
                }
                return;
            }
            // Send heartbeat immediately
            setOnline(true);
            // Set up interval for heartbeat
            heartbeatIntervalRef.current = setInterval({
                "useAdminPresence.useEffect": ()=>{
                    if (isMountedRef.current) {
                        setOnline(true);
                    }
                }
            }["useAdminPresence.useEffect"], heartbeatInterval);
            return ({
                "useAdminPresence.useEffect": ()=>{
                    if (heartbeatIntervalRef.current) {
                        clearInterval(heartbeatIntervalRef.current);
                        heartbeatIntervalRef.current = null;
                    }
                }
            })["useAdminPresence.useEffect"];
        }
    }["useAdminPresence.useEffect"], [
        enabled,
        isOnline,
        heartbeatInterval,
        setOnline
    ]);
    // Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAdminPresence.useEffect": ()=>{
            return ({
                "useAdminPresence.useEffect": ()=>{
                    isMountedRef.current = false;
                    if (heartbeatIntervalRef.current) {
                        clearInterval(heartbeatIntervalRef.current);
                        heartbeatIntervalRef.current = null;
                    }
                    // Mark as offline when component unmounts
                    if (enabled) {
                        setOnline(false).catch({
                            "useAdminPresence.useEffect": (err)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error setting offline status:", err)
                        }["useAdminPresence.useEffect"]);
                    }
                }
            })["useAdminPresence.useEffect"];
        }
    }["useAdminPresence.useEffect"], [
        enabled,
        setOnline
    ]);
    return {
        isOnline,
        lastSeen,
        checkStatus,
        setOnline
    };
}
_s(useAdminPresence, "hwNYCyjkiSowbEYjNsZt39Op4IU=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/chat/typing-indicator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TypingIndicator",
    ()=>TypingIndicator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
"use client";
;
;
function TypingIndicator({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 10
        },
        animate: {
            opacity: 1,
            y: 0
        },
        exit: {
            opacity: 0,
            y: 10
        },
        className: `flex items-center gap-2 px-5 py-3 bg-muted/60 rounded-2xl shadow-sm border border-border/30 ${className || ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "w-2.5 h-2.5 bg-muted-foreground/70 rounded-full",
                animate: {
                    y: [
                        0,
                        -6,
                        0
                    ]
                },
                transition: {
                    duration: 0.6,
                    repeat: Infinity,
                    delay: 0
                }
            }, void 0, false, {
                fileName: "[project]/components/chat/typing-indicator.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "w-2.5 h-2.5 bg-muted-foreground/70 rounded-full",
                animate: {
                    y: [
                        0,
                        -6,
                        0
                    ]
                },
                transition: {
                    duration: 0.6,
                    repeat: Infinity,
                    delay: 0.2
                }
            }, void 0, false, {
                fileName: "[project]/components/chat/typing-indicator.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "w-2.5 h-2.5 bg-muted-foreground/70 rounded-full",
                animate: {
                    y: [
                        0,
                        -6,
                        0
                    ]
                },
                transition: {
                    duration: 0.6,
                    repeat: Infinity,
                    delay: 0.4
                }
            }, void 0, false, {
                fileName: "[project]/components/chat/typing-indicator.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/chat/typing-indicator.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = TypingIndicator;
var _c;
__turbopack_context__.k.register(_c, "TypingIndicator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/chat/quick-buy-chat.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QuickBuyChat",
    ()=>QuickBuyChat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/sheet.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$paperclip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paperclip$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/paperclip.js [app-client] (ecmascript) <export default as Paperclip>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mic.js [app-client] (ecmascript) <export default as Mic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square.js [app-client] (ecmascript) <export default as Square>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pause.js [app-client] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check-check.js [app-client] (ecmascript) <export default as CheckCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$reply$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Reply$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/reply.js [app-client] (ecmascript) <export default as Reply>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen.js [app-client] (ecmascript) <export default as Edit2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-notifications.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$chat$2f$online$2d$status$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/chat/online-status-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$admin$2d$presence$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-admin-presence.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$persistent$2d$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-persistent-notifications.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$chat$2f$typing$2d$indicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/chat/typing-indicator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function QuickBuyChat({ isOpen, onOpenChange, trigger }) {
    _s();
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const { showNotification, requestPermission } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotifications"])();
    const { showMessageNotification } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$persistent$2d$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePersistentNotifications"])();
    const { isOnline, lastSeen, checkStatus } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$admin$2d$presence$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAdminPresence"])({
        enabled: true,
        heartbeatInterval: 20000
    });
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: "1",
            text: "سلام! خوش آمدید. برای خرید سریع لطفاً اطلاعات زیر را وارد کنید:",
            sender: "support",
            timestamp: new Date()
        }
    ]);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [replyingTo, setReplyingTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editingMessage, setEditingMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Load customer info from localStorage on mount with expiration check
    const loadCustomerInfo = ()=>{
        if ("TURBOPACK compile-time truthy", 1) {
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
                            return {
                                name: "",
                                phone: "",
                                email: ""
                            };
                        }
                    }
                    return data;
                } catch  {
                    // Clear corrupted data
                    localStorage.removeItem("quickBuyChat_customerInfo");
                    localStorage.removeItem("quickBuyChat_customerInfo_timestamp");
                    return {
                        name: "",
                        phone: "",
                        email: ""
                    };
                }
            }
        }
        return {
            name: "",
            phone: "",
            email: ""
        };
    };
    // Load chatId from localStorage
    const loadChatId = ()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            return localStorage.getItem("quickBuyChat_chatId");
        }
        //TURBOPACK unreachable
        ;
    };
    const [customerInfo, setCustomerInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(loadCustomerInfo);
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("info");
    const [attachments, setAttachments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showAttachmentOptions, setShowAttachmentOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Voice recording states
    const [isRecording, setIsRecording] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [recordingTime, setRecordingTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [audioBlob, setAudioBlob] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [audioUrl, setAudioUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isPlayingAudio, setIsPlayingAudio] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [recordingPermission, setRecordingPermission] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showPermissionGuide, setShowPermissionGuide] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [chatId, setChatId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(loadChatId());
    const [isPolling, setIsPolling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSupportTyping, setIsSupportTyping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const typingTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const typingPollIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mediaRecorderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pollingIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioChunksRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const recordingIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const lastPolledMessageIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const processedNotificationIdsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    const notificationDebounceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const lastNotificationTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const systemMessageShownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const systemMessageIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const messagesContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const imageInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const hasScrolledOnOpenRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const lastUserMessageIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [showScrollToBottom, setShowScrollToBottom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Check if user is scrolled up
    const checkScrollPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "QuickBuyChat.useCallback[checkScrollPosition]": ()=>{
            if (!messagesContainerRef.current || step !== "chat") {
                setShowScrollToBottom(false);
                return;
            }
            const container = messagesContainerRef.current;
            const threshold = 150; // 150px threshold
            const scrollBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
            const isScrolledUp = scrollBottom > threshold;
            setShowScrollToBottom(isScrolledUp);
        }
    }["QuickBuyChat.useCallback[checkScrollPosition]"], [
        step
    ]);
    // Scroll to bottom function
    const scrollToBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "QuickBuyChat.useCallback[scrollToBottom]": (instant = false)=>{
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({
                    behavior: instant ? "auto" : "smooth",
                    block: "end"
                });
                // Hide button after scrolling
                setTimeout({
                    "QuickBuyChat.useCallback[scrollToBottom]": ()=>{
                        setShowScrollToBottom(false);
                    }
                }["QuickBuyChat.useCallback[scrollToBottom]"], 300);
            }
        }
    }["QuickBuyChat.useCallback[scrollToBottom]"], []);
    // Track scroll position
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuickBuyChat.useEffect": ()=>{
            const container = messagesContainerRef.current;
            if (!container || step !== "chat") {
                setShowScrollToBottom(false);
                return;
            }
            const handleScroll = {
                "QuickBuyChat.useEffect.handleScroll": ()=>{
                    checkScrollPosition();
                }
            }["QuickBuyChat.useEffect.handleScroll"];
            // Check position when messages change
            const checkOnMessagesChange = {
                "QuickBuyChat.useEffect.checkOnMessagesChange": ()=>{
                    setTimeout({
                        "QuickBuyChat.useEffect.checkOnMessagesChange": ()=>{
                            checkScrollPosition();
                        }
                    }["QuickBuyChat.useEffect.checkOnMessagesChange"], 100);
                }
            }["QuickBuyChat.useEffect.checkOnMessagesChange"];
            container.addEventListener("scroll", handleScroll, {
                passive: true
            });
            // Check initial position
            checkScrollPosition();
            checkOnMessagesChange();
            return ({
                "QuickBuyChat.useEffect": ()=>{
                    container.removeEventListener("scroll", handleScroll);
                }
            })["QuickBuyChat.useEffect"];
        }
    }["QuickBuyChat.useEffect"], [
        step,
        checkScrollPosition,
        messages.length
    ]);
    // Scroll to bottom only when chat step is opened (first time)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuickBuyChat.useEffect": ()=>{
            if (step === "chat" && messages.length > 0 && !hasScrolledOnOpenRef.current) {
                // Scroll only once when opening chat
                hasScrolledOnOpenRef.current = true;
                const timeout = setTimeout({
                    "QuickBuyChat.useEffect.timeout": ()=>{
                        scrollToBottom(true);
                        // Check position after scroll to hide button
                        setTimeout({
                            "QuickBuyChat.useEffect.timeout": ()=>{
                                checkScrollPosition();
                            }
                        }["QuickBuyChat.useEffect.timeout"], 500);
                    }
                }["QuickBuyChat.useEffect.timeout"], 200);
                return ({
                    "QuickBuyChat.useEffect": ()=>clearTimeout(timeout)
                })["QuickBuyChat.useEffect"];
            }
        }
    }["QuickBuyChat.useEffect"], [
        step,
        scrollToBottom,
        checkScrollPosition
    ]);
    // Reset scroll flag when chat closes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuickBuyChat.useEffect": ()=>{
            if (step !== "chat") {
                hasScrolledOnOpenRef.current = false;
            }
        }
    }["QuickBuyChat.useEffect"], [
        step
    ]);
    // Scroll to bottom only when user sends a message
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuickBuyChat.useEffect": ()=>{
            if (messages.length > 0 && step === "chat") {
                const lastMessage = messages[messages.length - 1];
                const isNewUserMessage = lastMessage.id === lastUserMessageIdRef.current;
                // Only scroll if user just sent a message
                if (isNewUserMessage && lastMessage.sender === "user") {
                    const timeout = setTimeout({
                        "QuickBuyChat.useEffect.timeout": ()=>{
                            scrollToBottom(false);
                            // Check position after scroll to hide button
                            setTimeout({
                                "QuickBuyChat.useEffect.timeout": ()=>{
                                    checkScrollPosition();
                                }
                            }["QuickBuyChat.useEffect.timeout"], 500);
                        }
                    }["QuickBuyChat.useEffect.timeout"], 150);
                    return ({
                        "QuickBuyChat.useEffect": ()=>clearTimeout(timeout)
                    })["QuickBuyChat.useEffect"];
                } else {
                    // Check position when messages change (for new support messages)
                    const checkTimeout = setTimeout({
                        "QuickBuyChat.useEffect.checkTimeout": ()=>{
                            checkScrollPosition();
                        }
                    }["QuickBuyChat.useEffect.checkTimeout"], 200);
                    return ({
                        "QuickBuyChat.useEffect": ()=>clearTimeout(checkTimeout)
                    })["QuickBuyChat.useEffect"];
                }
            }
        }
    }["QuickBuyChat.useEffect"], [
        messages,
        step,
        scrollToBottom,
        checkScrollPosition
    ]);
    // Save customer info and chatId to localStorage whenever they change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuickBuyChat.useEffect": ()=>{
            if (("TURBOPACK compile-time value", "object") !== "undefined" && customerInfo.name && customerInfo.phone) {
                localStorage.setItem("quickBuyChat_customerInfo", JSON.stringify(customerInfo));
                // Save timestamp for expiration check
                localStorage.setItem("quickBuyChat_customerInfo_timestamp", Date.now().toString());
            }
        }
    }["QuickBuyChat.useEffect"], [
        customerInfo
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuickBuyChat.useEffect": ()=>{
            if (("TURBOPACK compile-time value", "object") !== "undefined" && chatId) {
                localStorage.setItem("quickBuyChat_chatId", chatId);
            }
        }
    }["QuickBuyChat.useEffect"], [
        chatId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuickBuyChat.useEffect": ()=>{
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
                            timestamp: new Date()
                        }
                    ]);
                }
            }
        }
    }["QuickBuyChat.useEffect"], [
        isOpen
    ]);
    // Check microphone permission
    const checkMicrophonePermission = async ()=>{
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            stream.getTracks().forEach((track)=>track.stop());
            return true;
        } catch (error) {
            return false;
        }
    };
    // Voice recording functions
    const startRecording = async ()=>{
        try {
            // Check if browser supports getUserMedia
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                toast({
                    title: "مرورگر شما پشتیبانی نمی‌کند",
                    description: "مرورگر شما از ضبط صدا پشتیبانی نمی‌کند. لطفاً از مرورگر جدیدتری استفاده کنید.",
                    variant: "destructive"
                });
                return;
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            setRecordingPermission(true);
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "audio/webm"
            });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            mediaRecorder.ondataavailable = (event)=>{
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
            mediaRecorder.onstop = ()=>{
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: mediaRecorder.mimeType || "audio/webm"
                });
                setAudioBlob(audioBlob);
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                // Stop all tracks
                stream.getTracks().forEach((track)=>track.stop());
            };
            mediaRecorder.onerror = (event)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("MediaRecorder error:", event);
                toast({
                    title: "خطا در ضبط صدا",
                    description: "خطایی در هنگام ضبط صدا رخ داد. لطفاً دوباره تلاش کنید.",
                    variant: "destructive"
                });
                stopRecording();
            };
            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            // Start timer
            recordingIntervalRef.current = setInterval(()=>{
                setRecordingTime((prev)=>prev + 1);
            }, 1000);
            toast({
                title: "ضبط صدا شروع شد",
                description: "در حال ضبط پیام صوتی..."
            });
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error starting recording:", error);
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
                duration: 5000
            });
            // Show permission guide for permission errors
            if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
                setShowPermissionGuide(true);
            }
        }
    };
    const stopRecording = ()=>{
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            try {
                mediaRecorderRef.current.stop();
                setIsRecording(false);
                if (recordingIntervalRef.current) {
                    clearInterval(recordingIntervalRef.current);
                }
                toast({
                    title: "ضبط صدا متوقف شد",
                    description: "پیام صوتی شما آماده است. می‌توانید آن را ذخیره یا لغو کنید."
                });
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error stopping recording:", error);
                toast({
                    title: "خطا",
                    description: "خطایی در توقف ضبط رخ داد.",
                    variant: "destructive"
                });
            }
        }
    };
    const cancelRecording = ()=>{
        stopRecording();
        setAudioBlob(null);
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            setAudioUrl(null);
        }
        setRecordingTime(0);
    };
    const saveRecording = async ()=>{
        if (audioBlob && audioUrl) {
            try {
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
                const audioFile = new File([
                    audioBlob
                ], `audio-${Date.now()}.${extension}`, {
                    type: mimeType
                });
                // Upload audio file
                const uploadedUrl = await uploadFile(audioFile, "audio");
                const attachment = {
                    id: Date.now().toString(),
                    type: "audio",
                    url: uploadedUrl,
                    name: `پیام صوتی ${formatTime(recordingTime)}`,
                    size: audioBlob.size,
                    duration: recordingTime
                };
                setAttachments((prev)=>[
                        ...prev,
                        attachment
                    ]);
                setAudioBlob(null);
                if (audioUrl) {
                    URL.revokeObjectURL(audioUrl);
                }
                setAudioUrl(null);
                setRecordingTime(0);
            } catch (error) {
            // Error already handled in uploadFile
            }
        }
    };
    const formatTime = (seconds)=>{
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };
    const loadChatHistory = async (customerInfo, savedChatId)=>{
        try {
            let url = "/api/chat?";
            if (savedChatId) {
                // Try to load by chatId first
                url += `chatId=${savedChatId}`;
            } else {
                // Find chat by customer info
                url += `customerPhone=${encodeURIComponent(customerInfo.phone)}`;
                if (customerInfo.name) {
                    url += `&customerName=${encodeURIComponent(customerInfo.name)}`;
                }
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("خطا در بارگذاری تاریخچه چت");
            }
            const data = await response.json();
            if (data.success && data.data) {
                const { chat, messages } = data.data;
                if (chat && messages && messages.length > 0) {
                    // Set chatId
                    setChatId(chat.id);
                    if ("TURBOPACK compile-time truthy", 1) {
                        localStorage.setItem("quickBuyChat_chatId", chat.id);
                    }
                    // Convert database messages to component messages
                    const loadedMessages = messages.map((msg)=>{
                        // The API already merges attachments from JSONB and chat_attachments table
                        // So msg.attachments should be an array already
                        let finalAttachments = [];
                        if (msg.attachments) {
                            if (Array.isArray(msg.attachments)) {
                                // Already an array from API merge
                                finalAttachments = msg.attachments.map((att)=>{
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
                                        type: detectedType || att.type || "file",
                                        url: url,
                                        name: att.name || att.fileName,
                                        size: att.size || att.fileSize,
                                        duration: att.duration
                                    };
                                });
                            } else if (typeof msg.attachments === 'string') {
                                // Try to parse JSON string
                                try {
                                    const parsed = JSON.parse(msg.attachments);
                                    if (Array.isArray(parsed)) {
                                        finalAttachments = parsed.map((att)=>{
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
                                                type: detectedType || att.type || "file",
                                                url: url,
                                                name: att.name || att.fileName,
                                                size: att.size || att.fileSize,
                                                duration: att.duration
                                            };
                                        });
                                    }
                                } catch (e) {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error parsing attachments JSON:", e);
                                }
                            }
                        }
                        // Filter out attachments with temporary URLs (blob/data URLs)
                        const validAttachments = finalAttachments.filter((att)=>{
                            const url = att.url;
                            // Only keep attachments with valid URLs (not blob or data URLs)
                            return url && !url.startsWith('blob:') && !url.startsWith('data:') && (url.startsWith('http') || url.startsWith('/'));
                        });
                        // Debug: log all attachments
                        if (finalAttachments.length > 0) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug(`Loaded message ${msg.id} has ${validAttachments.length} valid attachment(s) out of ${finalAttachments.length} total:`, validAttachments.map((att)=>({
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
                            sender: msg.sender,
                            timestamp: new Date(msg.createdAt),
                            attachments: validAttachments.length > 0 ? validAttachments : undefined,
                            status: msg.sender === "user" ? msg.status || "sent" : undefined
                        };
                    });
                    // Ensure all user messages have status from database
                    const messagesWithStatus = loadedMessages.map((msg)=>{
                        if (msg.sender === "user" && !msg.status) {
                            return {
                                ...msg,
                                status: "sent"
                            };
                        }
                        return msg;
                    });
                    setMessages(messagesWithStatus);
                    // Set the last message ID for polling
                    if (loadedMessages.length > 0) {
                        const lastMessageId = loadedMessages[loadedMessages.length - 1].id;
                        lastPolledMessageIdRef.current = lastMessageId;
                        // Also save to localStorage for global polling
                        if ("TURBOPACK compile-time truthy", 1) {
                            localStorage.setItem("quickBuyChat_lastMessageId", lastMessageId);
                        }
                        // Check if admin has already replied - if yes, don't show system message
                        const hasAdminMessage = messagesWithStatus.some((msg)=>msg.sender === "support" && msg.id !== "1");
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
                            timestamp: new Date()
                        }
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
                        timestamp: new Date()
                    }
                ]);
                systemMessageShownRef.current = false; // Reset for new chat
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error loading chat history:", error);
            // On error, still go to chat step
            setStep("chat");
            setMessages([
                {
                    id: "1",
                    text: `سلام ${customerInfo.name}! خوش آمدید. لطفاً محصول مورد نظر خود را ذکر کنید یا سوال خود را بپرسید.`,
                    sender: "support",
                    timestamp: new Date()
                }
            ]);
            systemMessageShownRef.current = false; // Reset for new chat
        }
    };
    // Mark support messages as delivered (when chat is open)
    const markSupportMessagesAsDelivered = async ()=>{
        if (!chatId) return;
        try {
            await fetch("/api/chat/status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chatId,
                    sender: "user",
                    action: "delivered"
                })
            });
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error marking messages as delivered:", error);
        }
    };
    // Mark support messages as read (when user views messages)
    const markSupportMessagesAsRead = async ()=>{
        if (!chatId) return;
        try {
            await fetch("/api/chat/status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chatId,
                    sender: "user",
                    action: "read"
                })
            });
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error marking messages as read:", error);
        }
    };
    // Poll for new messages
    const pollForNewMessages = async ()=>{
        if (!chatId || !isOpen || step !== "chat") return;
        try {
            setIsPolling(true);
            const lastMessageId = lastPolledMessageIdRef.current;
            let url = `/api/chat?chatId=${chatId}`;
            if (lastMessageId && lastMessageId !== "1") {
                // Poll for messages after the last one we have
                url += `&lastMessageId=${lastMessageId}`;
            }
            const response = await fetch(url);
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
                    setTimeout(()=>{
                        markSupportMessagesAsRead();
                    }, 1000);
                }
                // Don't show notifications when chat is open - user is already viewing
                // Global polling handles notifications when chat is closed
                // Convert database messages to component messages
                const formattedMessages = newMessages.map((msg)=>{
                    let finalAttachments = [];
                    if (msg.attachments) {
                        if (Array.isArray(msg.attachments)) {
                            finalAttachments = msg.attachments.map((att)=>{
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
                                    type: detectedType || att.type || "file",
                                    url: url,
                                    name: att.name || att.fileName,
                                    size: att.size || att.fileSize,
                                    duration: att.duration
                                };
                            });
                        }
                    }
                    // Filter out attachments with temporary URLs (blob/data URLs)
                    const validAttachments = finalAttachments.filter((att)=>{
                        const url = att.url;
                        // Only keep attachments with valid URLs (not blob or data URLs)
                        return url && !url.startsWith('blob:') && !url.startsWith('data:') && (url.startsWith('http') || url.startsWith('/'));
                    });
                    return {
                        id: msg.id,
                        text: msg.text || "",
                        sender: msg.sender,
                        timestamp: new Date(msg.createdAt),
                        attachments: validAttachments.length > 0 ? validAttachments : undefined,
                        status: msg.sender === "user" ? msg.status || "sent" : undefined
                    };
                });
                // Add only new messages that we don't already have and update status of existing ones
                setMessages((prev)=>{
                    const existingIds = new Set(prev.map((m)=>m.id));
                    const uniqueNewMessages = formattedMessages.filter((msg)=>!existingIds.has(msg.id));
                    // Update status of existing messages from database (for user messages)
                    // Also remove any system messages (they're not in database)
                    const updatedPrev = prev.filter((existingMsg)=>!existingMsg.id.startsWith("system-")) // Remove system messages
                    .map((existingMsg)=>{
                        const dbMsg = formattedMessages.find((m)=>m.id === existingMsg.id);
                        if (dbMsg && existingMsg.sender === "user" && dbMsg.status && existingMsg.status !== dbMsg.status) {
                            return {
                                ...existingMsg,
                                status: dbMsg.status
                            };
                        }
                        return existingMsg;
                    });
                    if (uniqueNewMessages.length > 0) {
                        // Remove system message if admin has replied
                        const hasAdminMessage = uniqueNewMessages.some((msg)=>msg.sender === "support");
                        let filteredPrev = updatedPrev;
                        if (hasAdminMessage && systemMessageIdRef.current) {
                            filteredPrev = updatedPrev.filter((msg)=>msg.id !== systemMessageIdRef.current);
                            systemMessageIdRef.current = null;
                            systemMessageShownRef.current = true; // Admin replied, don't show system message again
                        }
                        // Update last polled message ID to the latest message (not just new ones)
                        const allMessages = [
                            ...filteredPrev,
                            ...uniqueNewMessages
                        ];
                        const latestMessage = allMessages[allMessages.length - 1];
                        if (latestMessage) {
                            lastPolledMessageIdRef.current = latestMessage.id;
                            // Also save to localStorage for global polling
                            if ("TURBOPACK compile-time truthy", 1) {
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
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error polling for new messages:", error);
        // Don't show error toast for polling failures to avoid spamming
        } finally{
            setIsPolling(false);
        }
    };
    // Check if support is typing
    const checkSupportTyping = async ()=>{
        if (!chatId) return;
        try {
            const response = await fetch(`/api/chat/typing?chatId=${chatId}&sender=support`);
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setIsSupportTyping(data.data.isTyping || false);
                }
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error checking typing status:", error);
        }
    };
    // Send typing status
    const sendTypingStatus = async (typing)=>{
        if (!chatId) return;
        try {
            await fetch("/api/chat/typing", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chatId,
                    sender: "user",
                    isTyping: typing
                })
            });
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error sending typing status:", error);
        }
    };
    // Request notification permission on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuickBuyChat.useEffect": ()=>{
            requestPermission();
        }
    }["QuickBuyChat.useEffect"], []);
    // Listen for openChat event from notifications
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuickBuyChat.useEffect": ()=>{
            const handleOpenChat = {
                "QuickBuyChat.useEffect.handleOpenChat": (event)=>{
                    const customEvent = event;
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
                        if (eventChatId && ("TURBOPACK compile-time value", "object") !== "undefined") {
                            const currentChatId = localStorage.getItem("quickBuyChat_chatId");
                            if (currentChatId !== eventChatId) {
                                localStorage.setItem("quickBuyChat_chatId", eventChatId);
                                // Reload chat messages
                                setTimeout({
                                    "QuickBuyChat.useEffect.handleOpenChat": ()=>{
                                        if (isOpen && step === "chat") {
                                            pollForNewMessages();
                                        }
                                    }
                                }["QuickBuyChat.useEffect.handleOpenChat"], 500);
                            }
                        }
                    }
                }
            }["QuickBuyChat.useEffect.handleOpenChat"];
            window.addEventListener("openChat", handleOpenChat);
            return ({
                "QuickBuyChat.useEffect": ()=>{
                    window.removeEventListener("openChat", handleOpenChat);
                }
            })["QuickBuyChat.useEffect"];
        }
    }["QuickBuyChat.useEffect"], [
        isOpen,
        onOpenChange,
        chatId,
        step,
        pollForNewMessages
    ]);
    // Start/stop polling based on chat state
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuickBuyChat.useEffect": ()=>{
            if (isOpen && step === "chat" && chatId) {
                // Mark support messages as delivered when chat opens (user is online)
                markSupportMessagesAsDelivered();
                // Mark support messages as read after a short delay (user is viewing)
                const readTimeout = setTimeout({
                    "QuickBuyChat.useEffect.readTimeout": ()=>{
                        markSupportMessagesAsRead();
                    }
                }["QuickBuyChat.useEffect.readTimeout"], 2000); // Mark as read after 2 seconds of viewing
                // Check typing status periodically
                checkSupportTyping();
                // Optimized: Check typing status every 3 seconds (reduced from 2s)
                typingPollIntervalRef.current = setInterval({
                    "QuickBuyChat.useEffect": ()=>{
                        checkSupportTyping();
                    }
                }["QuickBuyChat.useEffect"], 3000);
                // Optimized: Poll every 5 seconds for new messages (reduced from 3s to reduce server load)
                pollingIntervalRef.current = setInterval({
                    "QuickBuyChat.useEffect": ()=>{
                        pollForNewMessages();
                        // Keep marking as delivered while chat is open (user is online)
                        markSupportMessagesAsDelivered();
                    }
                }["QuickBuyChat.useEffect"], 5000);
                // Also poll immediately when entering chat
                pollForNewMessages();
                // Check admin status when chat opens
                checkStatus();
                return ({
                    "QuickBuyChat.useEffect": ()=>{
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
                    }
                })["QuickBuyChat.useEffect"];
            }
        }
    }["QuickBuyChat.useEffect"], [
        isOpen,
        step,
        chatId,
        checkStatus
    ]);
    const handlePlayAudio = (attachmentId, url)=>{
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
            audio.onended = ()=>{
                setIsPlayingAudio(null);
            };
        }
    };
    const saveChatToDatabase = async (showToast = true, retryCount = 0)=>{
        if (messages.length === 0) return;
        const MAX_RETRIES = 3;
        const RETRY_DELAY = 1000; // 1 second
        try {
            setIsSaving(true);
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chatId: chatId || undefined,
                    customerInfo,
                    messages: messages.map((msg)=>({
                            id: msg.id,
                            text: msg.text,
                            sender: msg.sender,
                            timestamp: msg.timestamp.toISOString(),
                            attachments: msg.attachments ? msg.attachments.filter((att)=>{
                                const url = att.url;
                                // Only include attachments with valid URLs (not blob or data URLs)
                                return url && !url.startsWith('blob:') && !url.startsWith('data:') && (url.startsWith('http') || url.startsWith('/'));
                            }) : []
                        }))
                })
            });
            if (!response.ok) {
                const error = await response.json().catch(()=>({
                        error: "خطا در ذخیره چت"
                    }));
                throw new Error(error.error || "خطا در ذخیره چت");
            }
            const data = await response.json();
            if (data.data.chatId) {
                setChatId(data.data.chatId);
                if ("TURBOPACK compile-time truthy", 1) {
                    localStorage.setItem("quickBuyChat_chatId", data.data.chatId);
                }
            }
            if (showToast) {
                toast({
                    title: "ذخیره شد",
                    description: "پیام‌های شما با موفقیت ذخیره شدند"
                });
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error saving chat:", error);
            // Retry logic for network errors or 5xx errors
            if (retryCount < MAX_RETRIES && (error.message?.includes("fetch") || error.message?.includes("network") || error.message?.includes("timeout") || error.code === "NETWORK_ERROR")) {
                // Exponential backoff
                const delay = RETRY_DELAY * Math.pow(2, retryCount);
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug(`Retrying save in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
                setTimeout(()=>{
                    saveChatToDatabase(showToast, retryCount + 1);
                }, delay);
                return;
            }
            if (showToast) {
                toast({
                    title: "خطا در ذخیره",
                    description: error.message || "لطفاً دوباره تلاش کنید",
                    variant: "destructive"
                });
            }
        } finally{
            if (retryCount === 0) {
                // Only set saving to false if not retrying
                setIsSaving(false);
            }
        }
    };
    // Handle reply
    const handleReply = (msg)=>{
        setReplyingTo(msg);
        setEditingMessage(null);
    };
    // Handle edit
    const handleEdit = (msg)=>{
        setEditingMessage(msg);
        setReplyingTo(null);
        setMessage(msg.text || "");
    };
    // Handle delete
    const handleDelete = async (messageId)=>{
        try {
            const response = await fetch(`/api/chat/message/${messageId}`, {
                method: "DELETE"
            });
            if (response.ok) {
                setMessages((prev)=>prev.filter((msg)=>msg.id !== messageId));
                toast({
                    title: "موفق",
                    description: "پیام با موفقیت حذف شد"
                });
            } else {
                throw new Error("خطا در حذف پیام");
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error deleting message:", error);
            toast({
                title: "خطا",
                description: "خطا در حذف پیام",
                variant: "destructive"
            });
        }
    };
    const handleSendMessage = async ()=>{
        if (!message.trim() && attachments.length === 0) return;
        // If editing, update the message instead of sending new one
        if (editingMessage) {
            try {
                const response = await fetch(`/api/chat/message/${editingMessage.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        text: message,
                        attachments: attachments
                    })
                });
                if (response.ok) {
                    setMessages((prev)=>prev.map((msg)=>msg.id === editingMessage.id ? {
                                ...msg,
                                text: message,
                                attachments: attachments
                            } : msg));
                    setEditingMessage(null);
                    setMessage("");
                    setAttachments([]);
                    toast({
                        title: "موفق",
                        description: "پیام ویرایش شد"
                    });
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error editing message:", error);
                toast({
                    title: "خطا",
                    description: "خطا در ویرایش پیام",
                    variant: "destructive"
                });
            }
            return;
        }
        // Filter out attachments with temporary URLs (only keep valid uploaded URLs)
        const validAttachments = attachments.filter((att)=>{
            const url = att.url;
            // Only keep attachments with valid URLs (not blob or data URLs)
            return url && !url.startsWith('blob:') && !url.startsWith('data:') && (url.startsWith('http') || url.startsWith('/'));
        });
        // Don't send message if no valid attachments and no text
        if (!message.trim() && validAttachments.length === 0) {
            toast({
                title: "خطا",
                description: "لطفاً یک پیام یا فایل معتبر اضافه کنید",
                variant: "destructive"
            });
            return;
        }
        let messageText = message;
        if (replyingTo) {
            messageText = `در پاسخ به: ${replyingTo.text}\n\n${message}`;
        }
        const newMessage = {
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: messageText,
            sender: "user",
            timestamp: new Date(),
            attachments: validAttachments.length > 0 ? validAttachments : undefined,
            status: "sending"
        };
        // Add message to state IMMEDIATELY (optimistic update)
        setMessages((prev)=>{
            const updated = [
                ...prev,
                newMessage
            ];
            // Update last polled message ID
            lastPolledMessageIdRef.current = newMessage.id;
            // Track user message for scroll behavior
            lastUserMessageIdRef.current = newMessage.id;
            // Also save to localStorage for global polling
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem("quickBuyChat_lastMessageId", newMessage.id);
            }
            return updated;
        });
        // Scroll to bottom after adding message (force scroll for user messages)
        setTimeout(()=>{
            scrollToBottom(false);
        }, 150);
        // Clear input immediately for better UX
        const messageAttachments = [
            ...attachments
        ];
        setMessage("");
        setAttachments([]);
        setShowAttachmentOptions(false);
        setReplyingTo(null);
        // Save to database
        try {
            setIsSaving(true);
            // Prepare messages with filtered attachments and status
            const messagesToSave = [
                ...messages,
                newMessage
            ].map((msg)=>({
                    id: msg.id,
                    text: msg.text,
                    sender: msg.sender,
                    timestamp: msg.timestamp.toISOString(),
                    status: msg.id === newMessage.id ? "sent" : msg.status || (msg.sender === "user" ? "sent" : undefined),
                    attachments: msg.attachments ? msg.attachments.filter((att)=>{
                        const url = att.url;
                        return url && !url.startsWith('blob:') && !url.startsWith('data:') && (url.startsWith('http') || url.startsWith('/'));
                    }) : []
                }));
            // Log the new message being sent
            if (newMessage.attachments && newMessage.attachments.length > 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug(`📤 Sending new message with ${newMessage.attachments.length} attachment(s):`, newMessage.attachments.map((att)=>({
                        id: att.id,
                        type: att.type,
                        url: att.url,
                        name: att.name
                    })));
            }
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chatId: chatId || undefined,
                    customerInfo,
                    messages: messagesToSave
                })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                throw new Error(errorData.message || "خطا در ذخیره پیام");
            }
            const data = await response.json();
            // Update chatId if provided
            if (data.data?.chatId) {
                setChatId(data.data.chatId);
                if ("TURBOPACK compile-time truthy", 1) {
                    localStorage.setItem("quickBuyChat_chatId", data.data.chatId);
                }
            }
            // Get the actual saved message from response to get real status from database
            const savedMessage = data.data?.messages?.find((m)=>m.id === newMessage.id);
            const actualStatus = savedMessage?.status || "sent";
            // Update message status from database response immediately
            setMessages((prev)=>{
                return prev.map((msg)=>msg.id === newMessage.id ? {
                        ...msg,
                        status: actualStatus
                    } : msg);
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
                                onOpen: ()=>{
                                    if (!isOpen) {
                                        onOpenChange(true);
                                    }
                                },
                                chatId: chatId || undefined,
                                metadata: {
                                    isAdminOffline: true,
                                    isAdmin: false
                                }
                            });
                        }
                    }
                }
            } catch (adminError) {
                // Ignore admin status check errors
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error checking admin status:", adminError);
            }
        // Note: Status will be updated to "delivered" by admin when they open the chat (admin is online)
        // and to "read" when they view the messages. Status updates come from polling.
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error saving message:", error);
            // Update message status to "sent" even on error (so user sees it was attempted)
            setMessages((prev)=>{
                return prev.map((msg)=>msg.id === newMessage.id ? {
                        ...msg,
                        status: "sent"
                    } : msg);
            });
            // Restore input on error
            setMessage(messageText);
            setAttachments(messageAttachments);
            toast({
                title: "خطا",
                description: error.message || "خطا در ذخیره پیام. لطفاً دوباره تلاش کنید.",
                variant: "destructive"
            });
        } finally{
            setIsSaving(false);
        }
        // پاسخ خودکار - فقط یک بار و فقط اگر قبلاً نمایش داده نشده
        if (!systemMessageShownRef.current) {
            setTimeout(async ()=>{
                const systemMessageId = `system-${Date.now()}`;
                systemMessageIdRef.current = systemMessageId;
                systemMessageShownRef.current = true;
                const autoReply = {
                    id: systemMessageId,
                    text: "متشکرم! پیام شما دریافت شد. همکاران ما در اسرع وقت با شما تماس خواهند گرفت.",
                    sender: "support",
                    timestamp: new Date()
                };
                setMessages((prev)=>[
                        ...prev,
                        autoReply
                    ]);
            // Don't save system message to database - it's temporary
            }, 1000);
        }
    };
    const uploadFile = async (file, type, retryCount = 0)=>{
        const MAX_RETRIES = 3;
        const RETRY_DELAY = 2000; // 2 seconds
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", type);
            const response = await fetch("/api/chat/upload", {
                method: "POST",
                body: formData
            });
            if (!response.ok) {
                const error = await response.json().catch(()=>({
                        error: "خطا در آپلود فایل"
                    }));
                throw new Error(error.error || "خطا در آپلود فایل");
            }
            const data = await response.json();
            return data.data.url;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error uploading file:", error);
            // Retry logic for network errors
            if (retryCount < MAX_RETRIES && (error.message?.includes("fetch") || error.message?.includes("network") || error.message?.includes("timeout") || error.code === "NETWORK_ERROR" || error.name === "TypeError")) {
                const delay = RETRY_DELAY * Math.pow(2, retryCount);
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug(`Retrying file upload in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
                // Show toast only on first failure
                if (retryCount === 0) {
                    toast({
                        title: "در حال تلاش مجدد...",
                        description: "خطا در آپلود فایل. در حال تلاش مجدد...",
                        duration: 2000
                    });
                }
                await new Promise((resolve)=>setTimeout(resolve, delay));
                return uploadFile(file, type, retryCount + 1);
            }
            toast({
                title: "خطا در آپلود فایل",
                description: error.message || "لطفاً دوباره تلاش کنید",
                variant: "destructive"
            });
            throw error;
        }
    };
    const handleFileSelect = async (e, type)=>{
        const files = e.target.files;
        if (!files || files.length === 0) return;
        for (const file of Array.from(files)){
            try {
                // Upload file to server
                const fileUrl = await uploadFile(file, type);
                const attachment = {
                    id: Date.now().toString() + Math.random(),
                    type,
                    name: file.name,
                    size: file.size,
                    url: fileUrl
                };
                setAttachments((prev)=>[
                        ...prev,
                        attachment
                    ]);
            } catch (error) {
            // Error already handled in uploadFile
            }
        }
        e.target.value = "";
    };
    const handleRemoveAttachment = (id)=>{
        setAttachments((prev)=>{
            const attachment = prev.find((a)=>a.id === id);
            if (attachment?.url) {
                URL.revokeObjectURL(attachment.url);
            }
            return prev.filter((a)=>a.id !== id);
        });
    };
    const handleLocationShare = ()=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=>{
                const attachment = {
                    id: Date.now().toString(),
                    type: "location",
                    url: `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`,
                    name: "موقعیت مکانی"
                };
                setAttachments((prev)=>[
                        ...prev,
                        attachment
                    ]);
                setShowAttachmentOptions(false);
            }, (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error getting location:", error);
                alert("خطا در دریافت موقعیت مکانی");
            });
        } else {
            alert("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند");
        }
    };
    const formatFileSize = (bytes)=>{
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };
    const handleSubmitInfo = async ()=>{
        if (!customerInfo.name || !customerInfo.phone) {
            return;
        }
        // Save customer info to localStorage
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem("quickBuyChat_customerInfo", JSON.stringify(customerInfo));
        }
        // Reset system message flag for new chat
        systemMessageShownRef.current = false;
        systemMessageIdRef.current = null;
        setStep("chat");
        const welcomeMessage = {
            id: Date.now().toString(),
            text: `سلام ${customerInfo.name}! اطلاعات شما ثبت شد. لطفاً محصول مورد نظر خود را ذکر کنید یا سوال خود را بپرسید.`,
            sender: "support",
            timestamp: new Date()
        };
        setMessages((prev)=>[
                ...prev,
                welcomeMessage
            ]);
        // Save initial chat to database
        await saveChatToDatabase(false); // Don't show toast for welcome message
    };
    const renderContent = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetHeader"], {
                    className: "px-4 sm:px-6 py-2 border-b border-border/40",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetTitle"], {
                                    className: "text-base font-semibold text-foreground flex items-center gap-2",
                                    children: [
                                        "خرید سریع",
                                        step === "chat" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$chat$2f$online$2d$status$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OnlineStatusBadge"], {
                                            isOnline: isOnline,
                                            lastSeen: lastSeen,
                                            showText: false
                                        }, void 0, false, {
                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                            lineNumber: 1635,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 1632,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                lineNumber: 1631,
                                columnNumber: 11
                            }, this),
                            step === "chat" && customerInfo.name && customerInfo.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                onClick: ()=>{
                                    setStep("info");
                                    setMessages([
                                        {
                                            id: "1",
                                            text: "سلام! خوش آمدید. برای خرید سریع لطفاً اطلاعات زیر را وارد کنید:",
                                            sender: "support",
                                            timestamp: new Date()
                                        }
                                    ]);
                                },
                                className: "h-8 w-8 rounded-lg hover:bg-primary/10 transition-colors",
                                title: "تغییر اطلاعات",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-4 w-4",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    xmlns: "http://www.w3.org/2000/svg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                            lineNumber: 1663,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: "12",
                                            cy: "7",
                                            r: "4",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                            lineNumber: 1670,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 1657,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                lineNumber: 1640,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                        lineNumber: 1630,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                    lineNumber: 1629,
                    columnNumber: 7
                }, this),
                step === "info" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-gradient-to-b from-background via-background to-muted/10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                y: -10
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            className: "text-center pb-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-3 shadow-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "h-8 w-8 text-primary",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        xmlns: "http://www.w3.org/2000/svg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
                                                stroke: "currentColor",
                                                strokeWidth: "2",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round"
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 1700,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M8 10h.01M12 10h.01M16 10h.01",
                                                stroke: "currentColor",
                                                strokeWidth: "2",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round"
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 1707,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                        lineNumber: 1694,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 1693,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-muted-foreground leading-relaxed",
                                    children: "لطفاً اطلاعات زیر را برای شروع خرید سریع وارد کنید"
                                }, void 0, false, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 1716,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                            lineNumber: 1688,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            className: "space-y-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-semibold text-foreground flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "h-4 w-4 text-primary",
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
                                                            stroke: "currentColor",
                                                            strokeWidth: "2",
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                            lineNumber: 1734,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                            cx: "12",
                                                            cy: "7",
                                                            r: "4",
                                                            stroke: "currentColor",
                                                            strokeWidth: "2",
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                            lineNumber: 1741,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 1728,
                                                    columnNumber: 17
                                                }, this),
                                                "نام و نام خانوادگی",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-destructive text-xs",
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 1752,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                            lineNumber: 1727,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    type: "text",
                                                    placeholder: "مثال: علی احمدی",
                                                    value: customerInfo.name,
                                                    onChange: (e)=>setCustomerInfo({
                                                            ...customerInfo,
                                                            name: e.target.value
                                                        }),
                                                    className: "pr-12 h-12 text-base border-2 border-border/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all bg-background/50 hover:bg-background"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 1755,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "h-5 w-5 text-muted-foreground/60 group-focus-within:text-primary transition-colors",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
                                                                stroke: "currentColor",
                                                                strokeWidth: "2",
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                lineNumber: 1771,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                cx: "12",
                                                                cy: "7",
                                                                r: "4",
                                                                stroke: "currentColor",
                                                                strokeWidth: "2",
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                lineNumber: 1778,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                        lineNumber: 1765,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 1764,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                            lineNumber: 1754,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 1726,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-semibold text-foreground flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                    className: "h-4 w-4 text-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 1794,
                                                    columnNumber: 17
                                                }, this),
                                                "شماره تماس",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-destructive text-xs",
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 1796,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                            lineNumber: 1793,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    type: "tel",
                                                    placeholder: "09123456789",
                                                    value: customerInfo.phone,
                                                    onChange: (e)=>setCustomerInfo({
                                                            ...customerInfo,
                                                            phone: e.target.value
                                                        }),
                                                    className: "pr-12 h-12 text-base border-2 border-border/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all bg-background/50 hover:bg-background"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 1799,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                        className: "h-5 w-5 text-muted-foreground/60 group-focus-within:text-primary transition-colors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                        lineNumber: 1809,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 1808,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                            lineNumber: 1798,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 1792,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-semibold text-foreground flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                    className: "h-4 w-4 text-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 1816,
                                                    columnNumber: 17
                                                }, this),
                                                "ایمیل",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-muted-foreground font-normal",
                                                    children: "(اختیاری)"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 1818,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                            lineNumber: 1815,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    type: "email",
                                                    placeholder: "example@email.com",
                                                    value: customerInfo.email,
                                                    onChange: (e)=>setCustomerInfo({
                                                            ...customerInfo,
                                                            email: e.target.value
                                                        }),
                                                    className: "pr-12 h-12 text-base border-2 border-border/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all bg-background/50 hover:bg-background"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 1821,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                        className: "h-5 w-5 text-muted-foreground/60 group-focus-within:text-primary transition-colors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                        lineNumber: 1831,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 1830,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                            lineNumber: 1820,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 1814,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                            lineNumber: 1721,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                delay: 0.15
                            },
                            className: "pt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: handleSubmitInfo,
                                    disabled: !customerInfo.name || !customerInfo.phone,
                                    className: "w-full h-13 text-base font-semibold bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed rounded-xl",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center justify-center gap-2",
                                        children: [
                                            "ادامه",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                animate: {
                                                    x: [
                                                        0,
                                                        4,
                                                        0
                                                    ]
                                                },
                                                transition: {
                                                    repeat: Infinity,
                                                    duration: 1.5,
                                                    delay: 0.5
                                                },
                                                children: "→"
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 1850,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                        lineNumber: 1848,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 1843,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground text-center mt-3",
                                    children: "با ادامه، شما شرایط و قوانین ما را می‌پذیرید"
                                }, void 0, false, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 1858,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                            lineNumber: 1837,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                    lineNumber: 1686,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: messagesContainerRef,
                            className: "flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6 bg-gradient-to-b from-background via-background/95 to-muted/5 scroll-smooth",
                            children: [
                                messages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        y: 20
                                    },
                                    animate: {
                                        opacity: 1,
                                        y: 0
                                    },
                                    className: "flex flex-col items-center justify-center h-full min-h-[200px] text-center px-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 shadow-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "h-10 w-10 text-primary/60",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                xmlns: "http://www.w3.org/2000/svg",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
                                                        stroke: "currentColor",
                                                        strokeWidth: "2",
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                        lineNumber: 1879,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M8 10h.01M12 10h.01M16 10h.01",
                                                        stroke: "currentColor",
                                                        strokeWidth: "2",
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                        lineNumber: 1886,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 1873,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                            lineNumber: 1872,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-muted-foreground text-base font-medium leading-relaxed",
                                            children: "هنوز پیامی ارسال نشده است"
                                        }, void 0, false, {
                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                            lineNumber: 1895,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-muted-foreground/70 text-sm mt-2 leading-relaxed",
                                            children: "پیام خود را بنویسید..."
                                        }, void 0, false, {
                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                            lineNumber: 1896,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 1867,
                                    columnNumber: 15
                                }, this),
                                messages.map((msg, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                        initial: {
                                            opacity: 0,
                                            y: 10
                                        },
                                        animate: {
                                            opacity: 1,
                                            y: 0
                                        },
                                        exit: {
                                            opacity: 0
                                        },
                                        transition: {
                                            duration: 0.2,
                                            ease: "easeOut"
                                        },
                                        className: `flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-end gap-2 group`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-lg px-2.5 sm:px-3 py-2 transition-all ${msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground border border-border/40"}`,
                                            children: [
                                                msg.text && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words mb-1.5",
                                                    children: msg.text
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 1919,
                                                    columnNumber: 23
                                                }, this),
                                                msg.attachments && msg.attachments.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `space-y-2 ${msg.text ? "mt-2" : ""}`,
                                                    children: msg.attachments.map((attachment, attIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                            initial: {
                                                                opacity: 0,
                                                                scale: 0.9
                                                            },
                                                            animate: {
                                                                opacity: 1,
                                                                scale: 1
                                                            },
                                                            transition: {
                                                                delay: attIndex * 0.1
                                                            },
                                                            className: "rounded-xl overflow-hidden",
                                                            children: [
                                                                attachment.type === "image" && attachment.url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: attachment.url,
                                                                    alt: attachment.name || "تصویر",
                                                                    className: "max-w-full max-h-[150px] sm:max-h-[180px] rounded cursor-pointer hover:opacity-90 transition-all",
                                                                    onClick: ()=>window.open(attachment.url, "_blank"),
                                                                    onError: (e)=>{
                                                                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Image load error:", attachment.url);
                                                                        e.target.style.display = "none";
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                    lineNumber: 1934,
                                                                    columnNumber: 31
                                                                }, this),
                                                                attachment.type === "file" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                    href: attachment.url,
                                                                    target: "_blank",
                                                                    rel: "noopener noreferrer",
                                                                    download: attachment.name,
                                                                    className: "flex items-center gap-2 p-2 bg-background/50 rounded hover:bg-background/70 transition-all text-xs",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                            className: "h-3.5 w-3.5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                            lineNumber: 1953,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium truncate",
                                                                            children: attachment.name || "فایل"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                            lineNumber: 1954,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                    lineNumber: 1946,
                                                                    columnNumber: 31
                                                                }, this),
                                                                attachment.type === "location" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                    href: attachment.url,
                                                                    target: "_blank",
                                                                    rel: "noopener noreferrer",
                                                                    className: "flex items-center gap-2 p-2 bg-background/50 rounded hover:bg-background/70 transition-all text-xs",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                            className: "h-3.5 w-3.5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                            lineNumber: 1964,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium",
                                                                            children: attachment.name || "موقعیت"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                            lineNumber: 1965,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                    lineNumber: 1958,
                                                                    columnNumber: 31
                                                                }, this),
                                                                attachment.type === "audio" && attachment.url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2 p-2 bg-background/50 rounded",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
                                                                            className: "h-3.5 w-3.5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                            lineNumber: 1970,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("audio", {
                                                                            controls: true,
                                                                            className: "flex-1 h-7 text-xs",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                                                                                src: attachment.url
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                lineNumber: 1972,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                            lineNumber: 1971,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                    lineNumber: 1969,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, attachment.id || `att-${index}-${attIndex}`, true, {
                                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                            lineNumber: 1926,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 1924,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `flex items-center gap-1.5 mt-1.5 pt-1.5 border-t ${msg.sender === "user" ? "border-primary-foreground/20 justify-end" : "border-border/30 justify-start"}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-[10px] sm:text-xs ${msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`,
                                                            children: new Date(msg.timestamp).toLocaleTimeString("fa-IR", {
                                                                hour: "2-digit",
                                                                minute: "2-digit"
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                            lineNumber: 1985,
                                                            columnNumber: 23
                                                        }, this),
                                                        msg.sender === "user" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                msg.status === "sending" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                    className: "h-3 w-3 text-primary-foreground/50 animate-spin"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                    lineNumber: 1998,
                                                                    columnNumber: 29
                                                                }, this),
                                                                msg.status === "sent" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                    className: "h-3 w-3 text-primary-foreground/40"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                    lineNumber: 2001,
                                                                    columnNumber: 29
                                                                }, this),
                                                                msg.status === "delivered" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCheck$3e$__["CheckCheck"], {
                                                                    className: "h-3 w-3 text-primary-foreground/40"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                    lineNumber: 2004,
                                                                    columnNumber: 29
                                                                }, this),
                                                                msg.status === "read" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCheck$3e$__["CheckCheck"], {
                                                                    className: "h-3 w-3 text-primary-foreground/70"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                    lineNumber: 2007,
                                                                    columnNumber: 29
                                                                }, this),
                                                                !msg.status && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                    className: "h-3 w-3 text-primary-foreground/40"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                    lineNumber: 2010,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                                                        asChild: true,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                            variant: "ghost",
                                                                            size: "icon",
                                                                            className: "h-6 w-6 hover:bg-background/20",
                                                                            onClick: (e)=>{
                                                                                e.stopPropagation();
                                                                            },
                                                                            title: "گزینه‌های بیشتر",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                                                                                className: "h-3.5 w-3.5"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                lineNumber: 2026,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                            lineNumber: 2017,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                        lineNumber: 2016,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                                                        align: msg.sender === "user" ? "end" : "start",
                                                                        className: "min-w-[140px]",
                                                                        onClick: (e)=>e.stopPropagation(),
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                                onClick: (e)=>{
                                                                                    e.stopPropagation();
                                                                                    handleReply(msg);
                                                                                },
                                                                                className: "cursor-pointer",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$reply$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Reply$3e$__["Reply"], {
                                                                                        className: "h-4 w-4 ml-2"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                        lineNumber: 2041,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        children: "پاسخ"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                        lineNumber: 2042,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                lineNumber: 2034,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            msg.sender === "user" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                        lineNumber: 2046,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                                        onClick: (e)=>{
                                                                                            e.stopPropagation();
                                                                                            handleEdit(msg);
                                                                                        },
                                                                                        className: "cursor-pointer",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__["Edit2"], {
                                                                                                className: "h-4 w-4 ml-2"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                                lineNumber: 2054,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                children: "ویرایش"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                                lineNumber: 2055,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                        lineNumber: 2047,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                lineNumber: 2059,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                                onClick: (e)=>{
                                                                                    e.stopPropagation();
                                                                                    if (confirm("آیا مطمئن هستید که می‌خواهید این پیام را حذف کنید؟")) {
                                                                                        handleDelete(msg.id);
                                                                                    }
                                                                                },
                                                                                className: "cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                                        className: "h-4 w-4 ml-2"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                        lineNumber: 2069,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        children: "حذف"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                        lineNumber: 2070,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                lineNumber: 2060,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                        lineNumber: 2029,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                lineNumber: 2015,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                            lineNumber: 2014,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 1980,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                            lineNumber: 1911,
                                            columnNumber: 17
                                        }, this)
                                    }, msg.id, false, {
                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                        lineNumber: 1900,
                                        columnNumber: 15
                                    }, this)),
                                isSupportTyping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        y: 10
                                    },
                                    animate: {
                                        opacity: 1,
                                        y: 0
                                    },
                                    exit: {
                                        opacity: 0,
                                        y: 10
                                    },
                                    className: "flex justify-start items-end gap-2.5",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$chat$2f$typing$2d$indicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypingIndicator"], {}, void 0, false, {
                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                        lineNumber: 2086,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 2080,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: messagesEndRef
                                }, void 0, false, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 2089,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                            lineNumber: 1865,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-t border-border/40 bg-background p-2 sm:p-3 space-y-2 relative flex-shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                    children: showScrollToBottom && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                        initial: {
                                            opacity: 0,
                                            y: 10,
                                            scale: 0.9
                                        },
                                        animate: {
                                            opacity: 1,
                                            y: 0,
                                            scale: 1
                                        },
                                        exit: {
                                            opacity: 0,
                                            y: 10,
                                            scale: 0.9
                                        },
                                        className: "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            onClick: ()=>scrollToBottom(false),
                                            size: "icon",
                                            className: "h-9 w-9 rounded-full shadow-lg hover:shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all",
                                            title: "برو به آخرین پیام",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2108,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                            lineNumber: 2102,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                        lineNumber: 2096,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 2094,
                                    columnNumber: 13
                                }, this),
                                showPermissionGuide && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        y: 5
                                    },
                                    animate: {
                                        opacity: 1,
                                        y: 0
                                    },
                                    exit: {
                                        opacity: 0,
                                        y: 5
                                    },
                                    className: "p-3 bg-destructive/5 border-2 border-destructive/20 rounded-xl shadow-sm",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
                                                className: "h-3.5 w-3.5 text-destructive mt-0.5 flex-shrink-0"
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2122,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-semibold text-destructive mb-1.5 leading-tight",
                                                        children: "دسترسی میکروفون نیاز است"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                        lineNumber: 2124,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground leading-relaxed",
                                                        children: "لطفاً در تنظیمات مرورگر دسترسی میکروفون را فعال کنید"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                        lineNumber: 2127,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2123,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowPermissionGuide(false),
                                                className: "p-0.5 rounded hover:bg-destructive/10 transition-colors flex-shrink-0",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    className: "h-3 w-3 text-destructive"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 2135,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2131,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                        lineNumber: 2121,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 2115,
                                    columnNumber: 15
                                }, this),
                                (isRecording || audioUrl) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        y: 10,
                                        scale: 0.95
                                    },
                                    animate: {
                                        opacity: 1,
                                        y: 0,
                                        scale: 1
                                    },
                                    exit: {
                                        opacity: 0,
                                        y: 10,
                                        scale: 0.95
                                    },
                                    className: "flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/30 rounded-lg",
                                    children: isRecording ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                animate: {
                                                    scale: [
                                                        1,
                                                        1.1,
                                                        1
                                                    ]
                                                },
                                                transition: {
                                                    repeat: Infinity,
                                                    duration: 1
                                                },
                                                className: "p-1.5 rounded-full bg-destructive/20",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
                                                    className: "h-3.5 w-3.5 text-destructive"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 2156,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2151,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs font-medium text-destructive leading-tight",
                                                        children: "در حال ضبط"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                        lineNumber: 2159,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground font-mono",
                                                        children: formatTime(recordingTime)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                        lineNumber: 2160,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2158,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "icon",
                                                onClick: stopRecording,
                                                className: "h-7 w-7 text-destructive hover:bg-destructive/10 rounded-lg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"], {
                                                    className: "h-3 w-3 fill-current"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 2168,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2162,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-1.5 rounded-full bg-primary/20",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
                                                    className: "h-3.5 w-3.5 text-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 2174,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2173,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs font-medium leading-tight",
                                                        children: "پیام صوتی آماده است"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                        lineNumber: 2177,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground font-mono",
                                                        children: formatTime(recordingTime)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                        lineNumber: 2178,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2176,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "icon",
                                                onClick: cancelRecording,
                                                className: "h-7 w-7 text-muted-foreground hover:text-destructive rounded-lg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    className: "h-3.5 w-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 2186,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2180,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                onClick: saveRecording,
                                                size: "sm",
                                                className: "h-7 px-3 text-xs rounded-lg",
                                                children: "ذخیره"
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2188,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 2143,
                                    columnNumber: 15
                                }, this),
                                showAttachmentOptions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        y: 10,
                                        scale: 0.95
                                    },
                                    animate: {
                                        opacity: 1,
                                        y: 0,
                                        scale: 1
                                    },
                                    exit: {
                                        opacity: 0,
                                        y: 10,
                                        scale: 0.95
                                    },
                                    className: "flex gap-2 p-2 bg-card rounded-lg border border-border/50 shadow-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "icon",
                                            onClick: ()=>{
                                                imageInputRef.current?.click();
                                                setShowAttachmentOptions(false);
                                            },
                                            className: "h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2217,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                            lineNumber: 2208,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "icon",
                                            onClick: ()=>{
                                                fileInputRef.current?.click();
                                                setShowAttachmentOptions(false);
                                            },
                                            className: "h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2228,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                            lineNumber: 2219,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "icon",
                                            onClick: ()=>{
                                                handleLocationShare();
                                                setShowAttachmentOptions(false);
                                            },
                                            className: "h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2239,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                            lineNumber: 2230,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "icon",
                                            onClick: async ()=>{
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
                                                            duration: 5000
                                                        });
                                                    }
                                                    startRecording();
                                                }
                                            },
                                            className: "h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all rounded-lg",
                                            disabled: isRecording,
                                            children: isRecording ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                                                className: "h-3.5 w-3.5 text-destructive"
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2265,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2267,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                            lineNumber: 2241,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 2202,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    ref: imageInputRef,
                                    type: "file",
                                    accept: "image/*",
                                    multiple: true,
                                    className: "hidden",
                                    onChange: (e)=>handleFileSelect(e, "image")
                                }, void 0, false, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 2274,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    ref: fileInputRef,
                                    type: "file",
                                    multiple: true,
                                    className: "hidden",
                                    onChange: (e)=>handleFileSelect(e, "file")
                                }, void 0, false, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 2282,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-end gap-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 relative",
                                        children: [
                                            attachments.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-2 right-2 left-2 z-10 pointer-events-none overflow-hidden",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "overflow-x-auto overflow-y-hidden scroll-smooth w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1.5 flex-nowrap",
                                                        children: attachments.map((attachment)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative group pointer-events-auto flex-shrink-0 w-auto",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "bg-card/95 backdrop-blur-sm rounded-md p-1 border border-border/40 shadow-sm",
                                                                        children: [
                                                                            attachment.type === "image" && attachment.url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                                src: attachment.url,
                                                                                alt: attachment.name || "تصویر",
                                                                                className: "w-10 h-10 object-cover rounded"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                lineNumber: 2303,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            attachment.type === "file" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-1 px-1.5 py-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                                        className: "h-3 w-3 flex-shrink-0 text-primary"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                        lineNumber: 2311,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-[10px] truncate max-w-[50px] font-medium leading-tight",
                                                                                        children: attachment.name
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                        lineNumber: 2312,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                lineNumber: 2310,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            attachment.type === "location" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-1 px-1.5 py-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                                        className: "h-3 w-3 flex-shrink-0 text-primary"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                        lineNumber: 2317,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-[10px] font-medium whitespace-nowrap leading-tight",
                                                                                        children: "موقعیت"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                        lineNumber: 2318,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                lineNumber: 2316,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            attachment.type === "audio" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-1 px-1.5 py-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
                                                                                        className: "h-3 w-3 flex-shrink-0 text-primary"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                        lineNumber: 2323,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-[10px] font-medium whitespace-nowrap leading-tight",
                                                                                        children: attachment.duration ? formatTime(attachment.duration) : "صدا"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                        lineNumber: 2324,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                                lineNumber: 2322,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                        lineNumber: 2301,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>handleRemoveAttachment(attachment.id),
                                                                        className: "absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20 hover:scale-110",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                            className: "h-2.5 w-2.5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                            lineNumber: 2334,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                        lineNumber: 2330,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, attachment.id, true, {
                                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                lineNumber: 2297,
                                                                columnNumber: 27
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                        lineNumber: 2295,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                    lineNumber: 2294,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2293,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                                ref: textareaRef,
                                                value: message,
                                                onChange: (e)=>{
                                                    setMessage(e.target.value);
                                                    // Clear existing timeout
                                                    if (typingTimeoutRef.current) {
                                                        clearTimeout(typingTimeoutRef.current);
                                                    }
                                                    // Send typing status
                                                    if (e.target.value.trim().length > 0) {
                                                        sendTypingStatus(true);
                                                        // Stop typing after 2 seconds of no input
                                                        typingTimeoutRef.current = setTimeout(()=>{
                                                            sendTypingStatus(false);
                                                        }, 2000);
                                                    } else {
                                                        sendTypingStatus(false);
                                                    }
                                                },
                                                onKeyDown: (e)=>{
                                                    if (e.key === "Enter" && !e.shiftKey) {
                                                        e.preventDefault();
                                                        if (typingTimeoutRef.current) {
                                                            clearTimeout(typingTimeoutRef.current);
                                                        }
                                                        sendTypingStatus(false);
                                                        if (message.trim() || attachments.length > 0) {
                                                            handleSendMessage();
                                                        }
                                                    }
                                                },
                                                placeholder: "پیام خود را بنویسید...",
                                                className: `min-h-[44px] max-h-[100px] resize-none text-sm leading-relaxed rounded-lg border pr-20 pl-3 py-2 ${attachments.length > 0 ? "pt-12" : ""}`
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2343,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute bottom-2 right-2 flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        variant: "ghost",
                                                        size: "icon",
                                                        onClick: ()=>setShowAttachmentOptions(!showAttachmentOptions),
                                                        className: `h-7 w-7 rounded-lg transition-all ${showAttachmentOptions ? "bg-primary/10 text-primary" : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$paperclip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paperclip$3e$__["Paperclip"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                            lineNumber: 2397,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                        lineNumber: 2387,
                                                        columnNumber: 19
                                                    }, this),
                                                    (message.trim() || attachments.length > 0) && !isRecording && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: isSaving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                            className: "h-4 w-4 text-primary animate-spin"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                            lineNumber: 2404,
                                                            columnNumber: 25
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            onClick: handleSendMessage,
                                                            size: "icon",
                                                            className: "h-7 w-7 rounded-lg transition-all",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                                                className: "h-3.5 w-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                                lineNumber: 2411,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                            lineNumber: 2406,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                                lineNumber: 2385,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                        lineNumber: 2290,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/chat/quick-buy-chat.tsx",
                                    lineNumber: 2289,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/chat/quick-buy-chat.tsx",
                            lineNumber: 2092,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true)
            ]
        }, void 0, true);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-chat-open": isOpen && step === "chat" ? "true" : "false",
                style: {
                    display: "none"
                }
            }, void 0, false, {
                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                lineNumber: 2427,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sheet"], {
                open: isOpen,
                onOpenChange: onOpenChange,
                children: [
                    trigger && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetTrigger"], {
                        asChild: true,
                        children: trigger
                    }, void 0, false, {
                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                        lineNumber: 2429,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetContent"], {
                        side: "left",
                        className: "w-full sm:w-[420px] md:w-[480px] p-0 flex flex-col border-l-2 border-border/40 bg-background shadow-2xl",
                        children: renderContent()
                    }, void 0, false, {
                        fileName: "[project]/components/chat/quick-buy-chat.tsx",
                        lineNumber: 2430,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/chat/quick-buy-chat.tsx",
                lineNumber: 2428,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(QuickBuyChat, "zWZpxsjDRoEdALoZUylULl87XZU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotifications"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$persistent$2d$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePersistentNotifications"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$admin$2d$presence$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAdminPresence"]
    ];
});
_c = QuickBuyChat;
var _c;
__turbopack_context__.k.register(_c, "QuickBuyChat");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/layout/bottom-navigation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BottomNavigation",
    ()=>BottomNavigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/cart-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$chat$2f$quick$2d$buy$2d$chat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/chat/quick-buy-chat.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const navigationItems = [
    {
        name: "خانه",
        href: "/",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
        exact: true
    },
    {
        name: "محصولات",
        href: "/products",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"]
    },
    {
        name: "سبد خرید",
        href: "/cart",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"]
    },
    {
        name: "سفارش‌ها",
        href: "/orders",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"]
    }
];
function BottomNavigation() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { items } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])();
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [canGoBack, setCanGoBack] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [chatOpen, setChatOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [anyChatOpen, setAnyChatOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Check if we're in admin section
    const isAdminPage = pathname?.startsWith("/admin");
    // Calculate cart item count
    const itemCount = isMounted ? items.reduce((count, item)=>count + item.quantity, 0) : 0;
    // Check if browser history allows going back
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BottomNavigation.useEffect": ()=>{
            setIsMounted(true);
            // Check if there's history to go back to
            setCanGoBack(window.history.length > 1);
        }
    }["BottomNavigation.useEffect"], []);
    // Check if any chat is open (QuickBuyChat or AdminChat)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BottomNavigation.useEffect": ()=>{
            const checkChatStatus = {
                "BottomNavigation.useEffect.checkChatStatus": ()=>{
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    // Check for QuickBuyChat
                    const quickBuyChatOpen = document.querySelector('[data-chat-open="true"]') !== null;
                    // Check for AdminChat
                    const adminChatOpen = document.querySelector('[data-admin-chat-open="true"]') !== null;
                    setAnyChatOpen(quickBuyChatOpen || adminChatOpen);
                }
            }["BottomNavigation.useEffect.checkChatStatus"];
            // Check immediately
            checkChatStatus();
            // Set up interval to check periodically
            const interval = setInterval(checkChatStatus, 200);
            // Also listen for DOM changes
            const observer = new MutationObserver(checkChatStatus);
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: [
                    'data-chat-open',
                    'data-admin-chat-open'
                ]
            });
            return ({
                "BottomNavigation.useEffect": ()=>{
                    clearInterval(interval);
                    observer.disconnect();
                }
            })["BottomNavigation.useEffect"];
        }
    }["BottomNavigation.useEffect"], []);
    // Don't show on admin pages or when any chat is open
    if (isAdminPage || chatOpen || anyChatOpen) {
        return null;
    }
    const handleBack = ()=>{
        if (canGoBack) {
            router.back();
        } else {
            router.push("/");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "sticky bottom-0 left-0 right-0 z-[9999] flex justify-center md:hidden pointer-events-none mt-auto",
            style: {
                paddingBottom: "max(0.5rem, calc(env(safe-area-inset-bottom, 0px) + 0.25rem))",
                paddingLeft: "1rem",
                paddingRight: "1rem"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full max-w-sm pointer-events-auto", "bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80", "border-[0.25px] border-border/30", "rounded-[8px]", "shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.3)]"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-1.5 pb-0.5 pt-1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between h-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleBack,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-center", "h-7 w-7 rounded-full", "bg-muted hover:bg-accent", "text-foreground", "transition-colors duration-200", "active:scale-95", "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background"),
                                "aria-label": "بازگشت",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/bottom-navigation.tsx",
                                    lineNumber: 150,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/layout/bottom-navigation.tsx",
                                lineNumber: 137,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center flex-1 gap-0 px-0.5",
                                children: navigationItems.map((item, index)=>{
                                    const Icon = item.icon;
                                    const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
                                    const isCart = item.href === "/cart";
                                    const isHome = item.href === "/";
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.href,
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center justify-center", "flex-1 h-8 rounded-md", "transition-all duration-200", "relative", isActive ? "text-primary" : "text-muted-foreground hover:text-foreground", "active:scale-95"),
                                                "aria-label": item.name,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-3.5 w-3.5 transition-transform duration-200", isActive && "scale-110")
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                                lineNumber: 182,
                                                                columnNumber: 25
                                                            }, this),
                                                            isCart && itemCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute -top-0.5 -right-0.5", "h-3 w-3 rounded-full", "bg-primary text-primary-foreground", "text-[8px] font-bold", "flex items-center justify-center", "min-w-[12px] px-0.5", "border border-background"),
                                                                "aria-label": `${itemCount} آیتم در سبد خرید`,
                                                                children: itemCount > 99 ? "99+" : itemCount
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                                lineNumber: 189,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                        lineNumber: 181,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-[8px] font-medium mt-0 leading-tight", "transition-colors duration-200", isActive && "font-semibold"),
                                                        children: item.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                        lineNumber: 205,
                                                        columnNumber: 23
                                                    }, this),
                                                    isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute top-0 left-1/2 -translate-x-1/2", "w-5 h-0.5 rounded-full", "bg-primary", "animate-in fade-in slide-in-from-top-1 duration-200")
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                        lineNumber: 215,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, item.href, true, {
                                                fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                lineNumber: 166,
                                                columnNumber: 21
                                            }, this),
                                            isHome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$chat$2f$quick$2d$buy$2d$chat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuickBuyChat"], {
                                                isOpen: chatOpen,
                                                onOpenChange: setChatOpen,
                                                trigger: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center justify-center", "flex-1 h-8 rounded-md", "transition-all duration-200", "relative", chatOpen ? "text-primary" : "text-muted-foreground hover:text-foreground", "active:scale-95"),
                                                    "aria-label": "چت",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-3.5 w-3.5 transition-transform duration-200", chatOpen && "scale-110")
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                                lineNumber: 247,
                                                                columnNumber: 31
                                                            }, void 0)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                            lineNumber: 246,
                                                            columnNumber: 29
                                                        }, void 0),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-[8px] font-medium mt-0 leading-tight", "transition-colors duration-200", chatOpen && "font-semibold"),
                                                            children: "چت"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                            lineNumber: 254,
                                                            columnNumber: 29
                                                        }, void 0),
                                                        chatOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute top-0 left-1/2 -translate-x-1/2", "w-5 h-0.5 rounded-full", "bg-primary", "animate-in fade-in slide-in-from-top-1 duration-200")
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                            lineNumber: 264,
                                                            columnNumber: 31
                                                        }, void 0)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                    lineNumber: 233,
                                                    columnNumber: 27
                                                }, void 0)
                                            }, "chat-button", false, {
                                                fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                lineNumber: 228,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/layout/bottom-navigation.tsx",
                                lineNumber: 154,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/bottom-navigation.tsx",
                        lineNumber: 135,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/layout/bottom-navigation.tsx",
                    lineNumber: 134,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/layout/bottom-navigation.tsx",
                lineNumber: 125,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/layout/bottom-navigation.tsx",
            lineNumber: 117,
            columnNumber: 7
        }, this)
    }, void 0, false);
}
_s(BottomNavigation, "pYcvlpqXXY+EGr+t0uXOM/9BySI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"]
    ];
});
_c = BottomNavigation;
var _c;
__turbopack_context__.k.register(_c, "BottomNavigation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_1ee17600._.js.map