import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getRow, runQuery } from "@/lib/db/index";
import { AppError } from "@/lib/api-error-handler";

export const SESSION_COOKIE_NAME = "saded_session";

const SESSION_DAYS = 30;

function nowIso(): string {
  // MySQL friendly datetime (YYYY-MM-DD HH:mm:ss)
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function isHttpsRequest(request: NextRequest): boolean {
  const proto = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "");
  return proto === "https";
}

export function getSessionCookieOptions(request: NextRequest) {
  // Important: if your site is served over http (Not secure), Secure cookies won't set.
  const secure = process.env.NODE_ENV === "production" ? isHttpsRequest(request) : false;
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}

export async function ensureAuthTables(): Promise<void> {
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

  // Sessions table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(255) PRIMARY KEY,
      userId VARCHAR(255) NOT NULL,
      tokenHash CHAR(64) NOT NULL,
      expiresAt TIMESTAMP NOT NULL,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastSeenAt TIMESTAMP NULL DEFAULT NULL,
      userAgent VARCHAR(255) NULL DEFAULT NULL,
      ip VARCHAR(64) NULL DEFAULT NULL,
      UNIQUE KEY uniq_sessions_tokenHash (tokenHash),
      KEY idx_sessions_userId (userId),
      KEY idx_sessions_expiresAt (expiresAt)
    )
  `);
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
  const expiresAt = addDays(new Date(), SESSION_DAYS);

  const ua = request.headers.get("user-agent");
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;

  await runQuery(
    `INSERT INTO sessions (id, userId, tokenHash, expiresAt, createdAt, lastSeenAt, userAgent, ip)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sessionId,
      userId,
      tokenHash,
      expiresAt.toISOString().slice(0, 19).replace("T", " "),
      nowIso(),
      nowIso(),
      ua || null,
      ip,
    ]
  );

  return token;
}

export async function getSessionUserFromRequest(request: NextRequest): Promise<SessionUser | null> {
  await ensureAuthTables();

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = sha256Hex(token);
  const row = await getRow<{
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

  if (!row) return null;

  const expires = new Date(row.expiresAt);
  if (Number.isNaN(expires.getTime()) || expires.getTime() < Date.now()) {
    // Expired: delete it
    await runQuery(`DELETE FROM sessions WHERE tokenHash = ?`, [tokenHash]);
    return null;
  }

  // Touch session
  await runQuery(`UPDATE sessions SET lastSeenAt = ? WHERE id = ?`, [nowIso(), row.sessionId]);

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
  const tokenHash = sha256Hex(token);
  await runQuery(`DELETE FROM sessions WHERE tokenHash = ?`, [tokenHash]);
}

export function setSessionCookie(response: NextResponse, token: string, request: NextRequest) {
  response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions(request));
}

export function clearSessionCookie(response: NextResponse, request: NextRequest) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    ...getSessionCookieOptions(request),
    maxAge: 0,
  });
}


