# Datos del sitio (sin base de datos)

Todo el contenido se administra desde el **panel de administración** y se guarda en archivos JSON en esta carpeta.

## Archivos

| Archivo | Contenido |
|--------|------------|
| `projects.json` | Proyectos / portfolio |
| `services.json` | Servicios (obras civiles, eléctricas, etc.) |
| `messages.json` | Mensajes del formulario de contacto |
| `blog.json` | Entradas del blog / noticias |
| `testimonials.json` | Testimonios de clientes |
| `hero-images.json` | Imágenes del hero por página |
| `settings.json` | Datos de la empresa, redes, hero slides (textos) |
| `admins.json` | Usuarios administradores (email, hash de contraseña, rol) |

## Primer acceso al panel

1. Crear el primer administrador:
   ```bash
   node scripts/seed-admin-json.js
   ```
   Por defecto: email `admin@cronecsrl.com.ar`, contraseña `admin123`.

2. Opcional (variables de entorno):
   ```bash
   ADMIN_EMAIL=tu@email.com ADMIN_PASSWORD=tuclave node scripts/seed-admin-json.js
   ```

3. Iniciar sesión en `/admin/login` con ese usuario.

## Nota de despliegue

En entornos serverless (Vercel, etc.) el sistema de archivos es de solo lectura o efímero. Para producción con persistencia se recomienda migrar a base de datos (MySQL, PostgreSQL) o a un servicio como Vercel KV/Upstash. La lógica de negocio ya está en `app/actions/db/*` y puede adaptarse a cualquier backend.
