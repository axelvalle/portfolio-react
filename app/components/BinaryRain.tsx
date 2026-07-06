'use client';
import { useEffect, useRef } from 'react';

export default function BinaryRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const letters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 18;

    type Drop = { y: number; speed: number; opacity: number };
    let columns = Math.floor(window.innerWidth / fontSize);
    let drops: Drop[] = Array.from({ length: columns }, () => ({
      y: Math.random() * window.innerHeight / fontSize,
      speed: 0.2 + Math.random() * 0.6,
      opacity: 0.08 + Math.random() * 0.18,
    }));

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(window.innerWidth / fontSize);
      drops = Array.from({ length: columns }, () => ({
        y: Math.random() * window.innerHeight / fontSize,
        speed: 0.2 + Math.random() * 0.6,
        opacity: 0.08 + Math.random() * 0.18,
      }));
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let rafId = 0;
    let lastTime = 0;
    const FRAME_MS = 1000 / 30; // 30fps: suficiente para estela binaria, ahorra CPU vs 60fps

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Si el usuario tiene reduce-motion, pintamos un solo frame estático y salimos.
    const isReducedMotion = motionQuery.matches;

    function draw(now: number) {
      if (!ctx || !canvas) return;

      // Throttle: solo pintar cuando haya pasado el tiempo mínimo.
      if (now - lastTime < FRAME_MS) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      lastTime = now;

      // Si la pestaña está oculta, pausar hasta que vuelva.
      if (document.hidden) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      ctx.fillStyle = 'rgba(10, 10, 10, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.globalAlpha = drop.opacity;
        ctx.fillStyle = '#FF8C1A';
        ctx.fillText(text, i * fontSize, drop.y * fontSize);
        if (drop.y * fontSize > canvas.height && Math.random() > 0.96) {
          drop.y = 0;
          drop.speed = 0.2 + Math.random() * 0.6;
          drop.opacity = 0.08 + Math.random() * 0.18;
        }
        drop.y += drop.speed;
      }
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(draw);
    }

    if (isReducedMotion) {
      // Render estático: una sola "lluvia" congelada. Sin loop, sin rAF.
      draw(0);
      // Listener por si cambia la preferencia en runtime.
      const onChange = (e: MediaQueryListEvent) => {
        if (!e.matches) {
          // El usuario ACTIVÓ motion: arrancamos la animación.
          rafId = requestAnimationFrame(draw);
          motionQuery.removeEventListener('change', onChange);
        }
      };
      motionQuery.addEventListener('change', onChange);
      return () => motionQuery.removeEventListener('change', onChange);
    }

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}