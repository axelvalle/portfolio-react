import { NextResponse } from "next/server";
import { getCurrentSession } from "@/app/lib/auth-server";

export const runtime = "nodejs";

/**
 * GET /api/auth/me
 * Devuelve el estado de autenticación actual leyendo la cookie firmada.
 * El cliente usa esto en lugar de leer localStorage.
 */
export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
  return NextResponse.json({
    authenticated: true,
    username: session.username,
  });
}