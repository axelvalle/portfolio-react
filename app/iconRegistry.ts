/**
 * Mapa de iconKey (string, serializable) → componente React de react-icons.
 *
 * Esto permite guardar proyectos en localStorage como JSON plano sin
 * referencias a componentes. El componente que renderiza la card consulta
 * este mapa para resolver el icono a partir del string guardado.
 */
import {
  FaUserMd,
  FaMobileAlt,
  FaPaintBrush,
  FaUniversity,
  FaJava,
  FaDatabase,
  SiDotnet,
  SiDart,
  SiFlutter,
  SiHtml5,
  SiCss3,
  SiTypescript,
  SiAngular,
  type IconType,
} from "./icons";
import type { ProjectIconKey, TechBadgeIconKey } from "./types/projects";

export const projectIcons: Record<ProjectIconKey, IconType> = {
  medical: FaUserMd,
  mobile: FaMobileAlt,
  brush: FaPaintBrush,
  university: FaUniversity,
};

export const techIcons: Partial<Record<TechBadgeIconKey, IconType>> = {
  java: FaJava,
  sqlserver: FaDatabase,
  dotnet: SiDotnet,
  dart: SiDart,
  flutter: SiFlutter,
  html: SiHtml5,
  css: SiCss3,
  typescript: SiTypescript,
  angular: SiAngular,
};