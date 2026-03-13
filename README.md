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

## Base de datos

- **Neon (PostgreSQL):** Definir `DATABASE_URL` en `.env.local`. Crear tablas: `npm run db:init-pg`. Crear admin: `npm run db:seed-admin-pg`. Ver `scripts/postgres/README.md`.
- **MySQL:** Definir `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`. Schema: `scripts/mysql/schema.sql`. Admin: `npm run db:seed-admin`.

Si está definida `DATABASE_URL`, la app usa Neon; si no, usa MySQL o archivos en `data/*.json`.

## Despliegue

- **Estático (FTP):** `npm run build:ftp` → subir contenido de `out/` por FTP. Ver `DESPLIEGUE-ESTATICO-FTP.md` y `DESPLIEGUE-CHECKLIST.md`.
- **Con Node (VPS):** Ver `DESPLIEGUE-MYSQL.md` o `scripts/postgres/README.md` según la base elegida.

## Documentación

| Documento | Contenido |
|-----------|-----------|
| `DESPLIEGUE-CHECKLIST.md` | Checklist FTP, Node, Neon y MySQL |
| `DASHBOARD-A-WEB.md` | Cómo los cambios del panel se reflejan en la web |
| `VERIFICACION-APIS-RUTAS-TABLAS.md` | APIs, rutas, tablas y conexiones |
| `AUDITORIA-PRODUCCION.md` | Auditoría para producción |
| `.env.local.example` | Variables de entorno (no subir `.env.local` a Git) |
