import type { ComponentType } from "react";
import {
  FaJava,
  FaDatabase,
  FaUserMd,
  FaMobileAlt,
  FaPaintBrush,
  FaUniversity,
  SiDotnet,
} from "../icons";
// NOTA: SiDotnet y FaDatabase son re-exportados de ../icons para mantener
// este archivo libre de imports grandes directos de react-icons.

type Lang = "en" | "es";

export type TechBadge = { name: string; color: string; icon: ComponentType<{ size?: number }> | null };

export type ProjectCopy = {
  title: string;
  desc: string;
  techs: TechBadge[];
  githubUrl: string;
};

export const projectsCopy: Record<Lang, {
  title: string;
  desc: string;
  liveDemo: string;
  projects: ProjectCopy[];
}> = {
  en: {
    title: "Projects",
    desc: "A little bit about my work...",
    liveDemo: "Github",
    projects: [
      {
        title: "WIMAX Medical Center",
        desc: "Vaccination management system using SQL Server, C# and .NET Framework.",
        techs: [
          { name: "SQL Server", color: "#23272f", icon: FaDatabase },
          { name: "C#", color: "#178600", icon: SiDotnet },
          { name: ".NET Framework", color: "#512BD4", icon: SiDotnet },
        ],
        githubUrl: "https://github.com/axelvalle/FINALWIMAX",
      },
      {
        title: '"StockFlow Mama Pola"',
        desc: "Mobile inventory and statistics app for small businesses.",
        techs: [],
        githubUrl: "https://github.com/axelvalle/stockflow-mama-pola",
      },
      {
        title: '"Yaleli Creations"',
        desc: "Coming soon...",
        techs: [],
        githubUrl: "",
      },
      {
        title: '"Administración de Empresas"',
        desc: "Desktop application in Java for business management: products, suppliers and payroll.",
        techs: [
          { name: "Java", color: "#3178c6", icon: FaJava },
          { name: "Swing", color: "#FF8C1A", icon: null },
          { name: "Text Files", color: "#23272f", icon: null },
        ],
        githubUrl: "https://github.com/axelvalle/Administracion_Empresas",
      },
    ],
  },
  es: {
    title: "Proyectos",
    desc: "Un poco sobre mi trabajo...",
    liveDemo: "Github",
    projects: [
      {
        title: "WIMAX Centro Médico",
        desc: "Sistema de gestión de vacunación usando SQL Server, C# y .NET Framework.",
        techs: [
          { name: "SQL Server", color: "#23272f", icon: FaDatabase },
          { name: "C#", color: "#178600", icon: SiDotnet },
          { name: ".NET Framework", color: "#512BD4", icon: SiDotnet },
        ],
        githubUrl: "https://github.com/axelvalle/FINALWIMAX",
      },
      {
        title: '"StockFlow Mama Pola"',
        desc: "App móvil de inventario y estadísticas para pequeños negocios.",
        techs: [],
        githubUrl: "https://github.com/axelvalle/stockflow-mama-pola",
      },
      {
        title: '"Yaleli Creations"',
        desc: "Próximamente...",
        techs: [],
        githubUrl: "",
      },
      {
        title: '"Administración de Empresas"',
        desc: "Aplicación de escritorio en Java para gestión administrativa: productos, proveedores y planillas.",
        techs: [
          { name: "Java", color: "#3178c6", icon: FaJava },
          { name: "Swing", color: "#FF8C1A", icon: null },
          { name: "Archivos de texto", color: "#23272f", icon: null },
        ],
        githubUrl: "https://github.com/axelvalle/Administracion_Empresas",
      },
    ],
  },
};

export const certificationsCopy = {
  en: {
    title: "Certifications",
    desc: "Certifications and training obtained from recognized institutions.",
    items: [
      {
        title: "Intermediate Python Programming",
        tags: ["Python", "Intermediate"],
        institution: "UNI Postgraduate Nicaragua",
        year: "2023",
        iconColor: "#3776ab",
      },
      {
        title: "Programming with PHP & MVC",
        tags: ["PHP", "MVC"],
        institution: "UNI Postgraduate Nicaragua",
        year: "2024",
        iconColor: "#777bb4",
      },
    ],
  },
  es: {
    title: "Certificaciones",
    desc: "Certificados y capacitaciones obtenidas en instituciones reconocidas.",
    items: [
      {
        title: "Programación Intermedia con Python",
        tags: ["Python", "Intermedio"],
        institution: "UNI Postgrado Nicaragua",
        year: "2023",
        iconColor: "#3776ab",
      },
      {
        title: "Programación con PHP y MVC",
        tags: ["PHP", "MVC"],
        institution: "UNI Postgrado Nicaragua",
        year: "2024",
        iconColor: "#777bb4",
      },
    ],
  },
} as const;

export const socialMediaCopy = {
  title: "Social Media",
  desc: "You can find me on...",
  cards: [
    {
      platform: "Instagram",
      handle: "@perpetuaa_v",
      url: "https://instagram.com/perpetuaa_v",
      gradient: "from-pink-500 via-yellow-400 to-purple-600",
      iconBg: "",
      iconClass: "text-white",
    },
    {
      platform: "X (formerly Twitter)",
      handle: "@perpetua_v",
      url: "https://twitter.com/perpetua_v",
      gradient: "",
      iconBg: "bg-black",
      iconClass: "text-white",
    },
    {
      platform: "Github",
      handle: "@axelvalle",
      url: "https://github.com/axelvalle",
      gradient: "",
      iconBg: "bg-[#181818]",
      iconClass: "text-[#f4c152]",
    },
    {
      platform: "Email",
      handle: "voldsoy@hotmail.com",
      url: "mailto:voldsoy@hotmail.com",
      gradient: "",
      iconBg: "bg-[#FF8C1A]",
      iconClass: "text-black",
    },
  ],
} as const;

// Static icons used as card illustrations (not techs)
export const projectCardIcons = {
  medical: FaUserMd,
  mobile: FaMobileAlt,
  brush: FaPaintBrush,
  university: FaUniversity,
} as const;