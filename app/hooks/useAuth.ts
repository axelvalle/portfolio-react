"use client";

/**
 * Hook de autenticación que consulta el endpoint server-side `/api/auth/me`.
 *
 * La cookie httpOnly + el token firmado viven en el servidor. El cliente
 * nunca tiene acceso al token ni a la contraseña. Solo hace fetch a `/api/auth/me`
 * para saber si está logueado, y a `/api/auth/login` o `/api/auth/logout`
 * para cambiar el estado.
 */
import { useEffect, useState, useSyncExternalStore, useCallback } from "react";

type AuthState = {
  status: "loading" | "authed" | "anonymous";
  username: string | null;
};

// --- Singleton store ---
let current: AuthState = { status: "loading", username: null };
const listeners = new Set<() => void>();

function setState(next: AuthState) {
  current = next;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function getSnapshot(): AuthState {
  return current;
}

/** Refresca el estado desde el servidor. Llamado en mount y después de login/logout. */
export async function refreshAuth(): Promise<void> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "same-origin" });
    if (!res.ok) {
      setState({ status: "anonymous", username: null });
      return;
    }
    const data = (await res.json()) as { authenticated: boolean; username?: string };
    if (data.authenticated && data.username) {
      setState({ status: "authed", username: data.username });
    } else {
      setState({ status: "anonymous", username: null });
    }
  } catch {
    setState({ status: "anonymous", username: null });
  }
}

// --- Hook público ---
export function useAuth() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    // Disparar el primer fetch si todavía estamos en loading
    if (current.status === "loading") {
      refreshAuth();
    }
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
          credentials: "same-origin",
        });
        if (!res.ok) {
          // estado sigue como está
          return false;
        }
        await refreshAuth();
        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } catch {
      // ignorar
    }
    setState({ status: "anonymous", username: null });
  }, []);

  return {
    session: state.status === "authed" ? { username: state.username! } : null,
    isAuthenticated: state.status === "authed",
    isLoading: state.status === "loading",
    hydrated,
    login,
    logout,
  };
}