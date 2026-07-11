# Auditoría E2E CMS — CRONEC SRL (Jul 2026)

## Resumen ejecutivo

| Área | Estado | Notas |
|------|--------|-------|
| Build / lint / typecheck | ✅ OK | `npm run lint`, `typecheck`, `build` sin errores |
| Persistencia Neon (Vercel) | ✅ Corregido | Cotizador, secciones y nosotros ahora usan `site_config` vía `writeData` |
| CRUD admin principal | ✅ OK | Proyectos, servicios, blog, testimonios, certificaciones, clientes |
| Cotizador — agregar precios/tipos | ✅ Corregido | Botones Agregar/Eliminar en tipos, calidad y plazos |
| Cambios reflejados en web | ✅ Mejorado | `revalidatePath` tras guardar cotizador, secciones y nosotros |
| Heroes internos (servicios, nosotros) | ✅ Parcial | Conectados servicios y nosotros al admin de imágenes |
| Performance | ⚠️ Mejorable | `force-dynamic` global; contenido siempre fresco pero más TTFB |

---

## Mapa admin → web pública

| Admin | Ruta | Persistencia | Web pública |
|-------|------|--------------|-------------|
| Dashboard | `/admin` | stats BD | — |
| Proyectos | `/admin/proyectos` | Postgres `projects` | `/proyectos`, inicio |
| Servicios | `/admin/servicios` | Postgres `services` | `/servicios`, `/servicios/[slug]` |
| Noticias | `/admin/noticias` | Postgres `blog_posts` | `/blog`, `/blog/[slug]` |
| Secciones inicio | `/admin/secciones` | `site_config.cms_sections` | `/` (Why CRONEC, Proceso) |
| Imágenes Hero | `/admin/imagenes` | Postgres `hero_images` | `/`, `/servicios`, `/nosotros` (+ fallbacks) |
| Testimonios | `/admin/testimonios` | Postgres `testimonials` | `/` |
| Certificaciones | `/admin/certificaciones` | Postgres `certifications` | `/` |
| Clientes | `/admin/clientes` | Postgres `clients` | `/` |
| Nosotros | `/admin/nosotros` | `site_config.cms_nosotros` | `/nosotros` |
| Cotizador | `/admin/cotizador` | `site_config.cms_calculadora` | `/calculadora` |
| Configuración | `/admin/configuracion` | Postgres `company_info` | layout, footer, contacto, legal |
| Mensajes | `/admin/mensajes` | Postgres `contact_submissions` | formularios contacto/cotizador |

---

## Correcciones aplicadas en esta auditoría

1. **Cotizador, secciones y nosotros en Vercel** — Antes escribían solo a `data/*.json` (filesystem de solo lectura). Ahora van a Neon (`site_config`) con fallback JSON en local.
2. **Cotizador ampliable** — Agregar/eliminar tipos de proyecto, niveles de calidad y plazos sin límite fijo.
3. **Revalidación automática** — Tras guardar cotizador, secciones o nosotros se invalida la caché de las páginas públicas correspondientes.
4. **Dashboard mensajes nuevos** — Contador `newSubmissions` usa mensajes no leídos reales.
5. **Heroes servicios y nosotros** — Las páginas leen imágenes subidas en Admin → Imágenes Hero.
6. **Script** — `npm run db:seed-cms-json` importa JSON local a Neon.

---

## Checklist por sección (editabilidad)

| Sección web | ¿Editable? | Dónde |
|-------------|------------|-------|
| Hero inicio (slides + textos) | ✅ | Configuración + Imágenes Hero |
| Servicios destacados inicio | ✅ | Admin Servicios |
| Proyectos inicio | ✅ | Admin Proyectos |
| Por qué CRONEC / stats / features | ✅ | Admin Secciones |
| Proceso de trabajo (pasos) | ✅ | Admin Secciones (cantidad fija en UI: 5 pasos) |
| Testimonios | ✅ | Admin Testimonios |
| Certificaciones ISO (inicio) | ✅ | Admin Certificaciones |
| Logos clientes | ✅ | Admin Clientes |
| CTA / contacto / footer | ✅ | Admin Configuración |
| Página servicios (lista + detalle) | ✅ | Admin Servicios |
| Blog / noticias | ✅ | Admin Noticias |
| Nosotros (historia, equipo, valores) | ✅ | Admin Nosotros + misión/visión en Configuración |
| Cotizador (precios m², multiplicadores) | ✅ | Admin Cotizador |
| Legal (términos, privacidad) | ✅ | HTML custom en Configuración o páginas por defecto |
| Brochure PDF corporativo | ⚠️ Parcial | URL PDF en config; cuerpo de brochure mayormente estático |
| Newsletter blog | ❌ | Formulario sin backend |
| Imagen lateral Why CRONEC / fondo CTA | ❌ | Fijas en `lib/images.ts` |

---

## Requisitos producción (Vercel)

Variables obligatorias:

- `DATABASE_URL` o `POSTGRES_URL` (Neon)
- `SESSION_SECRET`
- `BLOB_READ_WRITE_TOKEN` (subida de imágenes)

Comandos útiles tras deploy:

```bash
npm run db:seed-cms-json      # cotizador, secciones, nosotros → Neon
npm run db:seed-certs-clients # certificaciones y clientes
npm run db:update-company     # settings / company_info
```

---

## Performance

- **Actual:** `force-dynamic` en layout y páginas principales → datos siempre actuales, sin stale cache.
- **Trade-off:** cada visita ejecuta queries a Neon; aceptable para CMS pequeño/mediano.
- **Recomendación futura:** `revalidate = 60` + `revalidatePath` en todos los saves admin (ya iniciado en cotizador/secciones/nosotros).

---

## Pruebas ejecutadas

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] `npm run db:seed-cms-json` (Neon OK)
- [x] Revisión de flujos CRUD en código
- [x] Verificación persistencia Vercel (writeData + assertDbWritable)

---

## Pendientes menores (no bloquean producción)

1. Conectar heroes de contacto, blog y proyectos al admin (como servicios/nosotros).
2. Brochure: mover contenido estático al CMS o markdown.
3. Secciones: permitir agregar/quitar stats, features y pasos dinámicamente.
4. Newsletter blog: endpoint o integración externa.
5. Extender `revalidatePath` a servicios, proyectos, blog, certificaciones, clientes.
