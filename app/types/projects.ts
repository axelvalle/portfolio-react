/**
 * Tipos para la capa de datos de Projects.
 *
 * `iconKey` apunta a un ícono de react-icons declarado en `app/icons.ts`,
 * NO al componente en sí, para que el store sea serializable a JSON sin
 * arrastrar referencias de React al localStorage.
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
  color: string;        // hex (#RRGGBB)
  iconKey?: TechBadgeIconKey | null;
};

export type Project = {
  id: string;           // crypto.randomUUID()
  iconKey: ProjectIconKey;
  title: string;
  desc: string;
  techs: TechBadge[];
  githubUrl: string;
  comingSoon?: boolean;
  /** Idioma al que pertenece. "" = ambos. */
  lang: "en" | "es" | "";
};

/** Lo que el editor recibe para crear/editar (sin id). */
export type ProjectInput = Omit<Project, "id">;