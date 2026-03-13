# Guía para dejar la web 100% operativa

Objetivo: que **todo** funcione desde el servidor y que **consultas, formularios de contacto, cotizaciones y administración** se gestionen desde el **dashboard administrativo**.

---

## Resumen de lo que queda operativo

| Funcionalidad | Dónde se guarda | Dónde se gestiona |
|---------------|------------------|-------------------|
| **Formulario de contacto** | MySQL `contact_submissions` | Admin → Mensajes |
| **Cotizaciones (calculadora)** | MySQL `contact_submissions` (servicio "Cotización - ...") | Admin → Mensajes |
| **Proyectos** | MySQL `projects` | Admin → Proyectos |
| **Servicios** | MySQL `services` | Admin → Servicios |
| **Testimonios** | MySQL `testimonials` | Admin → Testimonios |
| **Blog / Noticias** | MySQL `blog_posts` | Admin → Noticias |
| **Configuración empresa** | MySQL `company_info` | Admin → Configuración |
| **Imágenes hero** | MySQL `hero_images` | Admin → Imágenes |
| **Usuarios admin** | MySQL `users` | Registro / recuperar contraseña |

---

## Requisitos previos

- Servidor con la app desplegada (código en `~/apps/cronec`, PM2 con proceso `cronec`).
- Acceso SSH al servidor (ej. `ssh -p 5010 root@vps-5753489-x.dattaweb.com`).
- MySQL disponible (en el mismo servidor o en tu hosting).

---

## Paso 1: Base de datos MySQL

### 1.1 Crear la base de datos

En tu panel de hosting (Dattaweb, DonWeb, cPanel, etc.) o por línea de comandos:

- Crear una base de datos (ej. `cronec`).
- Crear un usuario con permisos sobre esa base y anotar: **host**, **usuario**, **contraseña**, **nombre de la base**.

Si MySQL está en el mismo servidor (Linux):

```bash
mysql -u root -p
CREATE DATABASE cronec CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cronec'@'localhost' IDENTIFIED BY 'TU_PASSWORD_SEGURO';
GRANT ALL PRIVILEGES ON cronec.* TO 'cronec'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 1.2 Ejecutar el esquema

Desde tu PC (o desde el servidor si ya tienes el proyecto):

**Opción A – Desde el servidor (recomendado si ya desplegaste):**

```bash
ssh -p 5010 root@vps-5753489-x.dattaweb.com
cd ~/apps/cronec
mysql -u cronec -p cronec < scripts/mysql/schema.sql
```

**Opción B – Desde tu PC** (si tienes cliente MySQL y acceso remoto a la BD):

```bash
mysql -h TU_HOST_BD -u cronec -p cronec < "C:\Users\Windows\Desktop\cronec srl\scripts\mysql\schema.sql"
```

Comprueba que existan las tablas: `users`, `contact_submissions`, `projects`, `services`, `testimonials`, `company_info`, `blog_posts`, `hero_images`, etc.

---

## Paso 2: Variables de entorno en el servidor

Conéctate por SSH y crea (o edita) el archivo de entorno de producción:

```bash
ssh -p 5010 root@vps-5753489-x.dattaweb.com
nano ~/apps/cronec/.env.production
```

Contenido (ajusta los valores a tu MySQL y genera una clave segura para sesión):

```env
# Base de datos (obligatorio para formularios, cotizaciones y dashboard)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=cronec
MYSQL_PASSWORD=TU_PASSWORD_MYSQL
MYSQL_DATABASE=cronec

# Sesión del panel admin (obligatorio, mínimo 32 caracteres aleatorios)
SESSION_SECRET=una-clave-aleatoria-muy-larga-de-al-menos-32-caracteres-aqui

# NO definas NEXT_PUBLIC_FORMSPREE_ID en producción
# Si no está definido, el formulario de contacto y la calculadora envían a tu API/MySQL
# y todo se ve en Admin → Mensajes
```

Guarda (Ctrl+O, Enter, Ctrl+X).

Importante: **no** pongas `NEXT_PUBLIC_FORMSPREE_ID` en producción si quieres que contacto y cotizaciones se guarden en MySQL y se gestionen desde el dashboard.

---

## Paso 3: Crear usuario administrador

Tras tener la BD creada y el esquema aplicado, crea el primer admin. Puedes hacerlo desde el servidor (con `.env.production` ya configurado) o desde tu PC apuntando a la BD de producción.

**Desde el servidor:**

```bash
cd ~/apps/cronec
export NODE_ENV=production
node scripts/mysql/seed-admin.js
```

O si el script usa `.env.production` automáticamente:

```bash
npm run db:seed-admin
```

Credenciales por defecto del seed: **admin@cronecsrl.com** / **admin123**. **Cámbialas** tras el primer acceso (por seguridad).

Si prefieres ejecutarlo desde tu PC contra la BD de producción, en tu máquina crea un `.env.local` con los mismos `MYSQL_*` de producción y ejecuta:

```bash
npm run db:seed-admin
```

---

## Paso 4: Reiniciar la app y abrir puerto

En el servidor:

```bash
pm2 restart cronec
pm2 save
# Si el puerto 3000 está cerrado en el firewall:
ufw allow 3000
ufw reload
```

Comprueba que la app esté en marcha:

```bash
pm2 status
pm2 logs cronec --lines 20
```

---

## Paso 5: Verificar que todo funcione

### 5.1 Formulario de contacto

1. Entra en tu sitio: `http://66.97.38.130:3000` (o tu dominio).
2. Ve a **Contacto**, rellena y envía el formulario.
3. Inicia sesión en el panel: **http://66.97.38.130:3000/admin** (admin@cronecsrl.com / admin123 si no cambiaste el seed).
4. En el dashboard, entra en **Mensajes**. Debe aparecer el mensaje recién enviado.

Si no aparece: revisa que **no** tengas `NEXT_PUBLIC_FORMSPREE_ID` en `.env.production` y que las variables `MYSQL_*` sean correctas. Revisa `pm2 logs cronec` por errores.

### 5.2 Cotizaciones (calculadora)

1. Ve a **Calculadora** (o la ruta donde está el cotizador).
2. Completa los pasos (tipo de proyecto, m², calidad, urgencia, datos de contacto).
3. Pulsa **Solicitar cotización**.
4. En Admin → **Mensajes** debe aparecer una nueva entrada con servicio tipo "Cotización - Obras Civiles" (o el tipo que elegiste) y el detalle (área, estimación, etc.).

Así todas las cotizaciones se centralizan en el mismo panel que los contactos.

### 5.3 Dashboard administrativo

Desde **Admin** comprueba que puedes:

- **Mensajes**: ver, marcar como leído y gestionar contactos y cotizaciones.
- **Proyectos**: listar, crear, editar y publicar proyectos.
- **Servicios**: gestionar servicios.
- **Testimonios**: gestionar testimonios.
- **Noticias**: gestionar entradas del blog.
- **Configuración**: datos de la empresa (teléfono, email, redes, etc.).
- **Imágenes**: imágenes hero por página.
- **Diagnóstico**: revisar tablas de la BD (solo lectura).

Si algo falla (p. ej. “Error al cargar”), revisa de nuevo `MYSQL_*` y `SESSION_SECRET` y los logs de PM2.

---

## Paso 6: Dominio y HTTPS (opcional pero recomendado)

Para usar tu dominio (ej. cronecsrl.com.ar) y HTTPS:

1. En el servidor configura Nginx como proxy al puerto 3000 (ver **DESPLIEGUE-SERVIDOR.md**, sección 6).
2. Apunta el DNS del dominio (registro A) a la IP del servidor (66.97.38.130 para Dattaweb).
3. Instala certificado SSL:  
   `certbot --nginx -d cronecsrl.com.ar -d www.cronecsrl.com.ar`

Así la web y el panel admin quedan en **https://tudominio.com** y **https://tudominio.com/admin**.

---

## Checklist final: web 100 % operativa

| # | Tarea | Hecho |
|---|--------|--------|
| 1 | Base de datos MySQL creada y esquema `scripts/mysql/schema.sql` ejecutado | ☐ |
| 2 | `.env.production` en el servidor con `MYSQL_*` y `SESSION_SECRET`; sin `NEXT_PUBLIC_FORMSPREE_ID` | ☐ |
| 3 | Usuario admin creado (`npm run db:seed-admin`) y contraseña cambiada tras primer login | ☐ |
| 4 | App en marcha con PM2 (`pm2 restart cronec`) y puerto 3000 abierto en el firewall | ☐ |
| 5 | Formulario de contacto: envía y el mensaje aparece en Admin → Mensajes | ☐ |
| 6 | Calculadora / cotizaciones: envío correcto y aparece en Admin → Mensajes | ☐ |
| 7 | Login en /admin y uso de Proyectos, Servicios, Testimonios, Noticias, Configuración, Imágenes | ☐ |
| 8 | (Opcional) Dominio + Nginx + SSL configurados | ☐ |

Cuando todos los ítems estén hechos, la web está **100 % desplegada** y toda la administración (contactos, cotizaciones, contenido) se maneja desde el dashboard.

---

## Solución de problemas

- **"Error al enviar" en contacto o cotización**: revisa `MYSQL_*` en `.env.production`, que la BD exista y que el esquema esté aplicado. Mira `pm2 logs cronec`.
- **Mensajes no aparecen en Admin**: confirma que no estés usando Formspree en producción (no definir `NEXT_PUBLIC_FORMSPREE_ID`).
- **No puedo entrar a /admin**: verifica que hayas ejecutado `db:seed-admin` y que `SESSION_SECRET` esté definido.
- **Páginas de servicios/proyectos vacías**: desde Admin, agrega al menos un proyecto o servicio publicado y comprueba que la portada y listados los consuman desde la BD.

Referencias: **DEPLIEGUE.md**, **DESPLIEGUE-SERVIDOR.md**, **MIGRACION-MYSQL.md**.
