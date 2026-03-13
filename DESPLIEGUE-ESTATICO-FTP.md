# Despliegue estático por FTP (sin Node ni MySQL en el servidor)

Este modo genera HTML/CSS/JS estáticos que puedes subir por FTP o File Manager a cualquier hosting (Apache, OpenLiteSpeed, CyberPanel, etc.). No requiere Node.js ni base de datos **en el servidor** donde subes los archivos.

**Misma base de datos para ambos despliegues:** La base MySQL (ej. `cron_cronecsrl`) es la misma que uses para el despliegue con Node (app completa con admin). Si en tu `.env.local` tienes `MYSQL_*` configurado y puedes conectar desde tu PC al ejecutar `npm run build:static`, el sitio estático generado contendrá los datos de esa base en el momento del build. Si no configuras MySQL (o no hay conexión en el build), se usan `data/*.json` o datos por defecto.

---

## 1. Requisitos en tu PC

- Node.js instalado
- Proyecto con `npm install` ya ejecutado
- **Formulario de contacto:** para que el formulario funcione sin servidor, necesitas una cuenta en [Formspree](https://formspree.io) y configurar la variable de entorno (ver paso 2).

---

## 2. Variables de entorno para el build estático

Crea o edita **`.env.local`** en la raíz del proyecto.

**Obligatorio para el formulario de contacto:**

```env
NEXT_PUBLIC_FORMSPREE_ID=tu_id_de_formspree
```

(Crea un formulario en https://formspree.io y pega el ID. Sin esto, el formulario falla en el sitio estático.)

**Opcional – misma base MySQL que para el despliegue con Node:**  
Si quieres que el sitio estático lleve los datos de tu base MySQL (proyectos, servicios, blog, etc.), configura las mismas variables que para el servidor:

```env
MYSQL_HOST=...
MYSQL_USER=...
MYSQL_PASSWORD=...
MYSQL_DATABASE=cron_cronecsrl
```

Al ejecutar `npm run build:static`, si la conexión a MySQL funciona, las páginas se generan con los datos de esa base. Si no configuras MySQL o la conexión falla (ej. desde tu PC), se usan `data/*.json` o datos por defecto.

---

## 3. Generar el sitio estático

En la raíz del proyecto:

```bash
npm run build:static
```

(o `npm run build:ftp`)

Este script:

- Excluye la carpeta **`/admin`** del build (no se incluye el panel de administración).
- Usa las versiones estáticas de la home y de la página de proyectos (contenido fijo).
- Genera el export estático con `output: "export"`.
- Copia **`static-deploy/.htaccess`** a **`out/.htaccess`** para Apache/OpenLiteSpeed.

Al terminar, todo el sitio listo para subir está en la carpeta **`out/`**.

---

## 4. Subir por FTP / File Manager

1. Conéctate por **FTP** o abre el **File Manager** de tu hosting (CyberPanel, cPanel, etc.).
2. Entra en la carpeta pública del sitio (por ejemplo `public_html` o la que use tu dominio).
3. Sube **todo el contenido** de la carpeta **`out/`** (no la carpeta `out` en sí):
   - `index.html`
   - `404.html`
   - `.htaccess`
   - Carpetas: `_next/`, `contacto/`, `servicios/`, `proyectos/`, `blog/`, `nosotros/`, etc.
   - Cualquier otro archivo o carpeta que haya generado Next.

No subas la carpeta `data/` ni archivos `.env`; no se usan en el sitio estático.

---

## 5. Contenido del sitio estático

- **Inicio:** servicios, portfolio, testimonios y clientes con datos por defecto (los mismos que en `lib/static-data` y en los componentes).
- **Proyectos:** lista estática de proyectos de ejemplo.
- **Servicios:** lista estática; cada servicio enlaza a `/servicios/[slug]` (p. ej. obras-civiles, obras-electricas). Esas páginas se generan en el build.
- **Blog:** lista con artículos por defecto; las entradas individuales se generan si existen en `data/blog.json` en el momento del build, o con slugs por defecto.
- **Nosotros, Contacto, Políticas:** páginas estáticas.
- **Formulario de contacto:** envía a Formspree si está configurado `NEXT_PUBLIC_FORMSPREE_ID`.
- **Panel admin:** no está incluido (solo sitio público).

---

## 6. Resumen de comandos

| Paso | Acción |
|------|--------|
| 1 | Crear formulario en Formspree y anotar el ID. |
| 2 | En `.env.local`: `NEXT_PUBLIC_FORMSPREE_ID=tu_id`. |
| 3 | `npm run build:static` (o `npm run build:ftp`). |
| 4 | Subir el contenido de `out/` por FTP/File Manager a la raíz del sitio. |

Si quieres que el sitio estático use datos de tu base MySQL o de `data/*.json`, debes ejecutar el build en un entorno donde esa data esté disponible (por ejemplo con `data/` rellenado o con MySQL accesible); el resultado seguirá siendo estático.
