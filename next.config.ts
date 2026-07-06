import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Tree-shake react-icons a nivel de icono: cada import FaCheckCircle baja solo ese SVG.
    optimizePackageImports: ["react-icons"],
  },
  images: {
    // Sirve AVIF cuando el browser lo soporta (más liviano que WebP), sino WebP.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;