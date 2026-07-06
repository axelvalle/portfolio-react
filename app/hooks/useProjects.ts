"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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

  // Flag para evitar que el mismo `id` se elimine dos veces seguidas.
  // Defensa contra el bug que reportaste: 'se eliminan 2' puede pasar si
  // un doble-click o un re-render del modal dispara handleDelete dos veces.
  const removingRef = useRef<Set<string>>(new Set());

  const remove = useCallback((id: string) => {
    if (removingRef.current.has(id)) {
      // Ya estamos eliminando este id; ignorar segundo llamado.
      return;
    }
    removingRef.current.add(id);
    setStore((prev) => prev.filter((p) => p.id !== id));
    // Limpia el flag después de un tick para permitir re-eliminar si vuelve.
    setTimeout(() => {
      removingRef.current.delete(id);
    }, 0);
  }, []);

  const reset = useCallback(() => {
    setStore(resetProjects());
  }, []);

  return { projects, add, update, remove, reset };
}