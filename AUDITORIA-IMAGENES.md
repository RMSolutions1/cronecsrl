# Auditoría de imágenes y consistencia (Full Stack)

**Fecha:** 2026-03-18  
**Alcance:** Imágenes en `public/`, referencias en código, datos (services, hero, certifications, blog), e inconsistencias entre slugs y assets.

---

## 1. Imágenes duplicadas por extensión (.jpg y .jpeg)

En `public/` existen **dos versiones** de cada hero (mismo nombre, distinta extensión):

| Base name              | Uso en código      | Duplicado en disco |
|------------------------|--------------------|--------------------|
| hero-construction-1/2/3 | `.jpeg` (lib/images, hero-images.json) | Sí: también existe `.jpg` |
| hero-contacto-1/2/3    | `.jpeg`            | Sí: `.jpg`         |
| hero-nosotros-1/2/3    | `.jpeg`            | Sí: `.jpg`         |
| hero-projects-1/2/3    | `.jpeg`            | Sí: `.jpg`         |
| hero-services-1/2/3    | `.jpeg`            | Sí: `.jpg`         |
| hero-blog-1/2/3        | `.jpeg`            | Sí: `.jpg`         |

**Recomendación:** Eliminar los 18 archivos `.jpg` (hero-*-1/2/3.jpg) de `public/`. Todo el código y `data/hero-images.json` usan `.jpeg`. Los scripts SQL en `scripts/` referencian `.jpg`; si se usan, actualizar a `.jpeg` o que la BD guarde la ruta que usa la app (`.jpeg`).

---

## 2. Servicios vs imágenes – consistencia

### 2.1 Slugs y assets

- **data/services.json:** 8 servicios con `image_url` definido. Mantenimiento y Consultoría reutilizan `/servicios/obras-generales.jpeg` y `/servicios/arquitectura-ingenieria.jpeg` (correcto).
- **public/servicios/:** Existen los 7 archivos referenciados (obras-civiles, obras-electricas, arquitectura-ingenieria, instalaciones-industriales, obras-generales, obras-saneamiento, servicios-especiales). No hay `mantenimiento.jpeg` ni `consultoria.jpeg`; se reutilizan obras-generales y arquitectura-ingenieria.
- **Corrección aplicada:** Se añadieron los slugs `mantenimiento` y `consultoria` a `defaultServiceImages` en `lib/images.ts` y al mapa local en `components/servicios-page-content.tsx`, y la página `app/servicios/[slug]/page.tsx` usa solo `defaultServiceImages` de `lib/images` (una sola fuente de verdad).

### 2.2 Servicio “obras-de-saneamiento”

- En `lib/images.ts` existe `obrasSaneamiento` y en `defaultServiceImages` el slug `obras-de-saneamiento`.
- En `data/services.json` **no** hay un servicio con slug `obras-de-saneamiento` (solo los 8 actuales). El archivo `public/servicios/obras-saneamiento.jpeg` existe por si se agrega el servicio o por compatibilidad con menú antiguo. Sin cambio necesario.

---

## 3. Certificaciones (ISO) – misma imagen 3 veces

- **lib/images.ts** y **data/certifications.json** usan la **misma URL** de Unsplash para las tres certificaciones (ISO 9001, 14001, 45001).
- Visualmente las tres tarjetas se ven iguales. Para diferenciar por norma se pueden usar 3 imágenes/iconos distintos (por ejemplo logos o iconos por tipo: calidad, ambiente, seguridad).
- Comentario añadido en código; decisión de diseño queda a criterio del equipo.

---

## 4. Blog – imágenes por artículo

- En `lib/images.ts`, `blog[]` tiene 6 URLs. Las posiciones **1 y 3** son la misma imagen (certificación). Si los artículos por defecto usan índices distintos, dos posts pueden verse con la misma imagen. Comentario añadido en código; opcional sustituir una por otra imagen.

---

## 5. Archivos en public/ no referenciados en código

Archivos que **no** se usan en `lib/images.ts`, `data/*.json` ni en componentes revisados:

- Varios con nombre tipo `*.jpg.jpeg` (ej. `alupubl.jpg.jpeg`, `colm1.jpg.jpeg`, `electri1.jpg.jpeg`, `obras electricas.jpg.jpeg`, etc.).
- Imágenes con nombres largos de WhatsApp (`WhatsApp Image 2026-03-11 at ...`), en raíz y en `public/proyectos/`.
- Otros: `civil1.jpeg`, `civil2.jpeg`, `conec4.jpeg` (conec4 sí se usa como `whyCronec`), `cronec.jpeg`, `cronec1.jpeg`, `red1/2/3.jpg.jpeg`, `set1.jpg.jpeg`, etc.

**Recomendación:** Revisar si algún asset “legacy” o de WhatsApp debe usarse en la web (por ejemplo en proyectos o galerías). Si no, mover a una carpeta `_archive/` o eliminarlos para reducir peso del repo y del build.

---

## 6. Proyectos

- **data/projects.json** y **lib/static-data.ts** usan `/proyectos/proyecto-1.jpeg` … `proyecto-6.jpeg`. Esos 6 archivos existen en `public/proyectos/`.
- En `public/proyectos/` hay además muchas imágenes con nombre “WhatsApp Image…”. No están referenciadas en `projects.json`; son candidatas a archivo o eliminación si no se usan.

---

## 7. Resumen de cambios aplicados en código

1. **lib/images.ts**
   - `defaultServiceImages`: añadidos `mantenimiento` y `consultoria` (reutilizando obrasGenerales y arquitectura).
   - Comentarios sobre certificaciones (misma imagen x3) y blog (duplicado en índices 1 y 3).

2. **components/servicios-page-content.tsx**
   - Mismo mapa de fallback: añadidos `mantenimiento` y `consultoria`.

3. **app/servicios/[slug]/page.tsx**
   - Eliminado el objeto local `defaultImgs`.
   - Uso único de `defaultServiceImages` y `images` desde `@/lib/images`; `defaultServiceSlugs` se deriva de `defaultServiceImages`.

---

## 8. Checklist post-auditoría

- [x] Un solo mapa de slugs → imagen de servicios (`defaultServiceImages` en lib/images).
- [x] Slugs `mantenimiento` y `consultoria` con fallback correcto en todas las vistas que usan ese mapa.
- [ ] Eliminar duplicados `.jpg` de heroes en `public/` (opcional, ahorra espacio).
- [ ] Decidir si certificaciones usan 3 imágenes distintas.
- [ ] Decidir si blog usa imágenes distintas para índices 1 y 3.
- [ ] Limpiar o archivar archivos no usados (WhatsApp, `*.jpg.jpeg`, etc.) en `public/`.
