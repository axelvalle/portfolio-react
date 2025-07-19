'use client';

import Image from "next/image";
import BinaryRain from "./components/BinaryRain";
import { useState, useEffect, useRef } from "react";
import { SiTypescript, SiHtml5, SiCss3, SiDart, SiFlutter, SiPhp, SiAngular, SiGit, SiMysql, SiPython, SiPostgresql, SiVercel } from "react-icons/si";
import { FaReact, FaMobileAlt, FaPaintBrush, FaInstagram, FaTwitter, FaGithub, FaEnvelope } from "react-icons/fa";
import { FaUniversity, FaCertificate } from "react-icons/fa";
import { MdOutlineHive } from "react-icons/md";


function useSectionFadeIn(ids: string[]) {
  const [visible, setVisible] = useState(ids.map(() => false));
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ids.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (el) {
        const obs = new window.IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisible(v => {
                const copy = [...v];
                copy[idx] = true;
                return copy;
              });
            }
          },
          { threshold: 0.3 }
        );
        obs.observe(el);
        observers.push(obs);
      }
    });
    return () => observers.forEach(o => o.disconnect());
  }, [ids]);
  return visible;
}

function useFadeInOnScroll(count: number, prefix: string) {
  const [visible, setVisible] = useState(Array(count).fill(false));
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (let i = 0; i < count; i++) {
      const el = document.getElementById(`${prefix}-card-${i}`);
      if (el) {
        const obs = new window.IntersectionObserver(
          ([entry]) => {
            setVisible(v => {
              const copy = [...v];
              copy[i] = entry.isIntersecting;
              return copy;
            });
          },
          { threshold: 0.2 }
        );
        obs.observe(el);
        observers.push(obs);
      }
    }
    return () => observers.forEach(o => o.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, prefix]);
  return visible;
}

const translations = {
  en: {
    navbar: ["Projects", "Technologies", "Social Media"],
    heroTitle1: "Systems",
    heroTitle2: "Engineer",
    heroDesc: '"My name is Axel. I\'m a Systems Engineering student and a passionate developer, specializing in mobile and web development."',
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
    liveDemo: "Live Demo"
  },
  es: {
    navbar: ["Proyectos", "Tecnologías", "Redes Sociales"],
    heroTitle1: "Ingeniero",
    heroTitle2: "de Sistemas",
    heroDesc: '"Mi nombre es Axel. Soy estudiante de Ingeniería en Sistemas y un desarrollador apasionado, especializado en desarrollo móvil y web."',
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
    liveDemo: "Ver Demo"
  }
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnimating, setMenuAnimating] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 = hero visible, 1 = tech visible
  const heroRef = useRef<HTMLElement | null>(null);
  const techRef = useRef<HTMLElement | null>(null);
  const [techVisible] = useSectionFadeIn(['technologies']);
  const projectCardsVisible = useFadeInOnScroll(3, 'project');
  const techIconsVisible = useFadeInOnScroll(12, 'techicon');
  const socialCardsVisible = useFadeInOnScroll(4, 'social');
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      const hero = heroRef.current;
      const tech = techRef.current;
      if (hero && tech) {
        const heroRect = hero.getBoundingClientRect();
        const techRect = tech.getBoundingClientRect();
        const windowH = window.innerHeight;
        // Cuando la parte inferior del hero llega al top, empieza la transición
        const start = heroRect.height * 0.4; // puedes ajustar el 0.4 para el punto de inicio
        const end = techRect.top;
        const progress = 1 - Math.max(0, Math.min(1, end / start));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Maneja la animación de cierre
  const handleMenuToggle = () => {
    if (menuOpen) {
      setMenuAnimating(true);
      setTimeout(() => {
        setMenuOpen(false);
        setMenuAnimating(false);
      }, 280); // Debe coincidir con la duración de la animación de salida
    } else {
      setMenuOpen(true);
    }
  };
  return (
    <>
      <BinaryRain />
      <main
        className="bg-[#0A0A0A]/40 text-white overflow-hidden relative"
        style={{
          backgroundSize: '20px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
        }}>
          {/* Navbar */}
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between py-4 sm:py-6">
            <button
              className="bg-[#23272f] text-white px-3 py-1 rounded-lg font-bold hover:bg-[#FF8C1A] hover:text-black transition"
              onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              aria-label="Change language"
            >
              {lang === 'en' ? 'ES' : 'EN'}
            </button>
            <header className="z-10 w-full flex flex-col sm:flex-row items-center justify-between font-semibold text-white gap-4 sm:gap-0">
              <div className="flex items-center space-x-2 text-xl mb-2 sm:mb-0 w-full sm:w-auto justify-between">
                <div className="flex items-center justify-center w-full">
                  <Image src="/logo.svg" alt="Logo" width={200} height={320} className="max-w-[85vw] sm:max-w-[260px] h-auto" />
                </div>
                {/* Botón hamburguesa solo en móviles */}
                <button
                  className="sm:hidden p-2 focus:outline-none"
                  aria-label="Abrir menú"
                  onClick={handleMenuToggle}
                >
                  <span className="block w-7 h-1 bg-[#FF8C1A] mb-1 rounded"></span>
                  <span className="block w-7 h-1 bg-[#FF8C1A] mb-1 rounded"></span>
                  <span className="block w-7 h-1 bg-[#FF8C1A] rounded"></span>
                </button>
              </div>
              {/* Menú desplegable en móviles */}
              <nav className={`w-full sm:w-auto ${(menuOpen || menuAnimating) ? 'block' : 'hidden'} sm:block`}>
                <ul className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 text-white sm:bg-transparent sm:rounded-none sm:shadow-none sm:p-0 sm:mt-0 mt-2 menu-dropdown-style ${menuOpen && !menuAnimating ? 'menu-dropdown-animate-in' : ''}${!menuOpen && menuAnimating ? ' menu-dropdown-animate-out' : ''}`}> 
                  <li><a href="#projects" className="group relative transition text-white hover:text-[#FF8C1A]" onClick={handleMenuToggle}>{t.navbar[0]}<span className='absolute left-0 -bottom-1 w-0 h-1 bg-[#FF8C1A] rounded transition-all duration-300 group-hover:w-full'></span></a></li>
                  <li><a href="#technologies" className="group relative transition text-white hover:text-[#FF8C1A]" onClick={handleMenuToggle}>{t.navbar[1]}<span className='absolute left-0 -bottom-1 w-0 h-1 bg-[#FF8C1A] rounded transition-all duration-300 group-hover:w-full'></span></a></li>
                  <li><a href="#social-media" className="group relative transition text-white hover:text-[#FF8C1A]" onClick={handleMenuToggle}>{t.navbar[2]}<span className='absolute left-0 -bottom-1 w-0 h-1 bg-[#FF8C1A] rounded transition-all duration-300 group-hover:w-full'></span></a></li>
                </ul>
              </nav>
              {/* Social icons in navbar */}
              <div className="hidden sm:flex items-center gap-4 ml-6">
                <a href="https://instagram.com/perpetuaa_v" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#FF8C1A] transition text-2xl"><FaInstagram /></a>
                <a href="https://twitter.com/perpetua_v" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-[#FF8C1A] transition text-2xl"><FaTwitter /></a>
                <a href="https://github.com/axelvalle" target="_blank" rel="noopener noreferrer" aria-label="Github" className="hover:text-[#FF8C1A] transition text-2xl"><FaGithub /></a>
              </div>
            </header>
          </div>

          {/* Hero Section */}
          <section
            id="hero"
            ref={heroRef}
            className="z-10 flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-7xl mt-[-1.5rem] md:mt-2 gap-8 md:gap-0"
          >
            {/* Text Side */}
            <div className="flex flex-col items-center justify-center w-full md:max-w-xl text-center mt-0 md:mt-0">
              <h1 className="montserrat-title text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-extrabold leading-[1.05] tracking-tight md:leading-[1.08] md:tracking-tight mb-2" style={{letterSpacing: '-0.02em'}}>
                <span className="block text-[#FF8C1A] drop-shadow-[0_2px_10px_#FF8C1A88]">{t.heroTitle1}</span>
                <span className="block text-[#FFE7B0] text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-bold mt-1">{t.heroTitle2}</span>
              </h1>
              <p className="mt-3 sm:mt-5 text-base xs:text-lg sm:text-xl text-[#DCDCDC] max-w-xs sm:max-w-lg mx-auto font-medium">
                {t.heroDesc}
              </p>
            </div>

            {/* Character Image */}
            <div className="relative mt-6 md:mt-0 w-[220px] h-[320px] xs:w-[260px] xs:h-[380px] sm:w-[300px] sm:h-[420px] md:w-[360px] md:h-[520px] flex-shrink-0 animate-float">
              <div className="absolute inset-0 bg-gradient-to-t from-[#FF8C1A]/40 to-transparent rounded-full blur-2xl z-0"></div>
              <Image
                src="/character.webp"
                alt="Axel Cartoon"
                fill
                className="z-10 object-contain drop-shadow-[0_5px_25px_rgba(255,140,26,0.5)]"
                draggable={false}
                onContextMenu={e => e.preventDefault()}
              />
            </div>
          </section>

          {/* Technologies Section */}
          <section
            id="technologies"
            ref={techRef}
            className={`scroll-snap-section fullpage-section slice-section full-vh-center section-spacing z-10 w-full max-w-7xl mx-auto px-2 sm:px-8 rounded-t-[2.5rem] rounded-b-[2.5rem] shadow-xl${techVisible ? ' visible' : ''}`}
            style={{ background: 'rgba(24, 24, 24, 0.75)' }}
          >
            <div className="slice-top">
              {/* Puedes agregar SVG decorativo aquí si quieres */}
            </div>
            <div className="mb-2">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[#FF8C1A] tracking-tight leading-tight mb-1 text-left">{t.techTitle}</h2>
              <p className="text-base sm:text-lg text-[#F3F3F3] max-w-2xl text-left leading-relaxed tracking-normal mb-8">{t.techDesc}</p>
            </div>
            <div className="flex flex-col items-center w-full">
              <div className="w-full flex justify-center">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-y-8 gap-x-8 sm:gap-x-10 mb-0 max-w-[340px] sm:max-w-2xl md:max-w-4xl w-full px-4 sm:px-2">
                  <div id="techicon-card-0" className={`col-span-1 flex justify-center fade-up${techIconsVisible[0] ? ' visible' : ''}`}><SiTypescript size={60} color="#3178c6" /></div>
                  <div id="techicon-card-1" className={`col-span-1 flex justify-center fade-up${techIconsVisible[1] ? ' visible' : ''}`}><SiHtml5 size={60} color="#e34c26" /></div>
                  <div id="techicon-card-2" className={`col-span-1 flex justify-center fade-up${techIconsVisible[2] ? ' visible' : ''}`}><SiCss3 size={60} color="#1572b6" /></div>
                  <div id="techicon-card-3" className={`col-span-1 flex justify-center fade-up${techIconsVisible[3] ? ' visible' : ''}`}><SiDart size={60} color="#0175c2" /></div>
                  <div id="techicon-card-4" className={`col-span-1 flex justify-center fade-up${techIconsVisible[4] ? ' visible' : ''}`}><SiFlutter size={60} color="#02569b" /></div>
                  <div id="techicon-card-5" className={`col-span-1 flex justify-center fade-up${techIconsVisible[5] ? ' visible' : ''}`}><SiPhp size={60} color="#777bb4" /></div>
                  <div id="techicon-card-6" className={`col-span-1 flex justify-center fade-up${techIconsVisible[6] ? ' visible' : ''}`}><SiAngular size={60} color="#dd0031" /></div>
                  <div id="techicon-card-7" className={`col-span-1 flex justify-center fade-up${techIconsVisible[7] ? ' visible' : ''}`}><SiGit size={60} color="#f34f29" /></div>
                  <div id="techicon-card-8" className={`col-span-1 flex justify-center fade-up${techIconsVisible[8] ? ' visible' : ''}`}><SiMysql size={60} color="#4479a1" /></div>
                  <div id="techicon-card-9" className={`col-span-1 flex justify-center fade-up${techIconsVisible[9] ? ' visible' : ''}`}><SiPython size={60} color="#3776ab" /></div>
                  <div id="techicon-card-10" className={`col-span-1 flex justify-center fade-up${techIconsVisible[10] ? ' visible' : ''}`}><SiPostgresql size={60} color="#336791" /></div>
                  <div id="techicon-card-11" className={`col-span-1 flex justify-center fade-up${techIconsVisible[11] ? ' visible' : ''}`}><SiVercel size={60} color="#47a248" /></div>
                </div>
              </div>
              <div className="w-full flex justify-center mt-8 sm:mt-12">
                <p className="text-white text-base sm:text-lg">{t.techAndMore}</p>
              </div>
            </div>
            <div className="slice-bottom">
              {/* Puedes agregar SVG decorativo aquí si quieres */}
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="section-spacing max-w-7xl mx-auto px-2 sm:px-8 min-h-[90vh] flex flex-col justify-center">
            <div className="mb-2">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[#FF8C1A] tracking-tight leading-tight mb-1 text-left">{t.projectsTitle}</h2>
              <p className="text-base sm:text-lg text-[#F3F3F3] max-w-2xl text-left leading-relaxed tracking-normal mb-8">{t.projectsDesc}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
              {/* Project 1 */}
              <div id="project-card-0" className={`bg-[#181818]/90 rounded-2xl shadow-lg p-6 flex flex-col items-center fade-up${projectCardsVisible[0] ? ' visible' : ''}`}>
                <MdOutlineHive size={48} className="text-[#FFB300] mb-4" />
                <h3 className="text-xl font-bold text-white mb-1 text-center">“Flor Miel de Abeja”</h3>
                <p className="text-[#DCDCDC] text-center mb-3">A web platform for a honey business, with company info and product catalog.</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  <span className="bg-[#e34c26] text-white px-2 py-1 rounded text-xs flex items-center gap-1"><SiHtml5 size={16}/>HTML</span>
                  <span className="bg-[#1572b6] text-white px-2 py-1 rounded text-xs flex items-center gap-1"><SiCss3 size={16}/>CSS</span>
                  <span className="bg-[#3178c6] text-white px-2 py-1 rounded text-xs flex items-center gap-1"><SiTypescript size={16}/>TS</span>
                  <span className="bg-[#dd0031] text-white px-2 py-1 rounded text-xs flex items-center gap-1"><SiAngular size={16}/>Angular</span>
                </div>
                <a href="#" className="mt-auto bg-[#23272f] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#FF8C1A] hover:text-black transition">{t.liveDemo}</a>
              </div>
              {/* Project 2 */}
              <div id="project-card-1" className={`bg-[#181818]/90 rounded-2xl shadow-lg p-6 flex flex-col items-center fade-up${projectCardsVisible[1] ? ' visible' : ''}`}>
                <FaMobileAlt size={48} className="text-[#25c6f9] mb-4" />
                <h3 className="text-xl font-bold text-white mb-1 text-center">“StockFlow Mama Pola”</h3>
                <p className="text-[#DCDCDC] text-center mb-3">Mobile inventory and statistics app for small businesses.</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  <span className="bg-[#02569b] text-white px-2 py-1 rounded text-xs flex items-center gap-1"><SiFlutter size={16}/>Flutter</span>
                  <span className="bg-[#0175c2] text-white px-2 py-1 rounded text-xs flex items-center gap-1"><SiDart size={16}/>Dart</span>
                </div>
                <a href="#" className="mt-auto bg-[#23272f] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#FF8C1A] hover:text-black transition">{t.liveDemo}</a>
              </div>
              {/* Project 3 */}
              <div id="project-card-2" className={`bg-[#181818]/90 rounded-2xl shadow-lg p-6 flex flex-col items-center fade-up${projectCardsVisible[2] ? ' visible' : ''}`}>
                <FaPaintBrush size={48} className="text-[#FF8C1A] mb-4" />
                <h3 className="text-xl font-bold text-white mb-1 text-center">“Yaleli Creations”</h3>
                <p className="text-[#DCDCDC] text-center mb-3">A creative portfolio for an artist, with gallery and contact form.</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  <span className="bg-[#e34c26] text-white px-2 py-1 rounded text-xs flex items-center gap-1"><SiHtml5 size={16}/>HTML</span>
                  <span className="bg-[#1572b6] text-white px-2 py-1 rounded text-xs flex items-center gap-1"><SiCss3 size={16}/>CSS</span>
                  <span className="bg-[#3178c6] text-white px-2 py-1 rounded text-xs flex items-center gap-1"><SiTypescript size={16}/>TS</span>
                  <span className="bg-[#dd0031] text-white px-2 py-1 rounded text-xs flex items-center gap-1"><SiAngular size={16}/>Angular</span>
                </div>
                <a href="#" className="mt-auto bg-[#23272f] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#FF8C1A] hover:text-black transition">{t.liveDemo}</a>
              </div>
            </div>
          </section>

          {/* Certifications Section */}
          <section id="certifications" className="section-spacing max-w-7xl mx-auto px-2 sm:px-8 min-h-[60vh] flex flex-col justify-center">
            <div className="mb-2">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[#FF8C1A] tracking-tight leading-tight mb-1 text-left">{t.certificationsTitle}</h2>
              <p className="text-base sm:text-lg text-[#F3F3F3] max-w-2xl text-left leading-relaxed tracking-normal mb-8">{t.certificationsDesc}</p>
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
                  <span className="bg-[#3776ab] text-white px-2 py-1 rounded text-xs flex items-center gap-1"><SiPython size={14}/>{t.cert1Tags[0]}</span>
                  <span className="bg-[#FF8C1A] text-black px-2 py-1 rounded text-xs flex items-center gap-1">{t.cert1Tags[1]}</span>
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
                  <span className="bg-[#777bb4] text-white px-2 py-1 rounded text-xs flex items-center gap-1"><SiPhp size={14}/>{t.cert2Tags[0]}</span>
                  <span className="bg-[#FF8C1A] text-black px-2 py-1 rounded text-xs flex items-center gap-1">{t.cert2Tags[1]}</span>
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
          <section id="social-media" className="relative max-w-7xl mx-auto px-2 sm:px-8 min-h-screen flex flex-col md:flex-row items-center justify-between overflow-hidden">
            <div className="flex-1 w-full">
              <div className="w-full max-w-3xl mx-auto bg-[#232323] bg-opacity-90 rounded-3xl shadow-2xl p-6 sm:p-10 flex flex-col items-center justify-center border border-[#23272f]">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-[#FF8C1A] tracking-tight leading-tight mb-1 text-left w-full">Social Media</h2>
                <p className="text-base sm:text-lg text-[#F3F3F3] max-w-2xl text-left leading-relaxed tracking-normal mb-8 w-full">You can find me on...</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  {/* Instagram */}
                  <a
                    id="social-card-0"
                    href="https://instagram.com/perpetuaa_v"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-4 bg-[#232323] rounded-2xl p-4 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 group fade-up${socialCardsVisible[0] ? ' visible' : ''}`}
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
                    className={`flex items-center gap-4 bg-[#232323] rounded-2xl p-4 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 group fade-up${socialCardsVisible[1] ? ' visible' : ''}`}
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
                    className={`flex items-center gap-4 bg-[#232323] rounded-2xl p-4 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 group fade-up${socialCardsVisible[2] ? ' visible' : ''}`}
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
                    className={`flex items-center gap-4 bg-[#232323] rounded-2xl p-4 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 group fade-up${socialCardsVisible[3] ? ' visible' : ''}`}
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
            {/* Character image right */}
            <div className="flex flex-1 justify-center md:justify-end items-end mt-8 md:mt-0 animate-zoom-bounce">
              <div className="relative w-[260px] h-[420px] xs:w-[320px] xs:h-[520px] sm:w-[380px] sm:h-[600px]">
                <Image
                  src="/character2.webp"
                  alt="Character 2"
                  fill
                  className="object-contain drop-shadow-[0_5px_25px_rgba(255,140,26,0.5)]"
                  draggable={false}
                  onContextMenu={e => e.preventDefault()}
                />
              </div>
            </div>
          </section>

      {/* Footer */}
      <footer className="w-full bg-[#181818] text-[#FF8C1A] py-8 mt-12 flex flex-col items-center justify-center text-center">
        <div className="text-2xl font-bold mb-2">Axel Valle</div>
        <div className="text-sm text-[#DCDCDC] mb-2">&copy; {new Date().getFullYear()} All rights reserved.</div>
        <div className="flex gap-4 text-[#FF8C1A]">
          <a href="https://github.com/axelvalle" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Github</a>
          <a href="mailto:voldsoy@hotmail.com" className="hover:text-white transition">Email</a>
        </div>
      </footer>
        </main>
    </>
  );
}
