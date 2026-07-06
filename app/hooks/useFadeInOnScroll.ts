"use client";

import { useEffect, useState } from "react";

/**
 * Hook que observa una lista de elementos del DOM identificados por `${prefix}-${i}`
 * y devuelve un array de booleanos indicando la visibilidad de cada uno.
 *
 * Usa un solo IntersectionObserver compartido (no N observers), lo cual es
 * significativamente más liviano para listas grandes.
 *
 * @param prefix Prefijo de los IDs (e.g. "project-card")
 * @param count Número total de elementos esperados
 * @param threshold Umbral de visibilidad (0..1). Default 0.2.
 */
export function useFadeInOnScroll(prefix: string, count: number, threshold = 0.2) {
  const [visible, setVisible] = useState<boolean[]>(() => Array(count).fill(false));

  useEffect(() => {
    const elements: HTMLElement[] = [];
    for (let i = 0; i < count; i++) {
      const el = document.getElementById(`${prefix}-${i}`);
      if (el) elements.push(el);
    }
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = [...prev];
          let changed = false;
          for (const entry of entries) {
            const id = entry.target.id;
            const idx = Number(id.slice(prefix.length + 1));
            if (!Number.isNaN(idx) && next[idx] !== entry.isIntersecting) {
              next[idx] = entry.isIntersecting;
              changed = true;
            }
          }
          return changed ? next : prev;
        });
      },
      { threshold },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [prefix, count, threshold]);

  return visible;
}