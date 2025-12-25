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
                    // Don't log error for 401 (unauthorized) - user is not logged in, this is expected
                    if (response.status === 401) {
                        // Silently return - user needs to log in first
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
"[project]/store/auth-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
"use client";
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
        hasCheckedAuth: false,
        register: async (name, phone, password)=>{
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    name,
                    phone,
                    password
                })
            });
            const result = await response.json();
            if (!result.success) {
                // نمایش پیام خطای دقیق از سرور
                const errorMessage = result.error || result.message || "خطا در ثبت‌نام";
                // Log کامل برای debugging
                if ("TURBOPACK compile-time truthy", 1) {
                    console.error("Register API error:", {
                        status: response.status,
                        statusText: response.statusText,
                        result,
                        body: {
                            name,
                            phone: "***",
                            password: "***"
                        }
                    });
                }
                throw new Error(errorMessage);
            }
            // Set user immediately from server response
            // Cookie is set by server, so we can trust the response
            const user = {
                id: result.data.user.id,
                name: result.data.user.name,
                phone: result.data.user.phone,
                role: result.data.user.role || "user",
                createdAt: result.data.user.createdAt
            };
            set({
                user,
                isAuthenticated: true,
                hasCheckedAuth: true
            });
        },
        login: async (phone, password)=>{
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    phone,
                    password
                })
            });
            const result = await response.json();
            if (!result.success) {
                // می‌توانیم پیام خطا را لاگ کنیم برای debugging
                if ("TURBOPACK compile-time truthy", 1) {
                    console.error("Login error:", result.error || result.message);
                }
                return false;
            }
            // Set user immediately from server response
            // Cookie is set by server, so we can trust the response
            const user = {
                id: result.data.user.id,
                name: result.data.user.name,
                phone: result.data.user.phone,
                role: result.data.user.role || "user",
                createdAt: result.data.user.createdAt
            };
            set({
                user,
                isAuthenticated: true,
                hasCheckedAuth: true
            });
            return true;
        },
        logout: async ()=>{
            try {
                await fetch("/api/auth/logout", {
                    method: "POST",
                    credentials: "include"
                });
            } catch  {
            // ignore
            } finally{
                set({
                    user: null,
                    isAuthenticated: false,
                    hasCheckedAuth: true
                });
            }
        },
        checkAuth: async ()=>{
            const { isCheckingAuth } = get();
            if (isCheckingAuth) return;
            set({
                isCheckingAuth: true
            });
            try {
                const controller = new AbortController();
                const timeout = setTimeout(()=>controller.abort(), 10000);
                const res = await fetch("/api/auth/me", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                    headers: {
                        "Cache-Control": "no-cache"
                    },
                    signal: controller.signal
                });
                clearTimeout(timeout);
                const json = await res.json().catch(()=>null);
                if (res.ok && json?.success) {
                    // Check both authenticated flag and user object
                    if (json.data?.authenticated && json.data?.user) {
                        const u = json.data.user;
                        set({
                            user: {
                                id: u.id,
                                name: u.name,
                                phone: u.phone,
                                role: u.role || "user",
                                createdAt: u.createdAt
                            },
                            isAuthenticated: true,
                            hasCheckedAuth: true
                        });
                    } else {
                        // Not authenticated - clear state
                        set({
                            user: null,
                            isAuthenticated: false,
                            hasCheckedAuth: true
                        });
                    }
                } else {
                    // API error - clear state (server says not authenticated)
                    set({
                        user: null,
                        isAuthenticated: false,
                        hasCheckedAuth: true
                    });
                }
            } catch (error) {
                // Network fail or timeout - clear state to be safe
                // User can retry by refreshing
                set({
                    user: null,
                    isAuthenticated: false,
                    hasCheckedAuth: true,
                    isCheckingAuth: false
                });
            } finally{
                set({
                    isCheckingAuth: false
                });
            }
        },
        updateUser: (userData)=>{
            const { user } = get();
            if (user) {
                const updatedUser = {
                    ...user,
                    ...userData
                };
                set({
                    user: updatedUser
                });
            }
        }
    }), {
    name: "saded_auth",
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage),
    partialize: (state)=>({
            user: state.user,
            isAuthenticated: state.isAuthenticated
        })
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/auth/auth-initializer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthInitializer",
    ()=>AuthInitializer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/auth-store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function AuthInitializer() {
    _s();
    const { checkAuth, hasCheckedAuth, isCheckingAuth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const hasInitializedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthInitializer.useEffect": ()=>{
            // Immediately check auth on mount - no delay
            // This runs once per app load to verify session from server
            // همیشه بررسی کن - حتی اگر user در localStorage باشد
            // این اطمینان می‌دهد که session از سرور معتبر است
            if (!hasInitializedRef.current && !isCheckingAuth && !hasCheckedAuth) {
                hasInitializedRef.current = true;
                // Call immediately - cookies are available synchronously
                checkAuth();
            }
        }
    }["AuthInitializer.useEffect"], [
        checkAuth,
        isCheckingAuth,
        hasCheckedAuth
    ]);
    // این کامپوننت هیچ UI رندر نمی‌کند
    return null;
}
_s(AuthInitializer, "POeumfDL7dL8FYd96ombf/40Q/o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = AuthInitializer;
var _c;
__turbopack_context__.k.register(_c, "AuthInitializer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/image-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Image utility functions
 */ /**
 * Get placeholder image URL
 * Uses external service for Next.js Image component compatibility
 * @param width - Image width in pixels (default: 600)
 * @param height - Image height in pixels (default: 600)
 * @returns Placeholder image URL
 */ __turbopack_context__.s([
    "addCacheBusting",
    ()=>addCacheBusting,
    "getImageCacheKey",
    ()=>getImageCacheKey,
    "getPlaceholderImage",
    ()=>getPlaceholderImage,
    "needsCacheBusting",
    ()=>needsCacheBusting,
    "normalizeImageUrl",
    ()=>normalizeImageUrl,
    "preloadImage",
    ()=>preloadImage,
    "validateBase64Image",
    ()=>validateBase64Image,
    "validateImageUrl",
    ()=>validateImageUrl
]);
function getPlaceholderImage(width = 600, height = 600) {
    // Use placehold.co service for Next.js Image compatibility
    const text = encodeURIComponent(`${width}x${height}`);
    return `https://placehold.co/${width}x${height}/f3f4f6/9ca3af?text=${text}`;
}
function validateImageUrl(url) {
    if (!url || typeof url !== 'string' || url.trim() === '') {
        return false;
    }
    const trimmedUrl = url.trim();
    // Check if it's a base64 data URL (be more lenient)
    if (trimmedUrl.startsWith('data:image') || trimmedUrl.startsWith('data:')) {
        // For base64, be more lenient - just check basic structure
        // The browser will handle actual image validation
        if (trimmedUrl.includes(';base64,') && trimmedUrl.length > 50) {
            // Basic validation - let the browser handle the rest
            return true;
        }
        // Even if it doesn't have ;base64,, if it's a data: URL and long enough, accept it
        if (trimmedUrl.startsWith('data:image') && trimmedUrl.length > 50) {
            return true;
        }
        // Fallback to strict validation
        return validateBase64Image(trimmedUrl);
    }
    // Check if it's a blob URL
    if (trimmedUrl.startsWith('blob:')) {
        return true;
    }
    // Check if it's a relative path
    if (trimmedUrl.startsWith('/')) {
        return true;
    }
    // Check if it's a valid HTTP/HTTPS URL
    try {
        const urlObj = new URL(trimmedUrl);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch  {
        return false;
    }
}
function validateBase64Image(base64) {
    if (!base64 || typeof base64 !== 'string') {
        return false;
    }
    // Check if it starts with data:image
    if (!base64.startsWith('data:image/')) {
        return false;
    }
    // Check if it has the base64 prefix
    if (!base64.includes(';base64,')) {
        return false;
    }
    // Extract the base64 part
    const base64Part = base64.split(';base64,')[1];
    if (!base64Part || base64Part.trim() === '') {
        return false;
    }
    // Check if base64 string is valid (basic check)
    // Base64 should only contain A-Z, a-z, 0-9, +, /, and = characters
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(base64Part)) {
        return false;
    }
    // Check if it's not too large (more than 15MB base64 is problematic)
    // But allow up to 15MB to handle high-quality product images
    if (base64.length > 15 * 1024 * 1024) {
        return false;
    }
    // Additional check: ensure the base64 part is not empty after trimming
    if (base64Part.trim().length === 0) {
        return false;
    }
    return true;
}
function normalizeImageUrl(url, baseUrl) {
    if (!url || typeof url !== 'string' || url.trim() === '') {
        return '';
    }
    const trimmedUrl = url.trim();
    // If it's already a valid absolute URL or base64, return as is
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('data:image') || trimmedUrl.startsWith('data:') || // More lenient - accept any data: URL
    trimmedUrl.startsWith('blob:')) {
        return trimmedUrl;
    }
    // Check if it might be a base64 string without the data: prefix
    // Base64 strings are typically very long and contain only base64 characters
    if (trimmedUrl.length > 100 && /^[A-Za-z0-9+/=]+$/.test(trimmedUrl)) {
        // It might be a raw base64 string, but we can't use it without the data:image prefix
        // Return empty string - the caller should handle this
        return '';
    }
    // If it's a relative path starting with /
    if (trimmedUrl.startsWith('/')) {
        // If baseUrl is provided, use it; otherwise use current origin
        if (baseUrl) {
            return `${baseUrl}${trimmedUrl}`;
        }
        // In browser, use window.location.origin
        if ("TURBOPACK compile-time truthy", 1) {
            return `${window.location.origin}${trimmedUrl}`;
        }
        //TURBOPACK unreachable
        ;
    }
    // If it doesn't start with /, try to construct a full URL
    // This handles cases where URL might be missing protocol
    try {
        const urlObj = new URL(trimmedUrl);
        return urlObj.toString();
    } catch  {
        // If URL construction fails, return empty string
        return '';
    }
}
function preloadImage(url) {
    return new Promise((resolve, reject)=>{
        if (!validateImageUrl(url)) {
            reject(new Error('Invalid image URL'));
            return;
        }
        // For base64 images, we can't use Image object, so just resolve
        if (url.startsWith('data:image') || url.startsWith('blob:')) {
            resolve();
            return;
        }
        const img = new Image();
        img.onload = ()=>resolve();
        img.onerror = ()=>reject(new Error('Failed to load image'));
        img.src = url;
    });
}
function getImageCacheKey(url) {
    if (!url || typeof url !== 'string') {
        return '';
    }
    // Remove cache busting parameters
    try {
        const urlObj = new URL(url);
        urlObj.searchParams.delete('_retry');
        urlObj.searchParams.delete('_t');
        urlObj.searchParams.delete('_cache');
        return urlObj.toString();
    } catch  {
        // If URL parsing fails, remove common cache busting patterns manually
        return url.replace(/[?&]_retry=\d+/g, '').replace(/[?&]_t=\d+/g, '').replace(/[?&]_cache=\d+/g, '');
    }
}
function needsCacheBusting(url) {
    if (!url || typeof url !== 'string') {
        return false;
    }
    // Base64 and blob URLs don't need cache busting
    if (url.startsWith('data:image') || url.startsWith('blob:')) {
        return false;
    }
    // Check if URL already has cache busting parameters
    return !url.includes('_t=') && !url.includes('_retry=');
}
function addCacheBusting(url) {
    if (!url || typeof url !== 'string') {
        return url;
    }
    // Don't add cache busting to base64 or blob URLs
    if (url.startsWith('data:image') || url.startsWith('blob:')) {
        return url;
    }
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_t=${Date.now()}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/product-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utility functions for product data normalization
 */ /**
 * Normalize images array from database
 * Handles various formats: string, array, null, undefined
 */ __turbopack_context__.s([
    "normalizeImages",
    ()=>normalizeImages,
    "normalizeSpecifications",
    ()=>normalizeSpecifications,
    "normalizeTags",
    ()=>normalizeTags
]);
function normalizeImages(images) {
    // اگر null یا undefined است
    if (images == null) {
        return [];
    }
    // اگر قبلاً array است
    if (Array.isArray(images)) {
        return images.filter((img)=>img != null && typeof img === 'string' && img.trim() !== '').map((img)=>img.trim());
    }
    // اگر string است، سعی کن parse کن
    if (typeof images === 'string') {
        // اگر string خالی است
        if (images.trim() === '') {
            return [];
        }
        try {
            const parsed = JSON.parse(images);
            if (Array.isArray(parsed)) {
                return parsed.filter((img)=>img != null && typeof img === 'string' && img.trim() !== '').map((img)=>img.trim());
            }
            // اگر یک string واحد است
            if (typeof parsed === 'string' && parsed.trim() !== '') {
                return [
                    parsed.trim()
                ];
            }
        } catch (e) {
            // اگر parse ناموفق بود، خود string را به عنوان یک تصویر در نظر بگیر
            return [
                images.trim()
            ];
        }
    }
    return [];
}
function normalizeTags(tags) {
    if (tags == null) {
        return [];
    }
    if (Array.isArray(tags)) {
        return tags.filter((tag)=>tag != null && typeof tag === 'string' && tag.trim() !== '').map((tag)=>tag.trim());
    }
    if (typeof tags === 'string') {
        if (tags.trim() === '') {
            return [];
        }
        try {
            const parsed = JSON.parse(tags);
            if (Array.isArray(parsed)) {
                return parsed.filter((tag)=>tag != null && typeof tag === 'string' && tag.trim() !== '').map((tag)=>tag.trim());
            }
        } catch (e) {
            return [];
        }
    }
    return [];
}
function normalizeSpecifications(specs) {
    if (specs == null) {
        return {};
    }
    if (typeof specs === 'object' && specs !== null && !Array.isArray(specs)) {
        return specs;
    }
    if (typeof specs === 'string') {
        if (specs.trim() === '') {
            return {};
        }
        try {
            const parsed = JSON.parse(specs);
            if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
                return parsed;
            }
        } catch (e) {
            return {};
        }
    }
    return {};
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/store/product-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductStore",
    ()=>useProductStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$image$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/image-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/product-utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const defaultFilters = {};
const useProductStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])((set, get)=>({
        products: [],
        filters: defaultFilters,
        setProducts: (products)=>{
            // Validate and normalize images for all products - be more lenient with base64
            const validatedProducts = products.map((product)=>{
                // First, normalize images (this handles parsing JSON strings into arrays)
                const normalizedImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeImages"])(product.images);
                // Then validate and normalize each image URL
                const validatedImages = normalizedImages.map((img)=>{
                    if (!img || typeof img !== 'string') return null;
                    const trimmed = img.trim();
                    if (trimmed === '') return null;
                    // For base64 images, validate directly without normalization
                    if (trimmed.startsWith('data:image') || trimmed.startsWith('data:')) {
                        if (trimmed.includes(';base64,') && trimmed.length > 50) {
                            return trimmed; // Accept base64 images with basic validation
                        } else if (trimmed.startsWith('data:image') && trimmed.length > 50) {
                            // Even without ;base64,, if it's data:image and long enough, accept it
                            return trimmed;
                        }
                        return null;
                    }
                    // For other URLs (http, https, blob, relative), normalize and validate
                    const normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$image$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeImageUrl"])(trimmed);
                    if (!normalized) return null;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$image$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateImageUrl"])(normalized) ? normalized : null;
                }).filter((img)=>img !== null);
                return {
                    ...product,
                    images: validatedImages
                };
            });
            set({
                products: validatedProducts
            });
        },
        addProduct: (product)=>set((state)=>{
                // First, normalize images (this handles parsing JSON strings into arrays)
                const normalizedImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeImages"])(product.images);
                // Then validate and normalize each image URL - be more lenient with base64
                const validatedImages = normalizedImages.map((img)=>{
                    if (!img || typeof img !== 'string') return null;
                    const trimmed = img.trim();
                    if (trimmed === '') return null;
                    // For base64 images, validate directly without normalization
                    if (trimmed.startsWith('data:image') || trimmed.startsWith('data:')) {
                        if (trimmed.includes(';base64,') && trimmed.length > 50) {
                            return trimmed; // Accept base64 images with basic validation
                        } else if (trimmed.startsWith('data:image') && trimmed.length > 50) {
                            // Even without ;base64,, if it's data:image and long enough, accept it
                            return trimmed;
                        }
                        return null;
                    }
                    // For other URLs (http, https, blob, relative), normalize and validate
                    const normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$image$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeImageUrl"])(trimmed);
                    if (!normalized) return null;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$image$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateImageUrl"])(normalized) ? normalized : null;
                }).filter((img)=>img !== null);
                const validatedProduct = {
                    ...product,
                    images: validatedImages,
                    // Ensure boolean fields are properly converted from numbers (0/1) to booleans
                    inStock: product.inStock !== undefined ? Boolean(product.inStock) : true,
                    enabled: product.enabled !== undefined ? Boolean(product.enabled) : true,
                    vinEnabled: product.vinEnabled !== undefined ? Boolean(product.vinEnabled) : false,
                    airShippingEnabled: product.airShippingEnabled !== undefined ? Boolean(product.airShippingEnabled) : true,
                    seaShippingEnabled: product.seaShippingEnabled !== undefined ? Boolean(product.seaShippingEnabled) : true
                };
                const existingIndex = state.products.findIndex((p)=>p.id === validatedProduct.id);
                if (existingIndex >= 0) {
                    // Update existing product
                    const updatedProducts = [
                        ...state.products
                    ];
                    updatedProducts[existingIndex] = validatedProduct;
                    return {
                        products: updatedProducts
                    };
                }
                // Add new product
                return {
                    products: [
                        ...state.products,
                        validatedProduct
                    ]
                };
            }),
        updateProduct: (product)=>set((state)=>{
                // First, normalize images (this handles parsing JSON strings into arrays)
                const normalizedImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeImages"])(product.images);
                // Then validate and normalize each image URL - be more lenient with base64
                const validatedImages = normalizedImages.map((img)=>{
                    if (!img || typeof img !== 'string') return null;
                    const trimmed = img.trim();
                    if (trimmed === '') return null;
                    // For base64 images, validate directly without normalization
                    if (trimmed.startsWith('data:image') || trimmed.startsWith('data:')) {
                        if (trimmed.includes(';base64,') && trimmed.length > 50) {
                            return trimmed; // Accept base64 images with basic validation
                        } else if (trimmed.startsWith('data:image') && trimmed.length > 50) {
                            // Even without ;base64,, if it's data:image and long enough, accept it
                            return trimmed;
                        }
                        return null;
                    }
                    // For other URLs (http, https, blob, relative), normalize and validate
                    const normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$image$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeImageUrl"])(trimmed);
                    if (!normalized) return null;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$image$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateImageUrl"])(normalized) ? normalized : null;
                }).filter((img)=>img !== null);
                const validatedProduct = {
                    ...product,
                    images: validatedImages,
                    // Ensure boolean fields are properly converted from numbers (0/1) to booleans
                    inStock: product.inStock !== undefined ? Boolean(product.inStock) : true,
                    enabled: product.enabled !== undefined ? Boolean(product.enabled) : true,
                    vinEnabled: product.vinEnabled !== undefined ? Boolean(product.vinEnabled) : false,
                    airShippingEnabled: product.airShippingEnabled !== undefined ? Boolean(product.airShippingEnabled) : true,
                    seaShippingEnabled: product.seaShippingEnabled !== undefined ? Boolean(product.seaShippingEnabled) : true
                };
                const existingIndex = state.products.findIndex((p)=>p.id === validatedProduct.id);
                if (existingIndex >= 0) {
                    const updatedProducts = [
                        ...state.products
                    ];
                    updatedProducts[existingIndex] = validatedProduct;
                    return {
                        products: updatedProducts
                    };
                }
                return state;
            }),
        removeProduct: (id)=>set((state)=>({
                    products: state.products.filter((p)=>p.id !== id)
                })),
        getProduct: (id)=>{
            const state = get();
            return state.products.find((p)=>p.id === id);
        },
        getEnabledProducts: ()=>{
            const state = get();
            return state.products.filter((p)=>p.enabled);
        },
        getFilteredProducts: ()=>{
            const state = get();
            const { products, filters } = state;
            let filtered = products.filter((p)=>p.enabled);
            // Apply search filter - search in all relevant fields
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                filtered = filtered.filter((p)=>{
                    // Search in name
                    if (p.name?.toLowerCase().includes(searchLower)) return true;
                    // Search in description
                    if (p.description?.toLowerCase().includes(searchLower)) return true;
                    // Search in brand
                    if (p.brand?.toLowerCase().includes(searchLower)) return true;
                    // Search in category
                    if (p.category?.toLowerCase().includes(searchLower)) return true;
                    // Search in VIN
                    if (p.vin?.toLowerCase().includes(searchLower)) return true;
                    // Search in tags (if array)
                    if (Array.isArray(p.tags) && p.tags.some((tag)=>tag?.toLowerCase().includes(searchLower))) return true;
                    // Search in specifications (if object)
                    if (p.specifications && typeof p.specifications === 'object') {
                        const specString = JSON.stringify(p.specifications).toLowerCase();
                        if (specString.includes(searchLower)) return true;
                    }
                    return false;
                });
            }
            // Apply price filters
            if (filters.minPrice !== undefined) {
                filtered = filtered.filter((p)=>p.price >= filters.minPrice);
            }
            if (filters.maxPrice !== undefined) {
                filtered = filtered.filter((p)=>p.price <= filters.maxPrice);
            }
            // Apply brand filter
            if (filters.brands && filters.brands.length > 0) {
                filtered = filtered.filter((p)=>p.brand && filters.brands.includes(p.brand));
            }
            // Apply category filter
            if (filters.categories && filters.categories.length > 0) {
                filtered = filtered.filter((p)=>p.category && filters.categories.includes(p.category));
            }
            // Apply vehicle filter
            if (filters.vehicle) {
                filtered = filtered.filter((p)=>p.vehicle === filters.vehicle);
            }
            // Apply stock filter
            if (filters.inStock !== undefined) {
                filtered = filtered.filter((p)=>p.inStock === filters.inStock);
            }
            return filtered;
        },
        setFilters: (newFilters)=>set((state)=>{
                const updatedFilters = {
                    ...state.filters
                };
                // Apply new filters
                Object.keys(newFilters).forEach((key)=>{
                    const value = newFilters[key];
                    if (value === undefined || value === null || Array.isArray(value) && value.length === 0) {
                        // Remove filter if undefined, null, or empty array
                        delete updatedFilters[key];
                    } else {
                        // Set filter value
                        updatedFilters[key] = value;
                    }
                });
                return {
                    filters: updatedFilters
                };
            }),
        clearFilters: ()=>set({
                filters: defaultFilters
            }),
        // Async API sync methods
        createProduct: async (productData)=>{
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                throw new Error(errorData.message || "خطا در ایجاد محصول");
            }
            const result = await response.json();
            const newProduct = result.data;
            get().addProduct(newProduct);
            return newProduct;
        },
        updateProductInDB: async (id, productData)=>{
            const response = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                throw new Error(errorData.message || "خطا در به‌روزرسانی محصول");
            }
            const result = await response.json();
            const updatedProduct = result.data;
            get().updateProduct(updatedProduct);
            return updatedProduct;
        },
        deleteProductFromDB: async (id)=>{
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                throw new Error(errorData.message || "خطا در حذف محصول");
            }
            get().removeProduct(id);
        },
        loadProductsFromDB: async (includeInactive = false)=>{
            try {
                // For admin pages, we need all products (including inactive ones)
                const url = includeInactive ? "/api/products?limit=1000&all=true" : "/api/products?limit=1000";
                const response = await fetch(url);
                if (!response.ok) {
                    const errorData = await response.json().catch(()=>({}));
                    const errorMessage = errorData.error || errorData.message || "خطا در بارگذاری محصولات";
                    throw new Error(errorMessage);
                }
                const result = await response.json();
                // Debug: Log raw API response
                if ("TURBOPACK compile-time truthy", 1) {
                    console.log('[ProductStore] Raw API response:', {
                        success: result.success,
                        dataLength: result.data?.length || 0,
                        firstProduct: result.data?.[0] ? {
                            id: result.data[0].id,
                            name: result.data[0].name,
                            imagesRaw: result.data[0].images,
                            imagesType: typeof result.data[0].images,
                            imagesIsArray: Array.isArray(result.data[0].images),
                            imagesLength: Array.isArray(result.data[0].images) ? result.data[0].images.length : 0,
                            firstImagePreview: Array.isArray(result.data[0].images) && result.data[0].images[0] ? result.data[0].images[0].substring(0, 100) : null
                        } : null
                    });
                }
                const products = (result.data || []).map((product)=>{
                    // First, normalize images (this handles parsing JSON strings into arrays)
                    const normalizedImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeImages"])(product.images);
                    // Then validate and normalize each image URL - be more lenient with base64
                    let validatedImages = normalizedImages.map((img)=>{
                        if (!img || typeof img !== 'string') {
                            if ("TURBOPACK compile-time truthy", 1) {
                                console.warn('[ProductStore] Invalid image (not string):', {
                                    img,
                                    type: typeof img
                                });
                            }
                            return null;
                        }
                        const trimmed = img.trim();
                        if (trimmed === '') {
                            if ("TURBOPACK compile-time truthy", 1) {
                                console.warn('[ProductStore] Invalid image (empty after trim)');
                            }
                            return null;
                        }
                        // For base64 images, validate directly without normalization
                        if (trimmed.startsWith('data:image') || trimmed.startsWith('data:')) {
                            // Just check basic structure for base64
                            if (trimmed.includes(';base64,') && trimmed.length > 50) {
                                if ("TURBOPACK compile-time truthy", 1) {
                                    console.log('[ProductStore] Accepted base64 image:', {
                                        length: trimmed.length,
                                        preview: trimmed.substring(0, 50)
                                    });
                                }
                                return trimmed; // Accept base64 images with basic validation
                            } else if (trimmed.startsWith('data:image') && trimmed.length > 50) {
                                // Even without ;base64,, if it's data:image and long enough, accept it
                                if ("TURBOPACK compile-time truthy", 1) {
                                    console.log('[ProductStore] Accepted base64 image (without ;base64,):', {
                                        length: trimmed.length,
                                        preview: trimmed.substring(0, 50)
                                    });
                                }
                                return trimmed;
                            } else {
                                if ("TURBOPACK compile-time truthy", 1) {
                                    console.warn('[ProductStore] Rejected base64 image (invalid structure):', {
                                        hasBase64: trimmed.includes(';base64,'),
                                        length: trimmed.length,
                                        preview: trimmed.substring(0, 50)
                                    });
                                }
                                return null;
                            }
                        }
                        // For other URLs (http, https, blob, relative), normalize and validate
                        const normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$image$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeImageUrl"])(trimmed);
                        if (!normalized) {
                            if ("TURBOPACK compile-time truthy", 1) {
                                console.warn('[ProductStore] Rejected image (normalization failed):', {
                                    original: trimmed.substring(0, 100)
                                });
                            }
                            return null;
                        }
                        const isValid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$image$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateImageUrl"])(normalized);
                        if (!isValid && ("TURBOPACK compile-time value", "development") === 'development') {
                            console.warn('[ProductStore] Rejected image (validation failed):', {
                                original: trimmed.substring(0, 100),
                                normalized: normalized.substring(0, 100)
                            });
                        }
                        return isValid ? normalized : null;
                    }).filter((img)=>img !== null);
                    // Debug: Log if images were parsed from string
                    if (("TURBOPACK compile-time value", "development") === 'development' && typeof product.images === 'string' && normalizedImages.length > 0) {
                        console.log('[ProductStore] Parsed images from string:', {
                            productId: product.id,
                            originalType: typeof product.images,
                            parsedCount: normalizedImages.length,
                            validatedCount: validatedImages.length
                        });
                    }
                    const processedProduct = {
                        ...product,
                        images: validatedImages,
                        specifications: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeSpecifications"])(product.specifications),
                        // Ensure boolean fields are properly converted from numbers (0/1) to booleans
                        inStock: product.inStock !== undefined ? Boolean(product.inStock) : true,
                        enabled: product.enabled !== undefined ? Boolean(product.enabled) : true,
                        vinEnabled: product.vinEnabled !== undefined ? Boolean(product.vinEnabled) : false,
                        airShippingEnabled: product.airShippingEnabled !== undefined ? Boolean(product.airShippingEnabled) : true,
                        seaShippingEnabled: product.seaShippingEnabled !== undefined ? Boolean(product.seaShippingEnabled) : true,
                        createdAt: product.createdAt instanceof Date ? product.createdAt : new Date(product.createdAt),
                        updatedAt: product.updatedAt instanceof Date ? product.updatedAt : new Date(product.updatedAt)
                    };
                    // Debug: Log processed product
                    if (("TURBOPACK compile-time value", "development") === 'development' && processedProduct.images.length === 0 && Array.isArray(product.images) && product.images.length > 0) {
                        console.warn('[ProductStore] Product lost all images during validation:', {
                            productId: processedProduct.id,
                            productName: processedProduct.name,
                            originalImagesCount: Array.isArray(product.images) ? product.images.length : 0,
                            validatedImagesCount: processedProduct.images.length,
                            originalFirstImage: Array.isArray(product.images) && product.images[0] ? product.images[0].substring(0, 200) : null
                        });
                    }
                    return processedProduct;
                });
                // Debug: Log final products
                if ("TURBOPACK compile-time truthy", 1) {
                    const firstProductWithImages = products.find((p)=>p.images && p.images.length > 0);
                    console.log('[ProductStore] Processed products:', {
                        total: products.length,
                        productsWithImages: products.filter((p)=>p.images && p.images.length > 0).length,
                        productsWithoutImages: products.filter((p)=>!p.images || p.images.length === 0).length,
                        firstProductWithImages: firstProductWithImages ? {
                            id: firstProductWithImages.id,
                            name: firstProductWithImages.name,
                            imagesCount: firstProductWithImages.images.length,
                            firstImagePreview: firstProductWithImages.images[0].substring(0, 100)
                        } : null
                    });
                }
                get().setProducts(products);
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error loading products from DB:", error);
            // Don't throw - allow app to continue with empty products
            }
        },
        // Additional actions for product table
        deleteProduct: async (id)=>{
            await get().deleteProductFromDB(id);
        },
        deleteProducts: async (ids)=>{
            await Promise.all(ids.map((id)=>get().deleteProductFromDB(id)));
        },
        toggleProduct: async (id)=>{
            const product = get().getProduct(id);
            if (product) {
                await get().updateProductInDB(id, {
                    enabled: !product.enabled
                });
            }
        },
        toggleProducts: async (ids, enabled)=>{
            await Promise.all(ids.map((id)=>get().updateProductInDB(id, {
                    enabled
                })));
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/store/category-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCategoryStore",
    ()=>useCategoryStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger-client.ts [app-client] (ecmascript)");
"use client";
;
;
const useCategoryStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])((set, get)=>({
        categories: [],
        setCategories: (categories)=>set({
                categories
            }),
        addCategory: (category)=>set((state)=>{
                const existingIndex = state.categories.findIndex((c)=>c.id === category.id);
                if (existingIndex >= 0) {
                    // Update existing category
                    const updatedCategories = [
                        ...state.categories
                    ];
                    updatedCategories[existingIndex] = category;
                    return {
                        categories: updatedCategories
                    };
                }
                // Add new category
                return {
                    categories: [
                        ...state.categories,
                        category
                    ]
                };
            }),
        updateCategory: (category)=>set((state)=>{
                const existingIndex = state.categories.findIndex((c)=>c.id === category.id);
                if (existingIndex >= 0) {
                    const updatedCategories = [
                        ...state.categories
                    ];
                    updatedCategories[existingIndex] = category;
                    return {
                        categories: updatedCategories
                    };
                }
                return state;
            }),
        deleteCategory: (id)=>set((state)=>({
                    categories: state.categories.filter((c)=>c.id !== id)
                })),
        toggleCategory: (id)=>set((state)=>({
                    categories: state.categories.map((c)=>c.id === id ? {
                            ...c,
                            isActive: !c.isActive
                        } : c)
                })),
        getCategory: (id)=>{
            const state = get();
            return state.categories.find((c)=>c.id === id);
        },
        getActiveCategories: ()=>{
            const state = get();
            return state.categories.filter((c)=>c.isActive && c.enabled);
        },
        getEnabledCategories: ()=>{
            const state = get();
            return state.categories.filter((c)=>c.enabled);
        },
        // Async API sync method
        loadCategoriesFromDB: async (includeInactive = false)=>{
            try {
                // For admin pages, we need all categories (including inactive ones)
                const url = includeInactive ? "/api/categories?all=true" : "/api/categories";
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("خطا در بارگذاری دسته‌بندی‌ها");
                }
                const result = await response.json();
                const categories = result.data || [];
                get().setCategories(categories);
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error loading categories from DB:", error);
            // Don't throw - allow app to continue with empty categories
            }
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/store/order-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOrderStore",
    ()=>useOrderStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/auth-store.ts [app-client] (ecmascript)");
"use client";
;
;
;
const defaultFilters = {};
const useOrderStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])((set, get)=>({
        orders: [],
        filters: defaultFilters,
        isLoading: false,
        setOrders: (orders)=>set({
                orders
            }),
        addOrder: (order)=>set((state)=>{
                const existingIndex = state.orders.findIndex((o)=>o.id === order.id);
                if (existingIndex >= 0) {
                    // Update existing order
                    const updatedOrders = [
                        ...state.orders
                    ];
                    updatedOrders[existingIndex] = order;
                    return {
                        orders: updatedOrders
                    };
                }
                // Add new order
                return {
                    orders: [
                        ...state.orders,
                        order
                    ]
                };
            }),
        updateOrder: (id, orderData)=>set((state)=>{
                const existingIndex = state.orders.findIndex((o)=>o.id === id);
                if (existingIndex >= 0) {
                    const updatedOrders = [
                        ...state.orders
                    ];
                    updatedOrders[existingIndex] = {
                        ...updatedOrders[existingIndex],
                        ...orderData
                    };
                    return {
                        orders: updatedOrders
                    };
                }
                return state;
            }),
        updateOrderStatus: (id, status)=>set((state)=>({
                    orders: state.orders.map((o)=>o.id === id ? {
                            ...o,
                            status,
                            updatedAt: new Date()
                        } : o)
                })),
        updatePaymentStatus: (id, status)=>set((state)=>({
                    orders: state.orders.map((o)=>o.id === id ? {
                            ...o,
                            paymentStatus: status,
                            updatedAt: new Date()
                        } : o)
                })),
        deleteOrder: (id)=>set((state)=>({
                    orders: state.orders.filter((o)=>o.id !== id)
                })),
        getOrder: (id)=>{
            const state = get();
            return state.orders.find((o)=>o.id === id);
        },
        setFilters: (newFilters)=>set((state)=>({
                    filters: {
                        ...state.filters,
                        ...newFilters
                    }
                })),
        clearFilters: ()=>set({
                filters: defaultFilters
            }),
        loadOrdersFromDB: async ()=>{
            set({
                isLoading: true
            });
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(()=>controller.abort(), 15000); // 15 second timeout
                // استفاده از fetchWithAuth برای ارسال header های احراز هویت
                const { fetchWithAuth } = await __turbopack_context__.A("[project]/lib/api/fetch-with-auth.ts [app-client] (ecmascript, async loader)");
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug("Loading orders from database...");
                // Log auth state before request
                const authState = __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState();
                console.log('[OrderStore] Auth state before request:', {
                    isAuthenticated: authState.isAuthenticated,
                    hasUser: !!authState.user,
                    userId: authState.user?.id,
                    hasCheckedAuth: authState.hasCheckedAuth
                });
                // Prepare headers
                const headers = {
                    "Cache-Control": "no-cache"
                };
                // Send userId in header as fallback if session cookie fails
                // This ensures admin can access orders even if session cookie has issues
                if (authState.user?.id) {
                    headers['x-user-id'] = authState.user.id;
                    console.log('[OrderStore] Adding userId header (fallback):', authState.user.id);
                }
                const response = await fetchWithAuth("/api/orders", {
                    signal: controller.signal,
                    credentials: "include",
                    cache: "no-store",
                    headers
                });
                console.log('[OrderStore] Response status:', response.status);
                clearTimeout(timeoutId);
                if (response.ok) {
                    let result;
                    try {
                        result = await response.json();
                    } catch (parseError) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error parsing orders response:", parseError);
                        set({
                            orders: [],
                            isLoading: false
                        });
                        return;
                    }
                    console.log('[OrderStore] Response from /api/orders:', {
                        success: result.success,
                        dataLength: result.data?.length || 0,
                        hasData: !!result.data
                    });
                    if (result.success && result.data) {
                        try {
                            // Parse dates and ensure proper structure
                            const parsedOrders = result.data.map((o)=>{
                                let items = [];
                                let shippingAddress = {};
                                try {
                                    items = Array.isArray(o.items) ? o.items : typeof o.items === 'string' ? JSON.parse(o.items) : [];
                                } catch (e) {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn("Error parsing items for order:", o.id, e);
                                    items = [];
                                }
                                try {
                                    shippingAddress = typeof o.shippingAddress === 'object' && o.shippingAddress !== null ? o.shippingAddress : typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : {};
                                } catch (e) {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn("Error parsing shippingAddress for order:", o.id, e);
                                    shippingAddress = {};
                                }
                                return {
                                    ...o,
                                    items,
                                    shippingAddress,
                                    total: Number(o.total) || 0,
                                    shippingCost: Number(o.shippingCost) || 0,
                                    createdAt: o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt),
                                    updatedAt: o.updatedAt instanceof Date ? o.updatedAt : new Date(o.updatedAt)
                                };
                            });
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info(`✅ Loaded ${parsedOrders.length} orders from database`);
                            set({
                                orders: parsedOrders,
                                isLoading: false
                            });
                        } catch (parseError) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error parsing orders data:", parseError);
                            set({
                                orders: [],
                                isLoading: false
                            });
                        }
                    } else {
                        // Empty result is valid
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info("No orders found in database");
                        set({
                            orders: [],
                            isLoading: false
                        });
                    }
                } else {
                    const errorText = await response.text().catch(()=>"Unknown error");
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error(`Failed to load orders: ${response.status} - ${errorText}`);
                    // If 401 (Unauthorized), don't show error - user will be redirected by ProtectedRoute
                    if (response.status === 401) {
                        set({
                            orders: [],
                            isLoading: false
                        });
                        return;
                    }
                    // Set empty orders and stop loading on error
                    set({
                        orders: [],
                        isLoading: false
                    });
                }
            } catch (error) {
                // Handle network errors, timeouts, etc.
                if (error instanceof Error && error.name !== 'AbortError') {
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error loading orders from DB:", error);
                }
                // Always set isLoading to false, even on error
                set({
                    orders: [],
                    isLoading: false
                });
            }
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-page-preload.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePagePreload",
    ()=>usePagePreload
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$product$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/product-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$category$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/category-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$order$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/order-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/auth-store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function usePagePreload() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [isPreloading, setIsPreloading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [preloadError, setPreloadError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { loadProductsFromDB } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$product$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductStore"])();
    const { loadCategoriesFromDB } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$category$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCategoryStore"])();
    const { loadOrdersFromDB } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$order$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOrderStore"])();
    const { isAuthenticated, hasCheckedAuth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePagePreload.useEffect": ()=>{
            let isMounted = true;
            const preloadData = {
                "usePagePreload.useEffect.preloadData": async ()=>{
                    try {
                        setIsPreloading(true);
                        setPreloadError(null);
                        // Preload مشترک برای همه صفحات
                        const commonPromises = [
                            loadCategoriesFromDB().catch({
                                "usePagePreload.useEffect.preloadData": (err)=>{
                                    console.warn("Failed to preload categories:", err);
                                    return null;
                                }
                            }["usePagePreload.useEffect.preloadData"])
                        ];
                        // Preload بر اساس مسیر
                        if (pathname.startsWith("/products")) {
                            // برای صفحات محصولات، محصولات را هم preload کن
                            commonPromises.push(loadProductsFromDB(true).catch({
                                "usePagePreload.useEffect.preloadData": (err)=>{
                                    console.warn("Failed to preload products:", err);
                                    return null;
                                }
                            }["usePagePreload.useEffect.preloadData"]));
                        }
                        if (pathname.startsWith("/orders") || pathname.startsWith("/order")) {
                            // برای صفحات سفارش، فقط اگر کاربر لاگین شده باشد
                            if (hasCheckedAuth && isAuthenticated) {
                                commonPromises.push(loadOrdersFromDB().catch({
                                    "usePagePreload.useEffect.preloadData": (err)=>{
                                        console.warn("Failed to preload orders:", err);
                                        return null;
                                    }
                                }["usePagePreload.useEffect.preloadData"]));
                            }
                        }
                        // منتظر بمان تا همه داده‌ها لود شوند
                        await Promise.allSettled(commonPromises);
                        // یک تاخیر کوچک برای اطمینان از اینکه همه چیز آماده است
                        await new Promise({
                            "usePagePreload.useEffect.preloadData": (resolve)=>setTimeout(resolve, 100)
                        }["usePagePreload.useEffect.preloadData"]);
                        if (isMounted) {
                            setIsPreloading(false);
                        }
                    } catch (error) {
                        console.error("Error during preload:", error);
                        if (isMounted) {
                            setPreloadError(error instanceof Error ? error.message : "خطا در بارگذاری داده‌ها");
                            setIsPreloading(false);
                        }
                    }
                }
            }["usePagePreload.useEffect.preloadData"];
            // فقط بعد از اینکه auth check انجام شد، preload را شروع کن
            // اما اگر auth check خیلی طول بکشد، بعد از 2 ثانیه preload را شروع کن
            if (hasCheckedAuth) {
                preloadData();
            } else {
                // اگر auth check انجام نشده، یک timeout تنظیم کن تا بعد از 2 ثانیه preload را شروع کند
                const timeout = setTimeout({
                    "usePagePreload.useEffect.timeout": ()=>{
                        if (isMounted) {
                            preloadData();
                        }
                    }
                }["usePagePreload.useEffect.timeout"], 2000);
                return ({
                    "usePagePreload.useEffect": ()=>{
                        isMounted = false;
                        clearTimeout(timeout);
                    }
                })["usePagePreload.useEffect"];
            }
            return ({
                "usePagePreload.useEffect": ()=>{
                    isMounted = false;
                }
            })["usePagePreload.useEffect"];
        }
    }["usePagePreload.useEffect"], [
        pathname,
        loadProductsFromDB,
        loadCategoriesFromDB,
        loadOrdersFromDB,
        isAuthenticated,
        hasCheckedAuth
    ]);
    return {
        isPreloading,
        preloadError
    };
}
_s(usePagePreload, "RL0KfBe29PjGqhm74OExnEGTqHI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$product$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$category$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCategoryStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$order$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOrderStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-lg border-[0.25px] border-border/3 bg-card text-card-foreground shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 8,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Card;
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 23,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = CardHeader;
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-2xl font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 35,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = CardTitle;
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 50,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = CardDescription;
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = CardContent;
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 70,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = CardFooter;
CardFooter.displayName = "CardFooter";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardDescription$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardDescription");
__turbopack_context__.k.register(_c8, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardContent");
__turbopack_context__.k.register(_c10, "CardFooter$React.forwardRef");
__turbopack_context__.k.register(_c11, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/page-loader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PageLoader",
    ()=>PageLoader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
"use client";
;
;
;
function PageLoader({ message = "در حال بارگذاری...", fullScreen = true }) {
    const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "h-8 w-8 sm:h-12 sm:w-12 animate-spin text-primary"
            }, void 0, false, {
                fileName: "[project]/components/ui/page-loader.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm sm:text-base text-muted-foreground",
                children: message
            }, void 0, false, {
                fileName: "[project]/components/ui/page-loader.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/page-loader.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
    if (fullScreen) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen flex-col items-center justify-center p-4",
            children: content
        }, void 0, false, {
            fileName: "[project]/components/ui/page-loader.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
            className: "pt-6",
            children: content
        }, void 0, false, {
            fileName: "[project]/components/ui/page-loader.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/page-loader.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_c = PageLoader;
var _c;
__turbopack_context__.k.register(_c, "PageLoader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/layout/page-preloader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PagePreloader",
    ()=>PagePreloader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$page$2d$preload$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-page-preload.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$page$2d$loader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/page-loader.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function PagePreloader({ children, showLoader = true }) {
    _s();
    const { isPreloading, preloadError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$page$2d$preload$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePagePreload"])();
    // اگر خطا رخ داد، children را نمایش بده (fallback)
    if (preloadError) {
        console.warn("Preload error (continuing anyway):", preloadError);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    // اگر در حال preload است و showLoader true است، loader نمایش بده
    if (isPreloading && showLoader) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$page$2d$loader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageLoader"], {
            message: "در حال آماده‌سازی صفحه...",
            fullScreen: false
        }, void 0, false, {
            fileName: "[project]/components/layout/page-preloader.tsx",
            lineNumber: 25,
            columnNumber: 12
        }, this);
    }
    // وقتی preload تمام شد، children را نمایش بده
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(PagePreloader, "G63fnoLvKDt9ft6bjsTUfojkK4o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$page$2d$preload$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePagePreload"]
    ];
});
_c = PagePreloader;
var _c;
__turbopack_context__.k.register(_c, "PagePreloader");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2f$auth$2d$initializer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/auth/auth-initializer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$preloader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-preloader.tsx [app-client] (ecmascript)");
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2f$auth$2d$initializer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthInitializer"], {}, void 0, false, {
                    fileName: "[project]/components/providers.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$preloader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PagePreloader"], {
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/providers.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$chat$2f$global$2d$chat$2d$polling$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GlobalChatPolling"], {}, void 0, false, {
                    fileName: "[project]/components/providers.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$notifications$2f$notification$2d$center$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotificationCenter"], {
                    position: "top-right",
                    maxNotifications: 5
                }, void 0, false, {
                    fileName: "[project]/components/providers.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/providers.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/providers.tsx",
        lineNumber: 36,
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
                    let errorData = null;
                    try {
                        errorData = await response.json();
                        if (errorData && typeof errorData === 'object') {
                            errorMessage = errorData.error || errorData.message || errorMessage;
                        }
                    } catch (parseError) {
                        // If JSON parsing fails, use the status text
                        try {
                            const text = await response.text();
                            if (text) {
                                errorMessage = `${errorMessage} - ${text.substring(0, 100)}`;
                            }
                        } catch (textError) {
                            // If text parsing also fails, just use the status
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn("Could not parse error response", {
                                status: response.status
                            });
                        }
                    }
                    // Only log if it's a real error (not 200-299 range)
                    if (response.status >= 400) {
                        const errorInfo = {
                            status: response.status,
                            statusText: response.statusText,
                            error: errorMessage,
                            sessionId: sessionId || 'unknown',
                            itemCount: itemsForDB.length
                        };
                        // Add error data if available
                        if (errorData) {
                            errorInfo.errorData = errorData;
                        }
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Failed to sync cart to database:", errorInfo);
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
                    // Build error info for non-Error objects
                    const errorInfo = {
                        sessionId: get().sessionId || getSessionId() || 'unknown',
                        itemCount: get().items.length
                    };
                    if (error && typeof error === 'object') {
                        errorInfo.error = error;
                        const errorObj = error;
                        errorInfo.message = errorObj.message || error.toString() || 'Unknown error';
                        if (errorObj.code) errorInfo.code = errorObj.code;
                        if (errorObj.status) errorInfo.status = errorObj.status;
                    } else {
                        errorInfo.message = String(error) || 'Unknown error';
                    }
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Failed to sync cart to database:", errorInfo);
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
"[project]/components/layout/bottom-navigation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BottomNavigation",
    ()=>BottomNavigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
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
    // Don't show on admin pages, chat page, or when any chat is open
    if (isAdminPage || pathname === "/chat" || anyChatOpen) {
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
            className: "fixed bottom-0 left-0 right-0 z-[9999] flex justify-center items-end md:hidden pointer-events-none",
            "data-bottom-nav": "true",
            style: {
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                width: '100vw',
                maxWidth: '100vw',
                paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))",
                paddingLeft: "1rem",
                paddingRight: "1rem",
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
                willChange: 'transform',
                display: 'flex',
                visibility: 'visible',
                opacity: 1
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full max-w-sm pointer-events-auto", "bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80", "border-[0.25px] border-border/30", "rounded-[8px]", "shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.3)]"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-2 pb-1 pt-1.5",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between h-14",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleBack,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-center", "h-9 w-9 rounded-full", "bg-muted hover:bg-accent", "text-foreground", "transition-colors duration-200", "active:scale-95", "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background"),
                                "aria-label": "بازگشت",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/bottom-navigation.tsx",
                                    lineNumber: 163,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/layout/bottom-navigation.tsx",
                                lineNumber: 150,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center flex-1 gap-0 px-0.5",
                                children: navigationItems.map((item, index)=>{
                                    const Icon = item.icon;
                                    const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
                                    const isCart = item.href === "/cart";
                                    const isHome = item.href === "/";
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.href,
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center justify-center", "flex-1 h-12 rounded-md", "transition-all duration-200", "relative", isActive ? "text-primary" : "text-muted-foreground hover:text-foreground", "active:scale-95"),
                                                "aria-label": item.name,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-5 w-5 transition-transform duration-200", isActive && "scale-110")
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                                lineNumber: 194,
                                                                columnNumber: 25
                                                            }, this),
                                                            isCart && itemCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute -top-0.5 -right-0.5", "h-4 w-4 rounded-full", "bg-primary text-primary-foreground", "text-[9px] font-bold", "flex items-center justify-center", "min-w-[16px] px-0.5", "border border-background"),
                                                                "aria-label": `${itemCount} آیتم در سبد خرید`,
                                                                children: itemCount > 99 ? "99+" : itemCount
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                                lineNumber: 201,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                        lineNumber: 193,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-[10px] font-medium mt-1 leading-tight", "transition-colors duration-200", isActive && "font-semibold"),
                                                        children: item.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                        lineNumber: 217,
                                                        columnNumber: 23
                                                    }, this),
                                                    isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute top-0 left-1/2 -translate-x-1/2", "w-6 h-0.5 rounded-full", "bg-primary", "animate-in fade-in slide-in-from-top-1 duration-200")
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                        lineNumber: 227,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                lineNumber: 179,
                                                columnNumber: 21
                                            }, this),
                                            isHome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/chat",
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center justify-center", "flex-1 h-12 rounded-md", "transition-all duration-200", "relative", pathname === "/chat" ? "text-primary" : "text-muted-foreground hover:text-foreground", "active:scale-95"),
                                                "aria-label": "چت",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-5 w-5 transition-transform duration-200", pathname === "/chat" && "scale-110")
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                            lineNumber: 256,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                        lineNumber: 255,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-[10px] font-medium mt-1 leading-tight", "transition-colors duration-200", pathname === "/chat" && "font-semibold"),
                                                        children: "چت"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                        lineNumber: 263,
                                                        columnNumber: 25
                                                    }, this),
                                                    pathname === "/chat" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute top-0 left-1/2 -translate-x-1/2", "w-6 h-0.5 rounded-full", "bg-primary", "animate-in fade-in slide-in-from-top-1 duration-200")
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                        lineNumber: 273,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, "chat-button", true, {
                                                fileName: "[project]/components/layout/bottom-navigation.tsx",
                                                lineNumber: 240,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, item.href, true, {
                                        fileName: "[project]/components/layout/bottom-navigation.tsx",
                                        lineNumber: 178,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/layout/bottom-navigation.tsx",
                                lineNumber: 167,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/bottom-navigation.tsx",
                        lineNumber: 148,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/layout/bottom-navigation.tsx",
                    lineNumber: 147,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/layout/bottom-navigation.tsx",
                lineNumber: 138,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/layout/bottom-navigation.tsx",
            lineNumber: 117,
            columnNumber: 7
        }, this)
    }, void 0, false);
}
_s(BottomNavigation, "hCw4LAf8uTO/uK2z938/3x9HGBI=", false, function() {
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

//# sourceMappingURL=_dffe2817._.js.map