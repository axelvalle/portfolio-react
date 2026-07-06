"use client";

import { useEffect, useState } from "react";
import { FaTimes, FaTrash, FaPlus, FaLanguage } from "react-icons/fa";
import type { Project, ProjectInput, TechBadge, ProjectIconKey, LocalizedText } from "../types/projects";
import { projectIcons } from "../iconRegistry";
import { translateText } from "../lib/translate";

const ICON_KEYS: ProjectIconKey[] = ["medical", "mobile", "brush", "university"];

const EMPTY_TEXT: LocalizedText = { en: "", es: "" };

type Draft = Omit<ProjectInput, "techs" | "title" | "desc" | "targetLangs"> & {
  title: LocalizedText;
  desc: LocalizedText;
  techs: TechBadge[];
};

function emptyDraft(): Draft {
  return {
    iconKey: "mobile",
    title: { ...EMPTY_TEXT },
    desc: { ...EMPTY_TEXT },
    techs: [],
    githubUrl: "",
    comingSoon: false,
  };
}

export default function ProjectEditorModal({
  open,
  onClose,
  onSave,
  onDelete,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (input: ProjectInput) => void;
  onDelete?: (id: string) => void;
  initial?: Project | null;
}) {
  const [draft, setDraft] = useState<Draft>(() =>
    initial
      ? {
          iconKey: initial.iconKey,
          title: { ...initial.title },
          desc: { ...initial.desc },
          techs: initial.techs,
          githubUrl: initial.githubUrl,
          comingSoon: initial.comingSoon ?? false,
        }
      : emptyDraft(),
  );
  const [error, setError] = useState<string | null>(null);
  const [translating, setTranslating] = useState<null | "es->en" | "en->es">(null);

  useEffect(() => {
    if (open) {
      setDraft(
        initial
          ? {
              iconKey: initial.iconKey,
              title: { ...initial.title },
              desc: { ...initial.desc },
              techs: initial.techs,
              githubUrl: initial.githubUrl,
              comingSoon: initial.comingSoon ?? false,
            }
: emptyDraft(),
      );
      setError(null);
      setTranslating(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial?.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const updateField = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const updateText = (
    field: "title" | "desc",
    langKey: "en" | "es",
    value: string,
  ) => {
    setDraft((d) => ({
      ...d,
      [field]: { ...d[field], [langKey]: value },
    }));
  };

  /**
   * Traduce el par title/desc de un idioma al otro.
   * Elige el idioma fuente según cuál tenga más contenido.
   */
  const handleTranslate = async (direction: "es->en" | "en->es") => {
    setError(null);
    const source = direction === "es->en" ? "es" : "en";
    const target = direction === "es->en" ? "en" : "es";
    const sourceTitle = draft.title[source].trim();
    const sourceDesc = draft.desc[source].trim();
    if (!sourceTitle && !sourceDesc) {
      setError(`Primero escribe el título y descripción en ${source.toUpperCase()}.`);
      return;
    }
    setTranslating(direction);
    try {
      const [newTitle, newDesc] = await Promise.all([
        sourceTitle
          ? translateText(sourceTitle, source, target)
          : Promise.resolve(""),
        sourceDesc
          ? translateText(sourceDesc, source, target)
          : Promise.resolve(""),
      ]);
      setDraft((d) => ({
        ...d,
        title: { ...d.title, [target]: newTitle || d.title[target] },
        desc: { ...d.desc, [target]: newDesc || d.desc[target] },
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? `No se pudo traducir: ${err.message}`
          : "No se pudo traducir. Revisa tu conexión.",
      );
    } finally {
      setTranslating(null);
    }
  };

  const addTech = () => {
    setDraft((d) => ({
      ...d,
      techs: [...d.techs, { name: "", color: "#23272f" }],
    }));
  };

  const updateTech = (idx: number, patch: Partial<TechBadge>) => {
    setDraft((d) => ({
      ...d,
      techs: d.techs.map((t, i) => (i === idx ? { ...t, ...patch } : t)),
    }));
  };

  const removeTech = (idx: number) => {
    setDraft((d) => ({ ...d, techs: d.techs.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar que al menos un idioma tenga título y descripción.
    const langs: ("en" | "es")[] = ["en", "es"];
    const hasContent = langs.some(
      (l) => draft.title[l].trim() !== "" && draft.desc[l].trim() !== "",
    );
    if (!hasContent) {
      setError("El título y la descripción son obligatorios en al menos un idioma.");
      return;
    }

    if (!draft.comingSoon && draft.githubUrl && !/^https?:\/\//.test(draft.githubUrl)) {
      setError("La URL de GitHub debe empezar con http(s)://");
      return;
    }

    const cleanTechs = draft.techs.filter((t) => t.name.trim() !== "");

    // Derivar targetLangs automáticamente del contenido: aparece en un idioma
    // solo si title y desc están no vacíos en ese idioma.
    const derived: ("en" | "es")[] = [];
    if (draft.title.en.trim() && draft.desc.en.trim()) derived.push("en");
    if (draft.title.es.trim() && draft.desc.es.trim()) derived.push("es");

    onSave({
      iconKey: draft.iconKey,
      title: { en: draft.title.en.trim(), es: draft.title.es.trim() },
      desc: { en: draft.desc.en.trim(), es: draft.desc.es.trim() },
      techs: cleanTechs,
      githubUrl: draft.githubUrl.trim(),
      comingSoon: draft.comingSoon,
      targetLangs: derived,
    });
  };

  const isEdit = Boolean(initial);
  const IconPreview = projectIcons[draft.iconKey];
  const hasEs = draft.title.es.trim() !== "" && draft.desc.es.trim() !== "";
  const hasEn = draft.title.en.trim() !== "" && draft.desc.en.trim() !== "";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-editor-title"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#181818]/95 backdrop-blur-md rounded-2xl border border-[#FF8C1A]/30 shadow-2xl p-6 sm:p-7 animate-fade-float"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full text-[#DCDCDC] hover:text-[#FF8C1A] hover:bg-[#FF8C1A]/10 transition-colors"
        >
          <FaTimes />
        </button>

        <h2
          id="project-editor-title"
          className="text-2xl font-extrabold text-[#FF8C1A] tracking-tight mb-1"
        >
          {isEdit ? "Editar proyecto" : "Nuevo proyecto"}
        </h2>
        <p className="text-sm text-[#DCDCDC] mb-5">
          Llena los campos en al menos un idioma. Usa el botón de auto-traducción para completar el otro.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Icono */}
          <div>
            <label className="block text-sm font-medium text-[#F3F3F3] mb-2">Icono</label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#0A0A0A]/80 border border-[#FF8C1A]/30 flex items-center justify-center shrink-0">
                {IconPreview && <IconPreview size={24} className="text-[#25c6f9]" />}
              </div>
              <div className="grid grid-cols-4 gap-2 flex-1">
                {ICON_KEYS.map((key) => {
                  const Ico = projectIcons[key];
                  const active = draft.iconKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => updateField("iconKey", key)}
                      className={`p-2 rounded-lg border transition-all ${
                        active
                          ? "border-[#FF8C1A] bg-[#FF8C1A]/10"
                          : "border-[#FF8C1A]/20 hover:border-[#FF8C1A]/50 bg-[#0A0A0A]/60"
                      }`}
                      aria-label={`Icono ${key}`}
                      aria-pressed={active}
                    >
                      <Ico size={20} className="text-[#25c6f9] mx-auto" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Título + Descripción: campos en ES */}
          <fieldset className="rounded-xl border border-[#FF8C1A]/20 p-4 space-y-3">
            <legend className="px-2 text-xs font-semibold text-[#FF8C1A]">🇪🇸 Español</legend>

            <div>
              <label htmlFor="pe-title-es" className="block text-sm font-medium text-[#F3F3F3] mb-1">
                Título (ES)
              </label>
              <input
                id="pe-title-es"
                type="text"
                value={draft.title.es}
                onChange={(e) => updateText("title", "es", e.target.value)}
                placeholder='ej. "StockFlow Mama Pola"'
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A]/80 text-white placeholder-[#777] border border-[#FF8C1A]/20 focus:border-[#FF8C1A] focus:outline-none focus:ring-1 focus:ring-[#FF8C1A] transition"
              />
            </div>

            <div>
              <label htmlFor="pe-desc-es" className="block text-sm font-medium text-[#F3F3F3] mb-1">
                Descripción (ES)
              </label>
              <textarea
                id="pe-desc-es"
                value={draft.desc.es}
                onChange={(e) => updateText("desc", "es", e.target.value)}
                rows={3}
                placeholder="App móvil de inventario..."
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A]/80 text-white placeholder-[#777] border border-[#FF8C1A]/20 focus:border-[#FF8C1A] focus:outline-none focus:ring-1 focus:ring-[#FF8C1A] transition resize-none"
              />
            </div>

            <button
              type="button"
              onClick={() => handleTranslate("es->en")}
              disabled={translating !== null || !hasEs}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#FF8C1A]/10 border border-[#FF8C1A]/30 text-[#FF8C1A] text-sm font-medium hover:bg-[#FF8C1A]/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <FaLanguage />
              {translating === "es->en" ? "Traduciendo..." : "Traducir al inglés"}
            </button>
          </fieldset>

          {/* Título + Descripción: campos en EN */}
          <fieldset className="rounded-xl border border-[#FF8C1A]/20 p-4 space-y-3">
            <legend className="px-2 text-xs font-semibold text-[#FF8C1A]">🇺🇸 English</legend>

            <div>
              <label htmlFor="pe-title-en" className="block text-sm font-medium text-[#F3F3F3] mb-1">
                Title (EN)
              </label>
              <input
                id="pe-title-en"
                type="text"
                value={draft.title.en}
                onChange={(e) => updateText("title", "en", e.target.value)}
                placeholder='e.g. "StockFlow Mama Pola"'
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A]/80 text-white placeholder-[#777] border border-[#FF8C1A]/20 focus:border-[#FF8C1A] focus:outline-none focus:ring-1 focus:ring-[#FF8C1A] transition"
              />
            </div>

            <div>
              <label htmlFor="pe-desc-en" className="block text-sm font-medium text-[#F3F3F3] mb-1">
                Description (EN)
              </label>
              <textarea
                id="pe-desc-en"
                value={draft.desc.en}
                onChange={(e) => updateText("desc", "en", e.target.value)}
                rows={3}
                placeholder="Mobile inventory app..."
                className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A]/80 text-white placeholder-[#777] border border-[#FF8C1A]/20 focus:border-[#FF8C1A] focus:outline-none focus:ring-1 focus:ring-[#FF8C1A] transition resize-none"
              />
            </div>

            <button
              type="button"
              onClick={() => handleTranslate("en->es")}
              disabled={translating !== null || !hasEn}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#FF8C1A]/10 border border-[#FF8C1A]/30 text-[#FF8C1A] text-sm font-medium hover:bg-[#FF8C1A]/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <FaLanguage />
              {translating === "en->es" ? "Traduciendo..." : "Translate to Spanish"}
            </button>
          </fieldset>

          {/* URL GitHub */}
          <div>
            <label htmlFor="pe-github" className="block text-sm font-medium text-[#F3F3F3] mb-1">
              URL GitHub
            </label>
            <input
              id="pe-github"
              type="url"
              value={draft.githubUrl}
              onChange={(e) => updateField("githubUrl", e.target.value)}
              placeholder="https://github.com/usuario/repo"
              disabled={draft.comingSoon}
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A]/80 text-white placeholder-[#777] border border-[#FF8C1A]/20 focus:border-[#FF8C1A] focus:outline-none focus:ring-1 focus:ring-[#FF8C1A] transition disabled:opacity-50"
            />
          </div>

          {/* Coming soon */}
          <label className="flex items-center gap-2 text-sm text-[#F3F3F3] cursor-pointer">
            <input
              type="checkbox"
              checked={draft.comingSoon}
              onChange={(e) => updateField("comingSoon", e.target.checked)}
              className="w-4 h-4 accent-[#FF8C1A]"
            />
            Marcar como &quot;Coming soon&quot;
          </label>

          {/* Techs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-[#F3F3F3]">Tecnologías</label>
              <button
                type="button"
                onClick={addTech}
                className="text-xs flex items-center gap-1 px-2 py-1 rounded-full bg-[#FF8C1A]/15 text-[#FF8C1A] hover:bg-[#FF8C1A]/25 transition"
              >
                <FaPlus size={10} /> Agregar
              </button>
            </div>
            <div className="space-y-2">
              {draft.techs.length === 0 && (
                <p className="text-xs text-[#777] italic">Sin tecnologías. Agregá una con el botón.</p>
              )}
              {draft.techs.map((tech, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tech.color}
                    onChange={(e) => updateTech(i, { color: e.target.value })}
                    aria-label={`Color ${tech.name || i}`}
                    className="w-8 h-8 rounded border border-[#FF8C1A]/20 bg-transparent cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={tech.name}
                    onChange={(e) => updateTech(i, { name: e.target.value })}
                    placeholder="ej. Flutter"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#0A0A0A]/80 text-white text-sm placeholder-[#777] border border-[#FF8C1A]/20 focus:border-[#FF8C1A] focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => removeTech(i)}
                    aria-label={`Quitar ${tech.name || i}`}
                    className="p-2 rounded-lg text-[#DCDCDC] hover:text-red-400 hover:bg-red-500/10 transition"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2"
            >
              {error}
            </div>
          )}

          {/* Acciones */}
          <div className="flex items-center justify-between pt-2 border-t border-[#FF8C1A]/20">
            <div>
              {isEdit && onDelete && initial && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`¿Eliminar "${initial.title.es || initial.title.en}"?`)) {
                      onDelete(initial.id);
                    }
                  }}
                  className="text-sm text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/10 transition"
                >
                  Eliminar
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-sm text-[#DCDCDC] hover:text-white hover:bg-white/5 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#FF8C1A] to-[#FFB300] text-black font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
              >
                {isEdit ? "Guardar" : "Crear"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}