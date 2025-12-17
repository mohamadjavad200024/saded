module.exports=[77756,a=>{"use strict";async function b(a,c={}){let d=new Headers(c.headers);return!d.has("Content-Type")&&c.body&&d.set("Content-Type","application/json"),fetch(a,{...c,credentials:"include",headers:d})}a.s(["fetchWithAuth",()=>b])}];

//# sourceMappingURL=lib_api_fetch-with-auth_ts_216bac7a._.js.map