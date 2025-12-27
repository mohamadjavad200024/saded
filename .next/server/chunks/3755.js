"use strict";exports.id=3755,exports.ids=[3755],exports.modules={23755:(a,b,c)=>{c.d(b,{$G:()=>p,C0:()=>q,IX:()=>h,KE:()=>l,getSessionUserFromRequest:()=>n,jw:()=>m,q7:()=>o});var d=c(55511),e=c.n(d),f=c(44075),g=c(76266);let h="saded_session";function i(){return new Date().toISOString().slice(0,19).replace("T"," ")}function j(a){return e().createHash("sha256").update(a).digest("hex")}function k(a){return{httpOnly:!0,secure:"localhost"!==a.nextUrl.hostname&&"127.0.0.1"!==a.nextUrl.hostname&&"::1"!==a.nextUrl.hostname&&"https"===(a.headers.get("x-forwarded-proto")||a.nextUrl.protocol.replace(":","")),sameSite:"lax",path:"/",maxAge:31536e4,...!1}}async function l(){try{await (0,f.GB)(`
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
  `);try{await (0,f.GB)("DELETE FROM users WHERE phone IS NULL OR TRIM(phone) = ''"),await (0,f.GB)("ALTER TABLE users MODIFY phone VARCHAR(32) NOT NULL");let a=await (0,f.getRows)("SHOW INDEX FROM users"),b=new Map;for(let c of a){let a=String(c.Key_name??c.key_name??c.KEY_NAME??""),d=Number(c.Non_unique??c.non_unique??c.NON_UNIQUE??1),e=String(c.Column_name??c.column_name??c.COLUMN_NAME??"");if(!a||!e||0!==d)continue;let f=b.get(a)||[];f.push(e),b.set(a,f)}let c=null;for(let[a,d]of b.entries()){if("PRIMARY"===a)continue;let b=d.map(a=>a.toLowerCase()).sort();if(1===b.length&&"phone"===b[0]){c=a;break}}for(let a of(c||(await (0,f.GB)("ALTER TABLE users ADD UNIQUE KEY uniq_users_phone (phone)"),c="uniq_users_phone"),b.keys()))if("PRIMARY"!==a&&a!==c)try{await (0,f.GB)(`ALTER TABLE users DROP INDEX \`${a}\``)}catch{}}catch{}await (0,f.GB)(`
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
  `);try{await (0,f.GB)("UPDATE sessions SET expiresAt = NULL WHERE expiresAt IS NOT NULL")}catch{}}catch(a){if(a?.code==="ECONNRESET"||a?.code==="PROTOCOL_CONNECTION_LOST"||a?.code==="ETIMEDOUT"||a?.code==="ECONNREFUSED"||a?.message?.includes("closed state"))return void g.v.warn("Database connection error in ensureAuthTables, will retry on next request:",a?.code);throw g.v.error("Error ensuring auth tables:",a),a}}async function m(a,b){await l();let c=e().randomBytes(32).toString("base64url"),d=j(c),g=`sess_${Date.now()}_${e().randomBytes(6).toString("hex")}`,h=b.headers.get("user-agent"),k=b.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||null;return await (0,f.GB)(`INSERT INTO sessions (id, userId, tokenHash, expiresAt, createdAt, lastSeenAt, userAgent, ip)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,[g,a,d,null,i(),i(),h||null,k]),c}async function n(a){let b,c=a.cookies.get(h)?.value;if(!c){let b=a.headers.get("cookie");if(b)for(let a of b.split(";").map(a=>a.trim())){let[b,d]=a.split("=");if(b===h&&d){c=decodeURIComponent(d);break}}}if(!c){let b=a.cookies.getAll().map(a=>a.name),c=a.headers.get("cookie");return console.log("[Session] ❌ No session cookie found!"),console.log("[Session] Available cookies:",b),console.log("[Session] Looking for cookie:",h),console.log("[Session] Request URL:",a.url),console.log("[Session] Cookie header:",c?c.substring(0,300):"no cookie header"),console.log("[Session] Request hostname:",a.nextUrl.hostname),console.log("[Session] Request protocol:",a.nextUrl.protocol),null}console.log("[Session] ✅ Session token found, length:",c.length);try{await l()}catch(a){if(a?.code==="ECONNRESET"||a?.code==="PROTOCOL_CONNECTION_LOST"||a?.code==="ETIMEDOUT"||a?.code==="ECONNREFUSED"||a?.message?.includes("closed state"))return g.v.warn("Database connection error in getSessionUserFromRequest, returning null:",a?.code),null;throw a}let d=j(c);try{b=await (0,f.getRow)(`SELECT s.id as sessionId, s.userId, s.expiresAt, u.enabled, u.role, u.name, u.phone, u.createdAt
       FROM sessions s
       JOIN users u ON u.id = s.userId
       WHERE s.tokenHash = ?
       LIMIT 1`,[d])}catch(a){if(a?.code==="ECONNRESET"||a?.code==="PROTOCOL_CONNECTION_LOST"||a?.code==="ETIMEDOUT"||a?.code==="ECONNREFUSED"||a?.message?.includes("closed state"))return g.v.warn("Database connection error in getSessionUserFromRequest query, returning null:",a?.code),null;throw a}if(!b)return null;if(b.expiresAt){let a=new Date(b.expiresAt);if(!Number.isNaN(a.getTime())&&a.getTime()<Date.now())return await (0,f.GB)("DELETE FROM sessions WHERE tokenHash = ?",[d]),null}try{await (0,f.GB)("UPDATE sessions SET lastSeenAt = ? WHERE id = ?",[i(),b.sessionId])}catch(a){a?.code==="ECONNRESET"||a?.code==="PROTOCOL_CONNECTION_LOST"||a?.code==="ETIMEDOUT"||a?.code==="ECONNREFUSED"||a?.message?.includes("closed state")||g.v.debug("Error touching session (non-critical):",a?.code)}return{id:b.userId,name:b.name,phone:b.phone,role:b.role||"user",enabled:!!b.enabled,createdAt:b.createdAt}}async function o(a){let b=a.cookies.get(h)?.value;if(!b)return;await l();let c=j(b);await (0,f.GB)("DELETE FROM sessions WHERE tokenHash = ?",[c])}function p(a,b,c){let d=k(c);a.cookies.set(h,b,{httpOnly:!0,secure:d.secure,sameSite:d.sameSite,path:"/",maxAge:d.maxAge})}function q(a,b){a.cookies.set(h,"",{...k(b),maxAge:0})}}};