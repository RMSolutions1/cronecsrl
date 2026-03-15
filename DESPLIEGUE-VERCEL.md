# Desplegar CRONEC SRL en Vercel

## 1. Variables de entorno en Vercel

En el proyecto de Vercel: **Settings → Environment Variables**. Añadí estas variables (para Production, Preview y Development si querés):

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de conexión a Neon (PostgreSQL) | `postgresql://user:pass@host/neondb?sslmode=verify-full` |
| `SESSION_SECRET` | Clave para firmar la sesión del admin (32+ caracteres) | Generar una aleatoria |
| `BLOB_READ_WRITE_TOKEN` | **Requerido para subir imágenes** desde el dashboard. En Vercel el disco es de solo lectura; sin Blob, "Subir desde la PC" falla. | Se crea al crear un Blob store (ver abajo) |
| `NEXT_PUBLIC_FORMSPREE_ID` | (Opcional) ID de Formspree para el formulario de contacto | `mnjgvyqj` |

**Importante:** Sin `DATABASE_URL`, la app usará los archivos `data/*.json` del repositorio (si existen). Para que el sitio use la base Neon en producción, tenés que configurar `DATABASE_URL` en Vercel.

### Crear Blob store (subida de imágenes)

1. En el proyecto de Vercel: **Storage** (sidebar) → **Create Database** → **Blob**.
2. Nombre (ej. `cronec-images`), acceso **Public** (para que las URLs de imágenes sean visibles en la web).
3. Crear. Vercel añade automáticamente la variable **`BLOB_READ_WRITE_TOKEN`** al proyecto.
4. Volvé a desplegar o esperá al próximo deploy. Las subidas desde el dashboard (proyectos, hero, certificaciones, etc.) pasarán a usar Vercel Blob.

Alternativa: en cualquier formulario de imagen del dashboard podés **pegar una URL** (por ejemplo de Unsplash o de un servicio externo) sin necesidad de subir archivo.

## 2. Build en Vercel

- El proyecto usa **Next.js** con servidor (no static export) en Vercel; `output: "export"` solo se aplica cuando `BUILD_FTP=1` (build local para FTP).
- No definas `BUILD_FTP` en Vercel, así el despliegue es una app Node normal.

## 3. Si el build falla

- Revisá el **log completo** del build en Vercel (la parte donde aparece el error en rojo).
- Errores frecuentes:
  - **Falta una variable:** asegurate de tener al menos `SESSION_SECRET` y, si querés Neon, `DATABASE_URL`.
  - **Error de TypeScript:** en el repo ejecutá `npm run build` localmente; si falla, corregí antes de volver a desplegar.
  - **Timeout o error de conexión a la base de datos:** puede ocurrir si en build time se intenta conectar a Neon y la red de Vercel no llega. En ese caso, comprobá que la URL de Neon sea accesible desde internet y que no tengas restricción por IP.

## 4. Después del despliegue

- **Web:** `https://tu-proyecto.vercel.app`
- **Admin:** `https://tu-proyecto.vercel.app/admin/login`  
  Usuario por defecto (si usaste `db:seed-admin-pg` en Neon): el que configuraste (ej. `admin@cronecsrl.com.ar` / la contraseña del seed).
