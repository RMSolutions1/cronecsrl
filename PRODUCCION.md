# Checklist para producción – CRONEC SRL

## 1. Variables de entorno

- **SESSION_SECRET**: Obligatorio. Clave aleatoria de al menos 32 caracteres para firmar la sesión del admin. En Vercel: Settings → Environment Variables.
- **MySQL** (opcional): Si usas base de datos, configura `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`.
- **NEXT_PUBLIC_FORMSPREE_ID**: Solo si despliegas sitio 100% estático (sin API). En Vercel/Node el formulario de contacto usa `/api/contact` y guarda en `data/messages.json`.

Copia `.env.local.example` a `.env.local` en desarrollo. En producción configura las variables en el panel de tu hosting.

## 2. Contenido y datos

- El contenido se guarda en `data/*.json`. Asegúrate de que la carpeta `data/` exista y tenga permisos de escritura si el servidor escribe (mensajes, etc.).
- En despliegues estáticos (FTP/export), los JSON se incluyen en el build; no hay escritura en runtime.

## 3. Build

```bash
npm ci
npm run build
npm run start
```

Para export estático (FTP): `BUILD_FTP=1 npm run build`. La API y el admin no funcionan en export estático.

## 4. Dominio y SEO

- En `app/layout.tsx` está `metadataBase: new URL("https://cronecsrl.com.ar")`. Cambia la URL si usas otro dominio.
- Opcional: en `metadata.verification` agrega el código de Google Search Console cuando lo tengas.

## 5. Seguridad

- No subas `.env.local` ni `.env.production` al repositorio.
- El panel admin está en `/admin`; protege con buenas contraseñas y, si quieres, restricción por IP en el servidor.

## 6. Despliegue en Vercel

- Conectar el repo y desplegar. Las variables se configuran en el proyecto.
- El sitio usa lectura/escritura en `data/` en el filesystem; en Vercel el sistema de archivos es de solo lectura tras el build, salvo que uses un volumen o BD. Para que los mensajes y el admin persistan, conviene usar MySQL o almacenamiento externo (en ese caso ya hay soporte para MySQL en el código).
