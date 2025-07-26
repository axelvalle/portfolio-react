'use client';
import { useEffect, useRef } from 'react';

export default function BinaryRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Caracteres variados para un efecto más Matrix
    const letters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 18;
    let columns = Math.floor(window.innerWidth / fontSize);
    // Cada gota tiene su y, velocidad y opacidad
    let drops = Array.from({ length: columns }, () => ({
      y: Math.random() * window.innerHeight / fontSize,
      speed: 0.2 + Math.random() * 0.6,
      opacity: 0.08 + Math.random() * 0.18, // Mucho más transparente
    }));

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(window.innerWidth / fontSize);
      drops = Array.from({ length: columns }, () => ({
        y: Math.random() * window.innerHeight / fontSize,
        speed: 0.2 + Math.random() * 0.6,
        opacity: 0.08 + Math.random() * 0.18, // Mucho más transparente
      }));
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      if (!ctx) return;
      // Fondo translúcido para el efecto de estela
      ctx.fillStyle = 'rgba(10, 10, 10, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = fontSize + 'px monospace';
      ctx.shadowColor = '#FF8C1A';
      ctx.shadowBlur = 8;

      drops.forEach((drop, i) => {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        const x = i * fontSize;
        ctx.globalAlpha = drop.opacity;
        ctx.fillStyle = '#FF8C1A';
        ctx.fillText(text, x, drop.y * fontSize);
        ctx.globalAlpha = 1;
        // Reinicia la gota aleatoriamente
        if (drop.y * fontSize > canvas.height && Math.random() > 0.96) {
          drop.y = 0;
          drop.speed = 0.2 + Math.random() * 0.6;
          drop.opacity = 0.08 + Math.random() * 0.18;
        }
        drop.y += drop.speed;
      });
      ctx.shadowBlur = 0;
    };

    const interval = setInterval(draw, 70);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{ filter: 'blur(0.5px) brightness(1.1)' }}
    />
  );
}