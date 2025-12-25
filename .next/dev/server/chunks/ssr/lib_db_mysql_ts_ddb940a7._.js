module.exports = [
"[project]/lib/db/mysql.ts [app-rsc] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/node_modules_e8869f21._.js",
  "server/chunks/ssr/[root-of-the-server]__e66c0cc3._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/db/mysql.ts [app-rsc] (ecmascript)");
    });
});
}),
];