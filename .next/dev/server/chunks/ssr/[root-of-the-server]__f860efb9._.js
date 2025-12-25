module.exports = [
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/loading.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/loading.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/products/loading.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/products/loading.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/products/[id]/loading.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/products/[id]/loading.tsx [app-rsc] (ecmascript)"));
}),
"[project]/components/product/product-detail.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

import * as clientProxy from "./product-detail.tsx" with {
    "__turbopack-helper__": "true",
    "turbopack-transition": "next-ecmascript-client-reference"
};
__turbopack_context__.n(clientProxy);
}),
"[project]/lib/db/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Database Wrapper
 * 
 * این فایل یک interface یکپارچه برای استفاده از MySQL فراهم می‌کند
 */ /**
 * Get single row from database
 */ __turbopack_context__.s([
    "getDatabaseType",
    ()=>getDatabaseType,
    "getRow",
    ()=>getRow,
    "getRows",
    ()=>getRows,
    "initializeDatabase",
    ()=>initializeDatabase,
    "runQuery",
    ()=>runQuery,
    "testConnection",
    ()=>testConnection
]);
async function getRow(sql, params = []) {
    try {
        const { queryOne } = await __turbopack_context__.A("[project]/lib/db/mysql.ts [app-rsc] (ecmascript, async loader)");
        // Convert double-quoted column names to backticks for MySQL
        const mysqlSql = convertToMySQLSQL(sql);
        return await queryOne(mysqlSql, params);
    } catch (error) {
        console.error("Database error in getRow:", {
            sql,
            params,
            error: error?.message,
            code: error?.code
        });
        throw error;
    }
}
async function getRows(sql, params = []) {
    try {
        const { queryAll } = await __turbopack_context__.A("[project]/lib/db/mysql.ts [app-rsc] (ecmascript, async loader)");
        // Convert double-quoted column names to backticks for MySQL
        const mysqlSql = convertToMySQLSQL(sql);
        return await queryAll(mysqlSql, params);
    } catch (error) {
        console.error("Database error in getRows:", {
            sql,
            params,
            error: error?.message,
            code: error?.code
        });
        throw error;
    }
}
async function runQuery(sql, params = []) {
    const { query } = await __turbopack_context__.A("[project]/lib/db/mysql.ts [app-rsc] (ecmascript, async loader)");
    const mysqlSql = convertToMySQLSQL(sql);
    const result = await query(mysqlSql, params);
    return {
        changes: result.affectedRows || result.rowCount || 0,
        lastInsertRowid: result.insertId || undefined
    };
}
/**
 * Convert SQL to MySQL SQL
 * - Converts double-quoted column names to backticks
 * - Converts PostgreSQL $1, $2, etc. placeholders to MySQL ? placeholders
 * - Converts ON CONFLICT to ON DUPLICATE KEY UPDATE
 * - MySQL uses ? placeholders (already correct)
 */ function convertToMySQLSQL(sql) {
    let mysqlSql = sql;
    // Convert PostgreSQL $1, $2, etc. placeholders to MySQL ? placeholders
    // First, extract all $N placeholders and their positions
    const placeholderRegex = /\$(\d+)/g;
    const placeholders = [];
    let match;
    while((match = placeholderRegex.exec(sql)) !== null){
        placeholders.push({
            index: parseInt(match[1], 10),
            position: match.index
        });
    }
    // Replace placeholders in reverse order to maintain positions
    if (placeholders.length > 0) {
        // Sort by position in reverse order
        placeholders.sort((a, b)=>b.position - a.position);
        // Replace each $N with ?
        for (const placeholder of placeholders){
            mysqlSql = mysqlSql.substring(0, placeholder.position) + '?' + mysqlSql.substring(placeholder.position + `$${placeholder.index}`.length);
        }
    }
    // Convert double-quoted column names to backticks for MySQL
    // Match "columnName" and replace with `columnName`
    mysqlSql = mysqlSql.replace(/"([^"]+)"/g, '`$1`');
    // Convert PostgreSQL ON CONFLICT to MySQL ON DUPLICATE KEY UPDATE
    mysqlSql = mysqlSql.replace(/ON CONFLICT\s*\(([^)]+)\)\s*DO UPDATE SET\s*(.+)/gi, (match, conflictColumns, updateClause)=>{
        // Convert EXCLUDED.columnName to VALUES(columnName)
        const convertedUpdate = updateClause.replace(/EXCLUDED\.(\w+)/gi, 'VALUES($1)');
        return `ON DUPLICATE KEY UPDATE ${convertedUpdate}`;
    });
    // Remove MySQL-incompatible syntax like ::jsonb (legacy PostgreSQL syntax)
    mysqlSql = mysqlSql.replace(/::jsonb/g, '');
    mysqlSql = mysqlSql.replace(/::json/g, '');
    return mysqlSql;
}
async function initializeDatabase() {
    const { ensureDatabase, initializeTables } = await __turbopack_context__.A("[project]/lib/db/mysql.ts [app-rsc] (ecmascript, async loader)");
    await ensureDatabase();
    await initializeTables();
}
async function testConnection() {
    try {
        const { testConnection } = await __turbopack_context__.A("[project]/lib/db/mysql.ts [app-rsc] (ecmascript, async loader)");
        return await testConnection();
    } catch (error) {
        return false;
    }
}
function getDatabaseType() {
    return "mysql";
}
}),
"[project]/lib/image-utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // In server, return relative path (will be handled by Next.js)
        return trimmedUrl;
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
}),
"[project]/lib/product-utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/app/products/[id]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductDetailPage,
    "generateMetadata",
    ()=>generateMetadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/header.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/footer.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2f$product$2d$detail$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/product/product-detail.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$image$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/image-utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/product-utils.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
const baseUrl = ("TURBOPACK compile-time value", "http://localhost:3000") || "https://saded.ir";
async function getProduct(id) {
    try {
        const product = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRow"])("SELECT * FROM products WHERE id = ? AND enabled = TRUE", [
            id
        ]);
        if (!product) {
            return null;
        }
        // Parse JSON fields with normalization
        const parsedProduct = {
            ...product,
            images: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["normalizeImages"])(product.images),
            tags: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["normalizeTags"])(product.tags),
            specifications: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$product$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["normalizeSpecifications"])(product.specifications),
            price: Number(product.price),
            originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
            stockCount: Number(product.stockCount),
            inStock: Boolean(product.inStock),
            enabled: Boolean(product.enabled),
            vinEnabled: Boolean(product.vinEnabled),
            airShippingEnabled: Boolean(product.airShippingEnabled),
            seaShippingEnabled: Boolean(product.seaShippingEnabled),
            airShippingCost: product.airShippingCost !== null && product.airShippingCost !== undefined ? Number(product.airShippingCost) : null,
            seaShippingCost: product.seaShippingCost !== null && product.seaShippingCost !== undefined ? Number(product.seaShippingCost) : null,
            createdAt: product.createdAt instanceof Date ? product.createdAt : new Date(product.createdAt),
            updatedAt: product.updatedAt instanceof Date ? product.updatedAt : new Date(product.updatedAt)
        };
        return parsedProduct;
    } catch (error) {
        console.error("Error fetching product for metadata:", error);
        return null;
    }
}
async function generateMetadata({ params }) {
    const { id } = await params;
    const product = await getProduct(id);
    if (!product) {
        return {
            title: "محصول یافت نشد - ساد",
            description: "محصول مورد نظر شما یافت نشد"
        };
    }
    const productImage = product.images?.[0] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$image$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPlaceholderImage"])(1200, 630);
    const productUrl = `${baseUrl}/products/${id}`;
    const price = product.price / 1000; // Convert from Rials to Tomans for display
    const description = product.description || `${product.name} - قطعه خودرو ${product.brand} با بهترین کیفیت و قیمت`;
    return {
        title: `${product.name} - ساد`,
        description: description.substring(0, 160),
        keywords: [
            product.name,
            product.brand || "",
            product.category || "",
            "قطعات خودرو",
            "قطعات وارداتی",
            ...product.tags || []
        ],
        alternates: {
            canonical: productUrl
        },
        openGraph: {
            title: product.name,
            description: description.substring(0, 160),
            url: productUrl,
            siteName: "ساد - فروشگاه قطعات خودرو",
            images: [
                {
                    url: productImage,
                    width: 1200,
                    height: 630,
                    alt: product.name
                }
            ],
            locale: "fa_IR",
            type: "website"
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: description.substring(0, 160),
            images: [
                productImage
            ]
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1
            }
        }
    };
}
async function ProductDetailPage({ params }) {
    const { id } = await params;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Header"], {}, void 0, false, {
                fileName: "[project]/app/products/[id]/page.tsx",
                lineNumber: 133,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 container py-4 sm:py-6 md:py-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2f$product$2d$detail$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ProductDetail"], {
                    productId: id
                }, void 0, false, {
                    fileName: "[project]/app/products/[id]/page.tsx",
                    lineNumber: 135,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/products/[id]/page.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Footer"], {}, void 0, false, {
                fileName: "[project]/app/products/[id]/page.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/products/[id]/page.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/products/[id]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/products/[id]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f860efb9._.js.map