-- Production Database Setup SQL Script
-- اجرا: psql -h localhost -U shop1111_saded_user -d saded -f scripts/setup-db.sql

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

-- Carts table
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

-- Chat Attachments table
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

-- Admin Presence table
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
CREATE INDEX IF NOT EXISTS idx_products_enabled_category ON products(enabled, category);
CREATE INDEX IF NOT EXISTS idx_products_enabled_price ON products(enabled, price);
CREATE INDEX IF NOT EXISTS idx_products_vin_enabled ON products(vin, "vinEnabled") WHERE "vinEnabled" = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_enabled_inStock ON products(enabled, "inStock");

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_userId ON orders("userId");
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_paymentStatus ON orders("paymentStatus");
CREATE INDEX IF NOT EXISTS idx_orders_status_paymentStatus ON orders(status, "paymentStatus");
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
CREATE INDEX IF NOT EXISTS idx_chat_messages_chatId_createdAt ON chat_messages("chatId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_chat_attachments_messageId ON chat_attachments("messageId");
CREATE INDEX IF NOT EXISTS idx_quick_buy_chats_status ON quick_buy_chats(status);
CREATE INDEX IF NOT EXISTS idx_quick_buy_chats_createdAt ON quick_buy_chats("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_quick_buy_chats_customerPhone ON quick_buy_chats("customerPhone");

-- Admin presence index
CREATE INDEX IF NOT EXISTS idx_admin_presence_isOnline ON admin_presence("isOnline");

-- Success message
SELECT 'Database tables created successfully!' AS message;

