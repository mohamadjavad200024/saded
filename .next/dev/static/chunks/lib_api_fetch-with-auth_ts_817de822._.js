(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/api/fetch-with-auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Helper function برای fetch با header های احراز هویت
 */ __turbopack_context__.s([
    "fetchWithAuth",
    ()=>fetchWithAuth
]);
async function fetchWithAuth(url, options = {}) {
    // New auth system uses HttpOnly cookie sessions.
    // For browser fetch, cookies are included automatically for same-origin.
    // We still set credentials: 'include' for safety.
    const headers = new Headers(options.headers);
    if (!headers.has("Content-Type") && options.body) {
        headers.set("Content-Type", "application/json");
    }
    return fetch(url, {
        ...options,
        credentials: "include",
        headers
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_api_fetch-with-auth_ts_817de822._.js.map