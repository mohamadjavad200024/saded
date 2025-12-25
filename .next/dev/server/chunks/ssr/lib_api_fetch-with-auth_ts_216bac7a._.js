module.exports = [
"[project]/lib/api/fetch-with-auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
];

//# sourceMappingURL=lib_api_fetch-with-auth_ts_216bac7a._.js.map