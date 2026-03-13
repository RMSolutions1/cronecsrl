# Desplegar CRONEC SRL en hosting Ubuntu 22.04 + CyberPanel + WordPress

Tu servidor usa **Ubuntu 22.04**, **CyberPanel** y una imagen con **WordPress**. Puedes desplegar la web de dos maneras:

- **Opción A – Sitio estático:** solo subir archivos (FTP / administrador de archivos). No requiere Node.js ni base de datos. Ideal si solo quieres la web corporativa.
- **Opción B – App Node.js:** instalar Node en el servidor y ejecutar la app completa (admin, formulario a BD, etc.). Requiere acceso SSH y configurar Nginx/proxy.

---

## Opción A – Sitio estático (subir a hosting)

Sirve para **subir la web como archivos** a la misma máquina donde está WordPress/CyberPanel (o a otro hosting con PHP/Apache). No se usa Node.js ni MySQL para esta web.

### 1. Formulario de contacto (Formspree)

En hosting estático el formulario no puede usar tu API ni MySQL. Se usa **Formspree** (gratis):

1. Entrá a [formspree.io](https://formspree.io), creá un formulario y copiá el **Form ID** (ej. `xyzwabcd`).
2. En la carpeta del proyecto creá o editá `.env.local` y agregá:
   ```env
   NEXT_PUBLIC_FORMSPREE_ID=xyzwabcd
   ```
   (reemplazá por tu ID real).

### 2. Generar el sitio estático

En tu PC, en la carpeta del proyecto:

```powershell
npm run build:static
```

O, si usás el script anterior:

```powershell
npm run build:ftp
```

Eso genera la carpeta **`out/`** con todo el sitio (HTML, CSS, JS, imágenes). No incluye panel de administración ni API.

**Si aparece "Acceso denegado"** al ejecutar el script, cerrá Cursor/VS Code u otro programa que tenga abierta la carpeta `app\admin` y volvé a ejecutar.

### 3. Subir los archivos al servidor

- **Por FTP / administrador de archivos de CyberPanel:**  
  Subí **todo el contenido** de la carpeta `out/` (no la carpeta `out` en sí) a la ruta donde quieras que esté la nueva web, por ejemplo:
  - `public_html/nueva-web/` → la web quedará en `https://tudominio.com/nueva-web/`
  - O en la raíz de un subdominio (ej. `public_html` del subdominio `web.tudominio.com`).

- Asegurate de subir también el archivo **`.htaccess`** que está en `out/` (el script de build lo copia desde `static-deploy/.htaccess`). Es necesario para Apache/OpenLiteSpeed (enlaces y 404).

### 4. Comprobar

- Entrá a la URL donde subiste los archivos (ej. `https://tudominio.com/nueva-web/`).
- Probá el formulario de contacto: los envíos deben llegar a Formspree (y a tu email si lo configuraste ahí).

### Resumen Opción A

| Paso | Acción |
|------|--------|
| 1 | Crear formulario en Formspree y poner `NEXT_PUBLIC_FORMSPREE_ID` en `.env.local` |
| 2 | Ejecutar `npm run build:static` (o `npm run build:ftp`) |
| 3 | Subir todo el contenido de `out/` (incluido `.htaccess`) por FTP/File Manager |
| 4 | Verificar la URL y el envío del formulario |

---

## Opción B – App Node.js en el mismo servidor

Si querés la **aplicación completa** (panel de admin, formulario a MySQL, etc.) en el mismo Ubuntu 22.04 con CyberPanel:

1. Necesitás **acceso SSH** al servidor e instalar **Node.js** (por ejemplo Node 20 LTS).
2. La guía detallada está en **[DESPLIEGUE-SERVIDOR.md](./DESPLIEGUE-SERVIDOR.md)** (script `deploy-donweb.ps1`, PM2, variables de entorno, Nginx, etc.).

En resumen:

- Conectarte por SSH (puerto que uses, ej. 5525).
- Instalar Node.js 20.
- En tu PC: ejecutar el script de despliegue hacia la IP del servidor.
- En el servidor: configurar `.env` con MySQL y `SESSION_SECRET`, abrir puerto 3000, opcionalmente Nginx como proxy inverso al puerto 3000.

WordPress puede seguir en su propio sitio o subdominio; la app Next.js puede ir en otro (subdominio o ruta) según cómo configures Nginx en CyberPanel.

---

## Comparación rápida

| | Opción A – Estático | Opción B – Node.js |
|--|---------------------|---------------------|
| **Requisitos** | Solo subir archivos (FTP/File Manager) | SSH, Node.js, MySQL, PM2 |
| **Formulario** | Formspree (externo) | API propia + MySQL |
| **Panel admin** | No | Sí |
| **Proyectos/servicios desde BD** | No (contenido estático) | Sí |
| **Ideal para** | Solo web corporativa en hosting compartido | Servidor propio/VPS con Node |

---

## Notas para la imagen Ubuntu + CyberPanel + WordPress

- La imagen **Ubuntu2204-64-cyberpanel-wp** suele tener **OpenLiteSpeed** o **Apache**. El `.htaccess` incluido en `out/` está pensado para Apache/OpenLiteSpeed.
- Si tu sitio está en un **subdirectorio** (ej. `/nueva-web/`), puede que tengas que ajustar la **base URL** en el proyecto (por ejemplo `metadataBase` o enlaces absolutos) y volver a hacer `npm run build:static` antes de subir de nuevo.
- Para **SSL (HTTPS)** en CyberPanel podés usar Let’s Encrypt desde el panel; luego, si querés forzar HTTPS, podés descomentar las reglas de redirección en el `.htaccess` de `static-deploy/` y volver a generar y subir `out/`.

Si querés, en el siguiente paso podemos dejar listo un `build:static` que copie siempre el `.htaccess` a `out/` y documentar en este mismo archivo la ruta exacta donde subir en tu panel (ej. nombre de la carpeta en `public_html`).
