import { NextResponse } from "next/server";
import { buildClearCookie } from "@/app/lib/auth-server";

export const runtime = "nodejs";

/**
 * POST /api/auth/logout
 * Limpia la cookie de sesión. Idempotente: si no hay sesión, igual 200.
 */
export async function POST() {
  const cookie = buildClearCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}