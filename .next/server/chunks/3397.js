exports.id=3397,exports.ids=[3397,3755],exports.modules={20602:(a,b,c)=>{"use strict";c.d(b,{uV:()=>e,vV:()=>g});var d=c(76266);class e extends Error{constructor(a,b,c,d){super(a),this.name="AppError",this.status=b,this.code=c,this.details=d,Object.setPrototypeOf(this,e.prototype)}}class f extends Error{constructor(a,b="UNKNOWN",c){super(a),this.name="NetworkError",this.type=b,this.originalError=c,Object.setPrototypeOf(this,f.prototype)}}function g(a,b){let c=a instanceof e?{message:a.message,status:a.status,code:a.code,details:a.details}:a instanceof f?{message:a.message,code:a.type,details:a.originalError}:a instanceof Error?{message:a.message}:"string"==typeof a?{message:a}:{message:"خطای نامشخص رخ داد"},g=b?`[${b}] `:"";d.v.error(`${g}${c.message}`,{status:c.status,code:c.code,details:c.details})}},23072:(a,b,c)=>{"use strict";c.d(b,{$y:()=>g,WX:()=>f});var d=c(45592),e=c(20602);function f(a,b=500){let c,g="خطای سرور",h=b;return a instanceof e.uV?(g=a.message,h=a.status||b,c=a.code,a.details):a instanceof Error?(g=a.message,"status"in a&&"number"==typeof a.status&&(h=a.status),"code"in a&&"string"==typeof a.code&&(c=a.code),"details"in a&&a.details):"string"==typeof a?g=a:a&&"object"==typeof a&&"message"in a&&(g=String(a.message),"status"in a&&"number"==typeof a.status&&(h=a.status),"code"in a&&"string"==typeof a.code&&(c=a.code)),(0,e.vV)(a,"API Route"),d.NextResponse.json({success:!1,error:g,...c?{code:c}:{}},{status:h})}function g(a,b=200,c){return d.NextResponse.json({success:!0,data:a,...c&&{pagination:c}},{status:b})}},23755:(a,b,c)=>{"use strict";c.d(b,{$G:()=>p,C0:()=>q,IX:()=>h,KE:()=>l,getSessionUserFromRequest:()=>n,jw:()=>m,q7:()=>o});var d=c(55511),e=c.n(d),f=c(44075),g=c(76266);let h="saded_session";function i(){return new Date().toISOString().slice(0,19).replace("T"," ")}function j(a){return e().createHash("sha256").update(a).digest("hex")}function k(a){return{httpOnly:!0,secure:"localhost"!==a.nextUrl.hostname&&"127.0.0.1"!==a.nextUrl.hostname&&"::1"!==a.nextUrl.hostname&&"https"===(a.headers.get("x-forwarded-proto")||a.nextUrl.protocol.replace(":","")),sameSite:"lax",path:"/",maxAge:31536e4,...!1}}async function l(){try{await (0,f.GB)(`
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
       LIMIT 1`,[d])}catch(a){if(a?.code==="ECONNRESET"||a?.code==="PROTOCOL_CONNECTION_LOST"||a?.code==="ETIMEDOUT"||a?.code==="ECONNREFUSED"||a?.message?.includes("closed state"))return g.v.warn("Database connection error in getSessionUserFromRequest query, returning null:",a?.code),null;throw a}if(!b)return null;if(b.expiresAt){let a=new Date(b.expiresAt);if(!Number.isNaN(a.getTime())&&a.getTime()<Date.now())return await (0,f.GB)("DELETE FROM sessions WHERE tokenHash = ?",[d]),null}try{await (0,f.GB)("UPDATE sessions SET lastSeenAt = ? WHERE id = ?",[i(),b.sessionId])}catch(a){a?.code==="ECONNRESET"||a?.code==="PROTOCOL_CONNECTION_LOST"||a?.code==="ETIMEDOUT"||a?.code==="ECONNREFUSED"||a?.message?.includes("closed state")||g.v.debug("Error touching session (non-critical):",a?.code)}return{id:b.userId,name:b.name,phone:b.phone,role:b.role||"user",enabled:!!b.enabled,createdAt:b.createdAt}}async function o(a){let b=a.cookies.get(h)?.value;if(!b)return;await l();let c=j(b);await (0,f.GB)("DELETE FROM sessions WHERE tokenHash = ?",[c])}function p(a,b,c){let d=k(c);a.cookies.set(h,b,{httpOnly:!0,secure:d.secure,sameSite:d.sameSite,path:"/",maxAge:d.maxAge})}function q(a,b){a.cookies.set(h,"",{...k(b),maxAge:0})}},28908:(a,b,c)=>{"use strict";c.d(b,{I:()=>g,i:()=>f});var d=c(44075);let e="__saded_chat_schema_info";async function f(){await (0,d.GB)(`
    CREATE TABLE IF NOT EXISTS quick_buy_chats (
      id VARCHAR(255) PRIMARY KEY,
      userId VARCHAR(255) NULL,
      customerName VARCHAR(255) NOT NULL,
      customerPhone VARCHAR(255) NOT NULL,
      customerEmail VARCHAR(255),
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `),await (0,d.GB)(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id VARCHAR(255) PRIMARY KEY,
      chatId VARCHAR(255) NOT NULL,
      userId VARCHAR(255) NULL,
      text TEXT,
      sender VARCHAR(50) NOT NULL,
      attachments JSON DEFAULT '[]',
      status VARCHAR(50) DEFAULT 'sent',
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `),await (0,d.GB)(`
    CREATE TABLE IF NOT EXISTS chat_attachments (
      id VARCHAR(255) PRIMARY KEY,
      messageId VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      filePath VARCHAR(500),
      fileName VARCHAR(255),
      fileSize BIGINT,
      fileUrl VARCHAR(500),
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);try{let a=await (0,d.getRows)("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'quick_buy_chats'");new Set(a.map(a=>String(a.COLUMN_NAME))).has("userId")||await (0,d.GB)("ALTER TABLE quick_buy_chats ADD COLUMN userId VARCHAR(255) NULL");try{await (0,d.GB)("CREATE INDEX idx_quick_buy_chats_userId ON quick_buy_chats (userId)")}catch(a){a?.code}try{await (0,d.GB)("CREATE INDEX idx_quick_buy_chats_customerPhone ON quick_buy_chats (customerPhone)")}catch(a){a?.code}}catch{}try{let a=await (0,d.getRows)("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'chat_messages'"),b=new Set(a.map(a=>String(a.COLUMN_NAME)));b.has("userId")||await (0,d.GB)("ALTER TABLE chat_messages ADD COLUMN userId VARCHAR(255) NULL");try{await (0,d.GB)("CREATE INDEX idx_chat_messages_userId ON chat_messages (userId)")}catch(a){a?.code}try{await (0,d.GB)("CREATE INDEX idx_chat_messages_chatId ON chat_messages (chatId)")}catch(a){a?.code}b.has("updatedAt")||await (0,d.GB)("ALTER TABLE chat_messages ADD COLUMN updatedAt TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP")}catch{}try{await (0,d.GB)("ALTER TABLE chat_messages ADD CONSTRAINT fk_chat_messages_chatId FOREIGN KEY (chatId) REFERENCES quick_buy_chats(id) ON DELETE CASCADE")}catch(a){a?.code!=="ER_DUP_KEY"&&a?.code!=="ER_CANT_CREATE_TABLE"&&a?.code}try{await (0,d.GB)("ALTER TABLE chat_attachments ADD CONSTRAINT fk_chat_attachments_messageId FOREIGN KEY (messageId) REFERENCES chat_messages(id) ON DELETE CASCADE")}catch(a){a?.code!=="ER_DUP_KEY"&&a?.code!=="ER_CANT_CREATE_TABLE"&&a?.code}}async function g(){let a,b=!(a=globalThis[e])||"number"!=typeof a.expiresAt||a.expiresAt<Date.now()?null:a;if(b)return b.value;let[c,f]=await Promise.all([(0,d.getRow)(`SELECT COUNT(*) as cnt
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'quick_buy_chats'
         AND COLUMN_NAME = 'userId'`).then(a=>Number(a?.cnt||0)>0).catch(()=>!1),(0,d.getRow)(`SELECT COUNT(*) as cnt
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'chat_messages'
         AND COLUMN_NAME = 'userId'`).then(a=>Number(a?.cnt||0)>0).catch(()=>!1)]),g={chatHasUserId:c,messageHasUserId:f};return globalThis[e]={value:g,expiresAt:Date.now()+3e5},g}},44075:(a,b,c)=>{"use strict";async function d(a,b=[]){try{let{queryOne:d}=await c.e(5289).then(c.bind(c,35289)),e=g(a);return await d(e,b)}catch(c){throw console.error("Database error in getRow:",{sql:a,params:b,error:c?.message,code:c?.code}),c}}async function e(a,b=[]){try{let{queryAll:d}=await c.e(5289).then(c.bind(c,35289)),e=g(a);return await d(e,b)}catch(c){throw console.error("Database error in getRows:",{sql:a,params:b,error:c?.message,code:c?.code}),c}}async function f(a,b=[]){let{query:d}=await c.e(5289).then(c.bind(c,35289)),e=g(a),h=await d(e,b);return{changes:h.affectedRows||h.rowCount||0,lastInsertRowid:h.insertId||void 0}}function g(a){let b,c=a,d=/\$(\d+)/g,e=[];for(;null!==(b=d.exec(a));)e.push({index:parseInt(b[1],10),position:b.index});if(e.length>0)for(let a of(e.sort((a,b)=>b.position-a.position),e))c=c.substring(0,a.position)+"?"+c.substring(a.position+`$${a.index}`.length);return(c=(c=(c=c.replace(/"([^"]+)"/g,"`$1`")).replace(/ON CONFLICT\s*\(([^)]+)\)\s*DO UPDATE SET\s*(.+)/gi,(a,b,c)=>{let d=c.replace(/EXCLUDED\.(\w+)/gi,"VALUES($1)");return`ON DUPLICATE KEY UPDATE ${d}`})).replace(/::jsonb/g,"")).replace(/::json/g,"")}async function h(){try{let{testConnection:a}=await c.e(5289).then(c.bind(c,35289));return await a()}catch(a){return!1}}function i(){return"mysql"}c.d(b,{GB:()=>f,c2:()=>i,getRow:()=>d,getRows:()=>e,testConnection:()=>h})},76266:(a,b,c)=>{"use strict";c.d(b,{v:()=>e});class d{shouldLog(a){return"error"===a||"warn"===a||this.isDevelopment}log(...a){this.shouldLog("log")&&console.log(...a)}error(...a){console.error(...a)}warn(...a){console.warn(...a)}info(...a){this.shouldLog("info")&&console.info(...a)}debug(...a){this.shouldLog("debug")&&console.debug(...a)}dbQuery(a,b){this.isDevelopment&&console.log("[DB Query]",a.substring(0,100),b?`[${b.length} params]`:"")}apiRequest(a,b,c){this.isDevelopment&&console.log(`[API] ${a} ${b}${c?` ${c}`:""}`)}constructor(){this.isDevelopment=!1,this.isProduction=!0}}let e=new d},78335:()=>{},96487:()=>{}};