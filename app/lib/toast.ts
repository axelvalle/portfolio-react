"use client";

/**
 * Sistema de toasts singleton. Cualquier componente puede llamar
 * `notify({...})` y aparece arriba a la derecha con fade-in/out.
 */
import { useEffect, useState, useSyncExternalStore, useCallback } from "react";

export type ToastKind = "success" | "error" | "info";
export type Toast = {
  id: number;
  kind: ToastKind;
  message: string;
};

let counter = 0;
let currentToasts: Toast[] = [];
const listeners = new Set<() => void>();
const timers = new Map<number, ReturnType<typeof setTimeout>>();

function notify(toasts: Toast[]) {
  currentToasts = toasts;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function getSnapshot(): Toast[] {
  return currentToasts;
}

const AUTO_DISMISS_MS = 3200;

export function showToast(kind: ToastKind, message: string) {
  const id = ++counter;
  const next = [...currentToasts, { id, kind, message }];
  notify(next);
  const t = setTimeout(() => {
    timers.delete(id);
    notify(currentToasts.filter((x) => x.id !== id));
  }, AUTO_DISMISS_MS);
  timers.set(id, t);
}

export function dismissToast(id: number) {
  const t = timers.get(id);
  if (t) {
    clearTimeout(t);
    timers.delete(id);
  }
  notify(currentToasts.filter((x) => x.id !== id));
}

/**
 * Hook opcional por si algún componente quiere reaccionar a toasts.
 * La mayoría solo necesita llamar `showToast(...)`.
 */
export function useToasts() {
  const toasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return { toasts, hydrated };
}

// Suppress unused warning if not consumed locally.
void useCallback;