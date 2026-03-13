# Auditoría de producción – CRONEC SRL

**Fecha:** 2025-03-11  
**Alcance:** Sitio estático (FTP) y preparación para producción real.

---

## Veredicto: **LISTO PARA PRODUCCIÓN**, con condiciones

El proyecto está listo para desplegar en producción **si se cumplen los puntos obligatorios** de la sección «Antes de subir». El build estático compila correctamente y la arquitectura (datos, formulario, favicon, rutas) es coherente.

---

## 1. Seguridad

| Aspecto | Estado | Notas |
|--------|--------|--------|
| Variables sensibles | OK | `.env*.local`, `.env.production` en `.gitignore`; no se suben a Git. |
| SESSION_SECRET | **Obligatorio en prod** | En producción (Node/VPS) hay que definir `SESSION_SECRET` (min. 32 caracteres). Si no se define, la app escribe un error en consola. Ver `.env.local.example`. |
| MySQL credenciales | OK | Solo en entorno (`.env`); no hardcodeadas. |
| SQL injection | OK | Consultas en `lib/data-mysql.ts` usan parámetros (`?`), no concatenación. |
| XSS | Aceptable | `dangerouslySetInnerHTML` se usa en: (1) JSON-LD en layout (datos controlados), (2) contenido de entradas de blog (controlado por admin). Riesgo bajo si solo editores de confianza gestionan el blog. |
| Formulario contacto (estático) | OK | Envío a Formspree; validación de email en cliente y en API cuando se usa Node. |
| API contacto (Node) | OK | Validación de campos y email; errores genéricos; no expone datos internos. |
| Panel admin | OK | Rutas `/admin` protegidas por middleware (cookie) y `getCurrentUser()` en cada página; login con bcrypt. |

**Recomendación:** En producción con Node, usar siempre `SESSION_SECRET` único y fuerte (p. ej. `openssl rand -base64 32`).

---

## 2. Configuración, build y despliegue

| Aspecto | Estado | Notas |
|--------|--------|--------|
| Build estático | OK | `npm run build:ftp` / `npm run build:static` termina correctamente y genera `out/`. |
| Export estático | OK | `next.config.mjs`: `output: "export"` cuando `BUILD_FTP=1`. |
| Script build-ftp | OK | Comprueba `page.ftp.tsx`, `proyectos/page.ftp.tsx` y `contacto/page.ftp.tsx`; borra `.next` antes del build; copia `.htaccess` a `out/`. |
| .htaccess | OK | `static-deploy/.htaccess` incluye reglas para SPA, 404 y cache; se copia a `out/`. |
| Favicon | OK | `public/icon.svg` es el favicon de CRONEC; `layout` usa solo `/icon.svg` (sin PNG inexistentes). |
| Formspree (estático) | **Configurar** | Para que el formulario funcione en el sitio estático, en `.env.local` debe estar `NEXT_PUBLIC_FORMSPREE_ID=...` **antes** de ejecutar el build. Sin esto, el formulario muestra error. |

**Nota:** En el build estático, las rutas `/api/contact` y `/api/upload` no se usan (Next las desactiva con `output: "export"`). El contacto en FTP va solo por Formspree.

---

## 3. Capa de datos y errores

| Aspecto | Estado | Notas |
|--------|--------|--------|
| Lectura pública | OK | Páginas públicas usan `lib/data-read.ts` (sin `"use server"`), compatible con export estático. |
| MySQL vs JSON | OK | `lib/data.ts` usa MySQL si `MYSQL_*` está definido; si no, `data/*.json`. Build estático puede usar MySQL en el PC o solo JSON. |
| Manejo de errores en lectura | OK | `data-read` usa try/catch y devuelve listas vacías o null; no rompe el build. |
| company_info / settings | OK | `getCompanyInfo()` lee `settings.json` (o MySQL `company_info`); layout y JSON-LD toleran `null`. |

---

## 4. Formularios, SEO y assets

| Aspecto | Estado | Notas |
|--------|--------|--------|
| Contacto (FTP) | OK | `app/contacto/page.ftp.tsx` envía a Formspree; mensaje claro si falta `NEXT_PUBLIC_FORMSPREE_ID`. |
| Metadata | OK | Título, descripción, Open Graph, Twitter, `metadataBase`, `robots`, favicon en `app/layout.tsx`. |
| JSON-LD | OK | Schema.org LocalBusiness en layout con datos de `getCompanyInfo()` o valores por defecto. |
| 404 | OK | `app/not-found.tsx` existe; página 404 usa logo (URL externa Vercel blob) y enlaces útiles. |
| Imagen “Por qué CRONEC” | Opcional | Código usa `public/conec4.jpeg` con fallback a `placeholder.svg`; si no existe el archivo, se ve el placeholder. |
| Placeholders | OK | Uso de `placeholder.svg` y textos "placeholder" en inputs es solo UI; no afecta producción. |

---

## 5. Dependencias

| Aspecto | Estado | Notas |
|--------|--------|--------|
| npm audit | 1 alta | Next.js 16.0.10 tiene 1 vulnerabilidad alta (DoS / Image Optimizer y otras). Corrección: actualizar a 16.1.6 cuando sea posible (`npm audit fix --force` puede cambiar versión; revisar changelog). |
| Otras dependencias | OK | Sin revisión exhaustiva; uso estándar de React, Next, Radix, etc. |

---

## 6. Checklist antes de subir a producción (FTP)

- [ ] **Formspree:** Formulario creado en https://formspree.io y en `.env.local`: `NEXT_PUBLIC_FORMSPREE_ID=tu_id`
- [ ] Ejecutar **`npm run build:static`** (o `npm run build:ftp`) y confirmar que termina sin errores.
- [ ] Subir **todo el contenido** de la carpeta **`out/`** (incluido `.htaccess`) a la raíz del sitio (ej. `public_html`).
- [ ] Probar en el navegador: inicio, servicios, proyectos, blog, contacto; enviar un mensaje de prueba por el formulario.
- [ ] (Opcional) Sustituir `public/conec4.jpeg` por la imagen deseada para la sección “Por qué CRONEC” y volver a generar el build.

---

## 7. Para despliegue con Node (VPS) más adelante

- [ ] Definir en el servidor: `MYSQL_*`, `SESSION_SECRET` (obligatorio), y opcionalmente `NEXT_PUBLIC_HIDE_ADMIN_LINK=1` si no quieres enlace al admin en la web pública.
- [ ] Crear admin con `npm run db:seed-admin` (o `db:init` si es la primera vez).
- [ ] No usar el `SESSION_SECRET` por defecto; la app avisa por consola si se usa en producción.

---

## Resumen

- **Sitio estático (FTP):** Listo para producción siempre que `NEXT_PUBLIC_FORMSPREE_ID` esté configurado antes del build y se suba el contenido de `out/` correctamente.
- **Seguridad:** Correcta para el caso de uso (SQL parametrizado, env no subidos, sesión con iron-session). Imprescindible `SESSION_SECRET` propio en producción con Node.
- **Build:** Estable; favicon y metadata coherentes; sin dependencias de Server Actions en las páginas públicas del export.
- **Recomendación:** Planificar actualización de Next.js para resolver la vulnerabilidad alta cuando sea posible.
