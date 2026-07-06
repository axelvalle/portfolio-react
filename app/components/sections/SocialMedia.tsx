"use client";

import Image from "next/image";
import { useFadeInOnScroll } from "../../hooks/useFadeInOnScroll";
import { socialMediaCopy } from "../../i18n/sections";
import { FaInstagram, FaTwitter, FaGithub, FaEnvelope } from "../../icons";

const icons = [FaInstagram, FaTwitter, FaGithub, FaEnvelope];

export default function SocialMedia() {
  const visible = useFadeInOnScroll("social-card", 4);
  const t = socialMediaCopy;

  return (
    <section
      id="social-media"
      className="relative max-w-7xl mx-auto px-4 sm:px-8 py-20 min-h-screen flex flex-col md:flex-row items-center justify-between overflow-hidden"
    >
      <div className="flex-1 w-full">
        <div className="w-full max-w-3xl mx-auto bg-[#232323] bg-opacity-90 rounded-3xl shadow-2xl p-6 sm:p-10 flex flex-col items-center justify-center border border-[#23272f]">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#FF8C1A] tracking-tight leading-tight mb-1 text-left w-full">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-[#F3F3F3] max-w-2xl text-left leading-relaxed tracking-normal mb-8 w-full">
            {t.desc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {t.cards.map((card, i) => {
              const Icon = icons[i];
              return (
                <a
                  key={card.platform}
                  id={`social-card-${i}`}
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 bg-[#232323] rounded-2xl p-4 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 group fade-up${visible[i] ? " visible" : ""}`}
                >
                  <div
                    className={`w-14 h-14 rounded-full overflow-hidden flex items-center justify-center group-hover:scale-110 transition ${
                      card.gradient ? `bg-gradient-to-tr ${card.gradient}` : card.iconBg
                    }`}
                  >
                    <Icon className={`text-3xl ${card.iconClass}`} />
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">{card.platform}</div>
                    <div className="text-[#DCDCDC] text-sm">{card.handle}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Personaje 2 */}
      <div className="flex flex-1 justify-center md:justify-end items-end mt-8 md:mt-0 animate-zoom-bounce" style={{ animationDelay: "0.3s" }}>
        <div className="relative w-[260px] h-[420px] xs:w-[320px] xs:h-[520px] sm:w-[380px] sm:h-[600px]">
          <Image
            src="/character2.webp"
            alt="Axel Valle - Systems Engineer"
            fill
            sizes="(max-width: 480px) 260px, (max-width: 640px) 320px, 380px"
            className="object-contain drop-shadow-[0_5px_25px_rgba(255,140,26,0.5)]"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      </div>
    </section>
  );
}