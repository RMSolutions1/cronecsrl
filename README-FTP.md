# Subir la web por FTP (hosting estático)

Esta versión genera una copia **100% estática** de la web, lista para subir por FTP a cualquier hosting (cPanel, DonWeb Web Hosting, etc.) **sin Node.js ni base de datos**.

## Cómo generar la carpeta para FTP

En la raíz del proyecto ejecutá:

```powershell
npm run build:ftp
```

O directamente:

```powershell
powershell -ExecutionPolicy Bypass -File ./scripts/build-ftp.ps1
```

Al terminar, toda la web estará en la carpeta **`out/`**.

## Qué subir por FTP

1. Subí **todo el contenido** de la carpeta **`out/`** a la raíz de tu hosting (public_html, www, htdocs, etc.).
2. No hace falta subir `node_modules`, `.next`, ni el código fuente; solo lo que está dentro de `out/`.

## Formulario de contacto (Formspree)

En la versión estática el formulario de contacto usa **Formspree**. Para recibir los mensajes:

1. Creá una cuenta en [formspree.io](https://formspree.io).
2. Creá un formulario y copiá el **Form ID** (ej: `xyzwabcd`).
3. Antes de hacer el build FTP, definí la variable de entorno con ese ID:
   ```powershell
   $env:NEXT_PUBLIC_FORMSPREE_ID = "tu-form-id"
   npm run build:ftp
   ```
   O editá `scripts/build-ftp.ps1` y reemplazá `"placeholder"` por tu Form ID.

Si no configurás Formspree, el formulario intentará enviar a Formspree con el ID "placeholder" y no funcionará hasta que pongas tu ID real.

## Diferencias con la versión con Node.js

| Funcionalidad        | Con Node (VPS/Cloud) | Versión FTP (estática) |
|----------------------|----------------------|-------------------------|
| Web pública          | Sí                   | Sí (igual)              |
| Servicios / Proyectos| Desde BD             | Contenido fijo en código |
| Formulario contacto  | BD o API             | Formspree               |
| Panel de administración | Sí                | No (no incluido)        |
| Blog / Noticias      | Desde BD             | Página estática de blog  |

La versión FTP es la **misma web** en diseño y páginas; solo cambia que no hay panel de admin ni base de datos, y el contacto se maneja con Formspree.

## Resumen

1. `npm run build:ftp`
2. Subir el contenido de **`out/`** por FTP a la raíz del sitio.
3. Configurar **NEXT_PUBLIC_FORMSPREE_ID** (o en el script) para el formulario de contacto.
