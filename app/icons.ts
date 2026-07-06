// Re-exports para que las secciones puedan importar íconos específicos sin
// arrastrar todo el módulo react-icons al bundle (con optimizePackageImports
// el bundler igual tree-shakea, pero esto deja claro qué íconos usa cada sección).

import type { IconType } from "react-icons";

// react-icons/si
export { SiDotnet, SiDart, SiFlutter, SiHtml5, SiCss3, SiTypescript, SiAngular } from "react-icons/si";

// react-icons/fa
export {
  FaJava,
  FaDatabase,
  FaUserMd,
  FaMobileAlt,
  FaPaintBrush,
  FaUniversity,
  FaCertificate,
  FaGithub,
  FaPhp,
  FaPython,
  FaCheckCircle,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaUser,
  FaLock,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaTrash,
  FaEdit,
  FaUndo,
} from "react-icons/fa";

export type { IconType };