"use client";

import { useEffect, useState, useCallback } from "react";
import type { ProjectInput } from "../types/projects";
import {
  loadProjects,
  saveProjects,
  resetProjects,
} from "../lib/projectsStorage";

/**
 * Hook de React para leer/escribir proyectos.
 * Los proyectos viven en `store` (un solo array global, no duplicado por idioma).
 * El filtro por idioma se hace en lectura, mirando `targetLangs`.
 *
 * Uso:
 *   const { projects, add, update, remove, reset } = useProjects(lang);
 *
 * El array `projects` devuelve los proyectos cuyo `targetLangs` incluye
 * el idioma activo.
 */
export function useProjects(lang: "en" | "es") {
  // Hidratación inicial: leer localStorage una sola vez al montar.
  const [store, setStore] = useState(() => loadProjects());

  // Persistir en cada cambio.
  useEffect(() => {
    saveProjects(store);
  }, [store]);

  // Sincronizar entre pestañas.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "portfolio:projects:v1") {
        setStore(loadProjects());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Filtrar proyectos visibles en el idioma activo.
  const projects = store.filter((p) => p.targetLangs.includes(lang));

  const add = useCallback((input: ProjectInput) => {
    const id = crypto.randomUUID();
    setStore((prev) => [...prev, { ...input, id }]);
  }, []);

  const update = useCallback((id: string, patch: Partial<ProjectInput>) => {
    setStore((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setStore((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const reset = useCallback(() => {
    setStore(resetProjects());
  }, []);

  return { projects, add, update, remove, reset };
}