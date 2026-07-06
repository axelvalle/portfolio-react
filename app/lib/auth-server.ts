/**
 * Server-only auth primitives. No debe importarse desde archivos "use client".
 *
 * - Credenciales: leídas desde env vars (ADMIN_USER, ADMIN_PASSWORD_HASH).
 * - Sesión: token firmado con HMAC-SHA256 (AUTH_SECRET), guardado en cookie httpOnly.
 * - bcrypt para comparar password.
 *
 * Si AUTH_SECRET no está configurado, falla cerrado (todas las requests
 * devuelven 401). Si ADMIN_PASSWORD_HASH no está, también.
 */
import "server-only";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const COOKIE_NAME = "portfolio_auth";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 horas
const TOKEN_TTL_MS = COOKIE_MAX_AGE_SECONDS * 1000;

type SessionPayload = {
  username: string;
  exp: number; // ms epoch
};

function getEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

function failClosed(reason: string): never {
  throw new Error(`auth misconfigured: ${reason}`);
}

/** Lee el hash de la contraseña desde env, validando que exista. */
export function getAdminPasswordHash(): string {
  const hash = getEnv("ADMIN_PASSWORD_HASH");
  if (!hash) {
    failClosed("ADMIN_PASSWORD_HASH is not set");
  }
  return hash!;
}

export function getAdminUsername(): string {
  return getEnv("ADMIN_USER") ?? "admin";
}

/** Compara un password plano contra el hash bcrypt guardado en env. */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

/** Genera un secret HMAC de 32 bytes para firmar tokens. Si no hay AUTH_SECRET
 *  configurado, genera uno en memoria (útil en dev). En prod, configurar
 *  AUTH_SECRET en Vercel para que persista entre deploys. */
function getOrCreateSecret(): Buffer {
  const env = getEnv("AUTH_SECRET");
  if (env) return Buffer.from(env, "utf8");
  if (process.env.NODE_ENV === "production") {
    failClosed("AUTH_SECRET is not set in production");
  }
  // dev fallback: estable por proceso (no ideal pero permite probar)
  globalThis.__AUTH_DEV_SECRET__ ??= crypto.randomBytes(32);
  return globalThis.__AUTH_DEV_SECRET__;
}

declare global {
  var __AUTH_DEV_SECRET__: Buffer | undefined;
}

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? 0 : 4 - (s.length % 4);
  const base64 = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  return Buffer.from(base64, "base64");
}

/** Firma un payload y devuelve token en formato base64url(payload).signature. */
export function signSession(payload: SessionPayload): string {
  const json = Buffer.from(JSON.stringify(payload), "utf8");
  const body = b64url(json);
  const sig = crypto.createHmac("sha256", getOrCreateSecret()).update(body).digest();
  return `${body}.${b64url(sig)}`;
}

/** Verifica un token. Devuelve el payload si es válido y no expiró; null en
 *  cualquier otro caso. */
export function verifySession(token: string): SessionPayload | null {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = crypto.createHmac("sha256", getOrCreateSecret()).update(body).digest();
  let provided: Buffer;
  try {
    provided = b64urlDecode(sig);
  } catch {
    return null;
  }
  if (
    expected.length !== provided.length ||
    !crypto.timingSafeEqual(expected, provided)
  ) {
    return null;
  }

  let payload: SessionPayload;
  try {
    payload = JSON.parse(b64urlDecode(body).toString("utf8"));
  } catch {
    return null;
  }
  if (
    typeof payload.username !== "string" ||
    typeof payload.exp !== "number" ||
    payload.exp < Date.now()
  ) {
    return null;
  }
  return payload;
}

/** Lee la cookie de sesión actual y la verifica. */
export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export function buildSetCookie(value: string): {
  name: string;
  value: string;
  options: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "lax" | "strict" | "none";
    path: string;
    maxAge: number;
  };
} {
  return {
    name: COOKIE_NAME,
    value,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE_SECONDS,
    },
  };
}

export function buildClearCookie(): {
  name: string;
  value: string;
  options: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "lax" | "strict" | "none";
    path: string;
    maxAge: number;
  };
} {
  return {
    name: COOKIE_NAME,
    value: "",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    },
  };
}

export function makeSessionToken(username: string): string {
  return signSession({ username, exp: Date.now() + TOKEN_TTL_MS });
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;