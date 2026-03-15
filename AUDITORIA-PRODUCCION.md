# Auditoría completa para producción – CRONEC SRL

**Fecha:** 15 de marzo de 2025  
**Objetivo:** Verificación exhaustiva de páginas públicas, dashboard, APIs, datos y despliegue. Garantizar que el desarrollo esté 100% listo para producción real.

---

## 1. Resumen ejecutivo

| Área | Estado | Notas |
|------|--------|--------|
| Build | ✅ OK | `npm run build` compila sin errores (Next.js 16.1.6). |
| Lint | ✅ OK | ESLint sin errores. |
| Páginas públicas | ✅ OK | Todas las rutas existen, metadata y datos desde `lib/data-read` o acciones. |
| Dashboard admin | ✅ OK | 20 rutas admin; sidebar fijo; login con redirect `next`; toasts shadcn visibles. |
| APIs | ✅ OK | `/api/contact`, `/api/upload`, `/api/health`, `/api/db-verify` implementadas y seguras. |
| Datos | ✅ OK | Postgres → MySQL → JSON; `lib/data.ts` unificado; sections/nosotros en archivo. |
| Auth | ✅ OK | iron-session, SESSION_SECRET, middleware con cookie y redirect. |
| Errores y 404 | ✅ OK | `error.tsx`, `global-error.tsx`, `not-found.tsx` presentes. |
| Variables de entorno | ✅ Documentado | `.env.local.example` y docs de despliegue actualizados. |

---

## 2. Páginas y secciones públicas

Todas verificadas en el build como rutas dinámicas (ƒ) o estáticas (○).

| Ruta | Descripción | Fuente de datos |
|------|-------------|------------------|
| `/` | Inicio | `getServicesPublic`, `getProjectsPublic`, `getCompanyInfo`, `getTestimonialsPublic`, `getCertificationsPublic`, `getClientsPublic`, `getSectionsPublic`, `getHeroImagesPublic("home")` |
| `/servicios` | Listado de servicios | `getServicesPublic()` |
| `/servicios/[slug]` | Detalle de servicio | `getServiceBySlug(slug)` |
| `/proyectos` | Portfolio | `getProjectsPublic()` + fallback `staticProjects` |
| `/blog` | Noticias / blog | `getBlogPostsPublic()` |
| `/blog/[slug]` | Entrada de blog | `getBlogPostBySlug(slug)` |
| `/contacto` | Formulario de contacto | Formulario → `/api/contact` o Formspree si `NEXT_PUBLIC_FORMSPREE_ID` |
| `/nosotros` | Sobre nosotros | `getNosotrosPublic()`, `getCompanyInfo()` (mission/vision) |
| `/calculadora` | Cotizador | Contenido estático + opcional datos desde dashboard |
| `/brochure` | Descarga brochure | URL desde configuración |
| `/politica-privacidad` | Legal | Contenido estático |
| `/politica-calidad` | Legal | Contenido estático |
| `/terminos-condiciones` | Legal | Contenido estático |
| `/robots.txt` | SEO | Estático |
| `/sitemap.xml` | SEO | Dinámico (servicios, blog) |

**Componentes globales:** `Header`, `Footer`, `WhatsAppButton` (configurables desde configuración).

---

## 3. Dashboard administrativo

### 3.1 Rutas y protección

- **Middleware:** Cookie `cronec_session`; sin sesión en rutas admin (salvo login/registro/recuperar) → redirect a `/admin/login?next=<path>`.
- **Layout:** `app/admin/layout.tsx` obtiene `getCurrentUser()`, pasa a `AdminShell`; sin usuario se redirige a login.
- **Rutas públicas admin:** `/admin/login`, `/admin/registro`, `/admin/recuperar` (registro en producción deshabilitado salvo `ALLOW_ADMIN_REGISTER=true`).

### 3.2 Páginas del sidebar (todas con página y flujo)

| Ruta | Contenido |
|------|-----------|
| `/admin` | Dashboard principal: estadísticas, proyectos y servicios recientes. |
| `/admin/estado-del-sitio` | Estado del sitio. |
| `/admin/inicio` | Contenido de inicio (secciones editables). |
| `/admin/proyectos` | CRUD proyectos; listado, nuevo, editar. |
| `/admin/servicios` | CRUD servicios. |
| `/admin/noticias` | CRUD blog/noticias. |
| `/admin/secciones` | Secciones de inicio (Por qué CRONEC, Proceso). |
| `/admin/imagenes` | Imágenes hero por página (subida URL o archivo; Vercel Blob si `BLOB_READ_WRITE_TOKEN`). |
| `/admin/testimonios` | CRUD testimonios. |
| `/admin/certificaciones-clientes` | Certificaciones y clientes. |
| `/admin/nosotros` | Contenido página Nosotros. |
| `/admin/cotizador` | Configuración cotizador. |
| `/admin/mensajes` | Mensajes de contacto. |
| `/admin/configuracion` | Configuración global (empresa, hero, menú, contacto, redes, SEO, etc.); guardado con toast de éxito (Shadcn Toaster en layout). |
| `/admin/diagnostico` | Diagnóstico: llama `/api/db-verify` (sesión admin o `X-Admin-Key`). |

### 3.3 UX del dashboard

- **Sidebar fijo:** El sidebar no hace scroll; solo el área principal (`main`) tiene `overflow-auto`. Usuario y "Cerrar sesión" siempre visibles.
- **Sidebar colapsable:** Estado en `localStorage` (`cronec-sidebar-collapsed`); margen del `main` se ajusta (`lg:ml-16` / `lg:ml-64`).
- **Toasts:** Layout raíz incluye `ShadcnToaster` y `SonnerToaster`; los managers que usan `useToast()` muestran "Guardado exitoso" correctamente.

---

## 4. APIs

| Endpoint | Método | Auth | Descripción |
|----------|--------|------|-------------|
| `/api/contact` | POST | No | Formulario contacto: validación (Zod), rate limit, `writeData("messages.json")` (o BD). |
| `/api/upload` | POST | Sesión admin/superadmin | Subida de imágenes: Vercel Blob si `BLOB_READ_WRITE_TOKEN`, si no `public/uploads` (solo local). |
| `/api/health` | GET | No | Health check para monitoreo. |
| `/api/db-verify` | GET | En producción: sesión admin o header `X-Admin-Key` | Diagnóstico: backend (postgres/mysql/json) y conteos por tabla. |

---

## 5. Capa de datos y variables de entorno

### 5.1 Prioridad de almacenamiento

1. **PostgreSQL (Neon):** `DATABASE_URL` o `POSTGRES_URL` → `lib/db-pg.ts`, `lib/data-pg.ts`.
2. **MySQL:** `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` → `lib/db.ts`, `lib/data-mysql.ts`.
3. **Fallback:** Archivos `data/*.json`.

Archivos lógicos con tabla en BD: `projects`, `services`, `blog`, `messages`, `testimonials`, `settings` (company_info), `hero-images`, `certifications`, `clients`, `admins` (users).  
Solo archivo: `nosotros.json`, `sections.json`, `calculadora.json`.

### 5.2 Variables críticas para producción

| Variable | Uso |
|----------|-----|
| `SESSION_SECRET` | Obligatorio en producción (min. 32 caracteres); no usar el valor por defecto del código. |
| `BLOB_READ_WRITE_TOKEN` | Obligatorio en Vercel para subir imágenes desde el dashboard. |
| `DATABASE_URL` o `POSTGRES_URL` | Para usar Neon/Postgres. |
| `MYSQL_*` | Para usar MySQL. |
| `DB_VERIFY_KEY` | Opcional; para GET `/api/db-verify` sin sesión (diagnóstico). |
| `NEXT_PUBLIC_FORMSPREE_ID` | Opcional; formulario de contacto estático (FTP). |
| `NEXT_PUBLIC_SITE_URL` | Opcional; sitemap y OG (Vercel puede usar `VERCEL_URL`). |
| `ALLOW_ADMIN_REGISTER` | Opcional; `true` para permitir `/admin/registro` en producción (no recomendado). |

---

## 6. Checklist pre-despliegue

- [ ] `SESSION_SECRET` definido en producción (valor aleatorio 32+ caracteres).
- [ ] En Vercel: `BLOB_READ_WRITE_TOKEN` configurado si se suben imágenes desde el dashboard.
- [ ] Si se usa BD: ejecutar `scripts/postgres/schema.sql` (Neon) o `scripts/mysql/schema.sql` (MySQL) y tener `DATABASE_URL` o `MYSQL_*` configurados.
- [ ] Al menos un usuario admin creado (script `db:seed-admin-pg` o `db:seed-admin` según BD o JSON).
- [ ] Formulario de contacto: sin BD puede usarse `NEXT_PUBLIC_FORMSPREE_ID`; con BD el POST a `/api/contact` guarda en `messages`/contact_submissions.
- [ ] Probar login admin, una edición de configuración (guardar y ver toast), subida de imagen (si aplica) y envío de formulario de contacto.

---

## 7. Conclusión

El proyecto está **listo para despliegue y producción real** siempre que se cumplan las variables de entorno y la configuración de BD/Blob descritas. La auditoría cubre páginas públicas, dashboard, APIs, datos, autenticación y manejo de errores. No se han detectado bloqueantes; el build y el lint son correctos.
