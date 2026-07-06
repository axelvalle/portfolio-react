"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Envuelve contenido traducible y le aplica un cross-fade cuando cambia el idioma.
 * El contenido viejo hace fade-out (120ms), luego el nuevo hace fade-in (180ms).
 *
 * @param lang Clave de idioma actual ("en" | "es")
 * @param children Contenido a renderizar
 */
export default function LangFade({ lang, children }: { lang: string; children: React.ReactNode }) {
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const [displayLang, setDisplayLang] = useState(lang);
  const prevLang = useRef(lang);

  useEffect(() => {
    if (prevLang.current === lang) return;
    prevLang.current = lang;

    setPhase("out");
    const outTimer = setTimeout(() => {
      setDisplayLang(lang);
      setPhase("in");
      const inTimer = setTimeout(() => setPhase("idle"), 180);
      // cleanup del inTimer si el componente se desmonta
      return () => clearTimeout(inTimer);
    }, 120);

    return () => clearTimeout(outTimer);
  }, [lang]);

  const opacity = phase === "out" ? 0 : 1;
  const translateY = phase === "out" ? "-6px" : "0";

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY})`,
        transition: phase === "out" ? "opacity 120ms ease-in, transform 120ms ease-in" : "opacity 180ms ease-out, transform 180ms ease-out",
      }}
      // Forzar remount del subtree cuando cambia el idioma para que los textos
      // se actualicen sin esperar al cambio de props (en algunas secciones el copy
      // se computa dentro del render, así que cambiar displayLang ya basta).
      key={displayLang}
    >
      {children}
    </div>
  );
}