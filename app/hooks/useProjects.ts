"use client";

import { useEffect, useState, useCallback } from "react";
import type { ProjectInput } from "../types/projects";
import {
  loadProjects,
  saveProjects,
  resetProjects,
  type StoredByLang,
} from "../lib/projectsStorage";

/**
 * Hook de React para leer/escribir proyectos.
 * Sincroniza con localStorage y re-renderiza a todos los consumidores
 * cuando hay cambios (storage event + listener custom).
 *
 * Uso:
 *   const { projects, add, update, remove, reset } = useProjects(lang);
 *
 * El array `projects` devuelve los proyectos cuyo `lang` coincide con el idioma
 * actual O cuyo `lang` está vacío (universales).
 */
export function useProjects(lang: "en" | "es") {
  // Hidratación inicial: leer localStorage una sola vez al montar.
  const [store, setStore] = useState<StoredByLang>(() => loadProjects());

  // Persistir en cada cambio.
  useEffect(() => {
    saveProjects(store);
  }, [store]);

  // Sincronizar entre pestañas / múltiples componentes.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "portfolio:projects:v1") {
        setStore(loadProjects());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Devuelve proyectos del idioma actual + universales (lang === "").
  // Útil cuando el usuario crea un proyecto y quiere verlo en ambos idiomas.
  const projects = [
    ...store[lang],
    ...(lang === "en" ? store.es : store.en).filter((p) => p.lang === ""),
  ];

  const add = useCallback(
    (input: ProjectInput) => {
      const id = crypto.randomUUID();
      // Si el lang del input es "", se guarda en ambos arrays para que
      // aparezca independientemente del idioma activo.
      if (input.lang === "") {
        setStore((prev) => ({
          en: [...prev.en, { ...input, id, lang: "en" }],
          es: [...prev.es, { ...input, id, lang: "es" }],
        }));
      } else {
        setStore((prev) => ({
          ...prev,
          [lang]: [...prev[lang], { ...input, id }],
        }));
      }
    },
    [lang],
  );

  const update = useCallback(
    (id: string, patch: Partial<ProjectInput>) => {
      // Un proyecto "universal" tiene copias en en y es con el mismo id;
      // actualizamos ambas para mantener consistencia.
      setStore((prev) => {
        const next = { ...prev };
        const nextLang = patch.lang ?? lang;
        // Quitamos el id del idioma anterior si cambia.
        if (patch.lang !== undefined && patch.lang !== lang) {
          next[lang] = next[lang].filter((p) => p.id !== id);
          next[nextLang as "en" | "es"] = next[nextLang as "en" | "es"].map((p) =>
            p.id === id ? { ...p, ...patch } : p,
          );
        } else {
          // Actualización in-place: probar primero en el lang activo, luego en el otro.
          let found = false;
          next[lang] = next[lang].map((p) => {
            if (p.id === id) {
              found = true;
              return { ...p, ...patch };
            }
            return p;
          });
          if (!found) {
            const other = lang === "en" ? "es" : "en";
            next[other] = next[other].map((p) => (p.id === id ? { ...p, ...patch } : p));
          }
        }
        return next;
      });
    },
    [lang],
  );

  const remove = useCallback(
    (id: string) => {
      setStore((prev) => {
        const next = {
          en: prev.en.filter((p) => p.id !== id),
          es: prev.es.filter((p) => p.id !== id),
        };
        return next;
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setStore(resetProjects());
  }, []);

  return { projects, add, update, remove, reset };
}