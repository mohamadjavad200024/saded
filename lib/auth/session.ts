import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getRow, getRows, runQuery } from "@/lib/db/index";
import { AppError } from "@/lib/api-error-handler";

export const SESSION_COOKIE_NAME = "saded_session";

// Session نامحدود - تا زمانی که کاربر logout نکند
// برای امنیت، از maxAge بسیار طولانی استفاده می‌کنیم (10 سال)
const SESSION_MAX_AGE_SECONDS = 10 * 365 * 24 * 60 * 60; // 10 years in seconds

function nowIso(): string {
  // MySQL friendly datetime (YYYY-MM-DD HH:mm:ss)
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

// Function removed - sessions are now unlimited, no expiration needed

export function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function isHttpsRequest(request: NextRequest): boolean {
  const proto = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "");
  return proto === "https";
}

export function getSessionCookieOptions(request: NextRequest) {
  // Important: if your site is served over http (Not secure), Secure cookies won't set.
  // In development, we use http, so secure must be false
  const isProduction = process.env.NODE_ENV === "production";
  const isLocalhost = request.nextUrl.hostname === "localhost" || 
                      request.nextUrl.hostname === "127.0.0.1" ||
                      request.nextUrl.hostname === "::1";
  
  // Never use secure on localhost - it prevents cookie from being set
  const secure = isProduction && !isLocalhost && isHttpsRequest(request);
  
  return {
    httpOnly: true,
    secure: secure, // false on localhost, true only in production with HTTPS
    sameSite: "lax" as const, // lax allows cookies to be sent with same-site requests
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS, // 10 years - effectively unlimited until logout
    // Ensure domain is not set (allows cookie to work on localhost)
    // domain is not set by default, which is correct for localhost
    // In development, explicitly set sameSite to 'lax' to ensure cookies work
    ...(process.env.NODE_ENV === 'development' && {
      sameSite: "lax" as const,
    }),
  };
}

export async function ensureAuthTables(): Promise<void> {
  try {
    // Users table
    await runQuery(`
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
  `);

  // If table already existed with different schema/indexes, normalize it:
  // - Only `phone` should be unique (besides PRIMARY id)
  // - Remove other UNIQUE indexes that can block registration (e.g. old email unique)
  // - Ensure phone is NOT NULL
  try {
    // Remove invalid rows (NULL/empty phone) to avoid ALTER failures
    await runQuery(`DELETE FROM users WHERE phone IS NULL OR TRIM(phone) = ''`);

    // Ensure phone column is NOT NULL (keep type small)
    await runQuery(`ALTER TABLE users MODIFY phone VARCHAR(32) NOT NULL`);

    // Read indexes
    const indexRows = await getRows<any>(`SHOW INDEX FROM users`);
    const uniqueIndexToColumns = new Map<string, string[]>();

    for (const r of indexRows) {
      const keyName = String(r.Key_name ?? r.key_name ?? r.KEY_NAME ?? "");
      const nonUnique = Number(r.Non_unique ?? r.non_unique ?? r.NON_UNIQUE ?? 1);
      const colName = String(r.Column_name ?? r.column_name ?? r.COLUMN_NAME ?? "");
      if (!keyName || !colName) continue;
      if (nonUnique !== 0) continue;
      const cols = uniqueIndexToColumns.get(keyName) || [];
      cols.push(colName);
      uniqueIndexToColumns.set(keyName, cols);
    }

    // Find which unique index (if any) is exactly on phone
    let phoneUniqueIndexName: string | null = null;
    for (const [key, cols] of uniqueIndexToColumns.entries()) {
      if (key === "PRIMARY") continue;
      const normalizedCols = cols.map((c) => c.toLowerCase()).sort();
      if (normalizedCols.length === 1 && normalizedCols[0] === "phone") {
        phoneUniqueIndexName = key;
        break;
      }
    }

    // Ensure we have a unique index on phone with our preferred name
    if (!phoneUniqueIndexName) {
      await runQuery(`ALTER TABLE users ADD UNIQUE KEY uniq_users_phone (phone)`);
      phoneUniqueIndexName = "uniq_users_phone";
    }

    // Drop any other UNIQUE indexes (only PRIMARY + phone unique should remain)
    for (const key of uniqueIndexToColumns.keys()) {
      if (key === "PRIMARY") continue;
      if (key === phoneUniqueIndexName) continue;
      // Drop (might fail if permissions; ignore)
      try {
        await runQuery(`ALTER TABLE users DROP INDEX \`${key}\``);
      } catch {
        // ignore
      }
    }
  } catch {
    // Best-effort; do not block auth if ALTER is not permitted
  }

  // Sessions table
  // Note: expiresAt is kept for backward compatibility but not enforced (sessions are unlimited)
  await runQuery(`
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
  `);
  
    // Migrate existing sessions: set expiresAt to NULL for unlimited sessions
    try {
      await runQuery(`UPDATE sessions SET expiresAt = NULL WHERE expiresAt IS NOT NULL`);
    } catch {
      // Best-effort migration, ignore errors
    }
  } catch (error: any) {
    // If database is not available, log but don't throw - allow app to continue
    if (error?.code === 'ECONNRESET' || 
        error?.code === 'PROTOCOL_CONNECTION_LOST' ||
        error?.code === 'ETIMEDOUT' ||
        error?.code === 'ECONNREFUSED' ||
        error?.message?.includes('closed state')) {
      logger.warn("Database connection error in ensureAuthTables, will retry on next request:", error?.code);
      // Don't throw - allow route to continue (it will handle the error)
      return;
    }
    // For other errors, log and rethrow
    logger.error("Error ensuring auth tables:", error);
    throw error;
  }
}

export type SessionUser = {
  id: string;
  name: string;
  phone: string;
  role: string;
  enabled: boolean;
  createdAt: string;
};

export async function createSession(userId: string, request: NextRequest): Promise<string> {
  await ensureAuthTables();

  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = sha256Hex(token);
  const sessionId = `sess_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;
  // Session نامحدود - expiresAt را NULL می‌گذاریم
  const expiresAt = null;

  const ua = request.headers.get("user-agent");
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;

  await runQuery(
    `INSERT INTO sessions (id, userId, tokenHash, expiresAt, createdAt, lastSeenAt, userAgent, ip)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sessionId,
      userId,
      tokenHash,
      expiresAt,
      nowIso(),
      nowIso(),
      ua || null,
      ip,
    ]
  );

  return token;
}

export async function getSessionUserFromRequest(request: NextRequest): Promise<SessionUser | null> {
  // Try to get cookie from both cookies.get() and headers
  let token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  
  // Fallback: try to parse from cookie header directly
  if (!token) {
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim());
      for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === SESSION_COOKIE_NAME && value) {
          token = decodeURIComponent(value);
          break;
        }
      }
    }
  }
  
  if (!token) {
    // Debug: log if cookie is missing - use console.log for visibility
    const allCookies = request.cookies.getAll();
    const cookieNames = allCookies.map(c => c.name);
    const cookieHeader = request.headers.get('cookie');
    console.log('[Session] ❌ No session cookie found!');
    console.log('[Session] Available cookies:', cookieNames);
    console.log('[Session] Looking for cookie:', SESSION_COOKIE_NAME);
    console.log('[Session] Request URL:', request.url);
    console.log('[Session] Cookie header:', cookieHeader ? cookieHeader.substring(0, 300) : 'no cookie header');
    console.log('[Session] Request hostname:', request.nextUrl.hostname);
    console.log('[Session] Request protocol:', request.nextUrl.protocol);
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Session] No session cookie found. Available cookies:', cookieNames);
    }
    return null;
  }
  
  console.log('[Session] ✅ Session token found, length:', token.length);

  // Only touch DB if a session cookie exists (prevents hanging on DB when user is not logged in)
  try {
    await ensureAuthTables();
  } catch (error: any) {
    // If database is not available, return null (user not authenticated)
    if (error?.code === 'ECONNRESET' || 
        error?.code === 'PROTOCOL_CONNECTION_LOST' ||
        error?.code === 'ETIMEDOUT' ||
        error?.code === 'ECONNREFUSED' ||
        error?.message?.includes('closed state')) {
      logger.warn("Database connection error in getSessionUserFromRequest, returning null:", error?.code);
      return null;
    }
    // For other errors, rethrow
    throw error;
  }

  const tokenHash = sha256Hex(token);
  let row;
  try {
    row = await getRow<{
      sessionId: string;
      userId: string;
      expiresAt: string;
      enabled: any;
      role: string;
      name: string;
      phone: string;
      createdAt: string;
    }>(
      `SELECT s.id as sessionId, s.userId, s.expiresAt, u.enabled, u.role, u.name, u.phone, u.createdAt
       FROM sessions s
       JOIN users u ON u.id = s.userId
       WHERE s.tokenHash = ?
       LIMIT 1`,
      [tokenHash]
    );
  } catch (error: any) {
    // If database is not available, return null (user not authenticated)
    if (error?.code === 'ECONNRESET' || 
        error?.code === 'PROTOCOL_CONNECTION_LOST' ||
        error?.code === 'ETIMEDOUT' ||
        error?.code === 'ECONNREFUSED' ||
        error?.message?.includes('closed state')) {
      logger.warn("Database connection error in getSessionUserFromRequest query, returning null:", error?.code);
      return null;
    }
    // For other errors, rethrow
    throw error;
  }

  if (!row) return null;

  // Session نامحدود - بررسی expiration را حذف می‌کنیم
  // فقط اگر expiresAt وجود داشته باشد و منقضی شده باشد، آن را حذف می‌کنیم
  // (برای backward compatibility با sessions قدیمی)
  if (row.expiresAt) {
    const expires = new Date(row.expiresAt);
    if (!Number.isNaN(expires.getTime()) && expires.getTime() < Date.now()) {
      // Expired: delete it
      await runQuery(`DELETE FROM sessions WHERE tokenHash = ?`, [tokenHash]);
      return null;
    }
  }

  // Touch session (ignore errors - not critical)
  try {
    await runQuery(`UPDATE sessions SET lastSeenAt = ? WHERE id = ?`, [nowIso(), row.sessionId]);
  } catch (error: any) {
    // Ignore connection errors when touching session - not critical
    if (error?.code === 'ECONNRESET' || 
        error?.code === 'PROTOCOL_CONNECTION_LOST' ||
        error?.code === 'ETIMEDOUT' ||
        error?.code === 'ECONNREFUSED' ||
        error?.message?.includes('closed state')) {
      // Silent ignore - session touch is not critical
    } else {
      // Log other errors but don't fail
      logger.debug("Error touching session (non-critical):", error?.code);
    }
  }

  return {
    id: row.userId,
    name: row.name,
    phone: row.phone,
    role: row.role || "user",
    enabled: Boolean(row.enabled),
    createdAt: row.createdAt,
  };
}

export async function clearSession(request: NextRequest): Promise<void> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return;
  await ensureAuthTables();
  const tokenHash = sha256Hex(token);
  await runQuery(`DELETE FROM sessions WHERE tokenHash = ?`, [tokenHash]);
}

export function setSessionCookie(response: NextResponse, token: string, request: NextRequest) {
  const options = getSessionCookieOptions(request);
  
  // CRITICAL: In Next.js, we should ONLY use response.cookies.set()
  // Setting headers directly can cause conflicts
  // Make sure all options are explicitly set
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: options.secure,
    sameSite: options.sameSite,
    path: "/",
    maxAge: options.maxAge,
    // DO NOT set domain - it breaks localhost
    // DO NOT set expires - use maxAge instead
  });
  
  // Debug in development
  if (process.env.NODE_ENV === 'development') {
    const cookieValue = response.cookies.get(SESSION_COOKIE_NAME)?.value;
    const allCookies = response.cookies.getAll();
    console.log('[Session] Cookie set:', {
      name: SESSION_COOKIE_NAME,
      hasToken: !!token,
      tokenLength: token?.length,
      cookieValueInResponse: !!cookieValue,
      cookieValueMatches: cookieValue === token,
      maxAge: options.maxAge,
      expiresIn: "unlimited (until logout)",
      secure: options.secure,
      sameSite: options.sameSite,
      requestHost: request.nextUrl.hostname,
      requestProtocol: request.nextUrl.protocol,
      allCookiesCount: allCookies.length,
      cookieNames: allCookies.map(c => c.name),
    });
  }
}

export function clearSessionCookie(response: NextResponse, request: NextRequest) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    ...getSessionCookieOptions(request),
    maxAge: 0,
  });
}


