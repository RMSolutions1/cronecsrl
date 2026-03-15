# Índice de documentación – CRONEC SRL

Repositorio: [github.com/RMSolutions1/cronecsrl](https://github.com/RMSolutions1/cronecsrl)  
Sitio en producción: [cronecsrl2026.vercel.app](https://cronecsrl2026.vercel.app)

---

## 1. Empezar

| Documento | Descripción |
|-----------|-------------|
| [README.md](README.md) | Inicio rápido, BD, despliegue y scripts. **Punto de entrada principal.** |
| [.env.local.example](.env.local.example) | Variables de entorno. Copiar a `.env.local` y completar (nunca subir `.env.local` a Git). |

---

## 2. Base de datos

| Documento | Descripción |
|-----------|-------------|
| [scripts/postgres/README.md](scripts/postgres/README.md) | PostgreSQL (Neon): schema, conexión, scripts. |
| [scripts/postgres/README-NEON.md](scripts/postgres/README-NEON.md) | Configuración específica en Neon. |
| [DESPLIEGUE-MYSQL.md](DESPLIEGUE-MYSQL.md) | Uso de MySQL como alternativa a Neon. |
| [MIGRACION-MYSQL.md](MIGRACION-MYSQL.md) | Migración a MySQL si aplica. |
| [data/README.md](data/README.md) | Archivos JSON en `data/` (fallback sin BD). |

---

## 3. Despliegue

| Documento | Descripción |
|-----------|-------------|
| [DESPLIEGUE-CHECKLIST.md](DESPLIEGUE-CHECKLIST.md) | **Checklist único:** FTP, Node, Neon, MySQL. |
| [DESPLIEGUE-VERCEL.md](DESPLIEGUE-VERCEL.md) | Desplegar en Vercel (recomendado). Variables, build, dominio. |
| [DESPLIEGUE-ESTATICO-FTP.md](DESPLIEGUE-ESTATICO-FTP.md) | Sitio estático para subir por FTP. |
| [README-FTP.md](README-FTP.md) | Build y subida FTP (resumen). |
| [DESPLIEGUE-SERVIDOR.md](DESPLIEGUE-SERVIDOR.md) | Despliegue en VPS/servidor propio con Node. |
| [DESPLIEGUE-DONWEB.md](DESPLIEGUE-DONWEB.md) | Despliegue en DonWeb. |
| [DESPLIEGUE-CYBERPANEL.md](DESPLIEGUE-CYBERPANEL.md) | Despliegue con CyberPanel. |
| [DESPLIEGUE-UBUNTU-CYBERPANEL.md](DESPLIEGUE-UBUNTU-CYBERPANEL.md) | Ubuntu + CyberPanel. |
| [SUBIR-ESTATICO.md](SUBIR-ESTATICO.md) | Cómo subir el build estático. |
| [DOMINIO-CRONECSRL.md](DOMINIO-CRONECSRL.md) | Configuración de dominio. |
| [SERVIDOR-POCA-RAM.md](SERVIDOR-POCA-RAM.md) | Optimización en servidores con poca RAM. |

---

## 4. Auditoría, recomendaciones y producción

| Documento | Descripción |
|-----------|-------------|
| [AUDITORIA-E2E.md](AUDITORIA-E2E.md) | **Auditoría de extremo a extremo:** BD, APIs, rutas, dashboard. |
| [RECOMENDACIONES-WEB-APP-COMPLETA.md](RECOMENDACIONES-WEB-APP-COMPLETA.md) | Recomendaciones de seguridad, SEO, accesibilidad y producción. |
| [AUDITORIA-PRODUCCION.md](AUDITORIA-PRODUCCION.md) | Verificación para llevar el sitio a producción. |
| [PRODUCCION.md](PRODUCCION.md) | Buenas prácticas en producción. |
| [AUDITORIA-DESPLIEGUE.md](AUDITORIA-DESPLIEGUE.md) | Revisión del proceso de despliegue. |
| [AUDITORIA-SITIO-ESTATICO.md](AUDITORIA-SITIO-ESTATICO.md) | Auditoría del sitio estático (FTP). |
| [CHECKLIST-WEB-100.md](CHECKLIST-WEB-100.md) | Checklist de cobertura de la web. |
| [AUDITORIA.md](AUDITORIA.md) | Auditoría general. |
| [AUDITORIA-COMPLETA.md](AUDITORIA-COMPLETA.md) | Auditoría completa (histórica). |
| [AUDITORIA-COMPLETA-WEB.md](AUDITORIA-COMPLETA-WEB.md) | Auditoría completa web (histórica). |
| [AUDITORIA-WEB-E2E.md](AUDITORIA-WEB-E2E.md) | Auditoría E2E web (histórica). |

---

## 5. Panel admin y web

| Documento | Descripción |
|-----------|-------------|
| [DASHBOARD-A-WEB.md](DASHBOARD-A-WEB.md) | Cómo los cambios del panel se reflejan en la web. |
| [WEB-ADMIN-MAPEO.md](WEB-ADMIN-MAPEO.md) | Mapeo entre secciones del admin y páginas públicas. |
| [VERIFICACION-APIS-RUTAS-TABLAS.md](VERIFICACION-APIS-RUTAS-TABLAS.md) | APIs, rutas y tablas de la aplicación. |
| [IMAGENES-PUBLIC.md](IMAGENES-PUBLIC.md) | Uso y gestión de imágenes públicas. |

**Subida de imágenes en Vercel:** En Vercel el sistema de archivos es de solo lectura. Para que "Subir desde la PC" funcione en el dashboard, hay que crear un **Blob store** en el proyecto y configurar `BLOB_READ_WRITE_TOKEN`. Ver [DESPLIEGUE-VERCEL.md](DESPLIEGUE-VERCEL.md). Siempre se puede **pegar una URL** de imagen en los formularios (Unsplash, Blob, etc.).

---

## 6. Otros

| Documento | Descripción |
|-----------|-------------|
| [DEPLIEGUE.md](DEPLIEGUE.md) | Notas de despliegue (resumen). |
| [DESPLIEGUE-100-PORCIENTO.md](DESPLIEGUE-100-PORCIENTO.md) | Guía de despliegue al 100 %. |

---

## Resumen rápido

- **Primera vez:** [README.md](README.md) → [.env.local.example](.env.local.example) → [DESPLIEGUE-VERCEL.md](DESPLIEGUE-VERCEL.md) o [DESPLIEGUE-ESTATICO-FTP.md](DESPLIEGUE-ESTATICO-FTP.md).
- **Estado del proyecto:** [AUDITORIA-E2E.md](AUDITORIA-E2E.md) y [RECOMENDACIONES-WEB-APP-COMPLETA.md](RECOMENDACIONES-WEB-APP-COMPLETA.md).
- **Checklist antes de subir:** [DESPLIEGUE-CHECKLIST.md](DESPLIEGUE-CHECKLIST.md).
