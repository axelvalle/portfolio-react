/**
 * Capa de persistencia de proyectos en localStorage.
 * Funciones puras, sin React — fáciles de testear y reusar fuera del hook.
 */
import type { Project } from "../types/projects";
import { defaultProjects } from "../i18n/sections";

const STORAGE_KEY = "portfolio:projects:v1";

/** Forma serializada: un solo array de proyectos con `targetLangs`. */
export type StoredProjects = Project[];

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
    Array.isArray(p.targetLangs) &&
    p.targetLangs.every((l) => l === "en" || l === "es")
  );
}

function buildDefaults(): StoredProjects {
  // Combinar defaults de en y es en un solo array (los duplicados con title idéntico
  // en ambos idiomas se toman una sola vez — son universales por defecto).
  // Como todos los defaults tienen targetLangs ["en","es"], están en ambos arrays.
  // Para no duplicar, los genero una sola vez tomando la versión en.
  return defaultProjects.en.map((p) => ({
    ...p,
    id: crypto.randomUUID(),
  }));
}

/**
 * Carga los proyectos desde localStorage. Si está vacío, corrupto, o con la
 * forma vieja (objeto con claves en/es), devuelve los defaults.
 */
export function loadProjects(): StoredProjects {
  if (typeof window === "undefined") {
    // SSR fallback: array vacío (no se renderiza nada durante el prerender).
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildDefaults();
    const parsed = JSON.parse(raw) as unknown;

    // Migración: si el storage viejo tenía la forma {en:[], es:[]}, descartamos.
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return buildDefaults();
    }

    const arr = parsed as unknown[];
    if (!Array.isArray(arr)) return buildDefaults();
    const valid = arr.filter(isProject);
    if (valid.length === 0 && arr.length > 0) return buildDefaults(); // corrupto
    return valid;
  } catch {
    return buildDefaults();
  }
}

export function saveProjects(data: StoredProjects): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage lleno o deshabilitado: ignorar.
  }
}

export function resetProjects(): StoredProjects {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return buildDefaults();
}

export type { Project, ProjectInput } from "../types/projects";