# Cómo subir el sitio estático (evitar página en blanco)

La página queda **en blanco** si el servidor no encuentra el JavaScript o si subiste la carpeta equivocada. Seguí estos pasos.

---

## 1. Subir el **contenido** de `out`, no la carpeta "out"

En tu PC la ruta es: `c:\Users\Windows\Downloads\cronec srl\out\`

**Correcto:** subir **todo lo que está DENTRO** de `out` a la **raíz del sitio** en el hosting.

En el hosting debe quedar así:

```
public_html/          (o la carpeta que sea la raíz de cronecsrl.com.ar)
├── index.html        ← debe estar en la raíz
├── _next/            ← carpeta completa con todo su contenido
│   └── static/
│       └── ...
├── servicios/
│   ├── index.html
│   ├── obras-civiles.html
│   └── ...
├── contacto/
│   └── index.html
├── .htaccess
├── sitemap.xml
├── robots.txt
└── ... (resto de carpetas y archivos)
```

**Incorrecto:** subir la carpeta **"out"** como tal. Si en el servidor tenés:

```
public_html/
└── out/
    ├── index.html
    └── _next/
```

entonces la web está en `cronecsrl.com.ar/out/` y los enlaces a `/_next/...` fallan → **página en blanco**.

**Qué hacer:** entrá en la carpeta `out`, seleccioná **todo** (index.html, _next, servicios, .htaccess, etc.) y subí **eso** a `public_html` (o la raíz que use tu dominio). No subas la carpeta "out" entera.

---

## 2. Comprobar que esté la carpeta `_next`

El sitio necesita la carpeta **`_next`** con los .js y .css. Si no la subiste o el servidor la bloquea, la página queda en blanco.

- En el administrador de archivos del hosting, en la raíz del sitio debe verse la carpeta **`_next`**.
- Si tu hosting oculta o bloquea carpetas que empiezan con `_`, puede que tengas que cambiar la configuración o contactar soporte.

---

## 3. Raíz del dominio

El dominio **cronecsrl.com.ar** debe apuntar a la carpeta donde subiste `index.html` y `_next`.  
En CyberPanel/cPanel suele ser **public_html** (o el directorio que hayas elegido para ese dominio). Subí el contenido de `out` ahí.

---

## 4. Resumen rápido

| Acción | Cómo |
|--------|------|
| Origen en tu PC | Carpeta `out` del proyecto |
| Qué subir | **Todo el contenido** dentro de `out` (archivos y carpetas), no la carpeta "out" |
| Dónde en el hosting | Raíz del sitio (ej. **public_html**) |
| Resultado | En la raíz: `index.html`, `_next/`, `servicios/`, `.htaccess`, etc. |

Después de subir bien, entrá a **https://cronecsrl.com.ar** (sin `/out`). Si sigue en blanco, abrí las herramientas de desarrollador (F12) → pestaña **Red/Network** y revisá si algún archivo en `_next` devuelve 404.
