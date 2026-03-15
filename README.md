# CRONEC SRL – Sitio web y panel de administración

Sitio corporativo de CRONEC SRL (construcción civil e instalaciones eléctricas, Salta). Next.js 16, panel admin y base de datos PostgreSQL (Neon) o MySQL.

## Inicio rápido

```bash
npm install
cp .env.local.example .env.local   # Editar y añadir DATABASE_URL (Neon) o MYSQL_*
npm run db:init-pg                 # Solo si usás Neon: crear tablas
npm run db:seed-admin-pg           # Solo si usás Neon: crear usuario admin
npm run dev
```

- **Web:** http://localhost:3000  
- **Admin:** http://localhost:3000/admin/login  

**Producción:** Definir `SESSION_SECRET` (mín. 32 caracteres aleatorios). No subir `.env.local` al repositorio.

## Base de datos

- **Neon (PostgreSQL):** Definir `DATABASE_URL` en `.env.local`. Crear tablas: `npm run db:init-pg`. Crear admin: `npm run db:seed-admin-pg`. Ver `scripts/postgres/README.md`.
- **MySQL:** Definir `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`. Schema: `scripts/mysql/schema.sql`. Admin: `npm run db:seed-admin`.

Si está definida `DATABASE_URL`, la app usa Neon; si no, usa MySQL o archivos en `data/*.json`.

## Despliegue

- **Vercel:** Conectar el repo; configurar variables de entorno (SESSION_SECRET, DATABASE_URL, etc.). Cada push a la rama principal despliega en producción.
- **Estático (FTP):** `npm run build:ftp` → subir contenido de `out/`. Definir `NEXT_PUBLIC_FORMSPREE_ID` para el formulario de contacto. Ver `README-FTP.md` y `DESPLIEGUE-CHECKLIST.md`.
- **Con Node (VPS):** Ver `DESPLIEGUE-MYSQL.md` o `scripts/postgres/README.md` según la base elegida.

## Scripts útiles

| Script | Uso |
|--------|-----|
| `npm run dev` | Desarrollo local |
| `npm run build` | Build de producción |
| `npm run start` | Servidor producción (tras build) |
| `npm run lint` | ESLint (ejecutar antes de deploy) |
| `npm run db:init-pg` | Crear tablas en Neon |
| `npm run db:seed-admin-pg` | Crear primer admin (Neon) |
| `npm run db:seed-admin` | Crear primer admin (MySQL) |
| `npm run seed:admin` | Crear admin en `data/admins.json` (sin BD) |

## Documentación

| Documento | Contenido |
|-----------|-----------|
| `.env.local.example` | Variables de entorno (no subir `.env.local` a Git) |
| `AUDITORIA-E2E.md` | Auditoría de BD, APIs, rutas y dashboard |
| `RECOMENDACIONES-WEB-APP-COMPLETA.md` | Recomendaciones de seguridad, SEO y producción |
| `DESPLIEGUE-CHECKLIST.md` | Checklist FTP, Node, Neon y MySQL |
| `DASHBOARD-A-WEB.md` | Cómo los cambios del panel se reflejan en la web |
| `VERIFICACION-APIS-RUTAS-TABLAS.md` | APIs, rutas, tablas y conexiones |
