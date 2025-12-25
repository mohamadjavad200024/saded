(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/store/admin-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAdminStore",
    ()=>useAdminStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$product$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/product-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$category$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/category-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$order$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/order-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger-client.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const defaultSettings = {
    siteName: "ساد",
    siteDescription: "فروشگاه آنلاین قطعات خودرو وارداتی",
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    lowStockThreshold: 10,
    itemsPerPage: 10,
    showNotifications: true,
    theme: "system"
};
const defaultStats = {
    totalProducts: 0,
    activeProducts: 0,
    totalStock: 0,
    lowStockProducts: 0,
    totalCategories: 0,
    activeCategories: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    averagePrice: 0
};
const useAdminStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])((set, get)=>({
        stats: null,
        isLoading: false,
        settings: defaultSettings,
        refreshStats: async ()=>{
            set({
                isLoading: true
            });
            try {
                // Get data from stores
                const productStore = __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$product$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductStore"].getState();
                const categoryStore = __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$category$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCategoryStore"].getState();
                const orderStore = __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$order$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOrderStore"].getState();
                const products = productStore.products;
                const categories = categoryStore.categories;
                const orders = orderStore.orders;
                // Calculate stats from store data
                const enabledProducts = products.filter((p)=>p.enabled);
                const totalPrice = enabledProducts.reduce((sum, p)=>sum + (p.price || 0), 0);
                const averagePrice = enabledProducts.length > 0 ? totalPrice / enabledProducts.length : 0;
                // Calculate order stats from order store
                const totalOrders = orders.length;
                const pendingOrders = orders.filter((o)=>o.status === "pending" || o.paymentStatus === "pending").length;
                const totalRevenue = orders.filter((o)=>o.paymentStatus === "paid").reduce((sum, o)=>sum + (o.total + o.shippingCost), 0);
                const stats = {
                    totalProducts: products.length,
                    activeProducts: enabledProducts.length,
                    totalStock: products.reduce((sum, p)=>sum + p.stockCount, 0),
                    lowStockProducts: products.filter((p)=>p.stockCount < get().settings.lowStockThreshold).length,
                    totalCategories: categories.length,
                    activeCategories: categories.filter((c)=>c.isActive && c.enabled).length,
                    totalOrders,
                    pendingOrders,
                    totalRevenue,
                    averagePrice: Math.round(averagePrice)
                };
                set({
                    stats,
                    isLoading: false
                });
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error("Error refreshing stats:", error);
                set({
                    stats: defaultStats,
                    isLoading: false
                });
            }
        },
        updateSettings: (newSettings)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        ...newSettings
                    }
                })),
        resetSettings: ()=>set({
                settings: defaultSettings
            })
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/theme-toggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ThemeToggle() {
    _s();
    const { theme, setTheme, resolvedTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const [mounted, setMounted] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    // Avoid hydration mismatch
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "ThemeToggle.useEffect": ()=>{
            setMounted(true);
        }
    }["ThemeToggle.useEffect"], []);
    if (!mounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: "ghost",
            size: "icon",
            className: "h-9 w-9",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                    className: "h-5 w-5"
                }, void 0, false, {
                    fileName: "[project]/components/ui/theme-toggle.tsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "sr-only",
                    children: "تغییر تم"
                }, void 0, false, {
                    fileName: "[project]/components/ui/theme-toggle.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/theme-toggle.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this);
    }
    const toggleTheme = ()=>{
        // اگر theme روی system است، از resolvedTheme استفاده می‌کنیم
        const currentTheme = resolvedTheme || (theme === "system" ? "light" : theme);
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
    };
    const isDark = resolvedTheme === "dark" || theme === "dark";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        variant: "ghost",
        size: "icon",
        className: "h-9 w-9 relative",
        onClick: toggleTheme,
        type: "button",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                className: `h-5 w-5 absolute transition-all duration-300 ${isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`
            }, void 0, false, {
                fileName: "[project]/components/ui/theme-toggle.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                className: `h-5 w-5 absolute transition-all duration-300 ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`
            }, void 0, false, {
                fileName: "[project]/components/ui/theme-toggle.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "sr-only",
                children: "تغییر تم"
            }, void 0, false, {
                fileName: "[project]/components/ui/theme-toggle.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/theme-toggle.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_s(ThemeToggle, "OPO4/Bwn/B3wErFIC5J6lGmQcgg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = ThemeToggle;
var _c;
__turbopack_context__.k.register(_c, "ThemeToggle");
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
"[project]/components/layout/header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/cart-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/auth-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$admin$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/admin-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$product$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/product-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/theme-toggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
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
function Header() {
    _s();
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [searchOpen, setSearchOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { getItemCount, initializeSession, loadFromDatabase, items } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])();
    const { user, isAuthenticated, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const { settings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$admin$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAdminStore"])();
    const { setFilters, filters } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$product$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductStore"])();
    // Load settings from localStorage on mount
    const [siteSettings, setSiteSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        siteName: settings.siteName || "ساد",
        logoUrl: settings.logoUrl || "",
        siteDescription: settings.siteDescription || "قطعات خودرو وارداتی"
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            // Load from localStorage
            const loadSettings = {
                "Header.useEffect.loadSettings": ()=>{
                    const savedSettings = localStorage.getItem("admin_site_settings");
                    if (savedSettings) {
                        try {
                            const parsed = JSON.parse(savedSettings);
                            setSiteSettings({
                                siteName: parsed.siteName || settings.siteName || "ساد",
                                logoUrl: parsed.logoUrl || settings.logoUrl || "",
                                siteDescription: parsed.siteDescription || settings.siteDescription || "قطعات خودرو وارداتی"
                            });
                        } catch (error) {
                            console.error("Error loading site settings:", error);
                        }
                    }
                }
            }["Header.useEffect.loadSettings"];
            loadSettings();
            // Listen for storage changes (when settings are updated in another tab/window)
            const handleStorageChange = {
                "Header.useEffect.handleStorageChange": (e)=>{
                    if (e.key === "admin_site_settings") {
                        loadSettings();
                    }
                }
            }["Header.useEffect.handleStorageChange"];
            window.addEventListener("storage", handleStorageChange);
            // Also listen for custom event (for same-tab updates)
            const handleSettingsUpdate = {
                "Header.useEffect.handleSettingsUpdate": ()=>{
                    loadSettings();
                }
            }["Header.useEffect.handleSettingsUpdate"];
            window.addEventListener("settingsUpdated", handleSettingsUpdate);
            return ({
                "Header.useEffect": ()=>{
                    window.removeEventListener("storage", handleStorageChange);
                    window.removeEventListener("settingsUpdated", handleSettingsUpdate);
                }
            })["Header.useEffect"];
        }
    }["Header.useEffect"], [
        settings
    ]);
    // Calculate item count - this will automatically update when items change
    const itemCount = items.reduce((count, item)=>count + item.quantity, 0);
    // Subscribe to items changes to update count
    // This ensures the count updates when cart changes
    // Prevent hydration mismatch by only showing cart count after mount
    // Also load cart from database on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            setIsMounted(true);
            // Initialize cart session and load from database
            const initCart = {
                "Header.useEffect.initCart": async ()=>{
                    try {
                        initializeSession();
                        await loadFromDatabase();
                    } catch (error) {
                        if ("TURBOPACK compile-time truthy", 1) {
                            console.error("Error initializing cart in header:", error);
                        }
                    }
                }
            }["Header.useEffect.initCart"];
            initCart();
        }
    }["Header.useEffect"], [
        initializeSession,
        loadFromDatabase
    ]);
    // Sync search query with store filter when on products page
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            if (pathname === "/products" && filters.search && filters.search !== searchQuery) {
                setSearchQuery(filters.search);
            }
        }
    }["Header.useEffect"], [
        filters.search,
        pathname
    ]);
    // Clear filter when search input is empty
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            if (pathname === "/products" && !searchQuery.trim() && filters.search) {
                // If search input is empty and there's a filter, clear it
                setFilters({
                    search: undefined
                });
            }
        }
    }["Header.useEffect"], [
        searchQuery,
        pathname,
        filters.search,
        setFilters
    ]);
    // Handle search submit
    const handleSearchSubmit = (e)=>{
        if (e) {
            e.preventDefault();
        }
        // Apply search filter
        setFilters({
            search: searchQuery.trim() || undefined
        });
        // Navigate to products page if not already there
        if (pathname !== "/products") {
            router.push("/products");
        }
        // Close mobile search
        setSearchOpen(false);
        // Close filter sheet if open (we'll need to expose this from product-grid)
        // For now, we'll dispatch a custom event
        window.dispatchEvent(new CustomEvent("closeFilterSheet"));
    };
    // Handle Enter key press
    const handleKeyDown = (e)=>{
        if (e.key === "Enter") {
            handleSearchSubmit();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-50 w-full border-b-[0.25px] border-border/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "flex items-center space-x-1.5 space-x-reverse min-w-0 flex-shrink-0",
                        children: siteSettings.logoUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: siteSettings.logoUrl,
                                        alt: siteSettings.siteName,
                                        className: "w-full h-full object-contain"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/header.tsx",
                                        lineNumber: 159,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/header.tsx",
                                    lineNumber: 158,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xl sm:text-2xl font-bold text-primary leading-tight truncate",
                                            children: siteSettings.siteName
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/header.tsx",
                                            lineNumber: 166,
                                            columnNumber: 17
                                        }, this),
                                        siteSettings.siteDescription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "hidden sm:block text-[10px] sm:text-xs text-muted-foreground leading-tight truncate",
                                            children: siteSettings.siteDescription
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/header.tsx",
                                            lineNumber: 170,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/layout/header.tsx",
                                    lineNumber: 165,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/header.tsx",
                            lineNumber: 157,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xl sm:text-2xl font-bold text-primary leading-tight",
                                    children: siteSettings.siteName
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/header.tsx",
                                    lineNumber: 178,
                                    columnNumber: 15
                                }, this),
                                siteSettings.siteDescription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "hidden sm:block text-[10px] sm:text-xs text-muted-foreground leading-tight",
                                    children: siteSettings.siteDescription
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/header.tsx",
                                    lineNumber: 182,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/header.tsx",
                            lineNumber: 177,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/layout/header.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        className: "hidden lg:flex flex-1 max-w-xl mx-8",
                        onSubmit: handleSearchSubmit,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative w-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/header.tsx",
                                    lineNumber: 193,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    type: "search",
                                    placeholder: "جستجوی قطعه، برند یا شماره VIN...",
                                    value: searchQuery,
                                    onChange: (e)=>{
                                        const value = e.target.value;
                                        setSearchQuery(value);
                                        // If input is cleared and we're on products page, clear filter immediately
                                        if (pathname === "/products" && !value.trim() && filters.search) {
                                            setFilters({
                                                search: undefined
                                            });
                                        }
                                    },
                                    onKeyDown: handleKeyDown,
                                    className: "pr-10 w-full h-9"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/header.tsx",
                                    lineNumber: 194,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/header.tsx",
                            lineNumber: 192,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/layout/header.tsx",
                        lineNumber: 191,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-1 space-x-reverse flex-shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                className: "lg:hidden h-9 w-9",
                                onClick: ()=>setSearchOpen(!searchOpen),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/header.tsx",
                                        lineNumber: 221,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sr-only",
                                        children: "جستجو"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/header.tsx",
                                        lineNumber: 222,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/header.tsx",
                                lineNumber: 215,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeToggle"], {}, void 0, false, {
                                fileName: "[project]/components/layout/header.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this),
                            isAuthenticated && user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "icon",
                                            className: "hidden md:flex h-9 w-9",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    className: "h-5 w-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/layout/header.tsx",
                                                    lineNumber: 233,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "sr-only",
                                                    children: "حساب کاربری"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/layout/header.tsx",
                                                    lineNumber: 234,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/layout/header.tsx",
                                            lineNumber: 232,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/header.tsx",
                                        lineNumber: 231,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                        align: "end",
                                        className: "w-56",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "px-2 py-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-semibold",
                                                        children: user.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/header.tsx",
                                                        lineNumber: 239,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: user.phone
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/header.tsx",
                                                        lineNumber: 240,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/layout/header.tsx",
                                                lineNumber: 238,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                fileName: "[project]/components/layout/header.tsx",
                                                lineNumber: 242,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                asChild: true,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/profile",
                                                    className: "cursor-pointer",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                            className: "ml-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/layout/header.tsx",
                                                            lineNumber: 245,
                                                            columnNumber: 21
                                                        }, this),
                                                        "پروفایل"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/layout/header.tsx",
                                                    lineNumber: 244,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/header.tsx",
                                                lineNumber: 243,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                fileName: "[project]/components/layout/header.tsx",
                                                lineNumber: 249,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                onClick: ()=>{
                                                    logout();
                                                },
                                                className: "cursor-pointer text-destructive focus:text-destructive",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                        className: "ml-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/header.tsx",
                                                        lineNumber: 256,
                                                        columnNumber: 19
                                                    }, this),
                                                    "خروج"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/layout/header.tsx",
                                                lineNumber: 250,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/layout/header.tsx",
                                        lineNumber: 237,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/header.tsx",
                                lineNumber: 230,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/auth",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon",
                                    className: "hidden md:flex h-9 w-9",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/header.tsx",
                                            lineNumber: 264,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "sr-only",
                                            children: "حساب کاربری"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/header.tsx",
                                            lineNumber: 265,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/layout/header.tsx",
                                    lineNumber: 263,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/layout/header.tsx",
                                lineNumber: 262,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: isAuthenticated ? "/profile" : "/auth",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon",
                                    className: "lg:hidden h-9 w-9",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/header.tsx",
                                            lineNumber: 273,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "sr-only",
                                            children: "پروفایل"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/header.tsx",
                                            lineNumber: 274,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/layout/header.tsx",
                                    lineNumber: 272,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/layout/header.tsx",
                                lineNumber: 271,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/cart",
                                "aria-label": isMounted ? `سبد خرید با ${itemCount} آیتم` : "سبد خرید",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon",
                                    className: "relative h-9 w-9",
                                    "aria-label": isMounted && itemCount > 0 ? `سبد خرید (${itemCount} آیتم)` : "سبد خرید",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/header.tsx",
                                            lineNumber: 286,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "sr-only",
                                            children: "سبد خرید"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/header.tsx",
                                            lineNumber: 287,
                                            columnNumber: 15
                                        }, this),
                                        isMounted && itemCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute -top-0.5 -left-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-secondary text-secondary-foreground text-[10px] sm:text-xs font-bold flex items-center justify-center",
                                            "aria-label": `${itemCount} آیتم در سبد خرید`,
                                            children: itemCount > 99 ? "99+" : itemCount
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/header.tsx",
                                            lineNumber: 289,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/layout/header.tsx",
                                    lineNumber: 280,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/layout/header.tsx",
                                lineNumber: 279,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/header.tsx",
                        lineNumber: 213,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/header.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this),
            searchOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:hidden border-t-[0.25px] border-border/30 px-3 py-2 bg-background animate-in slide-in-from-top",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSearchSubmit,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/header.tsx",
                                lineNumber: 306,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                type: "search",
                                placeholder: "جستجو...",
                                value: searchQuery,
                                onChange: (e)=>{
                                    const value = e.target.value;
                                    setSearchQuery(value);
                                    // If input is cleared and we're on products page, clear filter immediately
                                    if (pathname === "/products" && !value.trim() && filters.search) {
                                        setFilters({
                                            search: undefined
                                        });
                                    }
                                },
                                onKeyDown: handleKeyDown,
                                className: "pr-10 h-9",
                                autoFocus: true
                            }, void 0, false, {
                                fileName: "[project]/components/layout/header.tsx",
                                lineNumber: 307,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                variant: "ghost",
                                size: "icon",
                                className: "absolute left-1 top-1/2 transform -translate-y-1/2 h-7 w-7",
                                onClick: ()=>setSearchOpen(false),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/header.tsx",
                                    lineNumber: 330,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/layout/header.tsx",
                                lineNumber: 323,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/header.tsx",
                        lineNumber: 305,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/layout/header.tsx",
                    lineNumber: 304,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/layout/header.tsx",
                lineNumber: 303,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/header.tsx",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
_s(Header, "O3MoVuSTSugoTt3WYTsQKhi4hJg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$admin$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAdminStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$product$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductStore"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/layout/footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Footer",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Facebook$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/facebook.js [app-client] (ecmascript) <export default as Facebook>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$instagram$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Instagram$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/instagram.js [app-client] (ecmascript) <export default as Instagram>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Twitter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/twitter.js [app-client] (ecmascript) <export default as Twitter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const defaultContent = {
    footer: {
        about: {
            title: "درباره ساد",
            description: "فروشگاه آنلاین قطعات خودرو وارداتی با بهترین کیفیت و قیمت. ما متعهد به ارائه بهترین خدمات به مشتریان خود هستیم.",
            socialLinks: {
                instagram: "#",
                facebook: "#",
                twitter: "#"
            }
        },
        quickLinks: {
            title: "دسترسی سریع",
            links: [
                {
                    label: "محصولات",
                    href: "/products"
                },
                {
                    label: "درباره ما",
                    href: "/about"
                },
                {
                    label: "تماس با ما",
                    href: "/contact"
                },
                {
                    label: "وبلاگ",
                    href: "/blog"
                }
            ]
        },
        support: {
            title: "پشتیبانی",
            links: [
                {
                    label: "سوالات متداول",
                    href: "/faq"
                },
                {
                    label: "ارسال و تحویل",
                    href: "/shipping"
                },
                {
                    label: "بازگشت کالا",
                    href: "/returns"
                },
                {
                    label: "گارانتی",
                    href: "/warranty"
                }
            ]
        },
        contact: {
            title: "تماس با ما",
            phone: "021-12345678",
            email: "info@saded.ir"
        },
        copyright: `© ${new Date().getFullYear()} ساد. تمامی حقوق محفوظ است.`
    }
};
function Footer() {
    _s();
    const [content, setContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultContent);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Footer.useEffect": ()=>{
            const fetchContent = {
                "Footer.useEffect.fetchContent": async ()=>{
                    try {
                        const response = await fetch("/api/settings/site-content");
                        if (response.ok) {
                            const data = await response.json();
                            if (data.data?.footer) {
                                setContent(data.data);
                            }
                        }
                    } catch (error) {
                        console.error("Error fetching footer content:", error);
                    } finally{
                        setLoading(false);
                    }
                }
            }["Footer.useEffect.fetchContent"];
            fetchContent();
        }
    }["Footer.useEffect"], []);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
            className: "border-t-[0.25px] border-border/30 bg-background",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container py-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center py-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/components/layout/footer.tsx",
                        lineNumber: 101,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/layout/footer.tsx",
                    lineNumber: 100,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/layout/footer.tsx",
                lineNumber: 99,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/layout/footer.tsx",
            lineNumber: 98,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "border-t-[0.25px] border-border/30 bg-background",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container py-12",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4 col-span-2 md:col-span-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-foreground",
                                    children: content.footer.about.title
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/footer.tsx",
                                    lineNumber: 114,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-muted-foreground",
                                    children: content.footer.about.description
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/footer.tsx",
                                    lineNumber: 115,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex space-x-2 space-x-reverse",
                                    children: [
                                        content.footer.about.socialLinks.instagram && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: content.footer.about.socialLinks.instagram,
                                            className: "p-2 rounded-full border-[0.25px] border-border/30 hover:bg-foreground hover:text-background transition-colors text-foreground",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$instagram$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Instagram$3e$__["Instagram"], {
                                                className: "h-5 w-5"
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/footer.tsx",
                                                lineNumber: 124,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/footer.tsx",
                                            lineNumber: 120,
                                            columnNumber: 17
                                        }, this),
                                        content.footer.about.socialLinks.facebook && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: content.footer.about.socialLinks.facebook,
                                            className: "p-2 rounded-full border-[0.25px] border-border/30 hover:bg-foreground hover:text-background transition-colors text-foreground",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Facebook$3e$__["Facebook"], {
                                                className: "h-5 w-5"
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/footer.tsx",
                                                lineNumber: 132,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/footer.tsx",
                                            lineNumber: 128,
                                            columnNumber: 17
                                        }, this),
                                        content.footer.about.socialLinks.twitter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: content.footer.about.socialLinks.twitter,
                                            className: "p-2 rounded-full border-[0.25px] border-border/30 hover:bg-foreground hover:text-background transition-colors text-foreground",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Twitter$3e$__["Twitter"], {
                                                className: "h-5 w-5"
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/footer.tsx",
                                                lineNumber: 140,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/footer.tsx",
                                            lineNumber: 136,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/layout/footer.tsx",
                                    lineNumber: 118,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/footer.tsx",
                            lineNumber: 113,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-foreground",
                                    children: content.footer.quickLinks.title
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/footer.tsx",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2 text-sm",
                                    children: content.footer.quickLinks.links.map((link, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: link.href,
                                                className: "text-muted-foreground hover:text-foreground transition-colors",
                                                children: link.label
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/footer.tsx",
                                                lineNumber: 152,
                                                columnNumber: 19
                                            }, this)
                                        }, index, false, {
                                            fileName: "[project]/components/layout/footer.tsx",
                                            lineNumber: 151,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/footer.tsx",
                                    lineNumber: 149,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/footer.tsx",
                            lineNumber: 147,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-foreground",
                                    children: content.footer.support.title
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/footer.tsx",
                                    lineNumber: 162,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2 text-sm",
                                    children: content.footer.support.links.map((link, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: link.href,
                                                className: "text-muted-foreground hover:text-foreground transition-colors",
                                                children: link.label
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/footer.tsx",
                                                lineNumber: 166,
                                                columnNumber: 19
                                            }, this)
                                        }, index, false, {
                                            fileName: "[project]/components/layout/footer.tsx",
                                            lineNumber: 165,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/footer.tsx",
                                    lineNumber: 163,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/footer.tsx",
                            lineNumber: 161,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4 col-span-2 md:col-span-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-foreground",
                                    children: content.footer.contact.title
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/footer.tsx",
                                    lineNumber: 176,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-3 text-sm",
                                    children: [
                                        content.footer.contact.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "flex items-center space-x-2 space-x-reverse",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                    className: "h-4 w-4 text-muted-foreground"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/layout/footer.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-muted-foreground",
                                                    children: content.footer.contact.phone
                                                }, void 0, false, {
                                                    fileName: "[project]/components/layout/footer.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/layout/footer.tsx",
                                            lineNumber: 179,
                                            columnNumber: 17
                                        }, this),
                                        content.footer.contact.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "flex items-center space-x-2 space-x-reverse",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                    className: "h-4 w-4 text-muted-foreground"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/layout/footer.tsx",
                                                    lineNumber: 186,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-muted-foreground",
                                                    children: content.footer.contact.email
                                                }, void 0, false, {
                                                    fileName: "[project]/components/layout/footer.tsx",
                                                    lineNumber: 187,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/layout/footer.tsx",
                                            lineNumber: 185,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/layout/footer.tsx",
                                    lineNumber: 177,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/footer.tsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/footer.tsx",
                    lineNumber: 111,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-8 pt-8 border-t-[0.25px] border-border/30 text-center text-sm text-muted-foreground",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: content.footer.copyright
                    }, void 0, false, {
                        fileName: "[project]/components/layout/footer.tsx",
                        lineNumber: 195,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/layout/footer.tsx",
                    lineNumber: 194,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/layout/footer.tsx",
            lineNumber: 110,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/layout/footer.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
_s(Footer, "n6sDw2frJwmc8qnd7q0N/lJ4smU=");
_c = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/product/product-detail.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
var _s = __turbopack_context__.k.signature();
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Heart, Share2, Star, Check, Truck, Shield, Plane, Ship, AlertCircle } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";
import { VehicleLogo } from "@/components/ui/vehicle-logo";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { useProductStore } from "@/store/product-store";
import { useVehicleStore } from "@/store/vehicle-store";
import { getPlaceholderImage } from "@/lib/image-utils";
import { useToast } from "@/hooks/use-toast";
export function ProductDetail({ productId }) {
    _s();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [shippingMethod, setShippingMethod] = useState(null);
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const { toast } = useToast();
    const addToCart = useCartStore({
        "ProductDetail.useCartStore[addToCart]": (state)=>state.addItem
    }["ProductDetail.useCartStore[addToCart]"]);
    const getProduct = useProductStore({
        "ProductDetail.useProductStore[getProduct]": (state)=>state.getProduct
    }["ProductDetail.useProductStore[getProduct]"]);
    const addProduct = useProductStore({
        "ProductDetail.useProductStore[addProduct]": (state)=>state.addProduct
    }["ProductDetail.useProductStore[addProduct]"]);
    const { getVehicle, loadVehiclesFromDB } = useVehicleStore();
    // Only access store after hydration to avoid SSR mismatch
    useEffect({
        "ProductDetail.useEffect": ()=>{
            setIsHydrated(true);
            // First try to get from store
            const productData = getProduct(productId);
            if (productData) {
                setProduct(productData);
                setIsLoading(false);
                return;
            }
            // If not in store, fetch from API
            const fetchProduct = {
                "ProductDetail.useEffect.fetchProduct": async ()=>{
                    try {
                        setIsLoading(true);
                        const response = await fetch(`/api/products/${productId}`);
                        if (response.ok) {
                            const result = await response.json();
                            if (result.success && result.data) {
                                const fetchedProduct = result.data;
                                // Add to store for future use
                                addProduct(fetchedProduct);
                                setProduct(fetchedProduct);
                            } else {
                                setProduct(null);
                            }
                        } else {
                            setProduct(null);
                        }
                    } catch (error) {
                        console.error("Error fetching product:", error);
                        setProduct(null);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["ProductDetail.useEffect.fetchProduct"];
            fetchProduct();
        }
    }["ProductDetail.useEffect"], [
        productId,
        getProduct,
        addProduct
    ]);
    const setShippingMethodInStore = useCartStore({
        "ProductDetail.useCartStore[setShippingMethodInStore]": (state)=>state.setShippingMethod
    }["ProductDetail.useCartStore[setShippingMethodInStore]"]);
    // Load vehicles on mount
    useEffect({
        "ProductDetail.useEffect": ()=>{
            loadVehiclesFromDB().catch(console.error);
        }
    }["ProductDetail.useEffect"], [
        loadVehiclesFromDB
    ]);
    // Reset isAdded state after 2.5 seconds
    useEffect({
        "ProductDetail.useEffect": ()=>{
            if (isAdded) {
                const timer = setTimeout({
                    "ProductDetail.useEffect.timer": ()=>{
                        setIsAdded(false);
                    }
                }["ProductDetail.useEffect.timer"], 2500);
                return ({
                    "ProductDetail.useEffect": ()=>clearTimeout(timer)
                })["ProductDetail.useEffect"];
            }
        }
    }["ProductDetail.useEffect"], [
        isAdded
    ]);
    // Show loading state during hydration or while fetching
    if (!isHydrated || isLoading) {
        return /*#__PURE__*/ _jsxDEV("div", {
            className: "flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4",
            suppressHydrationWarning: true,
            children: [
                /*#__PURE__*/ _jsxDEV("div", {
                    className: "h-12 w-12 sm:h-16 sm:w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"
                }, void 0, false, {
                    fileName: "[project]/components/product/product-detail.tsx",
                    lineNumber: 99,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV("h2", {
                    className: "text-xl sm:text-2xl font-semibold mb-2",
                    children: "در حال بارگذاری..."
                }, void 0, false, {
                    fileName: "[project]/components/product/product-detail.tsx",
                    lineNumber: 100,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/product/product-detail.tsx",
            lineNumber: 98,
            columnNumber: 7
        }, this);
    }
    // After loading, show error if product not found
    if (!product) {
        return /*#__PURE__*/ _jsxDEV("div", {
            className: "flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4",
            children: [
                /*#__PURE__*/ _jsxDEV(AlertCircle, {
                    className: "h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4"
                }, void 0, false, {
                    fileName: "[project]/components/product/product-detail.tsx",
                    lineNumber: 109,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV("h2", {
                    className: "text-xl sm:text-2xl font-semibold mb-2",
                    children: "محصول یافت نشد"
                }, void 0, false, {
                    fileName: "[project]/components/product/product-detail.tsx",
                    lineNumber: 110,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV("p", {
                    className: "text-sm sm:text-base text-muted-foreground text-center mb-6",
                    children: "متأسفانه محصول مورد نظر شما یافت نشد"
                }, void 0, false, {
                    fileName: "[project]/components/product/product-detail.tsx",
                    lineNumber: 111,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV(Link, {
                    href: "/products",
                    children: /*#__PURE__*/ _jsxDEV(Button, {
                        variant: "default",
                        children: "بازگشت به لیست محصولات"
                    }, void 0, false, {
                        fileName: "[project]/components/product/product-detail.tsx",
                        lineNumber: 115,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/product/product-detail.tsx",
                    lineNumber: 114,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/product/product-detail.tsx",
            lineNumber: 108,
            columnNumber: 7
        }, this);
    }
    const handleAddToCart = ()=>{
        // Reset state if already added (for multiple clicks)
        if (isAdded) {
            setIsAdded(false);
        }
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: Array.isArray(product.images) && product.images[0] || getPlaceholderImage(300, 300),
            quantity
        });
        // Save shipping method to store when adding to cart
        // Only save if a method is selected and it's enabled for this product
        if (shippingMethod) {
            if (shippingMethod === "air" && product.airShippingEnabled || shippingMethod === "sea" && product.seaShippingEnabled) {
                setShippingMethodInStore(shippingMethod);
            } else {
                // If selected method is not enabled, set the first available method
                if (product.airShippingEnabled) {
                    setShippingMethodInStore("air");
                } else if (product.seaShippingEnabled) {
                    setShippingMethodInStore("sea");
                }
            }
        } else {
            // Auto-select first available method if none selected
            if (product.airShippingEnabled) {
                setShippingMethodInStore("air");
            } else if (product.seaShippingEnabled) {
                setShippingMethodInStore("sea");
            }
        }
        // Show toast notification
        toast({
            title: "افزوده شد",
            description: `${product.name} به سبد خرید اضافه شد`
        });
        // Set success state
        setIsAdded(true);
    };
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_URL || 'https://saded.ir';
    const productUrl = `${baseUrl}/products/${product.id}`;
    const productImages = Array.isArray(product.images) ? product.images : [];
    const productImage = productImages[0] || getPlaceholderImage(600, 600);
    const price = product.price / 1000; // Convert from Rials to Tomans
    const availability = product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
    // Generate Product Schema.org structured data
    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description || `${product.name} - قطعه خودرو ${product.brand || ''}`,
        "image": productImages.length > 0 ? productImages : [
            productImage
        ],
        "brand": {
            "@type": "Brand",
            "name": product.brand || "نامشخص"
        },
        "category": product.category,
        "sku": product.id,
        "offers": {
            "@type": "Offer",
            "url": productUrl,
            "priceCurrency": "IRR",
            "price": product.price.toString(),
            "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            "availability": availability,
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
                "@type": "Organization",
                "name": "ساد"
            }
        }
    };
    // Add aggregateRating only if rating exists
    if (product.rating) {
        productSchema.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": product.rating.toString(),
            "reviewCount": (product.reviews || 0).toString()
        };
    }
    return /*#__PURE__*/ _jsxDEV("div", {
        className: "relative space-y-4 sm:space-y-6 md:space-y-8 px-2 sm:px-0",
        children: [
            /*#__PURE__*/ _jsxDEV("script", {
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify(productSchema)
                }
            }, void 0, false, {
                fileName: "[project]/components/product/product-detail.tsx",
                lineNumber: 216,
                columnNumber: 7
            }, this),
            (()=>{
                const vehicle = product.vehicle ? getVehicle(product.vehicle) : null;
                const hasValidLogo = vehicle && vehicle.logo && typeof vehicle.logo === 'string' && vehicle.logo.trim() !== '' && (vehicle.logo.startsWith('data:image') || vehicle.logo.startsWith('http') || vehicle.logo.startsWith('/'));
                return /*#__PURE__*/ _jsxDEV("div", {
                    className: "absolute top-0 left-0 z-10 flex items-center gap-2 sm:gap-3",
                    children: [
                        /*#__PURE__*/ _jsxDEV("div", {
                            className: "relative w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full overflow-hidden border-2 border-green-500 flex items-center justify-center p-2 sm:p-3 flex-shrink-0",
                            children: vehicle && hasValidLogo ? /*#__PURE__*/ _jsxDEV("img", {
                                src: vehicle.logo,
                                alt: vehicle.name,
                                className: "w-full h-full object-contain rounded-full",
                                onError: (e)=>{
                                    e.currentTarget.style.display = 'none';
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                        const placeholder = document.createElement('span');
                                        placeholder.className = 'text-green-500 text-[10px] sm:text-xs font-medium';
                                        placeholder.textContent = 'لوگو';
                                        parent.appendChild(placeholder);
                                    }
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/product/product-detail.tsx",
                                lineNumber: 235,
                                columnNumber: 17
                            }, this) : vehicle ? /*#__PURE__*/ _jsxDEV(VehicleLogo, {
                                logo: vehicle.logo,
                                alt: vehicle.name,
                                size: "md",
                                className: "w-full h-full rounded-full"
                            }, void 0, false, {
                                fileName: "[project]/components/product/product-detail.tsx",
                                lineNumber: 251,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ _jsxDEV("span", {
                                className: "text-green-500 text-[10px] sm:text-xs font-medium",
                                children: "لوگو"
                            }, void 0, false, {
                                fileName: "[project]/components/product/product-detail.tsx",
                                lineNumber: 258,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/product/product-detail.tsx",
                            lineNumber: 233,
                            columnNumber: 13
                        }, this),
                        vehicle && /*#__PURE__*/ _jsxDEV("span", {
                            className: "text-sm sm:text-base md:text-lg font-bold text-foreground whitespace-nowrap mr-auto",
                            children: vehicle.name
                        }, void 0, false, {
                            fileName: "[project]/components/product/product-detail.tsx",
                            lineNumber: 264,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/product/product-detail.tsx",
                    lineNumber: 231,
                    columnNumber: 11
                }, this);
            })(),
            /*#__PURE__*/ _jsxDEV("nav", {
                className: "text-[10px] sm:text-xs text-muted-foreground overflow-x-auto mb-2",
                children: [
                    /*#__PURE__*/ _jsxDEV("span", {
                        children: "خانه"
                    }, void 0, false, {
                        fileName: "[project]/components/product/product-detail.tsx",
                        lineNumber: 274,
                        columnNumber: 9
                    }, this),
                    " / ",
                    /*#__PURE__*/ _jsxDEV("span", {
                        children: "محصولات"
                    }, void 0, false, {
                        fileName: "[project]/components/product/product-detail.tsx",
                        lineNumber: 274,
                        columnNumber: 29
                    }, this),
                    " / ",
                    /*#__PURE__*/ _jsxDEV("span", {
                        children: product.category
                    }, void 0, false, {
                        fileName: "[project]/components/product/product-detail.tsx",
                        lineNumber: 274,
                        columnNumber: 52
                    }, this),
                    " /",
                    " ",
                    /*#__PURE__*/ _jsxDEV("span", {
                        className: "text-foreground truncate",
                        children: product.name
                    }, void 0, false, {
                        fileName: "[project]/components/product/product-detail.tsx",
                        lineNumber: 275,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/product/product-detail.tsx",
                lineNumber: 273,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("div", {
                children: /*#__PURE__*/ _jsxDEV("span", {
                    className: "text-xs sm:text-sm text-muted-foreground",
                    children: product.category
                }, void 0, false, {
                    fileName: "[project]/components/product/product-detail.tsx",
                    lineNumber: 280,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/product/product-detail.tsx",
                lineNumber: 279,
                columnNumber: 7
            }, this),
            (product.airShippingEnabled || product.seaShippingEnabled) && /*#__PURE__*/ _jsxDEV("div", {
                className: "hidden lg:block space-y-2 sm:space-y-3 lg:max-w-lg lg:mr-auto",
                children: [
                    /*#__PURE__*/ _jsxDEV("label", {
                        className: "text-xs sm:text-sm font-medium block",
                        children: "روش ارسال:"
                    }, void 0, false, {
                        fileName: "[project]/components/product/product-detail.tsx",
                        lineNumber: 286,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ _jsxDEV("div", {
                        className: `grid gap-2 sm:gap-3 ${product.airShippingEnabled && product.seaShippingEnabled ? "grid-cols-2" : "grid-cols-1"}`,
                        children: [
                            product.airShippingEnabled && /*#__PURE__*/ _jsxDEV("button", {
                                onClick: ()=>setShippingMethod("air"),
                                className: `flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-lg border-[0.25px] transition-all ${shippingMethod === "air" ? "border-primary/30 bg-primary/5" : "border-border/30 hover:border-primary/20"}`,
                                children: [
                                    /*#__PURE__*/ _jsxDEV(Plane, {
                                        className: `h-5 w-5 sm:h-6 sm:w-6 ${shippingMethod === "air" ? "text-primary" : "text-muted-foreground"}`
                                    }, void 0, false, {
                                        fileName: "[project]/components/product/product-detail.tsx",
                                        lineNumber: 297,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ _jsxDEV("span", {
                                        className: `text-xs sm:text-sm font-medium ${shippingMethod === "air" ? "text-primary" : "text-foreground"}`,
                                        children: "ارسال هوایی"
                                    }, void 0, false, {
                                        fileName: "[project]/components/product/product-detail.tsx",
                                        lineNumber: 300,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/product/product-detail.tsx",
                                lineNumber: 289,
                                columnNumber: 15
                            }, this),
                            product.seaShippingEnabled && /*#__PURE__*/ _jsxDEV("button", {
                                onClick: ()=>setShippingMethod("sea"),
                                className: `flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-lg border-[0.25px] transition-all ${shippingMethod === "sea" ? "border-primary/30 bg-primary/5" : "border-border/30 hover:border-primary/20"}`,
                                children: [
                                    /*#__PURE__*/ _jsxDEV(Ship, {
                                        className: `h-5 w-5 sm:h-6 sm:w-6 ${shippingMethod === "sea" ? "text-primary" : "text-muted-foreground"}`
                                    }, void 0, false, {
                                        fileName: "[project]/components/product/product-detail.tsx",
                                        lineNumber: 316,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ _jsxDEV("span", {
                                        className: `text-xs sm:text-sm font-medium ${shippingMethod === "sea" ? "text-primary" : "text-foreground"}`,
                                        children: "ارسال دریایی"
                                    }, void 0, false, {
                                        fileName: "[project]/components/product/product-detail.tsx",
                                        lineNumber: 319,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/product/product-detail.tsx",
                                lineNumber: 308,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/product/product-detail.tsx",
                        lineNumber: 287,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/product/product-detail.tsx",
                lineNumber: 285,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ _jsxDEV("div", {
                className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8",
                children: [
                    /*#__PURE__*/ _jsxDEV("div", {
                        className: "space-y-2 sm:space-y-3 lg:-mt-32",
                        children: [
                            /*#__PURE__*/ _jsxDEV("div", {
                                className: "relative aspect-square w-full bg-muted rounded-lg overflow-hidden",
                                children: /*#__PURE__*/ _jsxDEV(SafeImage, {
                                    src: Array.isArray(product.images) && product.images.length > 0 ? product.images[selectedImage] : null,
                                    alt: product.name,
                                    fill: true,
                                    className: "w-full h-full",
                                    priority: true,
                                    loading: "eager",
                                    productId: product.id
                                }, void 0, false, {
                                    fileName: "[project]/components/product/product-detail.tsx",
                                    lineNumber: 334,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/product/product-detail.tsx",
                                lineNumber: 333,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ _jsxDEV("div", {
                                className: "grid grid-cols-4 gap-1.5 sm:gap-2",
                                children: (Array.isArray(product.images) && product.images.length > 0 ? product.images : [
                                    getPlaceholderImage(600, 600)
                                ]).map((image, index)=>/*#__PURE__*/ _jsxDEV("button", {
                                        onClick: ()=>setSelectedImage(index),
                                        className: `relative aspect-square rounded-lg overflow-hidden border-[0.25px] transition-all ${selectedImage === index ? "border-primary/30" : "border-transparent hover:border-muted-foreground/30"}`,
                                        children: /*#__PURE__*/ _jsxDEV(SafeImage, {
                                            src: image,
                                            alt: `${product.name} - تصویر ${index + 1} از ${Array.isArray(product.images) ? product.images.length : 1}`,
                                            fill: true,
                                            className: "w-full h-full",
                                            priority: true,
                                            loading: "eager",
                                            sizes: "(max-width: 640px) 25vw, 20vw",
                                            productId: product.id
                                        }, void 0, false, {
                                            fileName: "[project]/components/product/product-detail.tsx",
                                            lineNumber: 355,
                                            columnNumber: 17
                                        }, this)
                                    }, index, false, {
                                        fileName: "[project]/components/product/product-detail.tsx",
                                        lineNumber: 346,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/product/product-detail.tsx",
                                lineNumber: 344,
                                columnNumber: 11
                            }, this),
                            (product.airShippingEnabled || product.seaShippingEnabled) && /*#__PURE__*/ _jsxDEV("div", {
                                className: "block lg:hidden space-y-2 sm:space-y-3 pt-2 sm:pt-3",
                                children: [
                                    /*#__PURE__*/ _jsxDEV("label", {
                                        className: "text-xs sm:text-sm font-medium block",
                                        children: "روش ارسال:"
                                    }, void 0, false, {
                                        fileName: "[project]/components/product/product-detail.tsx",
                                        lineNumber: 372,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ _jsxDEV("div", {
                                        className: `grid gap-2 sm:gap-3 ${product.airShippingEnabled && product.seaShippingEnabled ? "grid-cols-2" : "grid-cols-1"}`,
                                        children: [
                                            product.airShippingEnabled && /*#__PURE__*/ _jsxDEV("button", {
                                                onClick: ()=>setShippingMethod("air"),
                                                className: `flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-lg border-[0.25px] transition-all ${shippingMethod === "air" ? "border-primary/30 bg-primary/5" : "border-border/30 hover:border-primary/20"}`,
                                                children: [
                                                    /*#__PURE__*/ _jsxDEV(Plane, {
                                                        className: `h-5 w-5 sm:h-6 sm:w-6 ${shippingMethod === "air" ? "text-primary" : "text-muted-foreground"}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/product/product-detail.tsx",
                                                        lineNumber: 383,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ _jsxDEV("span", {
                                                        className: `text-xs sm:text-sm font-medium ${shippingMethod === "air" ? "text-primary" : "text-foreground"}`,
                                                        children: "ارسال هوایی"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/product/product-detail.tsx",
                                                        lineNumber: 386,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/product/product-detail.tsx",
                                                lineNumber: 375,
                                                columnNumber: 19
                                            }, this),
                                            product.seaShippingEnabled && /*#__PURE__*/ _jsxDEV("button", {
                                                onClick: ()=>setShippingMethod("sea"),
                                                className: `flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-lg border-[0.25px] transition-all ${shippingMethod === "sea" ? "border-primary/30 bg-primary/5" : "border-border/30 hover:border-primary/20"}`,
                                                children: [
                                                    /*#__PURE__*/ _jsxDEV(Ship, {
                                                        className: `h-5 w-5 sm:h-6 sm:w-6 ${shippingMethod === "sea" ? "text-primary" : "text-muted-foreground"}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/product/product-detail.tsx",
                                                        lineNumber: 402,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ _jsxDEV("span", {
                                                        className: `text-xs sm:text-sm font-medium ${shippingMethod === "sea" ? "text-primary" : "text-foreground"}`,
                                                        children: "ارسال دریایی"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/product/product-detail.tsx",
                                                        lineNumber: 405,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/product/product-detail.tsx",
                                                lineNumber: 394,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/product/product-detail.tsx",
                                        lineNumber: 373,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/product/product-detail.tsx",
                                lineNumber: 371,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/product/product-detail.tsx",
                        lineNumber: 332,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("div", {
                        className: "flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8",
                        children: [
                            /*#__PURE__*/ _jsxDEV("div", {
                                className: "flex-shrink-0 space-y-3 sm:space-y-4",
                                children: /*#__PURE__*/ _jsxDEV("div", {
                                    children: [
                                        /*#__PURE__*/ _jsxDEV("div", {
                                            className: "flex items-center gap-1.5 mb-2 flex-wrap",
                                            children: [
                                                /*#__PURE__*/ _jsxDEV("span", {
                                                    className: "text-[10px] sm:text-xs text-muted-foreground",
                                                    children: product.brand
                                                }, void 0, false, {
                                                    fileName: "[project]/components/product/product-detail.tsx",
                                                    lineNumber: 423,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ _jsxDEV("span", {
                                                    className: "text-muted-foreground hidden sm:inline text-xs",
                                                    children: "•"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/product/product-detail.tsx",
                                                    lineNumber: 424,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ _jsxDEV("span", {
                                                    className: "text-[10px] sm:text-xs text-muted-foreground",
                                                    children: product.category
                                                }, void 0, false, {
                                                    fileName: "[project]/components/product/product-detail.tsx",
                                                    lineNumber: 425,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/product/product-detail.tsx",
                                            lineNumber: 422,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV("h1", {
                                            className: "text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 leading-tight",
                                            children: product.name
                                        }, void 0, false, {
                                            fileName: "[project]/components/product/product-detail.tsx",
                                            lineNumber: 427,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV("div", {
                                            className: "flex items-center gap-2 sm:gap-3",
                                            children: product.rating && /*#__PURE__*/ _jsxDEV(_Fragment, {
                                                children: [
                                                    /*#__PURE__*/ _jsxDEV("div", {
                                                        className: "flex items-center",
                                                        children: [
                                                            /*#__PURE__*/ _jsxDEV(Star, {
                                                                className: "h-3.5 w-3.5 sm:h-4 sm:w-4 fill-accent text-accent"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/product/product-detail.tsx",
                                                                lineNumber: 432,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ _jsxDEV("span", {
                                                                className: "text-sm sm:text-base font-semibold mr-1",
                                                                children: product.rating
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/product/product-detail.tsx",
                                                                lineNumber: 433,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/product/product-detail.tsx",
                                                        lineNumber: 431,
                                                        columnNumber: 21
                                                    }, this),
                                                    product.reviews && /*#__PURE__*/ _jsxDEV("span", {
                                                        className: "text-xs sm:text-sm text-muted-foreground",
                                                        children: [
                                                            "(",
                                                            product.reviews,
                                                            " نظر)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/product/product-detail.tsx",
                                                        lineNumber: 436,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/components/product/product-detail.tsx",
                                            lineNumber: 428,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/product/product-detail.tsx",
                                    lineNumber: 421,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/product/product-detail.tsx",
                                lineNumber: 420,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ _jsxDEV("div", {
                                className: "flex-1 space-y-4 sm:space-y-5 md:space-y-6",
                                children: [
                                    /*#__PURE__*/ _jsxDEV("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ _jsxDEV("div", {
                                                className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3",
                                                children: [
                                                    /*#__PURE__*/ _jsxDEV("span", {
                                                        className: "text-xl sm:text-2xl md:text-3xl font-bold text-primary",
                                                        children: [
                                                            product.price.toLocaleString("fa-IR"),
                                                            " تومان"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/product/product-detail.tsx",
                                                        lineNumber: 451,
                                                        columnNumber: 17
                                                    }, this),
                                                    product.originalPrice && product.originalPrice > product.price && /*#__PURE__*/ _jsxDEV("span", {
                                                        className: "text-sm sm:text-base text-muted-foreground line-through",
                                                        children: product.originalPrice.toLocaleString("fa-IR")
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/product/product-detail.tsx",
                                                        lineNumber: 455,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/product/product-detail.tsx",
                                                lineNumber: 450,
                                                columnNumber: 15
                                            }, this),
                                            product.originalPrice && product.originalPrice > product.price && /*#__PURE__*/ _jsxDEV("div", {
                                                className: "text-[10px] sm:text-xs text-secondary font-semibold",
                                                children: [
                                                    Math.round((product.originalPrice - product.price) / product.originalPrice * 100),
                                                    "% تخفیف"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/product/product-detail.tsx",
                                                lineNumber: 461,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/product/product-detail.tsx",
                                        lineNumber: 449,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ _jsxDEV("div", {
                                        className: "flex items-center gap-1.5",
                                        children: product.inStock ? /*#__PURE__*/ _jsxDEV(_Fragment, {
                                            children: [
                                                /*#__PURE__*/ _jsxDEV(Check, {
                                                    className: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/product/product-detail.tsx",
                                                    lineNumber: 474,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ _jsxDEV("span", {
                                                    className: "text-xs sm:text-sm text-green-600 font-semibold",
                                                    children: [
                                                        "موجود در انبار",
                                                        product.stockCount ? ` (${product.stockCount} عدد)` : ""
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/product/product-detail.tsx",
                                                    lineNumber: 475,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ _jsxDEV("span", {
                                            className: "text-xs sm:text-sm text-secondary font-semibold",
                                            children: "ناموجود"
                                        }, void 0, false, {
                                            fileName: "[project]/components/product/product-detail.tsx",
                                            lineNumber: 480,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/product/product-detail.tsx",
                                        lineNumber: 471,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ _jsxDEV("div", {
                                        className: "space-y-3 sm:space-y-4",
                                        children: [
                                            /*#__PURE__*/ _jsxDEV("div", {
                                                className: "flex items-center gap-2 sm:gap-3",
                                                children: [
                                                    /*#__PURE__*/ _jsxDEV("label", {
                                                        className: "text-xs sm:text-sm font-medium",
                                                        children: "تعداد:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/product/product-detail.tsx",
                                                        lineNumber: 487,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ _jsxDEV("div", {
                                                        className: "flex items-center border-[0.25px] border-border/30 rounded-md",
                                                        children: [
                                                            /*#__PURE__*/ _jsxDEV(Button, {
                                                                variant: "ghost",
                                                                size: "icon",
                                                                className: "h-8 w-8 sm:h-9 sm:w-9",
                                                                onClick: ()=>setQuantity(Math.max(1, quantity - 1)),
                                                                children: /*#__PURE__*/ _jsxDEV("span", {
                                                                    className: "text-sm",
                                                                    children: "-"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/product/product-detail.tsx",
                                                                    lineNumber: 495,
                                                                    columnNumber: 21
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/product/product-detail.tsx",
                                                                lineNumber: 489,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ _jsxDEV("span", {
                                                                className: "w-8 sm:w-10 text-center text-xs sm:text-sm",
                                                                children: quantity
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/product/product-detail.tsx",
                                                                lineNumber: 497,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ _jsxDEV(Button, {
                                                                variant: "ghost",
                                                                size: "icon",
                                                                className: "h-8 w-8 sm:h-9 sm:w-9",
                                                                onClick: ()=>setQuantity(quantity + 1),
                                                                children: /*#__PURE__*/ _jsxDEV("span", {
                                                                    className: "text-sm",
                                                                    children: "+"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/product/product-detail.tsx",
                                                                    lineNumber: 504,
                                                                    columnNumber: 21
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/product/product-detail.tsx",
                                                                lineNumber: 498,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/product/product-detail.tsx",
                                                        lineNumber: 488,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/product/product-detail.tsx",
                                                lineNumber: 486,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ _jsxDEV("div", {
                                                className: "flex gap-1.5 sm:gap-2",
                                                children: [
                                                    /*#__PURE__*/ _jsxDEV(Button, {
                                                        size: "default",
                                                        className: `flex-1 h-9 sm:h-10 text-xs sm:text-sm transition-all ${isAdded ? "bg-green-600 hover:bg-green-700" : ""}`,
                                                        disabled: !product.inStock,
                                                        onClick: handleAddToCart,
                                                        children: isAdded ? /*#__PURE__*/ _jsxDEV(_Fragment, {
                                                            children: [
                                                                /*#__PURE__*/ _jsxDEV(Check, {
                                                                    className: "h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5 sm:ml-2"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/product/product-detail.tsx",
                                                                    lineNumber: 520,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ _jsxDEV("span", {
                                                                    children: "افزوده شد"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/product/product-detail.tsx",
                                                                    lineNumber: 521,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true) : /*#__PURE__*/ _jsxDEV(_Fragment, {
                                                            children: [
                                                                /*#__PURE__*/ _jsxDEV(ShoppingCart, {
                                                                    className: "h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5 sm:ml-2"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/product/product-detail.tsx",
                                                                    lineNumber: 525,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ _jsxDEV("span", {
                                                                    children: "افزودن به سبد"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/product/product-detail.tsx",
                                                                    lineNumber: 526,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/product/product-detail.tsx",
                                                        lineNumber: 510,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ _jsxDEV(Button, {
                                                        variant: "outline",
                                                        size: "icon",
                                                        className: "h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0",
                                                        children: /*#__PURE__*/ _jsxDEV(Share2, {
                                                            className: "h-3.5 w-3.5 sm:h-4 sm:w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/product/product-detail.tsx",
                                                            lineNumber: 531,
                                                            columnNumber: 19
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/product/product-detail.tsx",
                                                        lineNumber: 530,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ _jsxDEV(Button, {
                                                        variant: "outline",
                                                        size: "icon",
                                                        className: "h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0",
                                                        children: /*#__PURE__*/ _jsxDEV(Heart, {
                                                            className: "h-3.5 w-3.5 sm:h-4 sm:w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/product/product-detail.tsx",
                                                            lineNumber: 534,
                                                            columnNumber: 19
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/product/product-detail.tsx",
                                                        lineNumber: 533,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/product/product-detail.tsx",
                                                lineNumber: 509,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/product/product-detail.tsx",
                                        lineNumber: 485,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ _jsxDEV("div", {
                                        className: "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-5 border-t-[0.25px] border-border/30",
                                        children: [
                                            /*#__PURE__*/ _jsxDEV("div", {
                                                className: "flex items-start gap-2",
                                                children: [
                                                    /*#__PURE__*/ _jsxDEV(Truck, {
                                                        className: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0 mt-0.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/product/product-detail.tsx",
                                                        lineNumber: 542,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ _jsxDEV("span", {
                                                        className: "text-[10px] sm:text-xs leading-relaxed",
                                                        children: "ارسال رایگان بالای 500 هزار تومان"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/product/product-detail.tsx",
                                                        lineNumber: 543,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/product/product-detail.tsx",
                                                lineNumber: 541,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ _jsxDEV("div", {
                                                className: "flex items-start gap-2",
                                                children: [
                                                    /*#__PURE__*/ _jsxDEV(Shield, {
                                                        className: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0 mt-0.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/product/product-detail.tsx",
                                                        lineNumber: 546,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ _jsxDEV("span", {
                                                        className: "text-[10px] sm:text-xs leading-relaxed",
                                                        children: "گارانتی اصالت کالا"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/product/product-detail.tsx",
                                                        lineNumber: 547,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/product/product-detail.tsx",
                                                lineNumber: 545,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/product/product-detail.tsx",
                                        lineNumber: 540,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/product/product-detail.tsx",
                                lineNumber: 447,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/product/product-detail.tsx",
                        lineNumber: 418,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/product/product-detail.tsx",
                lineNumber: 330,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV(Tabs, {
                defaultValue: "description",
                className: "w-full",
                children: [
                    /*#__PURE__*/ _jsxDEV(TabsList, {
                        className: "w-full grid grid-cols-2 h-auto",
                        children: [
                            /*#__PURE__*/ _jsxDEV(TabsTrigger, {
                                value: "description",
                                className: "text-[10px] sm:text-xs py-1.5 sm:py-2",
                                children: "توضیحات"
                            }, void 0, false, {
                                fileName: "[project]/components/product/product-detail.tsx",
                                lineNumber: 557,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ _jsxDEV(TabsTrigger, {
                                value: "specifications",
                                className: "text-[10px] sm:text-xs py-1.5 sm:py-2",
                                children: "مشخصات"
                            }, void 0, false, {
                                fileName: "[project]/components/product/product-detail.tsx",
                                lineNumber: 558,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/product/product-detail.tsx",
                        lineNumber: 556,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV(TabsContent, {
                        value: "description",
                        className: "mt-4 sm:mt-6",
                        children: /*#__PURE__*/ _jsxDEV(Card, {
                            children: /*#__PURE__*/ _jsxDEV(CardContent, {
                                className: "p-4 sm:p-5",
                                children: /*#__PURE__*/ _jsxDEV("p", {
                                    className: "text-xs sm:text-sm text-muted-foreground leading-relaxed",
                                    children: product.description || "توضیحات محصول در دسترس نیست"
                                }, void 0, false, {
                                    fileName: "[project]/components/product/product-detail.tsx",
                                    lineNumber: 563,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/product/product-detail.tsx",
                                lineNumber: 562,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/product/product-detail.tsx",
                            lineNumber: 561,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/product/product-detail.tsx",
                        lineNumber: 560,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV(TabsContent, {
                        value: "specifications",
                        className: "mt-4 sm:mt-6",
                        children: /*#__PURE__*/ _jsxDEV(Card, {
                            children: /*#__PURE__*/ _jsxDEV(CardContent, {
                                className: "p-4 sm:p-5",
                                children: product.specifications && Object.keys(product.specifications).length > 0 ? /*#__PURE__*/ _jsxDEV("dl", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4",
                                    children: Object.entries(product.specifications).map(([key, value])=>/*#__PURE__*/ _jsxDEV("div", {
                                            className: "flex flex-col sm:flex-row sm:justify-between py-2 border-b-[0.25px] border-border/30 gap-1 sm:gap-0",
                                            children: [
                                                /*#__PURE__*/ _jsxDEV("dt", {
                                                    className: "font-medium text-xs sm:text-sm",
                                                    children: [
                                                        key,
                                                        ":"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/product/product-detail.tsx",
                                                    lineNumber: 576,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ _jsxDEV("dd", {
                                                    className: "text-xs sm:text-sm text-muted-foreground",
                                                    children: typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? String(value) : JSON.stringify(value)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/product/product-detail.tsx",
                                                    lineNumber: 577,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, key, true, {
                                            fileName: "[project]/components/product/product-detail.tsx",
                                            lineNumber: 575,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/product/product-detail.tsx",
                                    lineNumber: 573,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ _jsxDEV("p", {
                                    className: "text-xs sm:text-sm text-muted-foreground",
                                    children: "مشخصات محصول در دسترس نیست"
                                }, void 0, false, {
                                    fileName: "[project]/components/product/product-detail.tsx",
                                    lineNumber: 586,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/product/product-detail.tsx",
                                lineNumber: 571,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/product/product-detail.tsx",
                            lineNumber: 570,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/product/product-detail.tsx",
                        lineNumber: 569,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/product/product-detail.tsx",
                lineNumber: 555,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/product/product-detail.tsx",
        lineNumber: 214,
        columnNumber: 5
    }, this);
}
_s(ProductDetail, "04Jsn9jsqKvXYBs0lpI8MLSDa8g=", false, function() {
    return [
        useToast,
        useCartStore,
        useProductStore,
        useProductStore,
        useVehicleStore,
        useCartStore
    ];
});
_c = ProductDetail;
var _c;
__turbopack_context__.k.register(_c, "ProductDetail");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_3acd1f05._.js.map