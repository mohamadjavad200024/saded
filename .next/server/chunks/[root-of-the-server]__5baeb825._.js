module.exports=[40911,e=>{"use strict";let t=new class{isDevelopment=!1;isProduction=!0;shouldLog(e){return"error"===e||"warn"===e||this.isDevelopment}log(...e){this.shouldLog("log")&&console.log(...e)}error(...e){console.error(...e)}warn(...e){console.warn(...e)}info(...e){this.shouldLog("info")&&console.info(...e)}debug(...e){this.shouldLog("debug")&&console.debug(...e)}dbQuery(e,t){this.isDevelopment&&console.log("[DB Query]",e.substring(0,100),t?`[${t.length} params]`:"")}apiRequest(e,t,s){this.isDevelopment&&console.log(`[API] ${e} ${t}${s?` ${s}`:""}`)}};e.s(["logger",0,t])},30056,e=>e.a(async(t,s)=>{try{let t=await e.y("pg");e.n(t),s()}catch(e){s(e)}},!0),19152,e=>e.a(async(t,s)=>{try{var a=e.i(30056),r=e.i(40911),E=t([a]);[a]=E.then?(await E)():E,process.env.DB_PASSWORD||(r.logger.error("⚠️  WARNING: DB_PASSWORD is not set in environment variables!"),r.logger.error("   Please make sure .env file exists and contains DB_PASSWORD"),r.logger.error("   If you just updated .env, restart your Next.js server"),r.logger.error("   Current working directory:",process.cwd()));let R={host:process.env.DB_HOST||"localhost",port:parseInt(process.env.DB_PORT||"5432"),database:process.env.DB_NAME||"saded",user:process.env.DB_USER||"postgres",password:process.env.DB_PASSWORD||"",max:20,idleTimeoutMillis:3e4,connectionTimeoutMillis:2e3},O=null;function o(){return O||(O=new a.Pool(R)).on("error",e=>{r.logger.error("Unexpected error on idle PostgreSQL client",e)}),O}async function T(){try{let e=o();return(await e.query("SELECT NOW()")).rows.length>0}catch(e){return r.logger.error("Database connection test failed:",e),!1}}async function i(e,t){let s=await o().connect();try{return await s.query(e,t)}catch(t){throw r.logger.error("❌ Database query error:",{message:t?.message,code:t?.code,query:e.substring(0,100),hasPassword:!!R.password}),t}finally{s.release()}}async function n(e,t){return(await i(e,t)).rows[0]||null}async function A(e,t){return(await i(e,t)).rows}async function d(e){let t=await o().connect();try{await t.query("BEGIN");let s=await e(t);return await t.query("COMMIT"),s}catch(e){throw await t.query("ROLLBACK"),e}finally{t.release()}}async function N(){O&&(await O.end(),O=null)}async function c(){let e=`
    ALTER TABLE products ADD COLUMN IF NOT EXISTS "airShippingCost" BIGINT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS "seaShippingCost" BIGINT;
  `;try{await i(e),r.logger.debug("✅ Shipping cost columns added/verified")}catch(e){e?.message?.includes("does not exist")||r.logger.warn("⚠️ Could not add shipping cost columns (may already exist or table doesn't exist yet):",e?.message)}let t=`
    -- Products table
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price BIGINT NOT NULL,
      "originalPrice" BIGINT,
      brand VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      vin VARCHAR(255),
      "vinEnabled" BOOLEAN DEFAULT FALSE,
      "airShippingEnabled" BOOLEAN DEFAULT TRUE,
      "seaShippingEnabled" BOOLEAN DEFAULT TRUE,
      "airShippingCost" BIGINT,
      "seaShippingCost" BIGINT,
      "stockCount" INTEGER DEFAULT 0,
      "inStock" BOOLEAN DEFAULT TRUE,
      enabled BOOLEAN DEFAULT TRUE,
      images JSONB NOT NULL DEFAULT '[]'::jsonb,
      tags JSONB DEFAULT '[]'::jsonb,
      specifications JSONB DEFAULT '{}'::jsonb,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );

    -- Categories table
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      slug VARCHAR(255) UNIQUE,
      image VARCHAR(255),
      icon VARCHAR(255),
      enabled BOOLEAN DEFAULT TRUE,
      "isActive" BOOLEAN DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );

    -- Orders table
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(255) PRIMARY KEY,
      "orderNumber" VARCHAR(255) UNIQUE NOT NULL,
      "userId" VARCHAR(255),
      "customerName" VARCHAR(255) NOT NULL,
      "customerPhone" VARCHAR(255) NOT NULL,
      "customerEmail" VARCHAR(255),
      items JSONB NOT NULL DEFAULT '[]'::jsonb,
      total BIGINT NOT NULL,
      "shippingCost" BIGINT NOT NULL,
      "shippingMethod" VARCHAR(50) NOT NULL,
      "shippingAddress" JSONB NOT NULL DEFAULT '{}'::jsonb,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      "paymentStatus" VARCHAR(50) NOT NULL DEFAULT 'pending',
      notes TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );

    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      phone VARCHAR(255),
      address TEXT,
      enabled BOOLEAN DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );

    -- Carts table (for storing user shopping carts)
    CREATE TABLE IF NOT EXISTS carts (
      id VARCHAR(255) PRIMARY KEY,
      "sessionId" VARCHAR(255) NOT NULL,
      "userId" VARCHAR(255),
      items JSONB NOT NULL DEFAULT '[]'::jsonb,
      "shippingMethod" VARCHAR(50),
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE("sessionId")
    );

    -- Quick Buy Chats table
    CREATE TABLE IF NOT EXISTS quick_buy_chats (
      id VARCHAR(255) PRIMARY KEY,
      "customerName" VARCHAR(255) NOT NULL,
      "customerPhone" VARCHAR(255) NOT NULL,
      "customerEmail" VARCHAR(255),
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );

    -- Chat Messages table
    CREATE TABLE IF NOT EXISTS chat_messages (
      id VARCHAR(255) PRIMARY KEY,
      "chatId" VARCHAR(255) NOT NULL REFERENCES quick_buy_chats(id) ON DELETE CASCADE,
      text TEXT,
      sender VARCHAR(50) NOT NULL,
      attachments JSONB DEFAULT '[]'::jsonb,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY ("chatId") REFERENCES quick_buy_chats(id) ON DELETE CASCADE
    );

    -- Chat Attachments table (for storing file metadata)
    CREATE TABLE IF NOT EXISTS chat_attachments (
      id VARCHAR(255) PRIMARY KEY,
      "messageId" VARCHAR(255) NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
      type VARCHAR(50) NOT NULL,
      "filePath" VARCHAR(500),
      "fileName" VARCHAR(255),
      "fileSize" BIGINT,
      "fileUrl" VARCHAR(500),
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY ("messageId") REFERENCES chat_messages(id) ON DELETE CASCADE
    );

    -- Admin Presence table (for tracking admin online/offline status)
    CREATE TABLE IF NOT EXISTS admin_presence (
      "adminId" VARCHAR(255) PRIMARY KEY,
      "isOnline" BOOLEAN DEFAULT FALSE,
      "lastSeen" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );

    -- Create indexes
    
    -- Products indexes
    CREATE INDEX IF NOT EXISTS idx_products_enabled ON products(enabled);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
    -- Composite index for common filter: enabled + category
    CREATE INDEX IF NOT EXISTS idx_products_enabled_category ON products(enabled, category);
    -- Composite index for search queries: enabled + price range
    CREATE INDEX IF NOT EXISTS idx_products_enabled_price ON products(enabled, price);
    -- Index for VIN search
    CREATE INDEX IF NOT EXISTS idx_products_vin_enabled ON products(vin, "vinEnabled") WHERE "vinEnabled" = TRUE;
    -- Index for inStock filter
    CREATE INDEX IF NOT EXISTS idx_products_enabled_inStock ON products(enabled, "inStock");
    
    -- Orders indexes
    CREATE INDEX IF NOT EXISTS idx_orders_userId ON orders("userId");
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_paymentStatus ON orders("paymentStatus");
    -- Composite index for order filtering
    CREATE INDEX IF NOT EXISTS idx_orders_status_paymentStatus ON orders(status, "paymentStatus");
    -- Index for order date queries
    CREATE INDEX IF NOT EXISTS idx_orders_createdAt ON orders("createdAt" DESC);
    
    -- Categories indexes
    CREATE INDEX IF NOT EXISTS idx_categories_enabled ON categories(enabled);
    CREATE INDEX IF NOT EXISTS idx_categories_enabled_active ON categories(enabled, "isActive");
    
    -- Carts indexes
    CREATE INDEX IF NOT EXISTS idx_carts_sessionId ON carts("sessionId");
    CREATE INDEX IF NOT EXISTS idx_carts_userId ON carts("userId");
    
    -- Chat indexes
    CREATE INDEX IF NOT EXISTS idx_chat_messages_chatId ON chat_messages("chatId");
    CREATE INDEX IF NOT EXISTS idx_chat_messages_createdAt ON chat_messages("createdAt");
    -- Composite index for chat messages queries (chatId + createdAt for pagination)
    CREATE INDEX IF NOT EXISTS idx_chat_messages_chatId_createdAt ON chat_messages("chatId", "createdAt" DESC);
    -- Index for unread messages count
    CREATE INDEX IF NOT EXISTS idx_chat_messages_chatId_sender_status ON chat_messages("chatId", sender, status);
    CREATE INDEX IF NOT EXISTS idx_chat_attachments_messageId ON chat_attachments("messageId");
    CREATE INDEX IF NOT EXISTS idx_quick_buy_chats_status ON quick_buy_chats(status);
    CREATE INDEX IF NOT EXISTS idx_quick_buy_chats_createdAt ON quick_buy_chats("createdAt" DESC);
    -- Index for finding chat by customer phone
    CREATE INDEX IF NOT EXISTS idx_quick_buy_chats_customerPhone ON quick_buy_chats("customerPhone");
    
    -- Admin presence index
    CREATE INDEX IF NOT EXISTS idx_admin_presence_isOnline ON admin_presence("isOnline");
  `;try{await i(t),r.logger.debug("✅ Database tables initialized successfully")}catch(e){throw r.logger.error("❌ Error initializing database tables:",e),e}}async function I(){let e=new a.Pool({...R,database:"postgres"});try{let t=await e.query("SELECT 1 FROM pg_database WHERE datname = $1",[R.database]);0===t.rows.length?(await e.query(`CREATE DATABASE ${R.database}`),r.logger.debug(`✅ Database '${R.database}' created successfully`)):r.logger.debug(`✅ Database '${R.database}' already exists`)}catch(e){if("42P04"!==e.code)throw r.logger.error("Error ensuring database:",e),e}finally{await e.end()}}e.s(["closePool",()=>N,"ensureDatabase",()=>I,"getPool",()=>o,"initializeTables",()=>c,"query",()=>i,"queryAll",()=>A,"queryOne",()=>n,"testConnection",()=>T,"transaction",()=>d]),s()}catch(e){s(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__5baeb825._.js.map