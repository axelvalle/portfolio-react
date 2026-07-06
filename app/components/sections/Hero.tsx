"use client";

import Image from "next/image";
import { FaCheckCircle } from "../../icons";

const copy = {
  en: {
    title1: "Systems",
    title2: "Engineer",
    desc: "\"My name is Axel. I'm a Systems Engineering student and a passionate developer, specializing in mobile and web development.\"",
    badge: "Open to Work",
  },
  es: {
    title1: "Ingeniero",
    title2: "de Sistemas",
    desc: "\"Mi nombre es Axel. Soy estudiante de Ingeniería en Sistemas y un desarrollador apasionado, especializado en desarrollo móvil y web.\"",
    badge: "Listo para trabajar",
  },
} as const;

export default function Hero({ lang }: { lang: "en" | "es" }) {
  const t = copy[lang];

  return (
    <section
      id="hero"
      className="z-10 flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 md:py-20 gap-8 md:gap-0 animate-fade-in"
    >
      {/* Texto */}
      <div className="flex flex-col items-center justify-center w-full md:max-w-xl text-center animate-fade-float">
        <h1
          className="montserrat-title text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-extrabold leading-[1.05] tracking-tight md:leading-[1.08] md:tracking-tight mb-2"
          style={{ letterSpacing: "-0.02em" }}
        >
          <span className="block text-[#FF8C1A] drop-shadow-[0_2px_10px_#FF8C1A88]">{t.title1}</span>
          <span className="block text-[#FFE7B0] text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-bold mt-1">
            {t.title2}
          </span>
        </h1>

        {/* Badge */}
        <div className="flex justify-center mb-2">
          <span
            className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-base sm:text-lg shadow-lg animate-badge-glow"
            style={{
              background: "linear-gradient(90deg, #FF8C1A 0%, #FFB300 100%)",
              color: "#181818",
              letterSpacing: "0.04em",
              boxShadow: "0 0 16px 2px #FF8C1A55",
            }}
          >
            <FaCheckCircle className="text-[#181818] text-lg sm:text-xl drop-shadow" />
            {t.badge}
          </span>
        </div>

        <p className="mt-3 sm:mt-5 text-base xs:text-lg sm:text-xl text-[#DCDCDC] max-w-xs sm:max-w-lg mx-auto font-medium animate-fade-float">
          {t.desc}
        </p>
      </div>

      {/* Personaje */}
      <div className="relative mt-6 md:mt-0 w-[220px] h-[320px] xs:w-[260px] xs:h-[380px] sm:w-[300px] sm:h-[420px] md:w-[360px] md:h-[520px] flex-shrink-0 animate-zoom-bounce">
        <div className="absolute inset-0 bg-gradient-to-t from-[#FF8C1A]/40 to-transparent rounded-full blur-2xl z-0"></div>
        <Image
          src="/character.webp"
          alt="Axel Valle - Systems Engineer"
          fill
          priority
          sizes="(max-width: 480px) 220px, (max-width: 640px) 260px, (max-width: 768px) 300px, 360px"
          className="z-10 object-contain drop-shadow-[0_5px_25px_rgba(255,140,26,0.5)]"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </section>
  );
}