"use client";

/**
 * Singleton store de autenticación.
 *
 * Antes había un `useAuth` por componente que leía/escribía sessionStorage
 * en su propio useState. Eso causaba que el Navbar y page.tsx tuvieran
 * estados independientes: cuando uno llamaba login(), el otro no se enteraba
 * hasta recargar la página.
 *
 * Esta implementación expone un store global (un único useState compartido)
 * con subscribe/notify, así todos los useAuth() en el árbol reflejan el
 * mismo valor instantáneamente.
 */
import { useEffect, useState, useSyncExternalStore, useCallback } from "react";
import {
  validateCredentials,
  persistSession,
  clearSession,
  getSession,
  type Session,
} from "../lib/auth";

// --- Singleton ---
type Listener = () => void;
let currentSession: Session | null = null;
const listeners = new Set<Listener>();

function setSession(next: Session | null) {
  currentSession = next;
  listeners.forEach((l) => l());
}

function subscribe(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function getSnapshot(): Session | null {
  return currentSession;
}

let initialized = false;
function ensureInit() {
  if (initialized) return;
  initialized = true;
  currentSession = getSession();
  if (typeof window !== "undefined") {
    // Sincronizar entre pestañas.
    window.addEventListener("storage", (e) => {
      if (e.key === "portfolio:auth:session:v2") {
        setSession(getSession());
      }
    });
  }
}

// --- Hook público ---
export function useAuth() {
  // Hidratación inicial (client-only).
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    ensureInit();
    setHydrated(true);
  }, []);

  // useSyncExternalStore: re-renderiza a todos los consumidores cuando
  // el singleton cambia, sin importar en qué componente estén.
  const session = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const login = useCallback((username: string, password: string): boolean => {
    ensureInit();
    if (!validateCredentials(username, password)) return false;
    const next: Session = { username, loggedInAt: Date.now() };
    persistSession(next);
    setSession(next);
    return true;
  }, []);

  const logout = useCallback(() => {
    ensureInit();
    clearSession();
    setSession(null);
  }, []);

  return {
    session,
    isAuthenticated: session !== null,
    hydrated,
    login,
    logout,
  };
}