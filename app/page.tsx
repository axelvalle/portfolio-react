"use client"

import Image from "next/image"
import BinaryRain from "./components/BinaryRain"
import { useState, useEffect, useRef } from "react"
import {
  SiTypescript,
  SiHtml5,
  SiCss3,
  SiDart,
  SiFlutter,
  SiPhp,
  SiAngular,
  SiGit,
  SiMysql,
  SiPython,
  SiPostgresql,
  SiNetlify,
  SiDotnet,
} from "react-icons/si"
import {
  FaMobileAlt,
  FaPaintBrush,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaEnvelope,
  FaUniversity,
  FaCertificate,
  FaUserMd,
  FaJava,
  FaDatabase,
  FaCheckCircle,
} from "react-icons/fa"

// Animación para el badge "Listo para trabajar" / "Open to Work"
import "./badge-glow.css"

/**
 * Hook personalizado para detectar cuándo una sección entra en el viewport y aplicar un efecto de fade-in.
 * @param {string[]} ids - Un array de IDs de los elementos a observar.
 * @returns {boolean[]} Un array de booleanos que indica la visibilidad de cada elemento.
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
 * Hook personalizado para animar la aparición (fade-in) de una lista de elementos al hacer scroll.
 * @param {number} count - El número de elementos a observar.
 * @param {string} prefix - El prefijo del ID para cada elemento (e.g., "project-card-").
 * @returns {boolean[]} Un array de booleanos que indica la visibilidad de cada elemento.
 */
function useFadeInOnScroll(count: number, prefix: string) {
  const [visible, setVisible] = useState(Array(count).fill(false))

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    for (let i = 0; i < count; i++) {
      const el = document.getElementById(`${prefix}-card-${i}`)
      if (el) {
        const obs = new window.IntersectionObserver(
          ([entry]) => {
            setVisible((v) => {
              const copy = [...v]
              copy[i] = entry.isIntersecting
              return copy
            })
          },
          { threshold: 0.2 },
        )
        obs.observe(el)
        observers.push(obs)
      }
    }

    return () => observers.forEach((o) => o.disconnect())
  }, [count, prefix])

  return visible
}

/**
 * Objeto que contiene las traducciones para inglés ('en') y español ('es').
 * Se utiliza para la internacionalización (i18n) del sitio.
 */
const translations = {
  en: {
    navbar: ["Projects", "Technologies", "Social Media"],
    heroTitle1: "Systems",
    heroTitle2: "Engineer",
    heroDesc:
      '"My name is Axel. I\'m a Systems Engineering student and a passionate developer, specializing in mobile and web development."',
    techTitle: "Technologies",
    techDesc: "Skills and tools that I've used in my projects",
    techAndMore: "and more...",
    projectsTitle: "Projects",
    projectsDesc: "A little bit about my work...",
    certificationsTitle: "Certifications",
    certificationsDesc: "Certifications and training obtained from recognized institutions.",
    cert1Title: "Intermediate Python Programming",
    cert1Tags: ["Python", "Intermediate"],
    cert1Uni: "UNI Postgraduate Nicaragua",
    cert1Year: "2023",
    cert2Title: "Programming with PHP & MVC",
    cert2Tags: ["PHP", "MVC"],
    cert2Uni: "UNI Postgraduate Nicaragua",
    cert2Year: "2024",
    liveDemo: "Github",
    projectWimaxTitle: "WIMAX Medical Center",
    projectWimaxDesc: "Vaccination management system using SQL Server, C# and .NET Framework.",
    projectWimaxTech: [
      { name: "SQL Server", color: "#23272f", icon: FaDatabase },
      { name: "C#", color: "#178600", icon: SiDotnet },
      { name: ".NET Framework", color: "#512BD4", icon: SiDotnet },
    ],
    projectAdmonTitle: "Business Administration",
    projectAdmonDesc: "Desktop application in Java for business management: products, suppliers and payroll.",
    projectAdmonTech: [
      { name: "Java", color: "#3178c6", icon: FaJava },
      { name: "Swing", color: "#FF8C1A", icon: null },
      { name: "Text Files", color: "#23272f", icon: null },
    ],
  },
  es: {
    navbar: ["Proyectos", "Tecnologías", "Redes Sociales"],
    heroTitle1: "Ingeniero",
    heroTitle2: "de Sistemas",
    heroDesc:
      '"Mi nombre es Axel. Soy estudiante de Ingeniería en Sistemas y un desarrollador apasionado, especializado en desarrollo móvil y web."',
    techTitle: "Tecnologías",
    techDesc: "Habilidades y herramientas que he usado en mis proyectos",
    techAndMore: "y más...",
    projectsTitle: "Proyectos",
    projectsDesc: "Un poco sobre mi trabajo...",
    certificationsTitle: "Certificaciones",
    certificationsDesc: "Certificados y capacitaciones obtenidas en instituciones reconocidas.",
    cert1Title: "Programación Intermedia con Python",
    cert1Tags: ["Python", "Intermedio"],
    cert1Uni: "UNI Postgrado Nicaragua",
    cert1Year: "2023",
    cert2Title: "Programación con PHP y MVC",
    cert2Tags: ["PHP", "MVC"],
    cert2Uni: "UNI Postgrado Nicaragua",
    cert2Year: "2024",
    liveDemo: "Github",
    projectWimaxTitle: "WIMAX Centro Médico",
    projectWimaxDesc: "Sistema de gestión de vacunación usando SQL Server, C# y .NET Framework.",
    projectWimaxTech: [
      { name: "SQL Server", color: "#23272f", icon: FaDatabase },
      { name: "C#", color: "#178600", icon: SiDotnet },
      { name: ".NET Framework", color: "#512BD4", icon: SiDotnet },
    ],
    projectAdmonTitle: "Administración de Empresas",
    projectAdmonDesc:
      "Aplicación de escritorio en Java para la gestión administrativa de empresas: productos, proveedores y planillas de empleados.",
    projectAdmonTech: [
      { name: "Java", color: "#3178c6", icon: FaJava },
      { name: "Swing", color: "#FF8C1A", icon: null },
      { name: "Archivos de texto", color: "#23272f", icon: null },
    ],
  },
}

/**
 * Componente principal de la página de inicio.
 * Renderiza todas las secciones del portafolio.
 */
export default function Home() {
  // --- STATE MANAGEMENT ---
  // Estado para el menú móvil (abierto/cerrado)
  const [menuOpen, setMenuOpen] = useState(false)
  // Estado para controlar la animación de cierre del menú
  const [menuAnimating, setMenuAnimating] = useState(false)
  // Referencias a las secciones de Hero y Tecnologías para calcular el scroll
  const heroRef = useRef<HTMLElement | null>(null)
  const techRef = useRef<HTMLElement | null>(null)

  // Estados para controlar la visibilidad y animación de entrada de las secciones.
  // Se utiliza el hook `useSectionFadeIn` para la sección de tecnologías.
  const [techVisible] = useSectionFadeIn(["technologies"])

  // Se utiliza `useFadeInOnScroll` para animar la aparición de elementos en varias secciones.
  const projectCardsVisible = useFadeInOnScroll(4, "project")
  const techIconsVisible = useFadeInOnScroll(12, "techicon")
  const socialCardsVisible = useFadeInOnScroll(4, "social")

  // Estado para el idioma actual (inglés o español)
  const [lang, setLang] = useState<"en" | "es">("en")
  // Objeto de traducción actual basado en el idioma seleccionado
  const t = translations[lang]

  // Estados para controlar la animación de entrada de la barra de navegación y la sección de héroe
  const [navbarVisible, setNavbarVisible] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)

  // useEffect para las animaciones iniciales de la barra de navegación y el héroe al cargar la página.
  useEffect(() => {
    setTimeout(() => setNavbarVisible(true), 100)
    setTimeout(() => setHeroVisible(true), 400)
  }, [])

  // useEffect para manejar el cálculo del progreso del scroll entre la sección Hero y Tech.
  useEffect(() => {
    const handleScroll = () => {
      const hero = heroRef.current
      const tech = techRef.current
      if (hero && tech) {
        // Cuando la parte inferior del hero llega al top, empieza la transición
        // (código de animación eliminado porque scrollProgress no se usa)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // --- MANEJADORES DE EVENTOS ---
  /**
   * Maneja el cambio de estado del menú móvil, incluyendo la animación de cierre.
   */
  const handleMenuToggle = () => {
    if (menuOpen) {
      setMenuAnimating(true)
      setTimeout(() => {
        setMenuOpen(false)
        setMenuAnimating(false)
      }, 280) // Debe coincidir con la duración de la animación de salida
    } else {
      setMenuOpen(true)
    }
  }

  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <>
      {/* Componente de fondo con efecto de lluvia de código binario */}
      <BinaryRain />

      <main
        className="bg-[#0A0A0A]/40 text-white overflow-hidden relative min-h-screen"
        style={{
          backgroundSize: "20px",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}
      >
        {/* Navbar con diseño estilo pestañas */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#FF8C1A]/20 transition-all duration-700 ${navbarVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Image src="/logo.svg" alt="Logo" width={120} height={40} className="h-8 w-auto" />
              </div>

              {/* Desktop Navigation - Estilo pestañas */}
              <div className="hidden md:flex items-center space-x-1 bg-[#181818]/80 rounded-full p-1 backdrop-blur-sm border border-[#FF8C1A]/20">
                <a
                  href="#projects"
                  className="px-6 py-2 rounded-full text-sm font-medium text-white hover:text-[#FF8C1A] hover:bg-[#FF8C1A]/10 transition-all duration-300 relative group"
                >
                  {t.navbar[0]}
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#FF8C1A] rounded-full transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a
                  href="#technologies"
                  className="px-6 py-2 rounded-full text-sm font-medium text-white hover:text-[#FF8C1A] hover:bg-[#FF8C1A]/10 transition-all duration-300 relative group"
                >
                  {t.navbar[1]}
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#FF8C1A] rounded-full transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a
                  href="#social-media"
                  className="px-6 py-2 rounded-full text-sm font-medium text-white hover:text-[#FF8C1A] hover:bg-[#FF8C1A]/10 transition-all duration-300 relative group"
                >
                  {t.navbar[2]}
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#FF8C1A] rounded-full transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>

              {/* Right side - Language toggle and social icons */}
              <div className="hidden md:flex items-center space-x-4">
                <button
                  className="bg-[#181818]/80 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-[#FF8C1A] hover:text-black transition-all duration-300 border border-[#FF8C1A]/20"
                  onClick={() => setLang(lang === "en" ? "es" : "en")}
                  aria-label="Change language"
                >
                  {lang === "en" ? "ES" : "EN"}
                </button>

                <div className="flex items-center space-x-3">
                  <a
                    href="https://instagram.com/perpetuaa_v"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-white hover:text-[#FF8C1A] transition-colors duration-300"
                  >
                    <FaInstagram size={18} />
                  </a>
                  <a
                    href="https://twitter.com/perpetua_v"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="text-white hover:text-[#FF8C1A] transition-colors duration-300"
                  >
                    <FaTwitter size={18} />
                  </a>
                  <a
                    href="https://github.com/axelvalle"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Github"
                    className="text-white hover:text-[#FF8C1A] transition-colors duration-300"
                  >
                    <FaGithub size={18} />
                  </a>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center space-x-3">
                <button
                  className="bg-[#181818]/80 text-white px-2 py-1 rounded text-xs font-medium hover:bg-[#FF8C1A] hover:text-black transition-all duration-300"
                  onClick={() => setLang(lang === "en" ? "es" : "en")}
                  aria-label="Change language"
                >
                  {lang === "en" ? "ES" : "EN"}
                </button>

                <button className="p-2 focus:outline-none" aria-label="Abrir menú" onClick={handleMenuToggle}>
                  <span className="block w-6 h-0.5 bg-[#FF8C1A] mb-1.5 rounded transition-all duration-300"></span>
                  <span className="block w-6 h-0.5 bg-[#FF8C1A] mb-1.5 rounded transition-all duration-300"></span>
                  <span className="block w-6 h-0.5 bg-[#FF8C1A] rounded transition-all duration-300"></span>
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            <div
              className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen || menuAnimating ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="py-4 space-y-2 bg-[#181818]/95 rounded-lg mt-2 border border-[#FF8C1A]/20">
                <a
                  href="#projects"
                  className="block px-4 py-2 text-white hover:text-[#FF8C1A] hover:bg-[#FF8C1A]/10 transition-all duration-300"
                  onClick={handleMenuToggle}
                >
                  {t.navbar[0]}
                </a>
                <a
                  href="#technologies"
                  className="block px-4 py-2 text-white hover:text-[#FF8C1A] hover:bg-[#FF8C1A]/10 transition-all duration-300"
                  onClick={handleMenuToggle}
                >
                  {t.navbar[1]}
                </a>
                <a
                  href="#social-media"
                  className="block px-4 py-2 text-white hover:text-[#FF8C1A] hover:bg-[#FF8C1A]/10 transition-all duration-300"
                  onClick={handleMenuToggle}
                >
                  {t.navbar[2]}
                </a>

                <div className="flex justify-center space-x-6 pt-4 border-t border-[#FF8C1A]/20 mt-4">
                  <a
                    href="https://instagram.com/perpetuaa_v"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-white hover:text-[#FF8C1A] transition-colors duration-300"
                  >
                    <FaInstagram size={20} />
                  </a>
                  <a
                    href="https://twitter.com/perpetua_v"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="text-white hover:text-[#FF8C1A] transition-colors duration-300"
                  >
                    <FaTwitter size={20} />
                  </a>
                  <a
                    href="https://github.com/axelvalle"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Github"
                    className="text-white hover:text-[#FF8C1A] transition-colors duration-300"
                  >
                    <FaGithub size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Espaciador para el navbar fijo */}
        <div className="h-16"></div>

        {/* Sección del Héroe (Hero) */}
        <section
          id="hero"
          ref={heroRef}
          className={`z-10 flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 md:py-20 gap-8 md:gap-0 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          style={{ transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)" }}
        >
          {/* Lado del texto */}
          <div
            className={`flex flex-col items-center justify-center w-full md:max-w-xl text-center transition-all duration-700 ${heroVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
            style={{ transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)" }}
          >
            <h1
              className="montserrat-title text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-extrabold leading-[1.05] tracking-tight md:leading-[1.08] md:tracking-tight mb-2 animate-fade-float"
              style={{ letterSpacing: "-0.02em" }}
            >
              <span className="block text-[#FF8C1A] drop-shadow-[0_2px_10px_#FF8C1A88]">{t.heroTitle1}</span>
              <span className="block text-[#FFE7B0] text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-bold mt-1">
                {t.heroTitle2}
              </span>
            </h1>

            {/* Badge animado "Listo para trabajar" / "Open to Work" */}
            <div className="flex justify-center mb-2">
              <span
                className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-base sm:text-lg shadow-lg animate-fade-float animate-badge-glow"
                style={{
                  background: "linear-gradient(90deg, #FF8C1A 0%, #FFB300 100%)",
                  color: "#181818",
                  letterSpacing: "0.04em",
                  boxShadow: "0 0 16px 2px #FF8C1A55",
                }}
              >
                <FaCheckCircle
                  className="text-[#25D366] text-lg sm:text-xl drop-shadow"
                  style={{ marginRight: "0.2em" }}
                />
                {lang === "es" ? "Listo para trabajar" : "Open to Work"}
              </span>
            </div>

            <p className="mt-3 sm:mt-5 text-base xs:text-lg sm:text-xl text-[#DCDCDC] max-w-xs sm:max-w-lg mx-auto font-medium animate-fade-float">
              {t.heroDesc}
            </p>
          </div>

          {/* Imagen del personaje */}
          <div
            className={`relative mt-6 md:mt-0 w-[220px] h-[320px] xs:w-[260px] xs:h-[380px] sm:w-[300px] sm:h-[420px] md:w-[360px] md:h-[520px] flex-shrink-0 animate-zoom-bounce transition-all duration-700 ${heroVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            style={{ transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#FF8C1A]/40 to-transparent rounded-full blur-2xl z-0"></div>
            <Image
              src="/character.webp"
              alt="Axel Cartoon"
              fill
              className="z-10 object-contain drop-shadow-[0_5px_25px_rgba(255,140,26,0.5)]"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </section>

        {/* Sección de Tecnologías */}
        <section
          id="technologies"
          ref={techRef}
          className={`scroll-snap-section fullpage-section slice-section full-vh-center section-spacing z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-20 rounded-t-[2.5rem] rounded-b-[2.5rem] shadow-xl${techVisible ? " visible" : ""}`}
          style={{ background: "rgba(24, 24, 24, 0.75)" }}
        >
          <div className="mb-2">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#FF8C1A] tracking-tight leading-tight mb-1 text-left">
              {t.techTitle}
            </h2>
            <p className="text-base sm:text-lg text-[#F3F3F3] max-w-2xl text-left leading-relaxed tracking-normal mb-8">
              {t.techDesc}
            </p>
          </div>

          <div className="flex flex-col items-center w-full">
            <div className="w-full flex justify-center">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-y-8 gap-x-8 sm:gap-x-10 mb-0 max-w-[340px] sm:max-w-2xl md:max-w-4xl w-full px-4 sm:px-2">
                <div
                  id="techicon-card-0"
                  className={`col-span-1 flex justify-center fade-up${techIconsVisible[0] ? " visible" : ""}`}
                >
                  <SiTypescript size={60} color="#3178c6" />
                </div>
                <div
                  id="techicon-card-1"
                  className={`col-span-1 flex justify-center fade-up${techIconsVisible[1] ? " visible" : ""}`}
                >
                  <SiHtml5 size={60} color="#e34c26" />
                </div>
                <div
                  id="techicon-card-2"
                  className={`col-span-1 flex justify-center fade-up${techIconsVisible[2] ? " visible" : ""}`}
                >
                  <SiCss3 size={60} color="#1572b6" />
                </div>
                <div
                  id="techicon-card-3"
                  className={`col-span-1 flex justify-center fade-up${techIconsVisible[3] ? " visible" : ""}`}
                >
                  <SiDart size={60} color="#0175c2" />
                </div>
                <div
                  id="techicon-card-4"
                  className={`col-span-1 flex justify-center fade-up${techIconsVisible[4] ? " visible" : ""}`}
                >
                  <SiFlutter size={60} color="#02569b" />
                </div>
                <div
                  id="techicon-card-5"
                  className={`col-span-1 flex justify-center fade-up${techIconsVisible[5] ? " visible" : ""}`}
                >
                  <SiPhp size={60} color="#777bb4" />
                </div>
                <div
                  id="techicon-card-6"
                  className={`col-span-1 flex justify-center fade-up${techIconsVisible[6] ? " visible" : ""}`}
                >
                  <SiAngular size={60} color="#dd0031" />
                </div>
                <div
                  id="techicon-card-7"
                  className={`col-span-1 flex justify-center fade-up${techIconsVisible[7] ? " visible" : ""}`}
                >
                  <SiGit size={60} color="#f34f29" />
                </div>
                <div
                  id="techicon-card-8"
                  className={`col-span-1 flex justify-center fade-up${techIconsVisible[8] ? " visible" : ""}`}
                >
                  <SiMysql size={60} color="#4479a1" />
                </div>
                <div
                  id="techicon-card-9"
                  className={`col-span-1 flex justify-center fade-up${techIconsVisible[9] ? " visible" : ""}`}
                >
                  <SiPython size={60} color="#3776ab" />
                </div>
                <div
                  id="techicon-card-10"
                  className={`col-span-1 flex justify-center fade-up${techIconsVisible[10] ? " visible" : ""}`}
                >
                  <SiPostgresql size={60} color="#336791" />
                </div>
                <div
                  id="techicon-card-11"
                  className={`col-span-1 flex justify-center fade-up${techIconsVisible[11] ? " visible" : ""}`}
                >
                  <SiNetlify size={60} color="#00C7B7" />
                </div>
              </div>
            </div>

            <div className="w-full flex justify-center mt-8 sm:mt-12">
              <p className="text-white text-base sm:text-lg">{t.techAndMore}</p>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section
          id="projects"
          className="section-spacing max-w-7xl mx-auto px-4 sm:px-8 py-20 min-h-[90vh] flex flex-col justify-center"
        >
          <div className="mb-2">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#FF8C1A] tracking-tight leading-tight mb-1 text-left">
              {t.projectsTitle}
            </h2>
            <p className="text-base sm:text-lg text-[#F3F3F3] max-w-2xl text-left leading-relaxed tracking-normal mb-8">
              {t.projectsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
            {/* Project 1 - WIMAX Centro Médico */}
            <div
              id="project-card-0"
              className={`bg-[#181818]/90 rounded-2xl shadow-lg p-6 flex flex-col items-center fade-up${projectCardsVisible[0] ? " visible" : ""}`}
            >
              <FaUserMd size={48} className="text-[#25c6f9] mb-4" />
              <h3 className="text-xl font-bold text-white mb-1 text-center">{t.projectWimaxTitle}</h3>
              <p className="text-[#DCDCDC] text-center mb-3">{t.projectWimaxDesc}</p>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {t.projectWimaxTech.map((tech) => {
                  const Icon = tech.icon
                  return (
                    <span
                      key={tech.name}
                      className={`px-2 py-1 rounded text-xs flex items-center gap-1`}
                      style={{ background: tech.color, color: tech.color === "#FF8C1A" ? "#181818" : "#fff" }}
                    >
                      {Icon && <Icon size={16} />} {tech.name}
                    </span>
                  )
                })}
              </div>
              <a
                href="https://github.com/axelvalle/FINALWIMAX"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto bg-[#23272f] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#FF8C1A] hover:text-black transition flex items-center justify-center gap-2"
              >
                <FaGithub className="text-xl" />
                Github
              </a>
            </div>

            {/* Project 2 - StockFlow Mama Pola */}
            <div
              id="project-card-1"
              className={`bg-[#181818]/90 rounded-2xl shadow-lg p-6 flex flex-col items-center fade-up${projectCardsVisible[1] ? " visible" : ""}`}
            >
              <FaMobileAlt size={48} className="text-[#25c6f9] mb-4" />
              <h3 className="text-xl font-bold text-white mb-1 text-center">"StockFlow Mama Pola"</h3>
              <p className="text-[#DCDCDC] text-center mb-3">
                Mobile inventory and statistics app for small businesses.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <span className="bg-[#02569b] text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <SiFlutter size={16} />
                  Flutter
                </span>
                <span className="bg-[#0175c2] text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <SiDart size={16} />
                  Dart
                </span>
              </div>
              <a
                href="https://github.com/axelvalle/stockflow-mama-pola"
                className="mt-auto bg-[#23272f] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#FF8C1A] hover:text-black transition flex items-center justify-center gap-2"
              >
                <FaGithub className="text-xl" />
                Github
              </a>
            </div>

            {/* Project 3 - Yaleli Creations (Coming Soon) */}
            <div
              id="project-card-2"
              className={`bg-gradient-to-br from-[#FF8C1A]/80 to-[#23272f]/90 rounded-2xl shadow-lg p-6 flex flex-col items-center fade-up${projectCardsVisible[2] ? " visible" : ""} animate-pulse`}
            >
              <FaPaintBrush size={48} className="text-[#FF8C1A] mb-4 animate-bounce" />
              <h3 className="text-xl font-bold text-white mb-1 text-center">"Yaleli Creations"</h3>
              <p className="text-[#FFE7B0] text-center mb-3 font-semibold text-lg">Coming soon...</p>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <span className="bg-[#e34c26] text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <SiHtml5 size={16} />
                  HTML
                </span>
                <span className="bg-[#1572b6] text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <SiCss3 size={16} />
                  CSS
                </span>
                <span className="bg-[#3178c6] text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <SiTypescript size={16} />
                  TS
                </span>
                <span className="bg-[#dd0031] text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <SiAngular size={16} />
                  Angular
                </span>
              </div>
              <span className="mt-auto bg-[#23272f] text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 opacity-60 cursor-not-allowed">
                <FaGithub className="text-xl" />
                Github
              </span>
            </div>

            {/* Project 4 - Administración de Empresas */}
            <div
              id="project-card-3"
              className={`bg-[#181818]/90 rounded-2xl shadow-lg p-6 flex flex-col items-center fade-up${projectCardsVisible[3] ? " visible" : ""}`}
            >
              <FaUniversity size={48} className="text-[#3178c6] mb-4" />
              <h3 className="text-xl font-bold text-white mb-1 text-center">{t.projectAdmonTitle}</h3>
              <p className="text-[#DCDCDC] text-center mb-3">{t.projectAdmonDesc}</p>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {t.projectAdmonTech.map((tech) => {
                  const Icon = tech.icon
                  return (
                    <span
                      key={tech.name}
                      className={`px-2 py-1 rounded text-xs flex items-center gap-1`}
                      style={{ background: tech.color, color: tech.color === "#FF8C1A" ? "#181818" : "#fff" }}
                    >
                      {Icon && <Icon size={16} />} {tech.name}
                    </span>
                  )
                })}
              </div>
              <a
                href="https://github.com/axelvalle/Administracion_Empresas"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto bg-[#23272f] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#FF8C1A] hover:text-black transition flex items-center justify-center gap-2"
              >
                <FaGithub className="text-xl" />
                Github
              </a>
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section
          id="certifications"
          className="section-spacing max-w-7xl mx-auto px-4 sm:px-8 py-20 min-h-[60vh] flex flex-col justify-center"
        >
          <div className="mb-2">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#FF8C1A] tracking-tight leading-tight mb-1 text-left">
              {t.certificationsTitle}
            </h2>
            <p className="text-base sm:text-lg text-[#F3F3F3] max-w-2xl text-left leading-relaxed tracking-normal mb-8">
              {t.certificationsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
            {/* Python Certification */}
            <div className="bg-[#181818]/90 rounded-2xl shadow-lg p-6 flex flex-col items-center fade-up visible">
              <div className="flex items-center gap-2 mb-4">
                <SiPython size={40} className="text-[#3776ab]" />
                <FaCertificate size={32} className="text-[#FF8C1A]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1 text-center">{t.cert1Title}</h3>
              <div className="flex flex-wrap gap-2 justify-center mb-2">
                <span className="bg-[#3776ab] text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <SiPython size={14} />
                  {t.cert1Tags[0]}
                </span>
                <span className="bg-[#FF8C1A] text-black px-2 py-1 rounded text-xs flex items-center gap-1">
                  {t.cert1Tags[1]}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#F3F3F3] text-xs mb-2">
                <FaUniversity className="text-[#FF8C1A]" />
                <span>{t.cert1Uni}</span>
              </div>
              <span className="bg-[#23272f] text-[#FF8C1A] px-2 py-1 rounded text-xs font-semibold">{t.cert1Year}</span>
            </div>

            {/* PHP Certification */}
            <div className="bg-[#181818]/90 rounded-2xl shadow-lg p-6 flex flex-col items-center fade-up visible">
              <div className="flex items-center gap-2 mb-4">
                <SiPhp size={40} className="text-[#777bb4]" />
                <FaCertificate size={32} className="text-[#FF8C1A]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1 text-center">{t.cert2Title}</h3>
              <div className="flex flex-wrap gap-2 justify-center mb-2">
                <span className="bg-[#777bb4] text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <SiPhp size={14} />
                  {t.cert2Tags[0]}
                </span>
                <span className="bg-[#FF8C1A] text-black px-2 py-1 rounded text-xs flex items-center gap-1">
                  {t.cert2Tags[1]}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#F3F3F3] text-xs mb-2">
                <FaUniversity className="text-[#FF8C1A]" />
                <span>{t.cert2Uni}</span>
              </div>
              <span className="bg-[#23272f] text-[#FF8C1A] px-2 py-1 rounded text-xs font-semibold">{t.cert2Year}</span>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section
          id="social-media"
          className="relative max-w-7xl mx-auto px-4 sm:px-8 py-20 min-h-screen flex flex-col md:flex-row items-center justify-between overflow-hidden"
        >
          <div className="flex-1 w-full">
            <div className="w-full max-w-3xl mx-auto bg-[#232323] bg-opacity-90 rounded-3xl shadow-2xl p-6 sm:p-10 flex flex-col items-center justify-center border border-[#23272f]">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[#FF8C1A] tracking-tight leading-tight mb-1 text-left w-full">
                Social Media
              </h2>
              <p className="text-base sm:text-lg text-[#F3F3F3] max-w-2xl text-left leading-relaxed tracking-normal mb-8 w-full">
                You can find me on...
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                {/* Instagram */}
                <a
                  id="social-card-0"
                  href="https://instagram.com/perpetuaa_v"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 bg-[#232323] rounded-2xl p-4 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 group fade-up${socialCardsVisible[0] ? " visible" : ""}`}
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-tr from-pink-500 via-yellow-400 to-purple-600 group-hover:scale-110 transition">
                    <FaInstagram className="text-white text-3xl" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">Instagram</div>
                    <div className="text-[#DCDCDC] text-sm">@perpetuaa_v</div>
                  </div>
                </a>

                {/* X (Twitter) */}
                <a
                  id="social-card-1"
                  href="https://twitter.com/perpetua_v"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 bg-[#232323] rounded-2xl p-4 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 group fade-up${socialCardsVisible[1] ? " visible" : ""}`}
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-black group-hover:scale-110 transition">
                    <FaTwitter className="text-white text-3xl" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">X (formerly Twitter)</div>
                    <div className="text-[#DCDCDC] text-sm">@perpetua_v</div>
                  </div>
                </a>

                {/* Github */}
                <a
                  id="social-card-2"
                  href="https://github.com/axelvalle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 bg-[#232323] rounded-2xl p-4 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 group fade-up${socialCardsVisible[2] ? " visible" : ""}`}
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-[#181818] group-hover:scale-110 transition">
                    <FaGithub className="text-[#f4c152] text-3xl" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">Github</div>
                    <div className="text-[#DCDCDC] text-sm">@axelvalle</div>
                  </div>
                </a>

                {/* Email */}
                <a
                  id="social-card-3"
                  href="mailto:voldsoy@hotmail.com"
                  className={`flex items-center gap-4 bg-[#232323] rounded-2xl p-4 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 group fade-up${socialCardsVisible[3] ? " visible" : ""}`}
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-[#FF8C1A] group-hover:scale-110 transition">
                    <FaEnvelope className="text-black text-3xl" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">Email</div>
                    <div className="text-[#DCDCDC] text-sm">voldsoy@hotmail.com</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Imagen del personaje a la derecha */}
          <div className="flex flex-1 justify-center md:justify-end items-end mt-8 md:mt-0 animate-zoom-bounce">
            <div className="relative w-[260px] h-[420px] xs:w-[320px] xs:h-[520px] sm:w-[380px] sm:h-[600px]">
              <Image
                src="/character2.webp"
                alt="Character 2"
                fill
                className="object-contain drop-shadow-[0_5px_25px_rgba(255,140,26,0.5)]"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          </div>
        </section>

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
