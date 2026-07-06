"use client"

import dynamic from "next/dynamic"
import BinaryRain from "./components/BinaryRain"
import Navbar from "./components/Navbar"
import LangFade from "./components/LangFade"
import ToastHost from "./components/ToastHost"
import { useState, useEffect, useCallback } from "react"
import { useAuth } from "./hooks/useAuth"

// Lazy-load de secciones que no están en el viewport inicial.
// ssr: false evita que el JS del cliente se renderice en el servidor.
const Hero = dynamic(() => import("./components/sections/Hero"), {
  ssr: false,
  loading: () => <div className="min-h-[60vh]" aria-hidden="true" />,
})
const Projects = dynamic(() => import("./components/sections/Projects"), {
  ssr: false,
  loading: () => <div className="min-h-[90vh]" aria-hidden="true" />,
})
const Certifications = dynamic(() => import("./components/sections/Certifications"), {
  ssr: false,
  loading: () => <div className="min-h-[60vh]" aria-hidden="true" />,
})
const SocialMedia = dynamic(() => import("./components/sections/SocialMedia"), {
  ssr: false,
  loading: () => <div className="min-h-screen" aria-hidden="true" />,
})

/**
 * Hook personalizado para detectar cuándo una sección entra en el viewport y aplicar un efecto de fade-in.
 */
function useSectionFadeIn(ids: string[]) {
  const [visible, setVisible] = useState(ids.map(() => false))

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    ids.forEach((id, idx) => {
      const el = document.getElementById(id)
      if (el) {
        const obs = new window.IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisible((v) => {
                const copy = [...v]
                copy[idx] = true
                return copy
              })
            }
          },
          { threshold: 0.3 },
        )
        obs.observe(el)
        observers.push(obs)
      }
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [ids])

  return visible
}

/**
 * Componente principal de la página de inicio.
 * Renderiza todas las secciones del portafolio.
 */
export default function Home() {
  // Estado para el idioma actual (inglés o español)
  const [lang, setLang] = useState<"en" | "es">("en")

  // Refleja el idioma activo en <html lang="..."> para a11y y SEO.
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang
    }
  }, [lang])

  // Auth: vive aquí para que el Navbar y Projects compartan el mismo estado.
  const { isAuthenticated, hydrated } = useAuth()

  // Visibilidad de la sección de tecnologías (animación de entrada).
  const [techVisible] = useSectionFadeIn(["technologies"])

  // Tras un login exitoso: contador que Projects observa para abrir el modal "Nuevo".
  const [loginSuccessCount, setLoginSuccessCount] = useState(0)

  const handleLoginSuccess = useCallback(() => {
    // Pequeño delay para que React pinte el FAB antes de hacer scroll,
    // y luego otro beat antes de abrir el modal para que se vea el scroll.
    setLoginSuccessCount((c) => c + 1)
  }, [])

  return (
    <>
      {/* Componente de fondo con efecto de lluvia de código binario */}
      <BinaryRain />

      {/* Toasts globales (login/logout/proyectos) */}
      <ToastHost />

      <main
        className="bg-[#0A0A0A]/40 text-white overflow-hidden relative min-h-screen"
        style={{
          backgroundSize: "20px",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}
      >
        <Navbar lang={lang} onLangChange={setLang} onLoginSuccess={handleLoginSuccess} />

        {/* Espaciador para el navbar fijo */}
        <div className="h-16"></div>

        <LangFade lang={lang}>
          <Hero lang={lang} />
        </LangFade>

        <section
          id="technologies"
          className={`scroll-snap-section fullpage-section slice-section full-vh-center section-spacing z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-20 rounded-t-[2.5rem] rounded-b-[2.5rem] shadow-xl${techVisible ? " visible" : ""}`}
          style={{ background: "rgba(24, 24, 24, 0.75)" }}
        >
          <TechnologiesGrid />
        </section>

        <LangFade lang={lang}>
          <Projects lang={lang} isAuthenticated={hydrated && isAuthenticated} loginSuccessSignal={loginSuccessCount} />
        </LangFade>
        <LangFade lang={lang}>
          <Certifications lang={lang} />
        </LangFade>
        <SocialMedia />

        {/* Pie de página (Footer) */}
        <footer className="w-full bg-[#181818] text-[#FF8C1A] py-8 mt-12 flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-bold mb-2">Axel Valle</div>
          <div className="text-sm text-[#DCDCDC] mb-2">&copy; {new Date().getFullYear()} All rights reserved.</div>
          <div className="flex gap-4 text-[#FF8C1A]">
            <a
              href="https://github.com/axelvalle"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              Github
            </a>
            <a href="mailto:voldsoy@hotmail.com" className="hover:text-white transition">
              Email
            </a>
          </div>
        </footer>
      </main>
    </>
  )
}

/**
 * Grid de iconos de tecnologías (sigue dentro de page.tsx para mantener
 * proximidad con la sección technologies y porque es muy liviano).
 */
import { useFadeInOnScroll } from "./hooks/useFadeInOnScroll"
import { techSectionCopy } from "./i18n/tech"

function TechnologiesGrid() {
  const visible = useFadeInOnScroll("techicon-card", 12)
  return (
    <>
      <div className="mb-2">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#FF8C1A] tracking-tight leading-tight mb-1 text-left">
          Technologies
        </h2>
        <p className="text-base sm:text-lg text-[#F3F3F3] max-w-2xl text-left leading-relaxed tracking-normal mb-8">
          Skills and tools that I&apos;ve used in my projects
        </p>
      </div>

      <div className="flex flex-col items-center w-full">
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-y-8 gap-x-8 sm:gap-x-10 mb-0 max-w-[340px] sm:max-w-2xl md:max-w-4xl w-full px-4 sm:px-2">
            {techSectionCopy.icons.map((Icon, i) => (
              <div
                key={techSectionCopy.iconNames[i]}
                id={`techicon-card-${i}`}
                className={`col-span-1 flex justify-center fade-up tech-icon${visible[i] ? " visible" : ""}`}
              >
                <Icon size={60} color={techSectionCopy.iconColors[i]} />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex justify-center mt-8 sm:mt-12">
          <p className="text-white text-base sm:text-lg">{techSectionCopy.andMore}</p>
        </div>
      </div>
    </>
  )
}