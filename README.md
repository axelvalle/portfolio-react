# Portfolio — Axel Valle

Portfolio personal con login para editar proyectos.

## Auth (Vercel deployment)

El login es server-side. Configurar estas env vars en Vercel → Settings → Environment Variables:

```
ADMIN_USER=admin
ADMIN_PASSWORD_HASH=<bcrypt hash>
AUTH_SECRET=<random 32+ bytes hex>
```

### Generar los valores

**`ADMIN_PASSWORD_HASH`** — hash bcrypt de tu contraseña:

```bash
node -e "console.log(require('bcryptjs').hashSync('TU_PASSWORD_AQUI', 10))"
```

**`AUTH_SECRET`** — 32+ bytes random para firmar tokens de sesión:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiá el output a las env vars. Sin ellas el login responde 401.

### Cómo funciona

- `/api/auth/login` (POST) valida con bcrypt, devuelve cookie `httpOnly` con token HMAC-SHA256 firmado
- `/api/auth/me` (GET) devuelve si hay sesión activa
- `/api/auth/logout` (POST) limpia la cookie
- La contraseña **nunca** aparece en el bundle del cliente
- El cliente solo hace `fetch` a esos 3 endpoints; el token nunca es accesible desde JS

## Local dev

```bash
npm install
cp .env.example .env.local
# Editá .env.local con tus valores
npm run dev
```

## Stack

- Next.js 15 (App Router) + TypeScript estricto + Tailwind v4
- `@hello-pangea/dnd` y `recharts` (vienen del template original)
- `react-icons` para los íconos de tech
- Auth server-side con `bcryptjs` y `crypto` nativo de Node

## Estructura

- `app/page.tsx` — composición de la home
- `app/components/sections/` — Hero, Projects, Certifications, SocialMedia (lazy-loaded)
- `app/components/{BinaryRain,Navbar,EditFab,LoginModal,LangFade,ToastHost,ProjectEditorModal}` — UI
- `app/hooks/` — `useAuth`, `useProjects`, `useFadeInOnScroll`
- `app/lib/` — `auth-server`, `auth`, `projectsStorage`, `translate`, `toast`
- `app/i18n/` — strings + defaults por idioma
- `app/types/` — tipos compartidos
- `app/api/auth/` — endpoints serverless (login/logout/me)