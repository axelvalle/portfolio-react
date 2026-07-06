"use client";

import { useToasts, dismissToast } from "../lib/toast";

const KIND_STYLES = {
  success: "bg-gradient-to-r from-[#FF8C1A] to-[#FFB300] text-black",
  error: "bg-red-500/95 text-white border border-red-300/40",
  info: "bg-[#181818]/95 text-white border border-[#FF8C1A]/30",
} as const;

export default function ToastHost() {
  const { toasts, hydrated } = useToasts();

  if (!hydrated) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-20 right-4 z-[200] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismissToast(t.id)}
          className={`pointer-events-auto px-4 py-2.5 rounded-full shadow-xl text-sm font-semibold animate-fade-float ${KIND_STYLES[t.kind]}`}
        >
          {t.message}
        </button>
      ))}
    </div>
  );
}