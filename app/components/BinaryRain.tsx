"use client"

import { useEffect, useRef } from "react"

const BinaryRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = document.body.offsetWidth
    let h = document.body.offsetHeight
    canvas.width = w
    canvas.height = h

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const fontSize = 16
    const columns = w / fontSize

    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    function draw() {
      if (!ctx) return;
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#0F0";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length))
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > h && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    const intervalId = setInterval(draw, 33)

    const handleResize = () => {
      w = document.body.offsetWidth
      h = document.body.offsetHeight
      canvas.width = w
      canvas.height = h
    }

    window.addEventListener("resize", handleResize)

    return () => {
      clearInterval(intervalId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  )
}

export default BinaryRain
