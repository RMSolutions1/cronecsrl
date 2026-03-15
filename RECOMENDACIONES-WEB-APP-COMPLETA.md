# Recomendaciones para la web app completa – CRONEC SRL

Documento de recomendaciones para considerar la web app **completa y lista para producción**, organizado por prioridad y área. Complementa la auditoría en `AUDITORIA-E2E.md`.

---

## Índice

1. [Seguridad](#1-seguridad)
2. [Variables de entorno y producción](#2-variables-de-entorno-y-producción)
3. [Base de datos](#3-base-de-datos)
4. [APIs](#4-apis)
5. [SEO y metadatos](#5-seo-y-metadatos)
6. [Accesibilidad](#6-accesibilidad)
7. [Rendimiento e imágenes](#7-rendimiento-e-imágenes)
8. [Testing](#8-testing)
9. [Despliegue y build](#9-despliegue-y-build)
10. [Funcionalidades pendientes o opcionales](#10-funcionalidades-pendientes-u-opcionales)
11. [Mantenimiento y monitoreo](#11-mantenimiento-y-monitoreo)
12. [UX y formularios](#12-ux-y-formularios)
13. [Documentación y equipo](#13-documentación-y-equipo)

---

## 1. Seguridad

| # | Recomendación | Prioridad | Notas |
|---|----------------|-----------|--------|
| 1.1 | **Definir `SESSION_SECRET` en producción** (mín. 32 caracteres aleatorios). No usar el valor por defecto del código. | Crítica | Ya documentado en `.env.local.example` y aviso en `lib/auth.ts`. |
| 1.2 | **Proteger `/api/db-verify`** en producción con header `X-Admin-Key: DB_VERIFY_KEY`. | Alta | Evita que cualquiera vea el estado de la BD. |
| 1.3 | **No subir `.env.local` ni URLs de BD** al repositorio. Añadir a `.gitignore` si no está. | Crítica | Revisar que `.env*` esté ignorado. |
| 1.4 | **HTTPS en producción.** En Vercel es automático; en servidor propio configurar certificado (Let's Encrypt). | Alta | Cookies de sesión con `secure: true` en producción. |
| 1.5 | **Revisar que las Server Actions admin** comprueben siempre `getCurrentUser()` y rol `admin`/`superadmin`. | Media | La auditoría confirmó que las acciones de `app/actions/db/*` lo hacen. |
| 1.6 | **Sanitización de contenido HTML** en blog/noticias. El proyecto usa `isomorphic-dompurify` en `app/blog/[slug]/page.tsx` para el contenido; mantenerlo en cualquier editor rich-text. | Alta | Evita XSS. |
| 1.7 | **Política de contraseñas** (opcional): longitud mínima, complejidad o guía en registro/admin. | Baja | Mejora la seguridad de cuentas admin. |

---

## 2. Variables de entorno y producción

| # | Recomendación | Prioridad | Notas |
|---|----------------|-----------|--------|
| 2.1 | **Producción:** Configurar en Vercel (o plataforma elegida) todas las variables de `.env.local.example`: `DATABASE_URL` o `POSTGRES_URL`, `SESSION_SECRET`, opcionalmente `DB_VERIFY_KEY`, `NEXT_PUBLIC_FORMSPREE_ID` si aplica. | Crítica | Sin `SESSION_SECRET` único, las sesiones son predecibles. |
| 2.2 | **Build estático (FTP):** Si se usa `BUILD_FTP=1`, definir `NEXT_PUBLIC_FORMSPREE_ID` para que el formulario de contacto funcione (no hay `/api/contact` en export estático). | Alta | Ver `README-FTP.md`. |
| 2.3 | **Dominio:** Mantener `metadataBase` y URLs en metadata apuntando al dominio real (ej. `https://cronecsrl.com.ar`). | Media | Ya configurado en `app/layout.tsx`. |

---

## 3. Base de datos

| # | Recomendación | Prioridad | Notas |
|---|----------------|-----------|--------|
| 3.1 | **PostgreSQL (Neon):** Ejecutar `scripts/postgres/schema.sql` en el SQL Editor de Neon tras crear el proyecto. Ejecutar migraciones adicionales si existen en `scripts/postgres/`. | Crítica | Sin tablas, el dashboard usará fallback a JSON. |
| 3.2 | **Primer usuario admin:** Con BD Postgres usar `node scripts/postgres/seed-admin.js` (o el script equivalente documentado); con JSON usar `node scripts/seed-admin-json.js`. | Crítica | Sin admin no se puede acceder al panel. |
| 3.3 | **Conteos MySQL en `/api/db-verify`:** Opcional: implementar conteos por tabla cuando el backend sea MySQL (hoy solo Postgres muestra `tables`). | Baja | Mejora la página de Diagnóstico con MySQL. |
| 3.4 | **Backups:** Programar backups de la BD (Neon/MySQL según corresponda) y, si se usa solo JSON, copias periódicas de la carpeta `data/`. | Alta | Recuperación ante fallos o borrados. |
| 3.5 | **Nosotros, secciones y cotizador** viven solo en `data/*.json`. Si en el futuro se migran a BD, añadir tablas y entradas en `lib/data.ts` / `data-pg` / `data-mysql`. | Baja | Por ahora el diseño es coherente. |

---

## 4. APIs

| # | Recomendación | Prioridad | Notas |
|---|----------------|-----------|--------|
| 4.1 | **Rate limit de contacto:** En producción con múltiples instancias (serverless), el rate limit en memoria (`lib/rate-limit.ts`) no se comparte. Para límites globales, considerar Redis o servicio externo (ej. Upstash). | Media | Evita abuso distribuido. |
| 4.2 | **Respuestas de error:** Mantener mensajes genéricos en producción (sin stack traces ni detalles de BD en `/api/contact` y `/api/upload`). | Alta | Ya implementado. |
| 4.3 | **CORS:** Si se consumen las APIs desde otro dominio, configurar headers CORS en las rutas API necesarias. | Baja | Solo si hay front externo. |
| 4.4 | **Tamaño de body:** Opcional: limitar el tamaño del body en `/api/contact` (Next.js tiene límites por defecto). | Baja | Evita payloads enormes. |

---

## 5. SEO y metadatos

| # | Recomendación | Prioridad | Notas |
|---|----------------|-----------|--------|
| 5.1 | **Metadata por página:** Las páginas principales ya exportan `metadata` o `generateMetadata`. Revisar que **contacto** tenga al menos `title` y `description` si aún no los tiene. | Media | Mejor resultado en buscadores. |
| 5.2 | **Sitemap dinámico:** `app/sitemap.ts` está estático. Opcional: generar entradas para cada servicio (`/servicios/[slug]`), cada proyecto y cada entrada de blog desde la BD o datos, para que Google indexe todas las URLs. | Media | Más cobertura en el sitemap. |
| 5.3 | **Open Graph por entrada:** En blog y servicios por slug, usar `generateMetadata` con `openGraph.title`, `openGraph.description` e `openGraph.images` cuando haya imagen. | Media | Mejor preview en redes. |
| 5.4 | **Google Search Console:** Añadir y verificar el sitio; opcionalmente configurar `metadata.verification.google` en el layout cuando se tenga el código. | Baja | Útil para SEO y alertas. |
| 5.5 | **Canonical:** El layout ya define `alternates.canonical`. Mantenerlo y usarlo en páginas que puedan tener duplicados (ej. con/sin trailing slash). | Baja | Ya cubierto en layout. |

---

## 6. Accesibilidad

| # | Recomendación | Prioridad | Notas |
|---|----------------|-----------|--------|
| 6.1 | **Uso de `aria-*` y `sr-only`:** El proyecto ya usa algunos (hero-carousel, footer, header, formularios). Revisar que todos los botones e iconos decorativos tengan `aria-label` o texto alternativo, y que los formularios tengan `<label>` asociados. | Media | Mejora uso con lectores de pantalla. |
| 6.2 | **Contraste de colores:** Verificar que textos y fondos cumplan WCAG (contraste mínimo). Herramientas: Lighthouse, axe DevTools. | Media | Reduce riesgo de incumplimiento normativo. |
| 6.3 | **Navegación por teclado:** Asegurar que el menú móvil y los modales se puedan cerrar con Escape y que el foco no quede atrapado. | Media | Componentes Radix suelen manejarlo; revisar custom. |
| 6.4 | **Idioma:** El `<html lang="es">` está correcto en layout y global-error. | Baja | Ya implementado. |

---

## 7. Rendimiento e imágenes

| # | Recomendación | Prioridad | Notas |
|---|----------------|-----------|--------|
| 7.1 | **Next/Image:** El proyecto usa `unoptimized: true` en `next.config.mjs`. Si se habilita optimización (sin export estático), usar tamaños y `sizes` adecuados en cada `<Image>` para reducir peso. | Media | Mejor LCP y menor ancho de banda. |
| 7.2 | **Lazy loading:** Imágenes below-the-fold pueden usar `loading="lazy"` (por defecto en Next/Image). Verificar en listados (proyectos, blog, galerías). | Baja | Ya aplicado por Next en muchas rutas. |
| 7.3 | **Cache:** Con servidor (no export estático), los headers de cache para `/images` ya están en `next.config.mjs`. Para APIs, considerar cache corto solo donde no haya datos sensibles. | Baja | Menor carga en repeticiones. |
| 7.4 | **Bundle:** Revisar que no se importen librerías pesadas en client components si solo se usan en servidor (ej. mantener `lib/data` y BD solo en server). | Baja | El diseño actual ya separa bien. |

---

## 8. Testing

| # | Recomendación | Prioridad | Notas |
|---|----------------|-----------|--------|
| 8.1 | **Tests unitarios:** No hay `*.test.*` en el repo. Añadir tests para validación de contacto (`lib/contact-validation.ts`), rate-limit (`lib/rate-limit.ts`) y funciones puras de `lib/data-read` (mocks de `readData`). | Media | Evita regresiones en lógica crítica. |
| 8.2 | **Tests E2E:** Opcional: Playwright o Cypress para flujos clave: envío de formulario de contacto, login admin, creación de un proyecto. | Baja | Aumenta confianza en despliegues. |
| 8.3 | **Lint:** Ejecutar `npm run lint` antes de cada deploy. Corregir avisos de ESLint. | Media | Mantiene estilo y detecta errores básicos. |

---

## 9. Despliegue y build

| # | Recomendación | Prioridad | Notas |
|---|----------------|-----------|--------|
| 9.1 | **Build de producción:** Usar `npm run build` y `npm run start` (o el comando de la plataforma). No usar `next dev` en producción. | Crítica | Comportamiento estable y optimizado. |
| 9.2 | **Middleware deprecation:** Next.js 16 avisa sobre la convención "middleware" en favor de "proxy". Planificar migración cuando la documentación oficial lo indique. | Baja | Evitar deprecaciones futuras. |
| 9.3 | **Build estático (FTP):** Si se usa `BUILD_FTP=1`, recordar que no hay API ni servidor; Formspree es obligatorio para contacto. Documentar en README o DESPLIEGUE-ESTATICO-FTP.md. | Alta | Ya documentado en ejemplo de env. |
| 9.4 | **Variables en build:** Las `NEXT_PUBLIC_*` se embeben en el cliente en tiempo de build. Cambios en esas variables requieren rebuild. | Media | Tenerlo en cuenta al cambiar Formspree ID, etc. |

---

## 10. Funcionalidades pendientes u opcionales

| # | Recomendación | Prioridad | Notas |
|---|----------------|-----------|--------|
| 10.1 | **Recuperación de contraseña:** La ruta `/admin/recuperar` existe pero solo informa que no hay recuperación por correo. Opcional: integrar envío de email (Resend, SendGrid, etc.) + token seguro para restablecer contraseña y actualizar `users.password_hash`. | Baja | Mejora autoservicio para admins. |
| 10.2 | **Registro de nuevos admins:** Si `/admin/registro` está abierto, restringirlo por invitación o desactivarlo en producción y crear admins solo por script/BD. | Alta | Evita cuentas no deseadas. |
| 10.3 | **Notificaciones de mensajes:** Opcional: notificar por email o panel cuando llegue un mensaje de contacto (webhook o polling desde admin). | Baja | Mejor tiempo de respuesta. |
| 10.4 | **PWA / modo offline:** Opcional: service worker y manifest para uso offline básico o “Add to Home Screen”. | Baja | Útil sobre todo en móvil. |
| 10.5 | **Idiomas:** Si en el futuro se requiere multidioma, plantear estructura (i18n) y rutas o dominios por idioma. | Baja | No necesario para el alcance actual. |

---

## 11. Mantenimiento y monitoreo

| # | Recomendación | Prioridad | Notas |
|---|----------------|-----------|--------|
| 11.1 | **Analytics:** El proyecto usa Vercel Analytics. Revisar que el dominio esté correctamente configurado en Vercel y que no se trackeen datos sensibles (ej. en rutas admin). | Media | Ya excluido en robots. |
| 11.2 | **Errores en producción:** Considerar un servicio de error tracking (Sentry, etc.) para capturar excepciones en cliente y servidor (con filtrado de datos sensibles). | Media | Diagnóstico rápido de fallos. |
| 11.3 | **Logs:** En producción no imprimir datos sensibles en `console.log`; usar niveles (error/warn) y, si aplica, enviar a un agregador de logs. | Baja | Ya se usa `console.error` en APIs. |
| 11.4 | **Health check:** Opcional: ruta tipo `/api/health` que devuelva 200 si la app responde (y opcionalmente si la BD está alcanzable), para monitoreo externo. | Baja | Útil con Uptime Robot o similar. |

---

## 12. UX y formularios

| # | Recomendación | Prioridad | Notas |
|---|----------------|-----------|--------|
| 12.1 | **Feedback en envío:** El formulario de contacto ya muestra éxito/error. Mantener mensajes claros y, si hay demora, un estado de “Enviando…” (ya manejado con `isSubmitting`). | Baja | Ya implementado. |
| 12.2 | **Validación en cliente:** Opcional: validar formato de email y campos requeridos en el cliente antes de enviar (reduce peticiones fallidas). | Baja | La API ya valida; mejora UX. |
| 12.3 | **Confirmación en acciones destructivas:** En el admin, al borrar (proyecto, mensaje, etc.), usar un diálogo de confirmación para evitar borrados accidentales. | Media | Revisar si ya existe en cada listado. |
| 12.4 | **Paginación o virtualización:** En listas muy largas (proyectos, noticias, mensajes), considerar paginación o “cargar más” para no renderizar cientos de ítems a la vez. | Baja | Depende del volumen de datos. |

---

## 13. Documentación y equipo

| # | Recomendación | Prioridad | Notas |
|---|----------------|-----------|--------|
| 13.1 | **README principal:** Mantener instrucciones de instalación (`npm install`), variables de entorno (referencia a `.env.local.example`), scripts de BD (`db:init-pg`, `db:seed-admin`, etc.) y cómo ejecutar dev/build. | Alta | Facilita onboarding. |
| 13.2 | **Auditoría y recomendaciones:** Tener `AUDITORIA-E2E.md` y este archivo (`RECOMENDACIONES-WEB-APP-COMPLETA.md`) en el repo o en un lugar accesible para el equipo. | Media | Referencia única de estado y mejoras. |
| 13.3 | **Changelog o versionado:** Opcional: mantener un CHANGELOG o etiquetar releases para saber qué se desplegó en cada entorno. | Baja | Útil con varios entornos o colaboradores. |

---

## Resumen por prioridad

- **Crítica:** 1.1, 1.3, 2.1, 3.1, 3.2, 9.1  
- **Alta:** 1.2, 1.4, 1.6, 2.2, 3.4, 4.2, 9.3, 10.2, 13.1  
- **Media:** 1.5, 2.3, 4.1, 5.1–5.3, 6.1–6.3, 7.1, 8.1, 8.3, 9.4, 11.1, 11.2, 12.3, 13.2  
- **Baja:** Resto (1.7, 3.3, 3.5, 4.3, 4.4, 5.4, 5.5, 6.4, 7.2–7.4, 8.2, 9.2, 10.1, 10.3–10.5, 11.3, 11.4, 12.1, 12.2, 12.4, 13.3)

Con las recomendaciones **críticas y altas** cubiertas, la web app puede considerarse **completa y preparada para producción**. El resto son mejoras incrementales de seguridad, SEO, accesibilidad, rendimiento y mantenimiento.
