# Auditoría y mejoras realizadas

Resumen de la auditoría exhaustiva y de los cambios aplicados (imágenes, secciones y funcionalidades).

---

## 1. Imágenes

### Rutas locales reemplazadas por URLs de `lib/images`

- **Proyectos (CTA):** `blueprint-construction-plans-technical-drawing.jpg` → `images.blueprint`
- **Brochure (portada):** placeholder.svg → `images.whyCronec`
- **Brochure (Quiénes somos):** `modern-construction-company-building.jpg` → `images.companyBuilding`
- **Servicios – Arquitectura e Ingeniería:**  
  `modern-hospital.png`, `modern-logistics-warehouse.png`, `modern-apartment-complex.png`, `modern-university-campus.png` → `images.portfolioGeneric.*`
- **Servicios – Obras civiles:**  
  `obra-civil-cronec.jpg`, `modern-apartment-complex.png`, `modern-hospital.png`, `modern-university-campus.png` → `images.services.obrasCiviles` + `images.portfolioGeneric.*`
- **Servicios – Instalaciones industriales:**  
  Galería de proyectos → `images.services.instalacionesIndustriales`, `images.portfolioGeneric.logistics`, `images.portfolio[1]`
- **Servicios – Obras generales:** `obras-generales-cronec.jpg` → `images.services.obrasGenerales`
- **Servicios – Obras eléctricas:** `electrical-substation-power-facility.jpg` → `images.services.obrasElectricas`
- **Servicios – Servicios especiales:** `servicios-especiales-cronec.jpg` → `images.services.serviciosEspeciales`

### Ajustes en `lib/images.ts`

- **portfolioGeneric:** hospital, logistics, apartment, university (Unsplash).
- **blueprint:** imagen tipo planos para CTAs.
- **companyBuilding:** edificio/empresa para brochure y secciones corporativas.
- **defaultServiceImages:** añadido slug `arquitectura-ingenieria` (además de `arquitectura-e-ingenieria`).

### Portfolio y metadata

- **Portfolio section:** fallback de imagen de proyecto → `defaultProjectImage` en lugar de `/placeholder.svg` cuando aplica.
- **Layout (Open Graph, Twitter, JSON-LD):** `og-image.jpg` y referencias rotas sustituidas por URL de imagen Unsplash (obra/construcción) para redes sociales y SEO.

---

## 2. Secciones y contenido

- **Calculadora:**  
  - Hero con imagen de fondo suave (`images.ctaBackground`, opacidad baja).  
  - Nueva sección “Por qué usar nuestro cotizador” (estimación rápida, sin compromiso, asesoramiento incluido) antes del footer.
- **Brochure:**  
  - Botón “Solicitar Cotización” enlazado a `/contacto` con `<Link>`.

---

## 3. Funcionalidades revisadas

- Formularios de contacto y calculadora ya enlazaban o usaban APIs/Formspree según correspondía.
- Blog, Nosotros, Contacto, Proyectos y servicios ya tenían heroes con imágenes (HeroCarousel o equivalente).
- ClientsSection y TestimonialsSection ya usaban `images.clients` e `images.testimonials`.
- No se detectaron enlaces rotos ni funcionalidades críticas faltantes; solo se ajustaron imágenes y alguna sección (calculadora y brochure).

---

## 4. Archivos modificados

| Archivo | Cambios |
|--------|---------|
| `lib/images.ts` | Nuevas claves: portfolioGeneric, blueprint, companyBuilding; defaultServiceImages con `arquitectura-ingenieria`. |
| `app/layout.tsx` | OG/Twitter/JSON-LD con imagen Unsplash en lugar de `/og-image.jpg`. |
| `app/proyectos/proyectos-client.tsx` | CTA con `images.blueprint`. |
| `app/brochure/page.tsx` | Hero con `images.whyCronec`, imagen empresa con `images.companyBuilding`, Link a contacto. |
| `app/calculadora/page.tsx` | Hero con fondo `images.ctaBackground`, sección “Por qué usar el cotizador”. |
| `app/servicios/arquitectura-ingenieria/page.tsx` | projectTypes con `images.portfolioGeneric.*`. |
| `app/servicios/obras-civiles/page.tsx` | Galería con `images.services.obrasCiviles` y `images.portfolioGeneric.*`. |
| `app/servicios/instalaciones-industriales/page.tsx` | projectGallery con imágenes de `lib/images`. |
| `app/servicios/obras-generales/page.tsx` | Imagen de sección con `images.services.obrasGenerales`. |
| `app/servicios/obras-electricas/page.tsx` | Imagen de sección con `images.services.obrasElectricas`. |
| `app/servicios/servicios-especiales/page.tsx` | Imagen de sección con `images.services.serviciosEspeciales`. |
| `components/portfolio-section.tsx` | Fallback de imagen de proyecto con `defaultProjectImage`. |

---

## 5. Pendiente opcional

- Añadir en `public/`: `og-image.jpg`, `icon-light-32x32.png`, `icon-dark-32x32.png`, `apple-icon.png` si se quieren favicons/og propios en lugar de los por defecto.
- Actualizar `npm i baseline-browser-mapping@latest -D` para quitar el aviso en build (opcional).

Build verificado con `npm run build` (compilación correcta).
