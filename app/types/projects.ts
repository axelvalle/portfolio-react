/**
 * Tipos para la capa de datos de Projects.
 *
 * `iconKey` apunta a un ícono de react-icons declarado en `app/icons.ts`,
 * NO al componente en sí, para que el store sea serializable a JSON sin
 * arrastrar referencias de React al localStorage.
 *
 * Forma del shape:
 * - title/desc ahora son mapas { en, es }. Un proyecto puede aparecer
 *   en targetLangs=[es] solo con title.es lleno y title.en vacío (o
 *   viceversa), o en ambos con ambos campos llenos.
 * - Para retrocompat, el storage puede traer title/desc como string
 *   (forma vieja). projectsStorage.ts se encarga de migrar.
 */
export type ProjectIconKey = "medical" | "mobile" | "brush" | "university";

export type TechBadgeIconKey =
  | "java"
  | "sqlserver"
  | "dotnet"
  | "flutter"
  | "dart"
  | "html"
  | "css"
  | "typescript"
  | "angular";

export type TechBadge = {
  name: string;
  color: string;
  iconKey?: TechBadgeIconKey | null;
};

/** Texto localizado por idioma. Permite campos vacíos (se mostrarán fallback). */
export type LocalizedText = {
  en: string;
  es: string;
};

export type Project = {
  id: string;
  iconKey: ProjectIconKey;
  title: LocalizedText;
  desc: LocalizedText;
  techs: TechBadge[];
  githubUrl: string;
  comingSoon?: boolean;
  /** Idiomas en los que aparece este proyecto. */
  targetLangs: ("en" | "es")[];
};

/** Lo que el editor recibe para crear/editar (sin id). */
export type ProjectInput = Omit<Project, "id">;