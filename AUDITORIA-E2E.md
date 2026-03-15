# Auditoría de extremo a extremo – CRONEC SRL

**Fecha:** 15 de marzo de 2025  
**Alcance:** Base de datos, conexiones API, rutas, dashboard admin y funcionalidades del sitio.

---

## 1. Resumen ejecutivo

| Área              | Estado   | Notas                                                                 |
|------------------|----------|-----------------------------------------------------------------------|
| Build            | ✅ OK    | `npm run build` compila sin errores.                                  |
| Base de datos    | ✅ OK    | Capa unificada Postgres → MySQL → JSON; prioridad y fallback correctos. |
| APIs             | ✅ OK    | `/api/contact`, `/api/upload`, `/api/db-verify` implementadas y seguras. |
| Rutas públicas   | ✅ OK    | Todas las rutas existen y están generadas en el build.                |
| Rutas admin      | ✅ OK    | 20 páginas admin; middleware y layout protegen correctamente.         |
| Dashboard        | ✅ OK    | Todas las secciones del sidebar tienen página y acciones asociadas.   |
| Mejora aplicada  | ✅       | Enlace "Diagnóstico" añadido al sidebar (`/admin/diagnostico`).                 |

---

## 2. Base de datos

### 2.1 Configuración y prioridad

- **PostgreSQL (Neon):** `DATABASE_URL` o `POSTGRES_URL`. Uso de `lib/db-pg.ts` y `lib/data-pg.ts`.
- **MySQL:** `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` (y opcional `MYSQL_PORT`). Uso de `lib/db.ts` y `lib/data-mysql.ts`.
- **Fallback:** Si no hay ninguna BD configurada, se usan archivos en `data/*.json`.

La capa `lib/data.ts` centraliza `readData`/`writeData` y delega según variables de entorno. Los archivos lógicos soportados en BD son: `projects.json`, `services.json`, `blog.json`, `messages.json`, `testimonials.json`, `settings.json`, `hero-images.json`, `certifications.json`, `clients.json`, `admins.json`.

### 2.2 Archivos solo en disco (sin tablas en BD)

- `nosotros.json` – Lectura/escritura vía `lib/data.ts` (readFromFile) y acciones en `app/actions/db/nosotros.ts` (lectura/escritura directa a `data/nosotros.json`). Consistente.
- `sections.json` – Igual, vía `lib/data-read.ts` y `app/actions/db/sections.ts`.
- `calculadora.json` – Igual, vía `lib/data-read.ts` y `app/actions/db/calculadora.ts`.

### 2.3 Esquema PostgreSQL

Tablas verificadas en `scripts/postgres/schema.sql` y en `/api/db-verify`:

- `users`, `projects`, `services`, `testimonials`, `company_info`, `contact_submissions`, `blog_posts`, `hero_images`, `certifications`, `clients`.

### 2.4 Autenticación y admins

- Login en `lib/auth.ts` usa `readData("admins.json")`. Con Postgres/MySQL, ese dato sale de la tabla `users` vía `data-pg`/`data-mysql` `readAdmins()`. Credenciales y sesión (iron-session, bcrypt) correctas.

### 2.5 Punto de mejora

- **API `/api/db-verify`:** Con backend MySQL, actualmente no se rellenan conteos por tabla (`tables` queda `{}`). Solo Postgres muestra conteos. Opcional: implementar conteos para MySQL en esa ruta.

---

## 3. APIs

### 3.1 POST `/api/contact`

- **Validación:** Zod vía `lib/contact-validation.ts` (nombre, email, teléfono, servicio, mensaje, empresa; límites de longitud).
- **Rate limit:** `lib/rate-limit.ts` – 10 peticiones por minuto por IP (en memoria).
- **Persistencia:** `writeData("messages.json", list)` – con BD configurada escribe en `contact_submissions` (Postgres) o equivalente MySQL.
- **Respuestas:** 400 (validación), 429 (rate limit), 500 (error interno). Mensajes genéricos en producción.

### 3.2 POST `/api/upload`

- **Autorización:** `getCurrentUser()`; solo roles `admin` y `superadmin`.
- **Validación:** Solo imágenes (`file.type.startsWith("image/")`), máximo 5 MB.
- **Almacenamiento:** Si está definido `BLOB_READ_WRITE_TOKEN`, se usa **Vercel Blob** (obligatorio en Vercel; el disco es de solo lectura). Si no, se escribe en `public/uploads/{subdir}/` (solo válido en local o VPS).
- **Respuestas:** 401 (no autorizado), 400 (sin archivo / no imagen / >5MB), 500 (error; en Vercel sin Blob se devuelve mensaje indicando configurar `BLOB_READ_WRITE_TOKEN`).
- **Dashboard:** En los formularios de imagen también se puede **pegar una URL** (sin subir archivo); ver `components/admin/image-uploader.tsx`.

### 3.3 GET `/api/db-verify`

- **Producción:** Requiere header `X-Admin-Key` igual a `DB_VERIFY_KEY`. En desarrollo no se exige.
- **Respuesta:** `{ backend, tables, ok, message }`. Con Postgres, `tables` contiene conteos por tabla; con MySQL, `tables` queda vacío (ver mejora en §2.5).

---

## 4. Rutas de la aplicación

### 4.1 Páginas públicas (todas presentes en el build)

| Ruta                       | Archivo                    | Comentario                          |
|----------------------------|----------------------------|-------------------------------------|
| `/`                        | `app/page.tsx`             | Inicio; datos desde data-read       |
| `/proyectos`               | `app/proyectos/page.tsx`   | Listado proyectos                   |
| `/servicios`               | `app/servicios/page.tsx`   | Listado servicios                   |
| `/servicios/[slug]`        | `app/servicios/[slug]/page.tsx` | Detalle servicio               |
| `/nosotros`                | `app/nosotros/page.tsx`    | getNosotrosPublic + getCompanyInfo  |
| `/blog`                    | `app/blog/page.tsx`        | Listado noticias                    |
| `/blog/[slug]`             | `app/blog/[slug]/page.tsx` | Detalle noticia                     |
| `/contacto`                | `app/contacto/page.tsx`    | Formulario: Formspree o `/api/contact` |
| `/calculadora`             | `app/calculadora/page.tsx` | Cotizador; getCalculadoraPublic     |
| `/brochure`                | `app/brochure/page.tsx`    | Brochure                            |
| `/politica-privacidad`     | `app/politica-privacidad/page.tsx` | Legal                         |
| `/terminos-condiciones`    | `app/terminos-condiciones/page.tsx` | Legal                        |
| `/politica-calidad`        | `app/politica-calidad/page.tsx` | Legal                          |
| `/robots.txt`              | `app/robots.ts`            | Estático                            |
| `/sitemap.xml`             | `app/sitemap.ts`           | Estático                            |

### 4.2 Middleware y rutas admin

- **Middleware:** Rutas bajo `/admin` exigen cookie `cronec_session`, excepto `/admin/login`, `/admin/registro`, `/admin/recuperar`. Si hay cookie y se está en `/admin/login`, redirige a `/admin`.
- **Layout admin:** `app/admin/layout.tsx` usa `getCurrentUser()` y `AdminShell`; sin usuario redirige a login.

Rutas admin verificadas en el build:

- `/admin`, `/admin/login`, `/admin/registro`, `/admin/recuperar`
- `/admin/inicio`, `/admin/estado-del-sitio`, `/admin/proyectos`, `/admin/proyectos/nuevo`, `/admin/proyectos/[id]/editar`
- `/admin/servicios`, `/admin/noticias`, `/admin/secciones`, `/admin/imagenes`, `/admin/testimonios`
- `/admin/certificaciones-clientes`, `/admin/nosotros`, `/admin/cotizador`, `/admin/mensajes`, `/admin/configuracion`, `/admin/diagnostico`

---

## 5. Dashboard – secciones y funcionalidad

Cada ítem del sidebar (`components/admin/admin-nav.tsx`) tiene su ruta y lógica asociada.

| Sección                    | Ruta                          | Acciones / datos                                      | Estado  |
|---------------------------|-------------------------------|--------------------------------------------------------|---------|
| Dashboard                 | `/admin`                      | getAdminStats, getProjectsAdmin, getServicesAdmin     | ✅ OK   |
| Estado del sitio          | `/admin/estado-del-sitio`     | getSectionsPublic, getNosotrosPublic, etc.             | ✅ OK   |
| Contenido de Inicio       | `/admin/inicio`               | getCompanyInfo, getServicesPublic; enlaces a secciones | ✅ OK   |
| Proyectos                 | `/admin/proyectos` (+ nuevo/editar) | actions/db/projects.ts                          | ✅ OK   |
| Servicios                 | `/admin/servicios`            | actions/db/services.ts                                | ✅ OK   |
| Noticias                  | `/admin/noticias`             | actions/db/blog.ts                                    | ✅ OK   |
| Secciones de Inicio       | `/admin/secciones`            | actions/db/sections.ts (archivo)                      | ✅ OK   |
| Imágenes Hero             | `/admin/imagenes`             | actions/db/hero-images.ts + `/api/upload`             | ✅ OK   |
| Testimonios               | `/admin/testimonios`          | actions/db/testimonials.ts                            | ✅ OK   |
| Certificaciones y Clientes | `/admin/certificaciones-clientes` | actions/db/certifications.ts, clients.ts        | ✅ OK   |
| Nosotros                  | `/admin/nosotros`             | actions/db/nosotros.ts (archivo)                      | ✅ OK   |
| Cotizador                 | `/admin/cotizador`            | actions/db/calculadora.ts (archivo)                    | ✅ OK   |
| Mensajes                  | `/admin/mensajes`             | actions/db/contact.ts                                 | ✅ OK   |
| Configuración             | `/admin/configuracion`        | actions/db/company-info.ts                             | ✅ OK   |
| Diagnóstico               | `/admin/diagnostico`          | readData("admins.json"), DbVerifyCard → `/api/db-verify` | ✅ OK (no en sidebar) |

Todas las secciones que editan contenido usan la capa `lib/data` (Postgres, MySQL o JSON) o, para nosotros/secciones/cotizador, escritura directa en `data/*.json` con comprobación de rol en la acción.

---

## 6. Formulario de contacto (flujo E2E)

- **Página:** `app/contacto/page.tsx` (client).
- Si existe `NEXT_PUBLIC_FORMSPREE_ID`: envía a Formspree; si no, envía a `/api/contact`.
- `/api/contact`: rate-limit → validación → `readData`/`writeData("messages.json")`. Con BD, los mensajes se persisten en la tabla correspondiente y el admin los ve en `/admin/mensajes`.

---

## 7. Verificaciones de seguridad y producción

- **SESSION_SECRET:** En producción debe ser distinto del valor por defecto (aviso en `lib/auth.ts`).
- **DB_VERIFY_KEY:** En producción, `/api/db-verify` debe protegerse con este header.
- **Build estático (BUILD_FTP=1):** No hay servidor; el formulario de contacto debe usar Formspree; las rutas `/api/*` no estarán disponibles.

---

## 8. Conclusión

El proyecto está **correctamente implementado** para:

- Múltiples backends (Postgres, MySQL, JSON) con prioridad y fallback coherentes.
- APIs de contacto, subida y diagnóstico con validación y control de acceso.
- Rutas públicas y admin generadas y protegidas por middleware y layout.
- Todas las secciones del dashboard con página y acciones asociadas y funcionales.

**Recomendación:** Añadir el enlace "Diagnóstico" en el sidebar del admin para acceder a `/admin/diagnostico` desde el menú. Opcional: implementar conteos por tabla para MySQL en `/api/db-verify`.
