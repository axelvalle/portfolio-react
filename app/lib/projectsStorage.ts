/**
 * Capa de persistencia de proyectos en localStorage.
 * Funciones puras, sin React.
 *
 * Forma actual: array de Project con title/desc como { en, es }.
 * Migración automática desde formas anteriores (title/desc como string).
 */
import type { Project, LocalizedText } from "../types/projects";
import { defaultProjects } from "../i18n/sections";

const STORAGE_KEY = "portfolio:projects:v1";

export type StoredProjects = Project[];

function asLocalized(value: unknown, fallbackLang: "en" | "es" = "en"): LocalizedText {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const v = value as { en?: unknown; es?: unknown };
    return {
      en: typeof v.en === "string" ? v.en : "",
      es: typeof v.es === "string" ? v.es : "",
    };
  }
  if (typeof value === "string") {
    // Forma vieja: el string era del idioma principal del usuario que lo creó.
    // Lo asumimos como el idioma `fallbackLang` y dejamos el otro vacío
    // (el usuario puede traducirlo desde el editor).
    return { en: fallbackLang === "en" ? value : "", es: fallbackLang === "es" ? value : "" };
  }
  return { en: "", es: "" };
}



/**
 * Migra un valor desde la forma vieja (title/desc como string) a la nueva.
 * Si ya está en la forma nueva, lo devuelve igual.
 */
function migrate(p: unknown): Project | null {
  if (typeof p !== "object" || p === null) return null;
  const obj = p as Record<string, unknown>;
  if (typeof obj.id !== "string") return null;
  if (typeof obj.iconKey !== "string") return null;
  if (!Array.isArray(obj.techs)) return null;
  if (typeof obj.githubUrl !== "string") return null;
  if (!Array.isArray(obj.targetLangs)) return null;

  return {
    id: obj.id,
    iconKey: obj.iconKey as Project["iconKey"],
    title: asLocalized(obj.title, "es"),
    desc: asLocalized(obj.desc, "es"),
    techs: obj.techs as Project["techs"],
    githubUrl: obj.githubUrl,
    comingSoon: typeof obj.comingSoon === "boolean" ? obj.comingSoon : undefined,
    targetLangs: (obj.targetLangs as Project["targetLangs"]).filter(
      (l) => l === "en" || l === "es",
    ),
  };
}

function buildDefaults(): StoredProjects {
  // Solo necesitamos `defaultProjects.en` porque cada default ya tiene
  // title/desc en ambos idiomas.
  return defaultProjects.en.map((p) => ({
    ...p,
    id: crypto.randomUUID(),
  }));
}

/**
 * Carga los proyectos desde localStorage. Si está vacío, corrupto, o con
 * la forma vieja (objeto con claves en/es o title/desc como string), lo
 * migra o devuelve defaults.
 */
export function loadProjects(): StoredProjects {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildDefaults();

    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      // Forma vieja: { en: [], es: [] }. Migramos o devolvemos defaults.
      const legacy = parsed as { en?: unknown[]; es?: unknown[] };
      const merged: unknown[] = [];
      if (Array.isArray(legacy.en)) merged.push(...legacy.en);
      if (Array.isArray(legacy.es)) merged.push(...legacy.es);
      // Dedupe por id
      const seen = new Set<string>();
      const deduped = merged.filter((x) => {
        if (typeof x !== "object" || x === null) return false;
        const id = (x as { id?: unknown }).id;
        if (typeof id !== "string" || seen.has(id)) return false;
        seen.add(id);
        return true;
      });
      const migrated = deduped.map(migrate).filter((x): x is Project => x !== null);
      if (migrated.length === 0) return buildDefaults();
      return migrated;
    }

    const arr = parsed as unknown[];
    if (!Array.isArray(arr)) return buildDefaults();
    const migrated = arr.map(migrate);
    const valid = migrated.filter((x): x is Project => x !== null);
    if (valid.length === 0 && arr.length > 0) return buildDefaults();
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
    // ignorar
  }
}

export function resetProjects(): StoredProjects {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return buildDefaults();
}

export type { Project, ProjectInput, LocalizedText } from "../types/projects";