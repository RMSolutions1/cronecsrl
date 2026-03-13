# Checklist de despliegue – CRONEC SRL

## Base de datos (desarrollo y producción con Node)

- **Neon (PostgreSQL):** Configurar `DATABASE_URL` en `.env.local` (ver `.env.local.example`). Tablas: `npm run db:init-pg`. Admin: `npm run db:seed-admin-pg`. Consultas de prueba: `npm run db:query-pg`. Ver `scripts/postgres/README.md`.
- **MySQL (alternativa):** Si no usás Neon, configurar `MYSQL_*` y usar `scripts/mysql/schema.sql`, `npm run db:seed-admin`.
- **Dashboard → Web:** Los cambios del panel se ven al recargar la web (sin caché). Ver `DASHBOARD-A-WEB.md`.

---

## Despliegue por FTP (sitio estático)

### Antes del build
- [ ] **Formspree:** Formulario creado en https://formspree.io y ID en `.env.local` como `NEXT_PUBLIC_FORMSPREE_ID=tu_id`
- [ ] **.env.local** en la raíz del proyecto (no se sube a Git)

### Build
- [ ] Ejecutar: **`npm run build:static`** (o `npm run build:ftp`)
- [ ] Ver mensaje: *"Build estático listo. Subí el contenido de out\ por FTP/File Manager."*

### Contenido a subir
- [ ] Subir **todo el contenido** de la carpeta **`out/`** (no la carpeta `out` en sí) a la raíz del sitio (ej. `public_html`)
- [ ] Incluye: `index.html`, `404.html`, `.htaccess`, carpetas `_next/`, `blog/`, `contacto/`, `servicios/`, `proyectos/`, etc.

### Después de subir
- [ ] Abrir la URL del sitio y comprobar: inicio, servicios, proyectos, blog, contacto
- [ ] Enviar un mensaje de prueba desde el formulario de contacto y revisar que llegue a Formspree

---

## Despliegue con Node en VPS (más adelante)

**Opción A – Neon (PostgreSQL)**  
- [ ] En el servidor: `DATABASE_URL` (Neon) y `SESSION_SECRET` en `.env.production`
- [ ] Ejecutar `npm run db:init-pg` (o el schema en Neon SQL Editor) y `npm run db:seed-admin-pg`
- [ ] `npm run build` y `npm start` (o PM2)

**Opción B – MySQL**  
- [ ] Base MySQL creada, esquema `scripts/mysql/schema.sql` ejecutado
- [ ] **.env.production** con `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `SESSION_SECRET`
- [ ] `npm run db:seed-admin` para crear usuario admin
- [ ] `npm run build` y `npm start` (o PM2)

Ver **DESPLIEGUE-MYSQL.md** para MySQL; **scripts/postgres/README.md** para Neon.

---

## Verificación rápida (ya comprobado)

| Elemento | Estado |
|----------|--------|
| Build estático (`npm run build:static`) | OK |
| Carpeta `out/` con index.html, .htaccess | OK |
| Script build-ftp con validaciones y limpieza de .next | OK |
| Formulario contacto vía Formspree en sitio estático | Configurar NEXT_PUBLIC_FORMSPREE_ID |
| Imagen sección "Por qué CRONEC" (conec4.jpeg) | Añadir archivo en `public/` si se desea imagen propia |
| Neon (Postgres) como BD principal | DATABASE_URL en .env.local; docs: VERIFICACION-APIS-RUTAS-TABLAS.md, DASHBOARD-A-WEB.md |
