/**
 * Capa de persistencia de proyectos en localStorage.
 * Funciones puras, sin React — fáciles de testear y reusar fuera del hook.
 */
import type { Project, ProjectInput } from "../types/projects";
import { defaultProjects } from "../i18n/sections";

const STORAGE_KEY = "portfolio:projects:v1";

type StoredByLang = Record<"en" | "es", Project[]>;

function isProject(value: unknown): value is Project {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.title === "string" &&
    typeof p.desc === "string" &&
    Array.isArray(p.techs) &&
    typeof p.iconKey === "string" &&
    typeof p.githubUrl === "string" &&
    (p.lang === "en" || p.lang === "es" || p.lang === "")
  );
}

function buildDefaults(): StoredByLang {
  // Asignamos ids estables a los defaults para que sean editables
  // y la key de React no cambie entre renders.
  return {
    en: defaultProjects.en.map((p) => ({ ...p, id: crypto.randomUUID() })),
    es: defaultProjects.es.map((p) => ({ ...p, id: crypto.randomUUID() })),
  };
}

/**
 * Carga los proyectos desde localStorage. Si está vacío o corrupto,
 * devuelve los defaults (generados con ids frescos).
 */
export function loadProjects(): StoredByLang {
  if (typeof window === "undefined") {
    // SSR fallback: devolver defaults sin ids (no se renderizan ids en SSR).
    return { en: [], es: [] };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildDefaults();
    const parsed = JSON.parse(raw) as Partial<StoredByLang>;
    if (!parsed.en || !parsed.es) return buildDefaults();
    // Validación básica: si algo no calza como Project, descartamos y usamos defaults.
    const validEn = (parsed.en as unknown[]).filter(isProject);
    const validEs = (parsed.es as unknown[]).filter(isProject);
    if (validEn.length === 0 && validEs.length === 0) return buildDefaults();
    return { en: validEn, es: validEs };
  } catch {
    return buildDefaults();
  }
}

export function saveProjects(data: StoredByLang): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage lleno o deshabilitado: ignoramos silenciosamente.
  }
}

export function resetProjects(): StoredByLang {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return buildDefaults();
}

export type { Project, ProjectInput };
export type { StoredByLang };