"use client";

import { useEffect, useState } from "react";
import { FaTimes, FaTrash, FaPlus } from "react-icons/fa";
import type { Project, ProjectInput, TechBadge, ProjectIconKey } from "../types/projects";
import { projectIcons } from "../iconRegistry";

const ICON_KEYS: ProjectIconKey[] = ["medical", "mobile", "brush", "university"];

type Draft = Omit<ProjectInput, "techs"> & { techs: TechBadge[] };

function emptyDraft(lang: "en" | "es"): Draft {
  return {
    iconKey: "mobile",
    title: "",
    desc: "",
    techs: [],
    githubUrl: "",
    comingSoon: false,
    lang,
  };
}

export default function ProjectEditorModal({
  open,
  onClose,
  onSave,
  onDelete,
  initial,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (input: ProjectInput) => void;
  onDelete?: (id: string) => void;
  initial?: Project | null;
  lang: "en" | "es";
}) {
  const [draft, setDraft] = useState<Draft>(() =>
    initial
      ? {
          iconKey: initial.iconKey,
          title: initial.title,
          desc: initial.desc,
          techs: initial.techs,
          githubUrl: initial.githubUrl,
          comingSoon: initial.comingSoon ?? false,
          lang: initial.lang || lang,
        }
      : emptyDraft(lang),
  );
  const [error, setError] = useState<string | null>(null);

  // Reset al abrir/cambiar initial.
  useEffect(() => {
    if (open) {
      setDraft(
        initial
          ? {
              iconKey: initial.iconKey,
              title: initial.title,
              desc: initial.desc,
              techs: initial.techs,
              githubUrl: initial.githubUrl,
              comingSoon: initial.comingSoon ?? false,
              lang: initial.lang || lang,
            }
          : emptyDraft(lang),
      );
      setError(null);
    }
  }, [open, initial, lang]);

  // Esc para cerrar.
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

    if (!draft.title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    if (!draft.desc.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }
    if (!draft.comingSoon && draft.githubUrl && !/^https?:\/\//.test(draft.githubUrl)) {
      setError("La URL de GitHub debe empezar con http(s)://");
      return;
    }

    // Limpiar techs vacíos.
    const cleanTechs = draft.techs.filter((t) => t.name.trim() !== "");

    onSave({
      iconKey: draft.iconKey,
      title: draft.title.trim(),
      desc: draft.desc.trim(),
      techs: cleanTechs,
      githubUrl: draft.githubUrl.trim(),
      comingSoon: draft.comingSoon,
      lang: draft.lang || "",
    });
  };

  const isEdit = Boolean(initial);
  const IconPreview = projectIcons[draft.iconKey];

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
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#181818]/95 backdrop-blur-md rounded-2xl border border-[#FF8C1A]/30 shadow-2xl p-6 sm:p-7 animate-fade-float"
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
          {isEdit
            ? "Modifica los datos del proyecto."
            : "Completa los datos del nuevo proyecto."}
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

          {/* Título */}
          <div>
            <label htmlFor="pe-title" className="block text-sm font-medium text-[#F3F3F3] mb-1">
              Título
            </label>
            <input
              id="pe-title"
              type="text"
              value={draft.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder='ej. "StockFlow Mama Pola"'
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A]/80 text-white placeholder-[#777] border border-[#FF8C1A]/20 focus:border-[#FF8C1A] focus:outline-none focus:ring-1 focus:ring-[#FF8C1A] transition"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="pe-desc" className="block text-sm font-medium text-[#F3F3F3] mb-1">
              Descripción
            </label>
            <textarea
              id="pe-desc"
              value={draft.desc}
              onChange={(e) => updateField("desc", e.target.value)}
              rows={3}
              placeholder="Mobile inventory and statistics app for small businesses."
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A]/80 text-white placeholder-[#777] border border-[#FF8C1A]/20 focus:border-[#FF8C1A] focus:outline-none focus:ring-1 focus:ring-[#FF8C1A] transition resize-none"
              required
            />
          </div>

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
                    if (confirm(`¿Eliminar "${initial.title}"?`)) {
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