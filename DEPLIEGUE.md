# Checklist de despliegue – CRONEC SRL

## Estado del proyecto

- **Build:** `npm run build` compila correctamente.
- **Sin BD:** La web funciona aunque MySQL no esté configurado (servicios y proyectos usan datos estáticos y fallbacks).
- **Con BD:** Servicios, proyectos, testimonios, blog y admin usan MySQL.

## Antes de desplegar

### 1. Variables de entorno (producción)

Configura en tu hosting (Vercel, Railway, Render, VPS, etc.):

| Variable | Obligatorio | Descripción |
|----------|-------------|-------------|
| `MYSQL_HOST` | Sí (si usas BD) | Host de MySQL (ej. `mysql.tuhosting.com`) |
| `MYSQL_PORT` | No | 3306 por defecto |
| `MYSQL_USER` | Sí (si usas BD) | Usuario MySQL |
| `MYSQL_PASSWORD` | Sí (si usas BD) | Contraseña |
| `MYSQL_DATABASE` | Sí (si usas BD) | Nombre de la base (ej. `cronec`) |
| `SESSION_SECRET` | **Sí** | Clave de al menos 32 caracteres para cookies (genera una aleatoria en producción) |

### 2. Base de datos MySQL

- Crea la base de datos en tu proveedor.
- Ejecuta el script: **`scripts/mysql/schema.sql`**.
- Después del primer deploy, ejecuta localmente (apuntando a la BD de producción) para crear el admin:
  ```bash
  npm run db:seed-admin
  ```
  Credenciales por defecto: `admin@cronecsrl.com` / `admin123` — **cámbialas tras el primer acceso**.

### 3. Dónde desplegar

- **Vercel:** Funciona, pero MySQL debe ser accesible desde internet (ej. PlanetScale, Railway MySQL, o MySQL en un VPS). Las variables se configuran en el dashboard de Vercel.
- **Railway / Render / VPS:** Ideal si tu MySQL está en el mismo proveedor o en una red accesible. Ejecuta `npm run build` y `npm run start`, o usa el build automático del servicio.

### 4. Subida de archivos

Las imágenes del admin se guardan en `public/uploads/`. En entornos serverless (Vercel) esta carpeta es efímera: cada deploy la borra. Opciones:

- Usar un almacenamiento externo (S3, Cloudinary, etc.) y guardar la URL en la BD, o
- Desplegar en un VPS/servidor con disco persistente para `public/uploads`.

### 5. Comandos útiles

```bash
npm run build    # Compilar
npm run start    # Servir producción (tras build)
npm run db:seed-admin   # Crear usuario admin (con .env apuntando a tu BD)
```

## Resumen

| Paso | Hecho |
|------|--------|
| Build correcto | Sí |
| Ejemplo de env (`.env.local.example`) | Sí |
| Esquema MySQL (`scripts/mysql/schema.sql`) | Sí |
| App funciona sin BD (fallbacks) | Sí |
| Documentación (MIGRACION-MYSQL.md, este archivo) | Sí |

**Conclusión:** El proyecto está listo para desplegar. Configura las variables de entorno, ejecuta el esquema MySQL en tu servidor de BD y, si usas admin, crea el usuario con `db:seed-admin`. En producción define siempre `SESSION_SECRET` con una clave segura.
