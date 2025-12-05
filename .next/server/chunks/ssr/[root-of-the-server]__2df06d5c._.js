module.exports=[30056,a=>a.a(async(b,c)=>{try{let b=await a.y("pg");a.n(b),c()}catch(a){c(a)}},!0),76668,a=>{"use strict";let b=new class{isDevelopment=!1;isProduction=!0;shouldLog(a){return"error"===a||"warn"===a||this.isDevelopment}log(...a){this.shouldLog("log")&&console.log(...a)}error(...a){console.error(...a)}warn(...a){console.warn(...a)}info(...a){this.shouldLog("info")&&console.info(...a)}debug(...a){this.shouldLog("debug")&&console.debug(...a)}dbQuery(a,b){this.isDevelopment&&console.log("[DB Query]",a.substring(0,100),b?`[${b.length} params]`:"")}apiRequest(a,b,c){this.isDevelopment&&console.log(`[API] ${a} ${b}${c?` ${c}`:""}`)}};a.s(["logger",0,b])},59379,a=>a.a(async(b,c)=>{try{var d=a.i(30056),e=a.i(76668),f=b([d]);[d]=f.then?(await f)():f,process.env.DB_PASSWORD||(e.logger.error("⚠️  WARNING: DB_PASSWORD is not set in environment variables!"),e.logger.error("   Please make sure .env file exists and contains DB_PASSWORD"),e.logger.error("   If you just updated .env, restart your Next.js server"),e.logger.error("   Current working directory:",process.cwd()));let p={host:process.env.DB_HOST||"localhost",port:parseInt(process.env.DB_PORT||"5432"),database:process.env.DB_NAME||"saded",user:process.env.DB_USER||"postgres",password:process.env.DB_PASSWORD||"",max:20,idleTimeoutMillis:3e4,connectionTimeoutMillis:2e3},q=null;function g(){return q||(q=new d.Pool(p)).on("error",a=>{e.logger.error("Unexpected error on idle PostgreSQL client",a)}),q}async function h(){try{let a=g();return(await a.query("SELECT NOW()")).rows.length>0}catch(a){return e.logger.error("Database connection test failed:",a),!1}}async function i(a,b){let c=await g().connect();try{return await c.query(a,b)}catch(b){throw e.logger.error("❌ Database query error:",{message:b?.message,code:b?.code,query:a.substring(0,100),hasPassword:!!p.password}),b}finally{c.release()}}async function j(a,b){return(await i(a,b)).rows[0]||null}async function k(a,b){return(await i(a,b)).rows}async function l(a){let b=await g().connect();try{await b.query("BEGIN");let c=await a(b);return await b.query("COMMIT"),c}catch(a){throw await b.query("ROLLBACK"),a}finally{b.release()}}async function m(){q&&(await q.end(),q=null)}async function n(){let a=`
    ALTER TABLE products ADD COLUMN IF NOT EXISTS "airShippingCost" BIGINT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS "seaShippingCost" BIGINT;
  `;try{await i(a),e.logger.debug("✅ Shipping cost columns added/verified")}catch(a){a?.message?.includes("does not exist")||e.logger.warn("⚠️ Could not add shipping cost columns (may already exist or table doesn't exist yet):",a?.message)}let b=`
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
  `;try{await i(b),e.logger.debug("✅ Database tables initialized successfully")}catch(a){throw e.logger.error("❌ Error initializing database tables:",a),a}}async function o(){let a=new d.Pool({...p,database:"postgres"});try{let b=await a.query("SELECT 1 FROM pg_database WHERE datname = $1",[p.database]);0===b.rows.length?(await a.query(`CREATE DATABASE ${p.database}`),e.logger.debug(`✅ Database '${p.database}' created successfully`)):e.logger.debug(`✅ Database '${p.database}' already exists`)}catch(a){if("42P04"!==a.code)throw e.logger.error("Error ensuring database:",a),a}finally{await a.end()}}a.s(["closePool",()=>m,"ensureDatabase",()=>o,"getPool",()=>g,"initializeTables",()=>n,"query",()=>i,"queryAll",()=>k,"queryOne",()=>j,"testConnection",()=>h,"transaction",()=>l]),c()}catch(a){c(a)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__2df06d5c._.js.map