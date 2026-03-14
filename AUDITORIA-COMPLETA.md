# Auditoría completa del proyecto CRONEC SRL

**Fecha:** 14 de marzo de 2025  
**Alcance:** Estructura, stack, seguridad, código, configuración y dependencias.

---

## Cambios realizados (post-auditoría)

- **Next.js** actualizado a 16.1.6; `npm audit` sin vulnerabilidades.
- **`/api/db-verify`** protegido en producción: requiere header `X-Admin-Key` = `DB_VERIFY_KEY` (opcional en .env).
- **writeAdmins** implementado en `lib/data-pg.ts` y `lib/data-mysql.ts`; `writeData("admins.json", ...)` persiste en Postgres/MySQL cuando está configurado.
- **Neon:** el esquema actual (`scripts/postgres/schema.sql`) ya incluye la tabla `users`; no fue necesaria migración. Ver `scripts/postgres/README-NEON.md`.
- **Blog:** contenido sanitizado con `isomorphic-dompurify` antes de `dangerouslySetInnerHTML`.
- **Contacto:** validación unificada en `lib/contact-validation.ts` (límites de longitud y email); usada en `app/api/contact/route.ts` y `app/contacto/actions.ts`.
- **Rate limit** en `POST /api/contact`: 10 peticiones por minuto por IP (`lib/rate-limit.ts`).
- **`.env.local.example`** actualizado con nota sobre `SESSION_SECRET` en producción y variable opcional `DB_VERIFY_KEY`.

---

## 1. Resumen ejecutivo

| Área           | Estado   | Resumen |
|----------------|----------|---------|
| Estructura     | ✅ Buena | Next.js 16 App Router, capa de datos unificada (Postgres/MySQL/JSON). |
| Seguridad      | ⚠️ Revisar | 1 vulnerabilidad alta en Next.js; SESSION_SECRET por defecto; API contacto sin rate limit; db-verify expuesta. |
| Código         | ⚠️ Mejorable | Bug: admins no se escriben en BD; validación contacto duplicada; XSS en blog. |
| Tests          | ❌ Ausentes | No hay tests unitarios ni E2E. |
| CI/CD          | ❌ Ausente | No hay workflows de GitHub Actions. |
| Dependencias   | ⚠️ 1 alta | Next.js con vulnerabilidades conocidas (DoS, memoria). |

---

## 2. Estructura del proyecto

- **Raíz:** `app/` (App Router), `components/`, `lib/`, `data/`, `scripts/`, `public/`, `hooks/`.
- **Config:** `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `.env.local.example`.
- **Paths:** `@/*` → `./*` (sin carpeta `src/`).

Rutas públicas: inicio, contacto, nosotros, servicios, proyectos, blog, calculadora, políticas, brochure.  
Admin: `/admin` (login, registro, recuperar, dashboard y CRUD de proyectos, servicios, noticias, mensajes, testimonios, certificaciones, secciones, configuración, imágenes, nosotros, cotizador).  
APIs: `POST /api/upload`, `POST /api/contact`, `GET /api/db-verify`.

---

## 3. Stack tecnológico

- **Framework:** Next.js 16.0.10 (App Router, Turbopack).
- **UI:** React 19.2.0, Radix UI, Tailwind CSS 4, lucide-react, sonner, recharts, embla-carousel, next-themes.
- **Formularios:** react-hook-form, @hookform/resolvers, zod (instalado; validación manual en contacto).
- **Datos:** PostgreSQL (pg) o MySQL (mysql2) según env; fallback a archivos en `data/*.json`.
- **Auth:** iron-session (cookie `cronec_session`), bcryptjs (hash).
- **Externos:** Formspree (sitio estático), @vercel/analytics.

---

## 4. Seguridad – Hallazgos

### 4.1 Crítico / Alto

1. **Vulnerabilidades en Next.js (npm audit)**  
   - **Severidad:** Alta.  
   - **Problemas:** DoS vía Image Optimizer `remotePatterns`, DoS en deserialización de RSC, consumo de memoria sin límite en PPR Resume.  
   - **Acción:** Actualizar a Next.js 16.1.6 o superior cuando sea estable:  
     `npm audit fix --force` (puede salir del rango ^16; revisar changelog antes).

2. **SESSION_SECRET por defecto en producción**  
   - **Archivo:** `lib/auth.ts` (líneas 13–16).  
   - **Problema:** Si no se define `SESSION_SECRET`, se usa `"cronec-session-secret-min-32-chars-long"`. Cualquiera que conozca este valor puede falsificar cookies de admin.  
   - **Acción:** En producción, definir siempre `SESSION_SECRET` en entorno (min. 32 caracteres aleatorios). No confiar en el valor por defecto.

3. **GET /api/db-verify sin protección**  
   - **Archivo:** `app/api/db-verify/route.ts`.  
   - **Problema:** Expone backend (postgres/mysql/json) y estado de tablas. No hay comprobación de auth ni de `X-Admin-Key` en el código actual.  
   - **Acción:** En producción, proteger por auth o por header secreto y/o limitar a `NODE_ENV !== "production"`.

### 4.2 Medio

4. **API de contacto sin rate limiting**  
   - **Archivos:** `app/api/contact/route.ts`, `app/contacto/actions.ts`.  
   - **Problema:** Un atacante puede enviar muchos requests y saturar almacenamiento o correo.  
   - **Acción:** Añadir rate limit (p. ej. por IP o por cabecera) en API y/o en action.

5. **XSS en contenido del blog**  
   - **Archivo:** `app/blog/[slug]/page.tsx` (línea 79).  
   - **Problema:** El contenido se renderiza con `dangerouslySetInnerHTML`. Si un admin introduce HTML/script malicioso, se ejecuta en el cliente.  
   - **Acción:** Sanitizar HTML (p. ej. DOMPurify) o permitir solo Markdown y renderizar de forma segura.

6. **Validación de contacto duplicada**  
   - **Archivos:** `app/api/contact/route.ts` y `app/contacto/actions.ts`.  
   - **Problema:** Misma lógica en dos sitios; riesgo de divergencia y de no aplicar límites de longitud en ambos.  
   - **Acción:** Extraer validación (y límites de longitud) a un módulo compartido y usarlo en API y en action.

### 4.3 Positivo

- **Upload:** Requiere usuario con rol `admin` o `superadmin`; solo imágenes; máx. 5MB; subdirectorio validado con `^[a-zA-Z0-9_-]+$` (evita path traversal).
- **SQL:** Uso de placeholders en MySQL y Postgres; no hay concatenación de input de usuario.
- **Cookies:** `httpOnly`, `secure` en producción, `sameSite: "lax"`.
- **JSON-LD en layout:** `dangerouslySetInnerHTML` con `JSON.stringify` (datos controlados por código; riesgo bajo).

---

## 5. Código – Hallazgos

### 5.1 Bug: admins no se persisten en base de datos

- **Archivo:** `lib/data.ts` (writeData).  
- **Problema:** Para `admins.json` existe `readFromDb` (readAdmins en pg/mysql), pero en los bloques de `writeData` para Postgres y MySQL **no** hay caso para `admins.json`. Cualquier escritura de admins va solo a `writeToFile` (JSON).  
- **Consecuencia:** Con BD configurada, los admins se leen de la BD pero no se actualizan allí si la app escribe vía `writeData("admins.json", ...)`.  
- **Acción:** Añadir en `data-pg.ts` y `data-mysql.ts` las funciones `writeAdmins` y llamarlas desde `writeData` cuando `filename === "admins.json"`.

### 5.2 Duplicación y tipado

- **data-pg / data-mysql:** Misma estructura por entidad; se podría factorizar con adaptadores por driver.
- **Tipos:** Uso de `unknown[]` y `Record<string, unknown>`; casts como `as PostShape | null` en blog. Mejorar tipos en capa de datos y en páginas reduce errores en tiempo de compilación.

### 5.3 Manejo de errores

- **readFromDb:** En caso de error se hace fallback a JSON sin registrar el fallo; útil para resiliencia pero dificulta diagnóstico.
- **Server Actions / API:** Respuestas con `{ success, message }` y toasts; no hay logging centralizado.

Recomendación: un logger mínimo (p. ej. por entorno) para errores de BD y de acciones críticas.

---

## 6. Configuración

### 6.1 TypeScript

- **tsconfig.json:** `strict: true`, `skipLibCheck: true`, `paths` correctos.  
- **next.config.mjs:** No se ignora TypeScript en build.  
- Estado: ✅ Adecuado.

### 6.2 ESLint

- **Script:** `"lint": "eslint ."` en package.json.  
- No hay `.eslintrc*` ni `eslintConfig` en package.json en el repo; Next.js aporta configuración por defecto.  
- Recomendación: añadir `.eslintrc.json` (o similar) si se quieren reglas propias o más estrictas.

### 6.3 Tests y CI/CD

- **Tests:** No hay Jest, Vitest ni Cypress; no hay `*.test.*`, `*.spec.*` ni carpetas de tests.  
- **CI/CD:** No hay `.github/workflows` ni otros pipelines en el repo.  
- Recomendación: al menos tests de humo (build + lint) en CI y, si es posible, tests E2E para flujos críticos (login, contacto).

---

## 7. Variables de entorno

Definidas en `.env.local.example` y usadas en el código:

| Variable                     | Uso                          | Producción |
|-----------------------------|------------------------------|------------|
| DATABASE_URL / POSTGRES_URL | Postgres (Neon)              | Configurar |
| MYSQL_*                     | MySQL si no hay Postgres     | Opcional  |
| SESSION_SECRET              | Firma de cookies de sesión   | **Obligatorio** |
| NEXT_PUBLIC_FORMSPREE_ID    | Formulario estático (FTP)    | Si aplica  |
| NEXT_PUBLIC_HIDE_ADMIN_LINK | Ocultar enlace admin         | Opcional  |
| BUILD_FTP                   | Export estático              | Si aplica  |

`.env.local` y `.env.production` están en `.gitignore`; no deben subirse al repositorio.

---

## 8. Checklist de acciones recomendadas

### Inmediato (seguridad)

- [ ] Definir `SESSION_SECRET` en producción (min. 32 caracteres aleatorios).
- [ ] Actualizar Next.js para resolver la vulnerabilidad alta (`npm audit` / `npm audit fix`; revisar versión).
- [ ] Proteger `/api/db-verify` en producción (auth o header secreto o deshabilitar).

### Corto plazo

- [ ] Añadir `writeAdmins` en Postgres/MySQL y usarlo en `writeData` para `admins.json`.
- [ ] Sanitizar HTML del blog (DOMPurify o Markdown) para mitigar XSS.
- [ ] Unificar validación del formulario de contacto y añadir límites de longitud.
- [ ] Valorar rate limiting en API de contacto (y en action si se expone).

### Medio plazo

- [ ] Introducir tests (p. ej. Vitest + Playwright) y pipeline CI (lint + build + tests).
- [ ] Mejorar tipado en capa de datos y reducir casts.
- [ ] Añadir logging básico para errores de BD y acciones críticas.

---

## 9. Archivos clave revisados

| Área    | Archivos |
|---------|----------|
| Config  | `package.json`, `tsconfig.json`, `next.config.mjs`, `.env.local.example` |
| Auth    | `lib/auth.ts`, `middleware.ts`, `app/admin/login/actions.ts`, `app/actions/auth.ts` |
| Datos   | `lib/data.ts`, `lib/data-pg.ts`, `lib/data-mysql.ts`, `lib/data-read.ts` |
| API     | `app/api/upload/route.ts`, `app/api/contact/route.ts`, `app/api/db-verify/route.ts` |
| Contacto| `app/contacto/page.tsx`, `app/contacto/actions.ts`, `app/actions/db/contact.ts` |

---

*Auditoría realizada sobre el estado del repositorio y dependencias (npm audit) a fecha indicada.*
