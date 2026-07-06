"use client";

import { useEffect, useRef, useState } from "react";
import { FaUser, FaLock, FaTimes } from "react-icons/fa";

export default function LoginModal({
  open,
  onClose,
  onLogin,
}: {
  open: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => boolean;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const usernameRef = useRef<HTMLInputElement | null>(null);

  // Enfocar el primer input al abrir.
  useEffect(() => {
    if (open) {
      // Esperar a que el modal esté en el DOM.
      const id = setTimeout(() => usernameRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [open]);

  // Cerrar con Esc.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset al cerrar.
  useEffect(() => {
    if (!open) {
      setUsername("");
      setPassword("");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const ok = onLogin(username.trim(), password);
    setSubmitting(false);
    if (!ok) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }
    // onClose lo maneja el padre tras un login exitoso.
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Card */}
      <div
        className="relative w-full max-w-sm bg-[#181818]/95 backdrop-blur-md rounded-2xl border border-[#FF8C1A]/30 shadow-2xl p-6 sm:p-8 animate-fade-float"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full text-[#DCDCDC] hover:text-[#FF8C1A] hover:bg-[#FF8C1A]/10 transition-colors"
        >
          <FaTimes />
        </button>

        {/* Título */}
        <h2
          id="login-title"
          className="text-2xl font-extrabold text-[#FF8C1A] tracking-tight mb-1"
        >
          Iniciar sesión
        </h2>
        <p className="text-sm text-[#DCDCDC] mb-6">
          Accede para editar los proyectos del portafolio.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Usuario */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF8C1A] pointer-events-none" />
            <input
              ref={usernameRef}
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
              className="w-full pl-10 pr-3 py-2.5 rounded-full bg-[#0A0A0A]/80 text-white placeholder-[#777] border border-[#FF8C1A]/20 focus:border-[#FF8C1A] focus:outline-none focus:ring-1 focus:ring-[#FF8C1A] transition"
              required
              disabled={submitting}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF8C1A] pointer-events-none" />
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full pl-10 pr-3 py-2.5 rounded-full bg-[#0A0A0A]/80 text-white placeholder-[#777] border border-[#FF8C1A]/20 focus:border-[#FF8C1A] focus:outline-none focus:ring-1 focus:ring-[#FF8C1A] transition"
              required
              disabled={submitting}
            />
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

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !username || !password}
            className="w-full bg-gradient-to-r from-[#FF8C1A] to-[#FFB300] text-black font-semibold py-2.5 rounded-full hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Hint */}
        <p className="text-xs text-[#777] text-center mt-4">
          Demo: <code className="text-[#FF8C1A]">axel</code> /{" "}
          <code className="text-[#FF8C1A]">axel2024</code>
        </p>
      </div>
    </div>
  );
}