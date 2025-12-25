module.exports=[94914,e=>{"use strict";var t=e.i(12e3);let a="__saded_chat_schema_info";async function s(){await (0,t.runQuery)(`
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
  `),await (0,t.runQuery)(`
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
  `),await (0,t.runQuery)(`
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
  `);try{let e=await (0,t.getRows)("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'quick_buy_chats'");new Set(e.map(e=>String(e.COLUMN_NAME))).has("userId")||await (0,t.runQuery)("ALTER TABLE quick_buy_chats ADD COLUMN userId VARCHAR(255) NULL");try{await (0,t.runQuery)("CREATE INDEX idx_quick_buy_chats_userId ON quick_buy_chats (userId)")}catch(e){e?.code}try{await (0,t.runQuery)("CREATE INDEX idx_quick_buy_chats_customerPhone ON quick_buy_chats (customerPhone)")}catch(e){e?.code}}catch{}try{let e=await (0,t.getRows)("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'chat_messages'"),a=new Set(e.map(e=>String(e.COLUMN_NAME)));a.has("userId")||await (0,t.runQuery)("ALTER TABLE chat_messages ADD COLUMN userId VARCHAR(255) NULL");try{await (0,t.runQuery)("CREATE INDEX idx_chat_messages_userId ON chat_messages (userId)")}catch(e){e?.code}try{await (0,t.runQuery)("CREATE INDEX idx_chat_messages_chatId ON chat_messages (chatId)")}catch(e){e?.code}a.has("updatedAt")||await (0,t.runQuery)("ALTER TABLE chat_messages ADD COLUMN updatedAt TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP")}catch{}try{await (0,t.runQuery)("ALTER TABLE chat_messages ADD CONSTRAINT fk_chat_messages_chatId FOREIGN KEY (chatId) REFERENCES quick_buy_chats(id) ON DELETE CASCADE")}catch(e){e?.code!=="ER_DUP_KEY"&&e?.code!=="ER_CANT_CREATE_TABLE"&&e?.code}try{await (0,t.runQuery)("ALTER TABLE chat_attachments ADD CONSTRAINT fk_chat_attachments_messageId FOREIGN KEY (messageId) REFERENCES chat_messages(id) ON DELETE CASCADE")}catch(e){e?.code!=="ER_DUP_KEY"&&e?.code!=="ER_CANT_CREATE_TABLE"&&e?.code}}async function r(){let e,s=!(e=globalThis[a])||"number"!=typeof e.expiresAt||e.expiresAt<Date.now()?null:e;if(s)return s.value;let[r,c]=await Promise.all([(0,t.getRow)(`SELECT COUNT(*) as cnt
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'quick_buy_chats'
         AND COLUMN_NAME = 'userId'`).then(e=>Number(e?.cnt||0)>0).catch(()=>!1),(0,t.getRow)(`SELECT COUNT(*) as cnt
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'chat_messages'
         AND COLUMN_NAME = 'userId'`).then(e=>Number(e?.cnt||0)>0).catch(()=>!1)]),i={chatHasUserId:r,messageHasUserId:c};return globalThis[a]={value:i,expiresAt:Date.now()+3e5},i}e.s(["ensureChatTables",()=>s,"getChatSchemaInfo",()=>r])},2572,38339,e=>{"use strict";class t{cache=new Map;maxSize=1e3;get(e){let t=this.cache.get(e);return t?Date.now()-t.timestamp>t.ttl?(this.cache.delete(e),null):t.data:null}set(e,t,a=6e4){if(this.cache.size>=this.maxSize){let e=this.cache.keys().next().value;void 0!==e&&this.cache.delete(e)}this.cache.set(e,{data:t,timestamp:Date.now(),ttl:a})}delete(e){this.cache.delete(e)}clear(){this.cache.clear()}clearExpired(){let e=Date.now();for(let[t,a]of this.cache.entries())e-a.timestamp>a.ttl&&this.cache.delete(t)}size(){return this.cache.size}}let a=new t;"undefined"!=typeof setInterval&&setInterval(()=>{a.clearExpired()},3e5),e.s(["cache",0,a,"cacheKeys",0,{chat:e=>`chat:${e}`,chatMessages:(e,t,a)=>`chat:messages:${e}:${t||1}:${a||50}`,chatList:(e,t)=>`chat:list:${e||1}:${t||50}`,products:(e,t,a)=>`products:${e||1}:${t||50}:${a||""}`,product:e=>`product:${e}`,categories:()=>"categories:all",category:e=>`category:${e}`,orders:e=>`orders:${e||""}`,order:e=>`order:${e}`}],2572);var s=e.i(54799);class r{store=new Map;cleanupInterval=null;isRateLimited(e,t,a){let s=Date.now(),r=this.store.get(e);return!r||s>r.resetTime?(this.store.set(e,{count:1,resetTime:s+a}),!1):r.count>=t||(r.count++,!1)}getRemaining(e,t){let a=this.store.get(e);return a?Math.max(0,t-a.count):t}getResetTime(e){let t=this.store.get(e);return t?t.resetTime:null}cleanup(){let e=Date.now();for(let[t,a]of this.store.entries())e>a.resetTime&&this.store.delete(t)}startCleanup(e=6e4){this.cleanupInterval||(this.cleanupInterval=setInterval(()=>{this.cleanup()},e))}stopCleanup(){this.cleanupInterval&&(clearInterval(this.cleanupInterval),this.cleanupInterval=null)}clear(){this.store.clear()}}let c=new r;function i(e){let t=[e.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),e.headers.get("x-real-ip")?.trim(),e.headers.get("cf-connecting-ip")?.trim(),e.headers.get("true-client-ip")?.trim(),e.headers.get("fastly-client-ip")?.trim(),e.headers.get("x-client-ip")?.trim()].filter(Boolean)[0]||"unknown";if("unknown"===t){let t=e.headers.get("user-agent")||"unknown-ua",a=s.default.createHash("sha256").update(t).digest("hex").slice(0,12);return`unknown:${a}`}return t}function A(e=100,t=6e4,a){return async s=>{let r=a?a(s):i(s),A=`${s.nextUrl.pathname}:${s.method}:${r}`;if(c.isRateLimited(A,e,t)){let a=c.getResetTime(A),s=c.getRemaining(A,e);return new Response(JSON.stringify({success:!1,error:"درخواست‌های شما زیاد است. لطفاً کمی بعد دوباره تلاش کنید.",code:"RATE_LIMIT_EXCEEDED"}),{status:429,headers:{"Content-Type":"application/json","X-RateLimit-Limit":e.toString(),"X-RateLimit-Remaining":s.toString(),"X-RateLimit-Reset":a?.toString()||"","Retry-After":Math.ceil((a?a-Date.now():t)/1e3).toString()}})}return null}}c.startCleanup(6e4),e.s(["getClientId",()=>i,"rateLimit",()=>A,"rateLimiter",0,c],38339)},6149,e=>{e.v(t=>Promise.all(["server/chunks/[externals]_util_be9989c7._.js","server/chunks/_19ab7056._.js","server/chunks/[root-of-the-server]__473dce0e._.js"].map(t=>e.l(t))).then(()=>t(85238)))}];

//# sourceMappingURL=lib_a4cdee0f._.js.map