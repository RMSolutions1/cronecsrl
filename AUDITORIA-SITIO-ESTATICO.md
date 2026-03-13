# Auditoría: sitio estático CRONEC SRL

Comprobación de que todas las páginas y secciones están implementadas, son funcionales y **consistentes con la app** (sin Node/BD) en el build estático (subida por FTP / CyberPanel).

---

## Verificación de consistencia app vs. estático (última revisión)

- **Home – Servicios:** La sección de servicios en la home usa la misma lista que el menú y `/servicios`: Obras Civiles, Obras Eléctricas, Arquitectura e Ingeniería, Instalaciones Industriales, Obras Generales, Servicios Especiales. Antes aparecía "Obras de Saneamiento" (sin página propia); corregido a "Obras Generales".
- **Home – Proyectos:** Con `projectsFromDb={[]}` se muestran los 6 proyectos estáticos del componente; mismo contenido conceptual que `/proyectos` (static-data).
- **Formulario de contacto:** Las opciones del selector de servicio se alinearon con los 6 servicios del sitio más "Mantenimiento de Infraestructura" y "Otro".
- **CTA (home):** El mini-formulario de la sección CTA solo muestra un toast de éxito (no envía a API/Formspree). Para enviar mensajes reales se usa la página `/contacto`.

---

## 1. Páginas incluidas en el build estático

Cuando se ejecuta `npm run build:static` (o `npm run build:ftp`), el script:

- Excluye la carpeta **`/admin`** (renombrada temporalmente) para que no se generen rutas que usan BD/sesiones.
- Sustituye **`app/page.tsx`** por **`app/page.ftp.tsx`** (home sin BD).
- Sustituye **`app/proyectos/page.tsx`** por **`app/proyectos/page.ftp.tsx`** (proyectos con datos estáticos).

Rutas que **sí** se exportan y deben funcionar:

| Ruta | Descripción | Estado |
|------|-------------|--------|
| `/` | Inicio (hero, servicios, portfolio, testimonios, CTA) | OK – page.ftp |
| `/servicios` | Listado de servicios con cards y enlaces | OK – "use client", estático |
| `/servicios/obras-civiles` | Obras Civiles | OK – estático |
| `/servicios/obras-electricas` | Obras Eléctricas | OK – estático |
| `/servicios/arquitectura-ingenieria` | Arquitectura e Ingeniería | OK – estático |
| `/servicios/instalaciones-industriales` | Instalaciones Industriales | OK – estático |
| `/servicios/obras-generales` | Obras Generales | OK – estático |
| `/servicios/servicios-especiales` | Servicios Especiales | OK – estático |
| `/proyectos` | Portfolio de proyectos | OK – page.ftp + staticProjects |
| `/nosotros` | Nosotros, valores, equipo | OK – estático |
| `/contacto` | Formulario de contacto | OK – "use client", Formspree o mensaje si no hay API |
| `/blog` | Noticias / blog | OK – artículos estáticos |
| `/calculadora` | Cotizador (pasos 1–4, estimación) | OK – "use client", solo toast al enviar |
| `/brochure` | Brochure corporativo | OK – estático |
| `/politica-privacidad` | Política de privacidad | OK – estático |
| `/terminos-condiciones` | Términos y condiciones | OK – estático |
| `/politica-calidad` | Política de calidad | OK – estático |
| `/404` (not-found) | Página 404 | OK – not-found.tsx |
| `/sitemap.xml` | Sitemap (SEO) | OK – force-static |
| `/robots.txt` | Robots | OK – force-static |

**No incluidas en el estático (por diseño):** `/admin/*`, `/api/*` (no existen en export).

---

## 2. Navegación y enlaces

- **Header:** Inicio, Servicios (desplegable con las 6 subpáginas), Proyectos, Nosotros, Noticias, Cotizador. Todos apuntan a rutas exportadas.
- **Footer:** Inicio, Servicios, Proyectos, Nosotros, Noticias, Cotizador, Contacto, Brochure; enlaces legales: Privacidad, Términos, Calidad. Todos válidos.
- **Sitemap:** Incluye todas las rutas públicas anteriores más las 6 subpáginas de servicios (añadidas en esta auditoría).

---

## 3. Funcionalidad en modo estático

| Funcionalidad | Comportamiento en estático |
|---------------|----------------------------|
| Formulario de contacto | Si está definido `NEXT_PUBLIC_FORMSPREE_ID` en `.env.local`, los envíos van a Formspree. Si no, el formulario intenta `/api/contact` y fallará (mensaje orientativo en pantalla). |
| Cotizador | Cálculo en cliente; al “enviar” muestra un toast de éxito (no hay backend en estático). |
| Home: servicios y proyectos | Contenido fijo (secciones con datos estáticos o listas vacías en page.ftp / staticProjects). |
| Enlaces externos | Teléfono, email, mapa, redes: correctos. |

---

## 4. Requisito del build estático

El build con `output: "export"` **no admite** Server Actions ni rutas API. Por eso es **obligatorio** usar el script:

```powershell
npm run build:static
```

No basta con poner `BUILD_FTP=1` y ejecutar `next build` sin el script: la home y proyectos originales usan acciones de servidor (getServicesPublic, getProjectsPublic) y el build fallaría.

Si al ejecutar el script aparece **"Acceso denegado"** al renombrar `app\admin`, cerrar Cursor/VS Code (u otro programa que tenga abierta esa carpeta) y volver a ejecutar.

---

## 5. Resumen

- **Páginas y secciones:** Todas las rutas públicas listadas están implementadas y son exportables.
- **Navegación:** Header y footer enlazan a todas las secciones; Brochure y Contacto añadidos al footer en esta auditoría.
- **Sitemap:** Incluye todas las páginas públicas y las 6 subpáginas de servicios.
- **Formulario y cotizador:** Operativos en estático con Formspree (contacto) y solo cliente (cotizador).
- **Build:** Listo para generación estática mediante `npm run build:static`; el resultado en `out/` (más `.htaccess`) puede subirse por FTP/File Manager al hosting (p. ej. CyberPanel). Ver **DESPLIEGUE-CYBERPANEL.md**.
