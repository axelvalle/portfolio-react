"use client";

import { useEffect, useState, useCallback } from "react";
import {
  validateCredentials,
  persistSession,
  clearSession,
  getSession,
  type Session,
} from "../lib/auth";

/**
 * Hook de autenticación para el demo.
 * Devuelve la sesión actual + login/logout.
 */
export function useAuth() {
  // Inicialización lazy: leer localStorage al montar (client-only).
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Limpiar la key vieja de localStorage (v1) para no acumular basura
    // de la versión anterior que sí persistía.
    try {
      window.localStorage.removeItem("portfolio:auth:session:v1");
    } catch {
      // ignorar
    }

    setSession(getSession());
    setHydrated(true);

    // Sincronizar logout/login entre pestañas (sessionStorage también dispara storage event).
    const onStorage = (e: StorageEvent) => {
      if (e.key === "portfolio:auth:session:v2") {
        setSession(getSession());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    if (!validateCredentials(username, password)) return false;
    const next: Session = { username, loggedInAt: Date.now() };
    persistSession(next);
    setSession(next);
    return true;
  }, []);

  const logout = useCallback(() => {
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