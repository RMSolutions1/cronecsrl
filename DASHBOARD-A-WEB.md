# Dashboard → Web: aplication en tiempo real

Cada cambio en el panel de administración se refleja en la web al **recargar la página** (o al entrar de nuevo). No hay caché: las páginas públicas usan `dynamic = "force-dynamic"` y leen siempre de la base de datos (Neon) o de los archivos JSON.

---

## Mapeo: qué editas en el dashboard → dónde se ve en la web

| Dashboard (Admin) | Dónde se guarda | Dónde se ve en la web |
|-------------------|-----------------|------------------------|
| **Proyectos** (crear/editar/eliminar/publicar) | BD: `projects` | Inicio (portfolio), página **/proyectos** |
| **Servicios** (crear/editar/eliminar) | BD: `services` | Inicio (sección servicios), **/servicios**, **/servicios/[slug]** (ej. /servicios/obras-civiles) |
| **Noticias / Blog** (crear/editar/eliminar/publicar) | BD: `blog_posts` | **/blog**, **/blog/[slug]** |
| **Mensajes de contacto** (leer/marcar/eliminar) | BD: `contact_submissions` | No se muestran en la web; solo en Admin → Mensajes. El formulario **/contacto** envía a la BD (o Formspree en sitio estático) |
| **Testimonios** (crear/editar/eliminar/publicar) | BD: `testimonials` | **Inicio** (sección testimonios) |
| **Configuración / Empresa** (nombre, teléfono, email, redes, hero, meta, etc.) | BD: `company_info` | **Layout** (JSON-LD, datos globales), **Inicio** (hero si se configuran slides), **/contacto**, **/brochure**, **/nosotros** (mission/vision) |
| **Imágenes hero** (por página) | BD: `hero_images` | Componentes hero de las páginas que usan `hero_images` |
| **Certificaciones y clientes** | Archivos: `certifications.json`, `clients.json` | **Inicio** (sección clientes/certificaciones) |
| **Nosotros** (historia, valores, equipo, etc.) | Archivo: `nosotros.json` | **/nosotros** |
| **Secciones** (Por qué CRONEC, Proceso) | Archivo: `sections.json` | **Inicio** (WhyCronecSection, ProcessSection) |
| **Cotizador / Calculadora** (tipos de proyecto, niveles, plazos) | Archivo: `calculadora.json` | **/calculadora** |

---

## Cómo se aplican los cambios

1. **Guardas en el dashboard** → La acción del panel escribe en la **base de datos** (Neon) o en **data/*.json**.
2. **Al recargar la página pública** → Next.js no usa caché (`force-dynamic`) y vuelve a leer de la BD o de los archivos.
3. **Resultado** → Ves siempre la última versión (creaciones, ediciones y borrados aplicados).

---

## Páginas con `force-dynamic` (siempre datos actuales)

- **Layout** (datos de empresa)
- **Inicio** (/)
- **Servicios** (/servicios y /servicios/[slug])
- **Proyectos** (/proyectos)
- **Blog** (/blog y /blog/[slug])
- **Nosotros** (/nosotros)
- **Calculadora** (/calculadora)
- **Brochure** (/brochure)

La página **Contacto** (/contacto) es cliente y pide datos al cargar con Server Actions; también obtiene datos actuales en cada visita.

---

## Resumen

Todas las funcionalidades del dashboard aplican correctamente a la web: **cada una** escribe en la misma fuente (BD o archivo) que leen las páginas públicas, y al recargar se ven los cambios en tiempo real (sin caché intermedio).
