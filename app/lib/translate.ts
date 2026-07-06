"use client";

/**
 * Cliente de traducción usando MyMemory (https://mymemory.translated.net).
 *
 * - Gratis sin signup, ~5000 chars/día por IP. Con email en `de` sube a 50000.
 * - CORS abierto: se puede llamar directo desde el browser.
 * - Calidad: combina memoria humana + MT. Buena para textos cortos.
 *
 * Si el día de mañana se quiere cambiar a Google/DeepL, solo se reemplaza
 * la implementación de `translateText` con un fetch a su endpoint.
 */

const MYMEMORY_ENDPOINT = "https://api.mymemory.translated.net/get";

export type TranslateLang = "en" | "es";

/** Cache simple en memoria para no repetir requests. Key: langPair + texto. */
const cache = new Map<string, string>();

function cacheKey(text: string, from: TranslateLang, to: TranslateLang): string {
  return `${from}->${to}::${text}`;
}

export async function translateText(
  text: string,
  from: TranslateLang,
  to: TranslateLang,
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";
  if (from === to) return trimmed;

  const key = cacheKey(trimmed, from, to);
  const cached = cache.get(key);
  if (cached) return cached;

  const url = new URL(MYMEMORY_ENDPOINT);
  url.searchParams.set("q", trimmed);
  url.searchParams.set("langpair", `${from}|${to}`);

  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) {
    throw new Error(`MyMemory HTTP ${res.status}`);
  }
  const json = (await res.json()) as {
    responseStatus?: number | string;
    responseData?: { translatedText?: string };
  };

  const translated = json.responseData?.translatedText;
  if (!translated) {
    throw new Error("MyMemory no devolvió traducción");
  }

  cache.set(key, translated);
  return translated;
}

/** Traduce múltiples textos preservando el orden. Si alguno falla, devuelve
 * el original en su lugar (graceful degradation). */
export async function translateBatch(
  texts: string[],
  from: TranslateLang,
  to: TranslateLang,
): Promise<string[]> {
  return Promise.all(
    texts.map((t) =>
      translateText(t, from, to).catch(() => t),
    ),
  );
}

/** Limpia el cache (útil si se quiere forzar re-fetch). */
export function clearTranslationCache(): void {
  cache.clear();
}