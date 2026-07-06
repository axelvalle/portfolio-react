"use client";

import { useState, useEffect, useRef } from "react";
import { FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";
import LoginModal from "./LoginModal";
import { useAuth } from "../hooks/useAuth";
import { showToast } from "../lib/toast";

type Lang = "en" | "es";

const NAV_ITEMS_EN = ["Projects", "Technologies", "Social Media"];
const NAV_ITEMS_ES = ["Proyectos", "Tecnologías", "Redes Sociales"];

const SECTION_IDS = ["projects", "technologies", "social-media"] as const;

export default function Navbar({
  lang,
  onLangChange,
  onLoginSuccess,
}: {
  lang: Lang;
  onLangChange: (next: Lang) => void;
  /**
   * Callback opcional disparado cuando un login es exitoso.
   * Usado por page.tsx para scrollear a #projects y abrir el modal "Nuevo".
   */
  onLoginSuccess?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnimating, setMenuAnimating] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loginOpen, setLoginOpen] = useState(false);
  const rafRef = useRef<number | null>(null);

  const { isAuthenticated, login, logout } = useAuth();

  const t = lang === "es" ? NAV_ITEMS_ES : NAV_ITEMS_EN;

  useEffect(() => {
    const id = setTimeout(() => setNavbarVisible(true), 100);
    return () => clearTimeout(id);
  }, []);

  // Barra de progreso de scroll: usa rAF para no bloquear el hilo en cada scroll event.
  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? Math.min(1, scrolled / max) : 0;
      setScrollProgress(pct);
      rafRef.current = null;
    };
    const onScroll = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMenuToggle = () => {
    if (menuOpen) {
      setMenuAnimating(true);
      setTimeout(() => {
        setMenuOpen(false);
        setMenuAnimating(false);
      }, 280);
    } else {
      setMenuOpen(true);
    }
  };

  const handleNavClick = () => handleMenuToggle();

  const handleLoginClick = async () => {
    if (isAuthenticated) {
      await logout();
      showToast("success", "Sesión cerrada");
    } else {
      setLoginOpen(true);
    }
  };

  const handleLoginSubmit = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    const ok = await login(username, password);
    if (ok) {
      setLoginOpen(false);
      showToast("success", "Login exitoso");
      // Notificamos al padre para que scrollee + abra el modal "Nuevo".
      onLoginSuccess?.();
    }
    return ok;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#FF8C1A]/20 transition-all duration-700 ${navbarVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-wide">&lt;&gt;Axel Valle</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 bg-[#181818]/80 rounded-full p-1 backdrop-blur-sm border border-[#FF8C1A]/20">
              {t.map((label, i) => (
                <a
                  key={label}
                  href={`#${SECTION_IDS[i]}`}
                  className="px-6 py-2 rounded-full text-sm font-medium text-white hover:text-[#FF8C1A] hover:bg-[#FF8C1A]/10 transition-all duration-300 relative group"
                >
                  {label}
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#FF8C1A] rounded-full transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                  isAuthenticated
                    ? "bg-[#FF8C1A] text-black border-[#FF8C1A]"
                    : "bg-[#181818]/80 text-white border-[#FF8C1A]/20 hover:bg-[#FF8C1A] hover:text-black"
                }`}
                onClick={handleLoginClick}
                aria-label={isAuthenticated ? "Cerrar sesión" : "Iniciar sesión"}
              >
                {isAuthenticated ? "Logout" : "Login"}
              </button>

              <button
                className="bg-[#181818]/80 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-[#FF8C1A] hover:text-black transition-all duration-300 border border-[#FF8C1A]/20"
                onClick={() => onLangChange(lang === "en" ? "es" : "en")}
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
                className={`px-2 py-1 rounded text-xs font-medium transition-all duration-300 border ${
                  isAuthenticated
                    ? "bg-[#FF8C1A] text-black border-[#FF8C1A]"
                    : "bg-[#181818]/80 text-white border-[#FF8C1A]/20 hover:bg-[#FF8C1A] hover:text-black"
                }`}
                onClick={handleLoginClick}
                aria-label={isAuthenticated ? "Cerrar sesión" : "Iniciar sesión"}
              >
                {isAuthenticated ? "Logout" : "Login"}
              </button>

              <button
                className="bg-[#181818]/80 text-white px-2 py-1 rounded text-xs font-medium hover:bg-[#FF8C1A] hover:text-black transition-all duration-300"
                onClick={() => onLangChange(lang === "en" ? "es" : "en")}
                aria-label="Change language"
              >
                {lang === "en" ? "ES" : "EN"}
              </button>

              <button
                className="relative p-2 w-9 h-9 flex flex-col items-center justify-center focus:outline-none"
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={menuOpen}
                onClick={handleMenuToggle}
              >
                <span
                  className={`block w-6 h-0.5 bg-[#FF8C1A] rounded transition-all duration-300 ease-out ${
                    menuOpen ? "translate-y-[5px] rotate-45" : "translate-y-0 rotate-0"
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-[#FF8C1A] my-1.5 rounded transition-all duration-300 ease-out ${
                    menuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-[#FF8C1A] rounded transition-all duration-300 ease-out ${
                    menuOpen ? "-translate-y-[5px] -rotate-45" : "translate-y-0 rotate-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden mobile-menu ${menuOpen || menuAnimating ? "open" : ""}`}>
            <div className="py-4 space-y-2 bg-[#181818]/95 rounded-lg mt-2 border border-[#FF8C1A]/20">
              {t.map((label, i) => (
                <a
                  key={label}
                  href={`#${SECTION_IDS[i]}`}
                  className="block px-4 py-2 text-white hover:text-[#FF8C1A] hover:bg-[#FF8C1A]/10 transition-all duration-300"
                  onClick={handleNavClick}
                >
                  {label}
                </a>
              ))}

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

        {/* Scroll progress bar — absolute sobre el borde inferior del navbar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="h-full bg-gradient-to-r from-[#FF8C1A] to-[#FFB300] origin-left"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>
      </nav>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLoginSubmit}
      />
    </>
  );
}