# Desplegar la app con MySQL (CyberPanel u otro hosting)

Para que la app se conecte automáticamente a tu base de datos MySQL, sigue estos pasos.

**Una sola base de datos:** La misma base MySQL (ej. `cron_cronecsrl`) se usa para el despliegue con Node (app completa + admin) y, si quieres, como fuente de datos al generar el sitio estático por FTP (ver `DESPLIEGUE-ESTATICO-FTP.md`). Mismas variables `MYSQL_*` en ambos casos.

---

## 1. Crear la base de datos en MySQL (CyberPanel / phpMyAdmin)

1. Entra a **CyberPanel** → **Bases de datos** (o **phpMyAdmin** si lo usas).
2. **Crea una nueva base de datos:**
   - Nombre: por ejemplo **`cronec_srl`** o **`cronec`** (sin espacios; MySQL no permite espacios en el nombre).
   - Cotejamiento: **utf8mb4_unicode_ci** (recomendado).
3. **Crea un usuario** para esa base de datos:
   - Usuario: ej. **`cronec_user`**
   - Contraseña: una contraseña segura (guárdala).
   - Asigna **todos los privilegios** sobre la base de datos `cronec_srl` (o la que hayas creado).

Anota: **host**, **usuario**, **contraseña** y **nombre de la base de datos**. En muchos hostings el host es **`localhost`**.

---

## 2. Variables de entorno que necesita la app

La app usa estas variables para conectarse a MySQL. Sin ellas, usará archivos JSON en `data/`.

| Variable          | Ejemplo       | Descripción                          |
|-------------------|---------------|--------------------------------------|
| **MYSQL_HOST**    | `localhost`   | Servidor MySQL                       |
| **MYSQL_PORT**    | `3306`        | Puerto (opcional; por defecto 3306)  |
| **MYSQL_USER**    | `cronec_user` | Usuario de la base de datos          |
| **MYSQL_PASSWORD**| `tu_password` | Contraseña del usuario               |
| **MYSQL_DATABASE**| `cronec_srl`  | Nombre de la base de datos           |
| **SESSION_SECRET**| (32+ caracteres) | Clave para las cookies de sesión (obligatorio en producción) |

**Dónde configurarlas:**

- **En el servidor (Node/PM2):** archivo **`.env.production`** en la raíz del proyecto (donde está `package.json`).
- **En tu PC (para ejecutar los scripts):** **`.env.local`** con los mismos valores.

Ejemplo **`.env.production`** en el servidor:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=cronec_user
MYSQL_PASSWORD=tu_contraseña_segura
MYSQL_DATABASE=cronec_srl
SESSION_SECRET=una-clave-aleatoria-de-al-menos-32-caracteres
```

---

## 3. Crear las tablas (solo una vez)

Después de crear la base de datos y el usuario en CyberPanel, hay que ejecutar el SQL que crea las tablas. Tienes dos opciones.

### Opción A: Script automático (recomendado)

En el servidor (o en tu PC si tienes acceso a la BD desde ahí), con las variables ya en `.env.production` o `.env.local`:

```bash
npm run db:init
```

Ese script lee las variables `MYSQL_*`, se conecta a la base de datos y ejecuta **schema.sql** (y la migración extra si existe). No tienes que copiar/pegar SQL a mano.

### Opción B: Ejecutar el SQL a mano

Si prefieres hacerlo desde phpMyAdmin o la consola MySQL:

1. En phpMyAdmin, selecciona la base de datos (ej. `cronec_srl`).
2. Pestaña **SQL**.
3. Copia todo el contenido de **`scripts/mysql/schema.sql`** y ejecútalo.
4. Si la base ya existía de antes, ejecuta también **`scripts/mysql/migrate-company-info-extra.sql`** (añade la columna `extra` en `company_info`).

Desde consola:

```bash
mysql -h localhost -u cronec_user -p cronec_srl < scripts/mysql/schema.sql
```

---

## 4. Crear el usuario administrador (solo una vez)

Para poder entrar al panel de administración:

```bash
npm run db:seed-admin
```

Por defecto crea:

- **Email:** admin@cronecsrl.com  
- **Contraseña:** admin123  

Para otro email/contraseña:

```bash
ADMIN_EMAIL=tu@email.com ADMIN_PASSWORD=tu_contraseña npm run db:seed-admin
```

**Importante:** cambia la contraseña después del primer acceso.

---

## 5. Desplegar y arrancar la app

1. Sube el proyecto al servidor (Git, FTP, etc.).
2. Asegúrate de que **`.env.production`** esté en la raíz del proyecto con **MYSQL_*** y **SESSION_SECRET**.
3. Instala dependencias y construye:

   ```bash
   npm install
   npm run build
   ```

4. Arranca en producción:

   ```bash
   npm start
   ```

   O con PM2:

   ```bash
   pm2 start npm --name "cronec" -- start
   ```

La app leerá las variables de entorno y se conectará a MySQL automáticamente. No hace falta tocar código.

---

## Resumen rápido

| Paso | Acción |
|------|--------|
| 1 | En CyberPanel: crear base de datos (ej. `cronec_srl`) y usuario con permisos. |
| 2 | Crear `.env.production` con `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `SESSION_SECRET`. |
| 3 | Ejecutar **`npm run db:init`** (crea las tablas). |
| 4 | Ejecutar **`npm run db:seed-admin`** (crea el admin). |
| 5 | `npm run build` y `npm start` (o PM2). |

Si algo falla (por ejemplo “Error al cargar” o “Credenciales incorrectas”), revisa que las variables `MYSQL_*` sean correctas, que la base de datos exista y que hayas ejecutado `db:init` y `db:seed-admin`.
