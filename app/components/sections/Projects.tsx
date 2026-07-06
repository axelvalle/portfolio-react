"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useFadeInOnScroll } from "../../hooks/useFadeInOnScroll";
import { useProjects } from "../../hooks/useProjects";
import { FaGithub, FaChevronLeft, FaChevronRight, FaEdit } from "../../icons";
import { projectIcons, techIcons } from "../../iconRegistry";
import { projectsCopy } from "../../i18n/sections";
import type { Project, ProjectInput } from "../../types/projects";
import EditFab from "../EditFab";
import ProjectEditorModal from "../ProjectEditorModal";

const VISIBLE_PER_PAGE = 6; // 3 cols × 2 filas

/**
 * Card individual. Reutilizable tanto en grid como en carousel.
 * Si `canEdit` es true, muestra un botón de edición y delega el click al padre.
 */
function ProjectCard({
  project,
  visible,
  canEdit = false,
  onEdit,
}: {
  project: Project;
  visible: boolean;
  canEdit?: boolean;
  onEdit?: (project: Project) => void;
}) {
  const Icon = projectIcons[project.iconKey];
  const t = projectsCopy.en; // "Github" label es igual en ambos idiomas en este copy

  return (
    <div
      className={`group relative rounded-2xl shadow-lg p-6 flex flex-col items-center fade-up transition-transform duration-300 hover:-translate-y-1${
        visible ? " visible" : ""
      } ${project.comingSoon ? "bg-gradient-to-br from-[#FF8C1A]/80 to-[#23272f]/90" : "bg-[#181818]/90"}`}
    >
      {canEdit && onEdit && (
        <button
          type="button"
          onClick={() => onEdit(project)}
          aria-label={`Editar ${project.title}`}
          className="absolute top-2 right-2 p-2 rounded-full bg-[#0A0A0A]/80 text-[#FF8C1A] border border-[#FF8C1A]/30 opacity-70 hover:opacity-100 hover:bg-[#FF8C1A] hover:text-black transition-all"
        >
          <FaEdit size={14} />
        </button>
      )}
      {Icon && (
        <Icon
          size={48}
          className={`mb-4 ${project.comingSoon ? "text-[#FF8C1A] transition-transform duration-300 group-hover:scale-110" : "text-[#25c6f9]"}`}
        />
      )}
      <h3 className="text-xl font-bold text-white mb-1 text-center">{project.title}</h3>
      <p
        className={`text-center mb-3 ${
          project.comingSoon ? "text-[#FFE7B0] font-semibold text-lg" : "text-[#DCDCDC]"
        }`}
      >
        {project.desc}
      </p>

      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {project.techs.map((tech) => {
          const TechIcon = tech.iconKey ? techIcons[tech.iconKey] : null;
          return (
            <span
              key={tech.name}
              className="px-2 py-1 rounded text-xs flex items-center gap-1"
              style={{
                background: tech.color,
                color: tech.color === "#FF8C1A" ? "#181818" : "#fff",
              }}
            >
              {TechIcon && <TechIcon size={16} />} {tech.name}
            </span>
          );
        })}
      </div>

      {project.comingSoon || !project.githubUrl ? (
        <span className="mt-auto bg-[#23272f] text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 opacity-60 cursor-not-allowed">
          <FaGithub className="text-xl" />
          {t.liveDemo}
        </span>
      ) : (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto bg-[#23272f] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#FF8C1A] hover:text-black transition flex items-center justify-center gap-2"
        >
          <FaGithub className="text-xl" />
          {t.liveDemo}
        </a>
      )}
    </div>
  );
}

/**
 * Carousel horizontal basado en scroll-snap CSS.
 * Sin dependencias externas. Soporta drag (mouse + touch) y scroll por teclado.
 */
function ProjectsCarousel({
  projects,
  canEdit,
  onEdit,
}: {
  projects: Project[];
  canEdit: boolean;
  onEdit: (project: Project) => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const recomputePages = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // Cada "página" = el ancho visible del contenedor.
    const visibleWidth = track.clientWidth;
    setPages(Math.max(1, Math.ceil(track.scrollWidth / visibleWidth)));
  }, []);

  useEffect(() => {
    recomputePages();
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const visibleWidth = track.clientWidth;
      if (visibleWidth <= 0) return;
      const current = Math.round(track.scrollLeft / visibleWidth);
      setPage(current);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recomputePages);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recomputePages);
    };
  }, [recomputePages, projects.length]);

  // Cuando cambia la cantidad de proyectos (add/remove/reset), resetea el scroll
  // a la primera página para evitar quedar "en el aire".
  const prevLengthRef = useRef(projects.length);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (prevLengthRef.current !== projects.length) {
      prevLengthRef.current = projects.length;
      track.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [projects.length]);

  const scrollToPage = (target: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(target, pages - 1));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Track */}
      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "none" }}
      >
        {Array.from({ length: pages }).map((_, pageIdx) => {
          const slice = projects.slice(pageIdx * VISIBLE_PER_PAGE, (pageIdx + 1) * VISIBLE_PER_PAGE);
          return (
            <div
              key={pageIdx}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full shrink-0 snap-start px-1"
              style={{ minWidth: "100%" }}
            >
              {slice.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  visible={true}
                  canEdit={canEdit}
                  onEdit={onEdit}
                />
              ))}
              {/* Si la última página tiene menos de 6, rellenamos con invisibles para mantener el grid 3x2 */}
              {Array.from({ length: VISIBLE_PER_PAGE - slice.length }).map((_, i) => (
                <div key={`empty-${i}`} className="hidden md:block" aria-hidden="true" />
              ))}
            </div>
          );
        })}
      </div>

      {/* Controles prev/next */}
      {pages > 1 && (
        <>
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => scrollToPage(page - 1)}
            disabled={page === 0}
            className="absolute top-1/2 -translate-y-1/2 left-0 sm:-left-2 w-10 h-10 rounded-full bg-[#181818]/90 border border-[#FF8C1A]/40 backdrop-blur-sm text-[#FF8C1A] flex items-center justify-center hover:bg-[#FF8C1A] hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <FaChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => scrollToPage(page + 1)}
            disabled={page >= pages - 1}
            className="absolute top-1/2 -translate-y-1/2 right-0 sm:-right-2 w-10 h-10 rounded-full bg-[#181818]/90 border border-[#FF8C1A]/40 backdrop-blur-sm text-[#FF8C1A] flex items-center justify-center hover:bg-[#FF8C1A] hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <FaChevronRight />
          </button>
        </>
      )}

      {/* Dots */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Página ${i + 1}`}
              onClick={() => scrollToPage(i)}
              className={`h-2 rounded-full transition-all ${
                i === page ? "bg-[#FF8C1A] w-6" : "bg-[#FF8C1A]/30 w-2 hover:bg-[#FF8C1A]/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Projects({
  lang,
  isAuthenticated,
}: {
  lang: "en" | "es";
  isAuthenticated: boolean;
}) {
  const { projects, add, update, remove, reset } = useProjects(lang);
  const t = projectsCopy[lang];

  // Solo para fade-up de las primeras 6 cards en el modo grid estático.
  const gridVisible = useFadeInOnScroll("project-card", VISIBLE_PER_PAGE);

  const hasOverflow = projects.length > VISIBLE_PER_PAGE;

  // Estado del modal editor.
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const handleNew = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditing(project);
    setEditorOpen(true);
  };

  const handleSave = (input: ProjectInput) => {
    if (editing) {
      update(editing.id, input);
    } else {
      add(input);
    }
    setEditorOpen(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    remove(id);
    setEditorOpen(false);
    setEditing(null);
  };

  const handleReset = () => {
    if (confirm("¿Restablecer los proyectos a los valores por defecto? Se perderán los cambios.")) {
      reset();
    }
  };

  return (
    <section
      id="projects"
      className="section-spacing max-w-7xl mx-auto px-4 sm:px-8 py-20 min-h-[90vh] flex flex-col justify-center"
    >
      <div className="mb-2">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#FF8C1A] tracking-tight leading-tight mb-1 text-left">
          {t.title}
        </h2>
        <p className="text-base sm:text-lg text-[#F3F3F3] max-w-2xl text-left leading-relaxed tracking-normal mb-8">
          {t.desc}
        </p>
      </div>

      {hasOverflow ? (
        <ProjectsCarousel projects={projects} canEdit={isAuthenticated} onEdit={handleEdit} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
          {projects.map((project, i) => (
            <div key={project.id} id={`project-card-${i}`}>
              <ProjectCard
                project={project}
                visible={gridVisible[i] ?? false}
                canEdit={isAuthenticated}
                onEdit={handleEdit}
              />
            </div>
          ))}
          {/* Mantener el grid 3×2 aunque haya <6 */}
          {Array.from({ length: VISIBLE_PER_PAGE - projects.length }).map((_, i) => (
            <div key={`empty-${i}`} className="hidden md:block" aria-hidden="true" />
          ))}
        </div>
      )}

      {/* FAB + Editor (solo si está autenticado) */}
      <EditFab visible={isAuthenticated} onClick={handleNew} onReset={handleReset} />
      <ProjectEditorModal
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        onDelete={handleDelete}
        initial={editing}
        lang={lang}
      />
    </section>
  );
}