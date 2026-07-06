"use client";

import { FaPlus, FaUndo } from "../icons";

/**
 * Floating Action Button — botón flotante naranja abajo a la derecha.
 * Solo se muestra si `visible` es true (controlado por el padre según isAuthenticated).
 *
 * Si `onReset` está definido, aparece un segundo botón más pequeño a la izquierda
 * para restablecer los proyectos a sus valores por defecto.
 */
export default function EditFab({
  visible,
  onClick,
  onReset,
  label = "Nuevo proyecto",
}: {
  visible: boolean;
  onClick: () => void;
  onReset?: () => void;
  label?: string;
}) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-3 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          aria-label="Restablecer proyectos"
          title="Restablecer proyectos por defecto"
          className="w-11 h-11 rounded-full bg-[#181818]/90 backdrop-blur-sm border border-[#FF8C1A]/30 text-[#FF8C1A] flex items-center justify-center shadow-lg hover:bg-[#FF8C1A] hover:text-black hover:border-[#FF8C1A] hover:-translate-y-0.5 active:scale-[0.95] transition-all"
        >
          <FaUndo size={14} />
        </button>
      )}
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className="group flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#FF8C1A] to-[#FFB300] text-black font-semibold shadow-lg shadow-[#FF8C1A]/30 hover:shadow-xl hover:shadow-[#FF8C1A]/50 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300"
      >
        <FaPlus size={16} />
        <span className="hidden sm:inline">Nuevo proyecto</span>
      </button>
    </div>
  );
}