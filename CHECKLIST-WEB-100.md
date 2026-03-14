# Checklist: Web 100% desarrollada y actualizada

**Fecha verificación:** 2025

## Rutas públicas (todas con datos dinámicos o estáticos)

| Ruta | dynamic | Datos | Estado |
|------|---------|-------|--------|
| `/` | force-dynamic | services, projects, company, testimonials, certs, clients, sections, heroImages | ✅ |
| `/servicios` | force-dynamic | getServicesPublic | ✅ |
| `/servicios/[slug]` | force-dynamic | getServiceBySlug | ✅ |
| `/proyectos` | force-dynamic | getProjectsPublic | ✅ |
| `/blog` | force-dynamic | getBlogPostsPublic | ✅ |
| `/blog/[slug]` | force-dynamic | getBlogPostBySlug | ✅ |
| `/nosotros` | force-dynamic | getNosotrosPublic, getCompanyInfo | ✅ |
| `/contacto` | client | getCompanyInfo, getServicesPublic | ✅ |
| `/calculadora` | force-dynamic | getCalculadoraPublic | ✅ |
| `/brochure` | force-dynamic | getCompanyInfo | ✅ |
| `/politica-privacidad`, `/terminos-condiciones`, `/politica-calidad` | estático | — | ✅ |

## Admin (todas con getCurrentUser + redirect)

- Dashboard, Proyectos (list, nuevo, editar), Servicios, Noticias, Testimonios, Certificaciones y Clientes, Imágenes Hero, Nosotros, Secciones, Cotizador, Mensajes, Configuración, Diagnóstico. Login, Registro, Recuperar. ✅

## Capa de datos

- lib/data.ts: Postgres → MySQL → JSON; readFromDb devuelve arrays vacíos desde BD. ✅
- lib/data-read.ts: getHeroImagesPublic, get*Public para todas las entidades. ✅
- Tablas: users, projects, services, blog_posts, contact_submissions, testimonials, company_info, hero_images, certifications, clients. ✅

## Conclusión

Web 100% desarrollada y actualizada. Contenido administrable desde el dashboard; datos unificados en BD o JSON.
