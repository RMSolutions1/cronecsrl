# Auditoría web CRONEC SRL – Extremo a extremo

**Enfoque:** Cliente (usabilidad, claridad, confianza) y Empresa (imagen, conversiones, profesionalismo).

---

## 1. Correcciones aplicadas

### 1.1 Ortografía y tildes (consistencia en español)

- **Header:** "Solicitar Cotizacion" → "Solicitar Cotización".
- **Footer:** "Terminos" → "Términos"; "Obras Publicas/Electricas" → "Obras Públicas/Eléctricas"; servicios con tildes (Construcción, Ingeniería).
- **Hero:** "Mas de 15 Anos" → "Más de 15 años"; "construccion/electricas" → "construcción/eléctricas"; "Solicitar Cotizacion" → "Solicitar Cotización".
- **CTA (inicio):** "Contactenos", "vision", "cotizacion", "como", "Telefono", "Cuentenos", "Descripcion", "ubicacion", "politica" → con tildes correctas.
- **Layout (SEO):** Título, description, keywords, openGraph y twitter con "Construcción", "años", "eléctricas", "ingeniería", "públicas".
- **404:** "Pagina", "Construccion", "esta/está", "Quizas", "Contactenos" → formas correctas; mensaje "¿Necesita ayuda?".

### 1.2 Formulario CTA en inicio (conversiones)

- **Antes:** Solo simulaba envío (toast), no guardaba datos.
- **Ahora:** Envía a `/api/contact` con servicio "Consulta desde inicio"; las consultas se guardan en MySQL y se ven en Admin → Mensajes.

### 1.3 Logo (tamaño y proporción)

- **Header:** Logo dentro de contenedor fijo (40px / 32px al hacer scroll).
- **Footer:** Logo 32px.
- **Admin nav:** Logo 32px.
- **404:** Logo en contenedor 48px para que no se vea desproporcionado.

### 1.4 Metadatos y SEO

- Tildes corregidas en title, description, openGraph, twitter y JSON-LD.
- Placeholder de verificación de Google comentado (agregar código real cuando se use Search Console).

### 1.5 Página 404

- Textos con tildes y redacción más clara.
- Logo acotado para que no se vea gigante.

---

## 1.6 Auditoría post-imágenes reales (public/)

**Imágenes locales integradas en `lib/images.ts`:**
- **Hero inicio:** `hero-construction-1.jpg`, `hero-construction-2.jpg`, `hero-construction-3.jpg`.
- **Hero páginas internas:** `hero-projects-*`, `hero-blog-*`, `hero-contacto-*`, `hero-nosotros-*`, `hero-services-*` (1, 2 y 3 por página).

**Textos y tildes corregidos en esta pasada:**
- **components:** `services-section.tsx` (Construcción, Eléctricas, diseño, área, región, Renovación, estándares, Reparación, metálicas, crítica, etc.); `why-cronec-section.tsx` (Más, años, región, técnicos, áreas, construcción, público, Tecnología, última generación, Gestión, planificación, Innovación, técnicas, Por qué elegirnos, Atención, Garantía); `footer.tsx` (Más de 15 años, construcción civil y eléctrica, Contáctenos); `header.tsx` (Diseño, proyecto, dirección).
- **app/servicios:** `page.tsx` (construcción, Refacción baños, eléctricas, tensión, dirección, Cálculo, técnico, años); `obras-electricas/page.tsx` (títulos, descripciones, tensión, diseño, Subestación, instalación eléctrica, Confíe, Solícitenos, Cotización, estándares, Trámites, Electrotécnica, protección); `obras-civiles/page.tsx`, `obras-generales/page.tsx` (construcción, refacción, años, región, públicos, renovación, etc.); `arquitectura-ingenieria/page.tsx` (Ingeniería, Diseño, Documentación, Ejecución, Dirección, Análisis, Cálculo, Años, m²); `instalaciones-industriales/page.tsx` (Construcción, Diseño, Depósitos, Electromecánicos, Cámaras, Logísticos, ejecución, Optimización); `servicios-especiales/page.tsx` (técnicos, Áreas, Especialización, área).
- **app/calculadora, blog, proyectos:** descripciones y excerpts con tildes (eléctricas, diseño, construcción, ampliación, subestación, beneficiará).
- **components/admin:** "Información de Contacto", "Teléfono", "dirección" en admin-dashboard.

**Optimización de imágenes:**
- Hero carousel: `sizes="100vw"` y `quality={85}` para mejor LCP sin perder calidad.
- Todas las heroes usan rutas locales desde `/public`; Next/Image las sirve optimizadas según dispositivo.

---

## 2. Estructura auditada (rutas)

| Ruta | Uso |
|------|-----|
| `/` | Inicio (hero, servicios, proyectos, por qué nosotros, proceso, testimonios, clientes, CTA con formulario real). |
| `/servicios`, `/servicios/*` | Servicios y subpáginas. |
| `/proyectos` | Portafolio. |
| `/nosotros` | Quiénes somos. |
| `/blog` | Noticias. |
| `/calculadora` | Cotizador (envía a `/api/contact`). |
| `/contacto` | Formulario de contacto (API o Formspree según env). |
| `/brochure`, `/politica-*`, `/terminos-condiciones` | Legales y descargas. |
| `/admin/*` | Panel (login, mensajes, proyectos, servicios, etc.). |

---

## 3. Recomendaciones (no implementadas en esta pasada)

### Como cliente

- **Accesibilidad:** Revisar contraste de textos (muted-foreground sobre fondos oscuros) y asegurar que todos los botones tengan texto o `aria-label`.
- **Móvil:** Confirmar que menú, formularios y tablas en admin se usen bien en pantallas chicas.
- **Formulario de contacto:** Mantener un mensaje de éxito/error claro y, si se usa solo API, no definir `NEXT_PUBLIC_FORMSPREE_ID` en producción.

### Como empresa

- **Google Search Console:** Cuando tengas el código de verificación, añadirlo en `layout.tsx` (verificación de Google).
- **Imágenes hero:** Si se gestionan desde Admin → Imágenes, asegurar que las URLs estén bien y que existan fallbacks.
- **WhatsApp:** El botón flotante ya usa el número correcto; el mensaje por defecto está bien para primer contacto.
- **Emails:** Unificar dominio (ej. `cronec@cronecsrl.com.ar`) en toda la web; ya está usado de forma consistente en los componentes revisados.

### Técnicas

- **Middleware:** Next.js 16 avisa que "middleware" está deprecado en favor de "proxy"; por ahora no bloquea; migrar cuando la documentación esté estable.
- **baseline-browser-mapping:** El aviso de actualización es opcional; no afecta el build.

---

## 4. Resumen

- **Errores corregidos:** Ortografía/tildes en textos visibles y en metadatos, formulario CTA que no guardaba, logos desproporcionados, 404 con textos mejorados.
- **Inconsistencias reducidas:** Mismo criterio de tildes en header, footer, hero, CTA, layout y 404; CTAs de contacto unificados con "Cotización"; formulario de inicio alineado con el de contacto (misma API).
- **Navegación:** Enlaces del header y footer coherentes con las rutas existentes; 404 con enlaces rápidos a Servicios, Proyectos, Contacto y Cotizador.

Para ver los cambios en local: `npm run dev` y revisar http://localhost:3000. Para producción: volver a desplegar con `deploy-donweb.ps1`.
