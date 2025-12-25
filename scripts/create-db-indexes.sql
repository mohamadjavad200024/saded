-- Database Indexes for Performance Optimization
-- Run this script to create indexes for better query performance

-- Products table indexes
CREATE INDEX IF NOT EXISTS idx_products_enabled ON products(enabled);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_inStock ON products(inStock);
CREATE INDEX IF NOT EXISTS idx_products_createdAt ON products(createdAt);

-- Composite index for common product queries
CREATE INDEX IF NOT EXISTS idx_products_enabled_category ON products(enabled, category);
CREATE INDEX IF NOT EXISTS idx_products_enabled_brand ON products(enabled, brand);

-- Categories table indexes
CREATE INDEX IF NOT EXISTS idx_categories_enabled ON categories(enabled);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_userId ON orders(userId);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_paymentStatus ON orders(paymentStatus);
CREATE INDEX IF NOT EXISTS idx_orders_createdAt ON orders(createdAt);
CREATE INDEX IF NOT EXISTS idx_orders_orderNumber ON orders(orderNumber);

-- Composite index for order queries
CREATE INDEX IF NOT EXISTS idx_orders_userId_status ON orders(userId, status);
CREATE INDEX IF NOT EXISTS idx_orders_status_createdAt ON orders(status, createdAt);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_enabled ON users(enabled);

-- Carts table indexes
CREATE INDEX IF NOT EXISTS idx_carts_sessionId ON carts(sessionId);
CREATE INDEX IF NOT EXISTS idx_carts_userId ON carts(userId);

-- Chat tables indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_chatId ON chat_messages(chatId);
CREATE INDEX IF NOT EXISTS idx_chat_messages_createdAt ON chat_messages(createdAt);
CREATE INDEX IF NOT EXISTS idx_chat_attachments_messageId ON chat_attachments(messageId);

-- Admin presence indexes
CREATE INDEX IF NOT EXISTS idx_admin_presence_isOnline ON admin_presence(isOnline);


