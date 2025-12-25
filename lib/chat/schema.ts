import { getRow, getRows, runQuery } from "@/lib/db/index";

export type ChatSchemaInfo = {
  chatHasUserId: boolean;
  messageHasUserId: boolean;
};

type Cached = { value: ChatSchemaInfo; expiresAt: number };

const CACHE_KEY = "__saded_chat_schema_info";
const TTL_MS = 5 * 60 * 1000;

function getCache(): Cached | null {
  const g: any = globalThis as any;
  const v = g[CACHE_KEY] as Cached | undefined;
  if (!v) return null;
  if (typeof v.expiresAt !== "number" || v.expiresAt < Date.now()) return null;
  return v;
}

function setCache(value: ChatSchemaInfo) {
  const g: any = globalThis as any;
  g[CACHE_KEY] = { value, expiresAt: Date.now() + TTL_MS } satisfies Cached;
}

export async function ensureChatTables(): Promise<void> {
  await runQuery(`
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
  `);

  await runQuery(`
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
  `);

  await runQuery(`
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
  `);

  // Best-effort migrations (may fail on limited DB permissions; that's OK)
  try {
    const chatCols = await getRows<{ COLUMN_NAME: string }>(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'quick_buy_chats'`
    );
    const chatColSet = new Set(chatCols.map((c) => String(c.COLUMN_NAME)));
    if (!chatColSet.has("userId")) {
      await runQuery(`ALTER TABLE quick_buy_chats ADD COLUMN userId VARCHAR(255) NULL`);
    }
    try {
      await runQuery(`CREATE INDEX idx_quick_buy_chats_userId ON quick_buy_chats (userId)`);
    } catch (err: any) {
      // ignore duplicate key errors (index already exists)
      if (err?.code !== 'ER_DUP_KEYNAME') {
        // Only log non-duplicate errors in development
        if (process.env.NODE_ENV === 'development') {
          console.debug('Index creation skipped (may already exist):', err?.code);
        }
      }
    }
    try {
      await runQuery(`CREATE INDEX idx_quick_buy_chats_customerPhone ON quick_buy_chats (customerPhone)`);
    } catch (err: any) {
      // ignore duplicate key errors (index already exists)
      if (err?.code !== 'ER_DUP_KEYNAME') {
        if (process.env.NODE_ENV === 'development') {
          console.debug('Index creation skipped (may already exist):', err?.code);
        }
      }
    }
  } catch {
    // ignore
  }

  try {
    const msgCols = await getRows<{ COLUMN_NAME: string }>(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'chat_messages'`
    );
    const msgColSet = new Set(msgCols.map((c) => String(c.COLUMN_NAME)));
    if (!msgColSet.has("userId")) {
      await runQuery(`ALTER TABLE chat_messages ADD COLUMN userId VARCHAR(255) NULL`);
    }
    try {
      await runQuery(`CREATE INDEX idx_chat_messages_userId ON chat_messages (userId)`);
    } catch (err: any) {
      // ignore duplicate key errors (index already exists)
      if (err?.code !== 'ER_DUP_KEYNAME') {
        if (process.env.NODE_ENV === 'development') {
          console.debug('Index creation skipped (may already exist):', err?.code);
        }
      }
    }
    try {
      await runQuery(`CREATE INDEX idx_chat_messages_chatId ON chat_messages (chatId)`);
    } catch (err: any) {
      // ignore duplicate key errors (index already exists)
      if (err?.code !== 'ER_DUP_KEYNAME') {
        if (process.env.NODE_ENV === 'development') {
          console.debug('Index creation skipped (may already exist):', err?.code);
        }
      }
    }
    if (!msgColSet.has("updatedAt")) {
      await runQuery(`ALTER TABLE chat_messages ADD COLUMN updatedAt TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP`);
    }
  } catch {
    // ignore
  }

  // Ensure FK/indexes are present where possible (best-effort)
  try {
    await runQuery(`ALTER TABLE chat_messages ADD CONSTRAINT fk_chat_messages_chatId FOREIGN KEY (chatId) REFERENCES quick_buy_chats(id) ON DELETE CASCADE`);
  } catch (err: any) {
    // ignore duplicate constraint errors (constraint already exists)
    if (err?.code !== 'ER_DUP_KEY' && err?.code !== 'ER_CANT_CREATE_TABLE' && err?.code !== 'ER_DUP_ENTRY') {
      if (process.env.NODE_ENV === 'development') {
        console.debug('Foreign key creation skipped (may already exist):', err?.code);
      }
    }
  }
  try {
    await runQuery(`ALTER TABLE chat_attachments ADD CONSTRAINT fk_chat_attachments_messageId FOREIGN KEY (messageId) REFERENCES chat_messages(id) ON DELETE CASCADE`);
  } catch (err: any) {
    // ignore duplicate constraint errors (constraint already exists)
    if (err?.code !== 'ER_DUP_KEY' && err?.code !== 'ER_CANT_CREATE_TABLE' && err?.code !== 'ER_DUP_ENTRY') {
      if (process.env.NODE_ENV === 'development') {
        console.debug('Foreign key creation skipped (may already exist):', err?.code);
      }
    }
  }
}

export async function getChatSchemaInfo(): Promise<ChatSchemaInfo> {
  const cached = getCache();
  if (cached) return cached.value;

  const [chatHasUserId, messageHasUserId] = await Promise.all([
    getRow<{ cnt: number }>(
      `SELECT COUNT(*) as cnt
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'quick_buy_chats'
         AND COLUMN_NAME = 'userId'`
    ).then((r) => Number(r?.cnt || 0) > 0).catch(() => false),
    getRow<{ cnt: number }>(
      `SELECT COUNT(*) as cnt
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'chat_messages'
         AND COLUMN_NAME = 'userId'`
    ).then((r) => Number(r?.cnt || 0) > 0).catch(() => false),
  ]);

  const info = { chatHasUserId, messageHasUserId };
  setCache(info);
  return info;
}


