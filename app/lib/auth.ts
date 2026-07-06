/**
 * Capa de autenticación — versión DEMO hardcoded.
 *
 * ⚠️ NO usar en producción. Las credenciales viajan y se almacenan en el cliente.
 *
 * Cuando se integre con backend real, reemplazar `validateCredentials` por un
 * fetch a /api/auth/login y guardar el token en lugar de un boolean.
 */

// ⚠️ Credenciales de demo — cámbialas si querés.
export const DEMO_USERNAME = "axel";
export const DEMO_PASSWORD = "axel2024";

// Usamos sessionStorage (no localStorage) para que la sesión muera
// automáticamente al cerrar la pestaña. No sobrevive a recargas.
const SESSION_KEY = "portfolio:auth:session:v2";

export type Session = {
  username: string;
  loggedInAt: number; // timestamp ms
};

export function validateCredentials(username: string, password: string): boolean {
  return username === DEMO_USERNAME && password === DEMO_PASSWORD;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (typeof parsed.username !== "string" || typeof parsed.loggedInAt !== "number") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function persistSession(session: Session): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // localStorage lleno o deshabilitado: ignorar.
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignorar
  }
}