"use client";

import { useFadeInOnScroll } from "../../hooks/useFadeInOnScroll";
import { projectsCopy, projectCardIcons } from "../../i18n/sections";
import {
  FaUserMd,
  FaMobileAlt,
  FaPaintBrush,
  FaUniversity,
  FaGithub,
  SiDart,
  SiFlutter,
  SiHtml5,
  SiCss3,
  SiTypescript,
  SiAngular,
} from "../../icons";

const cardIcons = [FaUserMd, FaMobileAlt, FaPaintBrush, FaUniversity];

// Static tech badges para projects 2 y 3 (que no están en projectsCopy.techs)
const staticTechs: Record<number, { name: string; bg: string; Icon: React.ComponentType<{ size?: number }> }[]> = {
  1: [
    { name: "Flutter", bg: "#02569b", Icon: SiFlutter },
    { name: "Dart", bg: "#0175c2", Icon: SiDart },
  ],
  2: [
    { name: "HTML", bg: "#e34c26", Icon: SiHtml5 },
    { name: "CSS", bg: "#1572b6", Icon: SiCss3 },
    { name: "TS", bg: "#3178c6", Icon: SiTypescript },
    { name: "Angular", bg: "#dd0031", Icon: SiAngular },
  ],
};

export default function Projects({ lang }: { lang: "en" | "es" }) {
  const visible = useFadeInOnScroll("project-card", 4);
  const t = projectsCopy[lang];

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
        {t.projects.map((project, i) => {
          const CardIcon = cardIcons[i];
          const isComingSoon = i === 2;
          const techs = project.techs.length > 0 ? project.techs : staticTechs[i] ?? [];

          return (
            <div
              key={i}
              id={`project-card-${i}`}
              className={`group rounded-2xl shadow-lg p-6 flex flex-col items-center fade-up transition-transform duration-300 hover:-translate-y-1${
                visible[i] ? " visible" : ""
              } ${isComingSoon ? "bg-gradient-to-br from-[#FF8C1A]/80 to-[#23272f]/90" : "bg-[#181818]/90"}`}
            >
              <CardIcon
                size={48}
                className={`mb-4 ${isComingSoon ? "text-[#FF8C1A] transition-transform duration-300 group-hover:scale-110" : "text-[#25c6f9]"}`}
              />
              <h3 className="text-xl font-bold text-white mb-1 text-center">{project.title}</h3>
              <p className={`text-center mb-3 ${isComingSoon ? "text-[#FFE7B0] font-semibold text-lg" : "text-[#DCDCDC]"}`}>
                {project.desc}
              </p>

              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {techs.map((tech) => {
                  if ("Icon" in tech && tech.Icon) {
                    const { Icon, name, bg } = tech;
                    return (
                      <span key={name} className="text-white px-2 py-1 rounded text-xs flex items-center gap-1" style={{ background: bg }}>
                        <Icon size={16} /> {name}
                      </span>
                    );
                  }
                  const legacyTech = tech as { name: string; color: string; icon: React.ComponentType<{ size?: number }> | null };
                  const Icon = legacyTech.icon;
                  return (
                    <span
                      key={legacyTech.name}
                      className="px-2 py-1 rounded text-xs flex items-center gap-1"
                      style={{
                        background: legacyTech.color,
                        color: legacyTech.color === "#FF8C1A" ? "#181818" : "#fff",
                      }}
                    >
                      {Icon && <Icon size={16} />} {legacyTech.name}
                    </span>
                  );
                })}
              </div>

              {isComingSoon ? (
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
        })}
      </div>
    </section>
  );
}