import { NextRequest, NextResponse } from "next/server";
import {
  getAdminPasswordHash,
  getAdminUsername,
  verifyPassword,
  makeSessionToken,
  buildSetCookie,
} from "@/app/lib/auth-server";

export const runtime = "nodejs";

/**
 * POST /api/auth/login
 * Body: { username: string, password: string }
 *
 * Valida credenciales con bcrypt. Si OK, devuelve cookie httpOnly con
 * token firmado HMAC-SHA256. La contraseña NUNCA aparece en la response.
 *
 * Devuelve siempre 401 ante credenciales inválidas (mismo mensaje para
 * username inexistente vs password incorrecto -> evita user enumeration).
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const username = typeof (body as { username?: unknown })?.username === "string"
    ? (body as { username: string }).username.trim()
    : "";
  const password = typeof (body as { password?: unknown })?.password === "string"
    ? (body as { password: string }).password
    : "";

  if (!username || !password) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  // Hash siempre: evita timing attack que distinga "usuario no existe"
  // de "password incorrecto". Para usuarios inexistentes comparamos contra
  // un hash dummy (mismo costo).
  const DUMMY_HASH = "$2a$10$CwTycUXTWue0Thq9StjUM0uJ8D7b5qK9PXHnF9.4Yp4rUpQp4rUp";
  const targetHash =
    username === getAdminUsername() ? getAdminPasswordHash() : DUMMY_HASH;

  const ok = await verifyPassword(password, targetHash);
  if (!ok || username !== getAdminUsername()) {
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  const token = makeSessionToken(username);
  const cookie = buildSetCookie(token);
  const res = NextResponse.json({ ok: true, username });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}