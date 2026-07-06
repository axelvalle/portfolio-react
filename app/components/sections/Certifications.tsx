"use client";

import { certificationsCopy } from "../../i18n/sections";
import { FaCertificate, FaUniversity, FaPython, FaPhp } from "../../icons";

const icons = [FaPython, FaPhp];

export default function Certifications({ lang }: { lang: "en" | "es" }) {
  const t = certificationsCopy[lang];

  return (
    <section
      id="certifications"
      className="section-spacing max-w-7xl mx-auto px-4 sm:px-8 py-20 min-h-[60vh] flex flex-col justify-center"
    >
      <div className="mb-2">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#FF8C1A] tracking-tight leading-tight mb-1 text-left">
          {t.title}
        </h2>
        <p className="text-base sm:text-lg text-[#F3F3F3] max-w-2xl text-left leading-relaxed tracking-normal mb-8">
          {t.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
        {t.items.map((cert, i) => {
          const Icon = icons[i];
          return (
            <div
              key={cert.title}
              className="bg-[#181818]/90 rounded-2xl shadow-lg p-6 flex flex-col items-center fade-up visible"
            >
              <div className="flex items-center gap-2 mb-4">
                <Icon size={40} style={{ color: cert.iconColor }} />
                <FaCertificate size={32} className="text-[#FF8C1A]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1 text-center">{cert.title}</h3>
              <div className="flex flex-wrap gap-2 justify-center mb-2">
                <span className="text-white px-2 py-1 rounded text-xs flex items-center gap-1" style={{ background: cert.iconColor }}>
                  <Icon size={14} />
                  {cert.tags[0]}
                </span>
                <span className="bg-[#FF8C1A] text-black px-2 py-1 rounded text-xs flex items-center gap-1">
                  {cert.tags[1]}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#F3F3F3] text-xs mb-2">
                <FaUniversity className="text-[#FF8C1A]" />
                <span>{cert.institution}</span>
              </div>
              <span className="bg-[#23272f] text-[#FF8C1A] px-2 py-1 rounded text-xs font-semibold">{cert.year}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}