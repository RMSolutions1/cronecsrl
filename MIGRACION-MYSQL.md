# Migración a MySQL (sin Supabase)

El proyecto quedó migrado de **Supabase** a **MySQL** para poder alojarlo en tu hosting con base de datos MySQL.

## 1. Base de datos MySQL

- Crea una base de datos MySQL en tu hosting (por ejemplo `cronec`).
- Ejecuta el esquema: **`scripts/mysql/schema.sql`** (todas las tablas e insert inicial de `company_info`).

## 2. Variables de entorno

Copia `.env.local.example` a `.env.local` y configura:

- **MYSQL_HOST** – Host de MySQL (ej. `localhost` o la IP de tu hosting)
- **MYSQL_PORT** – Puerto (por defecto `3306`)
- **MYSQL_USER** – Usuario de la base de datos
- **MYSQL_PASSWORD** – Contraseña
- **MYSQL_DATABASE** – Nombre de la base de datos (ej. `cronec`)
- **SESSION_SECRET** – Clave larga y aleatoria para firmar las cookies de sesión (mín. 32 caracteres)

## 3. Usuario administrador

Después de tener la BD creada y el esquema ejecutado:

```bash
npm run db:seed-admin
```

Por defecto crea el usuario:

- **Email:** admin@cronecsrl.com  
- **Contraseña:** admin123  

Para otro email/contraseña:

```bash
ADMIN_EMAIL=tu@email.com ADMIN_PASSWORD=tucontraseña npm run db:seed-admin
```

**Importante:** cambia la contraseña después del primer acceso.

## 4. Subida de imágenes

Las imágenes se guardan en **`public/uploads/`** (no hay Supabase Storage). La ruta `/api/upload` recibe el archivo y lo guarda ahí. Asegúrate de que la carpeta `public/uploads` exista y tenga permisos de escritura en el servidor (o se creará al subir la primera imagen).

## 5. Registro y recuperación de contraseña

- **Registro:** no hay registro público; los admins se crean con `db:seed-admin` o insertando en la tabla `users` con un hash bcrypt de la contraseña.
- **Recuperar contraseña:** no hay flujo por correo; el admin debe restablecer la contraseña manualmente en la BD (actualizando `password_hash` en `users` con un nuevo hash bcrypt).

## 6. Resumen de cambios

- **Auth:** sesiones con **iron-session** y tabla **users** (email + password_hash).
- **Datos:** todas las tablas en MySQL; consultas desde **Server Actions** en `app/actions/db/`.
- **Archivos:** subida a `public/uploads` vía **`/api/upload`**.
- **Supabase:** eliminado (paquetes y `lib/supabase`).

Para ver el proyecto en local: configura `.env.local`, ejecuta el esquema MySQL, corre `npm run db:seed-admin` y luego `npm run dev`.
