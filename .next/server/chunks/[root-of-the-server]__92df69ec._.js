module.exports=[54799,(e,s,t)=>{s.exports=e.x("crypto",()=>require("crypto"))},25686,e=>{"use strict";var s=e.i(54799),t=e.i(12e3);let o="saded_session";function n(){return new Date().toISOString().slice(0,19).replace("T"," ")}function r(e){return s.default.createHash("sha256").update(e).digest("hex")}function i(e){return"https"===(e.headers.get("x-forwarded-proto")||e.nextUrl.protocol.replace(":",""))}function a(e){return{httpOnly:!0,secure:"localhost"!==e.nextUrl.hostname&&"127.0.0.1"!==e.nextUrl.hostname&&"::1"!==e.nextUrl.hostname&&i(e),sameSite:"lax",path:"/",maxAge:31536e4,...!1}}async function u(){try{await (0,t.runQuery)(`
      CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(32) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      enabled BOOLEAN DEFAULT TRUE,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_users_phone (phone)
    )
  `);try{await (0,t.runQuery)("DELETE FROM users WHERE phone IS NULL OR TRIM(phone) = ''"),await (0,t.runQuery)("ALTER TABLE users MODIFY phone VARCHAR(32) NOT NULL");let e=await (0,t.getRows)("SHOW INDEX FROM users"),s=new Map;for(let t of e){let e=String(t.Key_name??t.key_name??t.KEY_NAME??""),o=Number(t.Non_unique??t.non_unique??t.NON_UNIQUE??1),n=String(t.Column_name??t.column_name??t.COLUMN_NAME??"");if(!e||!n||0!==o)continue;let r=s.get(e)||[];r.push(n),s.set(e,r)}let o=null;for(let[e,t]of s.entries()){if("PRIMARY"===e)continue;let s=t.map(e=>e.toLowerCase()).sort();if(1===s.length&&"phone"===s[0]){o=e;break}}for(let e of(o||(await (0,t.runQuery)("ALTER TABLE users ADD UNIQUE KEY uniq_users_phone (phone)"),o="uniq_users_phone"),s.keys()))if("PRIMARY"!==e&&e!==o)try{await (0,t.runQuery)(`ALTER TABLE users DROP INDEX \`${e}\``)}catch{}}catch{}await (0,t.runQuery)(`
    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(255) PRIMARY KEY,
      userId VARCHAR(255) NOT NULL,
      tokenHash CHAR(64) NOT NULL,
      expiresAt TIMESTAMP NULL DEFAULT NULL,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastSeenAt TIMESTAMP NULL DEFAULT NULL,
      userAgent VARCHAR(255) NULL DEFAULT NULL,
      ip VARCHAR(64) NULL DEFAULT NULL,
      UNIQUE KEY uniq_sessions_tokenHash (tokenHash),
      KEY idx_sessions_userId (userId),
      KEY idx_sessions_expiresAt (expiresAt)
    )
  `);try{await (0,t.runQuery)("UPDATE sessions SET expiresAt = NULL WHERE expiresAt IS NOT NULL")}catch{}}catch(e){if(e?.code==="ECONNRESET"||e?.code==="PROTOCOL_CONNECTION_LOST"||e?.code==="ETIMEDOUT"||e?.code==="ECONNREFUSED"||e?.message?.includes("closed state"))return void logger.warn("Database connection error in ensureAuthTables, will retry on next request:",e?.code);throw logger.error("Error ensuring auth tables:",e),e}}async function l(e,o){await u();let i=s.default.randomBytes(32).toString("base64url"),a=r(i),l=`sess_${Date.now()}_${s.default.randomBytes(6).toString("hex")}`,E=o.headers.get("user-agent"),c=o.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||null;return await (0,t.runQuery)(`INSERT INTO sessions (id, userId, tokenHash, expiresAt, createdAt, lastSeenAt, userAgent, ip)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,[l,e,a,null,n(),n(),E||null,c]),i}async function E(e){let s,i=e.cookies.get(o)?.value;if(!i){let s=e.headers.get("cookie");if(s)for(let e of s.split(";").map(e=>e.trim())){let[s,t]=e.split("=");if(s===o&&t){i=decodeURIComponent(t);break}}}if(!i){let s=e.cookies.getAll().map(e=>e.name),t=e.headers.get("cookie");return console.log("[Session] ❌ No session cookie found!"),console.log("[Session] Available cookies:",s),console.log("[Session] Looking for cookie:",o),console.log("[Session] Request URL:",e.url),console.log("[Session] Cookie header:",t?t.substring(0,300):"no cookie header"),console.log("[Session] Request hostname:",e.nextUrl.hostname),console.log("[Session] Request protocol:",e.nextUrl.protocol),null}console.log("[Session] ✅ Session token found, length:",i.length);try{await u()}catch(e){if(e?.code==="ECONNRESET"||e?.code==="PROTOCOL_CONNECTION_LOST"||e?.code==="ETIMEDOUT"||e?.code==="ECONNREFUSED"||e?.message?.includes("closed state"))return logger.warn("Database connection error in getSessionUserFromRequest, returning null:",e?.code),null;throw e}let a=r(i);try{s=await (0,t.getRow)(`SELECT s.id as sessionId, s.userId, s.expiresAt, u.enabled, u.role, u.name, u.phone, u.createdAt
       FROM sessions s
       JOIN users u ON u.id = s.userId
       WHERE s.tokenHash = ?
       LIMIT 1`,[a])}catch(e){if(e?.code==="ECONNRESET"||e?.code==="PROTOCOL_CONNECTION_LOST"||e?.code==="ETIMEDOUT"||e?.code==="ECONNREFUSED"||e?.message?.includes("closed state"))return logger.warn("Database connection error in getSessionUserFromRequest query, returning null:",e?.code),null;throw e}if(!s)return null;if(s.expiresAt){let e=new Date(s.expiresAt);if(!Number.isNaN(e.getTime())&&e.getTime()<Date.now())return await (0,t.runQuery)("DELETE FROM sessions WHERE tokenHash = ?",[a]),null}try{await (0,t.runQuery)("UPDATE sessions SET lastSeenAt = ? WHERE id = ?",[n(),s.sessionId])}catch(e){e?.code==="ECONNRESET"||e?.code==="PROTOCOL_CONNECTION_LOST"||e?.code==="ETIMEDOUT"||e?.code==="ECONNREFUSED"||e?.message?.includes("closed state")||logger.debug("Error touching session (non-critical):",e?.code)}return{id:s.userId,name:s.name,phone:s.phone,role:s.role||"user",enabled:!!s.enabled,createdAt:s.createdAt}}async function c(e){let s=e.cookies.get(o)?.value;if(!s)return;await u();let n=r(s);await (0,t.runQuery)("DELETE FROM sessions WHERE tokenHash = ?",[n])}function T(e,s,t){let n=a(t);e.cookies.set(o,s,{httpOnly:!0,secure:n.secure,sameSite:n.sameSite,path:"/",maxAge:n.maxAge})}function A(e,s){e.cookies.set(o,"",{...a(s),maxAge:0})}e.s(["SESSION_COOKIE_NAME",0,o,"clearSession",()=>c,"clearSessionCookie",()=>A,"createSession",()=>l,"ensureAuthTables",()=>u,"getSessionCookieOptions",()=>a,"getSessionUserFromRequest",()=>E,"isHttpsRequest",()=>i,"setSessionCookie",()=>T,"sha256Hex",()=>r])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__92df69ec._.js.map