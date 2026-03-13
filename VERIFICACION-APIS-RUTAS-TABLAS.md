# Verificación: APIs, rutas, tablas y conexiones – CRONEC SRL

## 1. APIs (Route Handlers)

| Ruta | Método | Función | Conexión datos | Estado |
|------|--------|---------|-----------------|--------|
| `/api/contact` | POST | Recibe formulario de contacto | `readData`/`writeData` → `messages.json` (Postgres: `contact_submissions`, MySQL: `contact_submissions`, o JSON) | OK |
| `/api/upload` | POST | Sube imágenes (admin) | Sistema de archivos `public/uploads/` | OK |

- **Contact:** Validación de campos y email; escribe en BD o en `data/messages.json`.
- **Upload:** Protegido por `getCurrentUser()`; solo imágenes, máx. 5MB.

---

## 2. Rutas públicas (páginas)

| Ruta | Datos que usa | Origen (data-read / lib/data) | Estado |
|------|----------------|--------------------------------|--------|
| `/` | services, projects, company, testimonials, certifications, clients, sections | `getServicesPublic`, `getProjectsPublic`, `getCompanyInfo`, `getTestimonialsPublic`, `getCertificationsPublic`, `getClientsPublic`, `getSectionsPublic` | OK |
| `/servicios` | services | `getServicesPublic` | OK |
| `/servicios/[slug]` | service by slug | `getServiceBySlug`, `getServicesPublic` (params) | OK |
| `/proyectos` | projects | `getProjectsPublic` | OK |
| `/blog` | blog posts | `getBlogPostsPublic` | OK |
| `/blog/[slug]` | post by slug | `getBlogPostBySlug`, `getBlogPostsPublic` (params) | OK |
| `/nosotros` | nosotros, company | `getNosotrosPublic`, `getCompanyInfo` | OK |
| `/contacto` | company (opcional) | Formulario + Formspree (estático) o API (Node) | OK |
| `/calculadora` | calculadora config | `getCalculadoraPublic` | OK |
| `/brochure` | company | `getCompanyInfo` | OK |
| `/politica-privacidad`, `/terminos-condiciones`, `/politica-calidad` | Estáticas | Sin BD | OK |
| `layout.tsx` | company (JSON-LD, settings) | `getCompanyInfo` | OK |

Todas las páginas públicas usan `@/lib/data-read`, que a su vez usa `readData` de `lib/data.ts` (Postgres → MySQL → JSON).

---

## 3. Tablas en base de datos (Postgres / MySQL)

### En Postgres (Neon) y MySQL

| Tabla | Archivo lógico | Uso |
|-------|----------------|-----|
| `users` | `admins.json` | Login admin (read); creación con seed/script |
| `projects` | `projects.json` | Proyectos públicos y admin |
| `services` | `services.json` | Servicios y páginas /servicios/[slug] |
| `blog_posts` | `blog.json` | Blog público y admin |
| `contact_submissions` | `messages.json` | Mensajes de contacto y API /api/contact |
| `testimonials` | `testimonials.json` | Testimonios en home y admin |
| `company_info` | `settings.json` | Configuración / empresa (layout, contacto, etc.) |
| `hero_images` | `hero-images.json` | Imágenes hero por página |

### Solo en archivos JSON (sin tabla en este esquema)

| Archivo | Uso |
|---------|-----|
| `certifications.json` | Certificaciones (admin + sección clientes) |
| `clients.json` | Clientes (admin + sección clientes) |
| `nosotros.json` | Contenido Nosotros (admin lee/escribe con actions que usan archivo directo) |
| `sections.json` | Secciones “Por qué CRONEC” y “Proceso” (idem) |
| `calculadora.json` | Config cotizador (idem) |

Si se desea que certificaciones y clientes vivan en la BD, habría que añadir tablas `certifications` y `clients` y mapearlas en `lib/data.ts` y `lib/data-pg.ts` / `lib/data-mysql.ts`.

---

## 4. Conexiones (lib/data.ts)

Orden de uso de backend:

1. **Postgres (Neon):** si existe `DATABASE_URL` o `POSTGRES_URL` → se usa `lib/db-pg.ts` y `lib/data-pg.ts`.
2. **MySQL:** si no hay Postgres y están definidas `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_DATABASE` → se usa `lib/db.ts` y `lib/data-mysql.ts`.
3. **JSON:** en caso contrario, o como fallback si la BD falla o devuelve listas vacías para listas → `data/*.json`.

Archivos que sí usan BD (cuando está configurada):

- `projects.json`, `services.json`, `blog.json`, `messages.json`, `testimonials.json`, `settings.json`, `hero-images.json`, `admins.json`.

---

## 5. Server Actions (admin)

Todas usan `getCurrentUser()` y `readData`/`writeData` (o lectura/escritura directa a archivo donde aplica):

| Action / módulo | Archivo/BD | Estado |
|-----------------|------------|--------|
| `app/actions/db/projects.ts` | projects.json / `projects` | OK |
| `app/actions/db/services.ts` | services.json / `services` | OK |
| `app/actions/db/blog.ts` | blog.json / `blog_posts` | OK |
| `app/actions/db/contact.ts` | messages.json / `contact_submissions` | OK |
| `app/actions/db/testimonials.ts` | testimonials.json / `testimonials` | OK |
| `app/actions/db/company-info.ts` | settings.json / `company_info` | OK |
| `app/actions/db/hero-images.ts` | hero-images.json / `hero_images` | OK |
| `app/actions/db/certifications.ts` | certifications.json (solo archivo) | OK |
| `app/actions/db/clients.ts` | clients.json (solo archivo) | OK |
| `app/actions/db/admin-stats.ts` | admins, projects, services, testimonials, messages, blog | OK |
| `app/actions/db/nosotros.ts` | Lectura/escritura directa `data/nosotros.json` | OK |
| `app/actions/db/sections.ts` | Lectura/escritura directa `data/sections.json` | OK |
| `app/actions/db/calculadora.ts` | Lectura/escritura directa `data/calculadora.json` | OK |

---

## 6. Autenticación

- **Login:** `lib/auth.ts` → `readData("admins.json")` (Postgres: tabla `users`, MySQL: tabla `users`).
- **Sesión:** `iron-session` con cookie `cronec_session`; `SESSION_SECRET` obligatorio en producción.
- **Protección:** `middleware.ts` redirige `/admin` sin cookie a `/admin/login`; cada página admin comprueba `getCurrentUser()`.

---

## 7. Resumen de estado

| Área | Estado |
|------|--------|
| APIs (/api/contact, /api/upload) | Completas y conectadas a datos o archivos |
| Rutas públicas | Todas usan data-read y datos correctos |
| Tablas Postgres/MySQL | Coinciden con archivos lógicos usados en código |
| Conexión (Postgres → MySQL → JSON) | Prioridad y fallback correctos en `lib/data.ts` |
| Server Actions admin | Todas desarrolladas y usando BD o archivo según diseño |
| Certificaciones y clientes | Solo JSON; opcional migrar a tablas si se requiere |

Para comprobar la conexión a la base de datos en local, usar:

- `npm run db:init-pg` (crear/actualizar tablas Postgres).
- `node scripts/postgres/query-now.js` (consultas de prueba; opcional con URL como argumento).
