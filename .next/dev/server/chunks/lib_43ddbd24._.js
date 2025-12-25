module.exports = [
"[project]/lib/db/mysql.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/node_modules_de0ccbd4._.js",
  "server/chunks/[root-of-the-server]__d53b1080._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/db/mysql.ts [app-route] (ecmascript)");
    });
});
}),
"[project]/lib/auth/session.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[root-of-the-server]__92df69ec._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/auth/session.ts [app-route] (ecmascript)");
    });
});
}),
];