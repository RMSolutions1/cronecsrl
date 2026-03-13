# PostgreSQL / Neon – CRONEC SRL

## 1. Crear la base en Neon

1. Entra en [Neon](https://neon.tech), crea un proyecto y copia la **connection string** (con `?sslmode=require`).
2. En la raíz del proyecto crea o edita **`.env.local`** y añade (con tu URL real):

   ```env
   DATABASE_URL=postgresql://USER:PASSWORD@HOST/neondb?sslmode=require
   ```

   No subas `.env.local` al repositorio.

## 2. Ejecutar el esquema

1. En el **Neon Dashboard** → tu proyecto → **SQL Editor**.
2. Abre el archivo **`scripts/postgres/schema.sql`** de este repo.
3. Copia todo su contenido y pégalo en el SQL Editor.
4. Ejecuta el script. Se crearán las tablas y la fila por defecto de `company_info`.

## 3. Usuario admin

El login usa la tabla `users`. Para crear el primer admin:

- Opción A: Insertar manualmente en Neon SQL Editor un usuario con `password_hash` generado con bcrypt (por ejemplo desde Node: `require('bcryptjs').hashSync('tu_password', 12)`).
- Opción B: Si tienes datos en `data/services.json` etc., puedes cargarlos una vez; el admin se gestiona aparte en `users`.

## 4. Prioridad de la base de datos

- Si está definido **`DATABASE_URL`** o **`POSTGRES_URL`** → la app usa **PostgreSQL (Neon)**.
- Si no, y están definidas las variables **`MYSQL_*`** → se usa **MySQL**.
- Si no hay ninguna → se usan los archivos **`data/*.json`**.
