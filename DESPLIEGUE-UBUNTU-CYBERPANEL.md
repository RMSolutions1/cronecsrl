# Desplegar CRONEC SRL (Next.js) en Ubuntu 22.04 con CyberPanel

**Dominio:** **cronecsrl.com.ar**  
Tu aplicación es **Next.js**. En un servidor con imagen "WordPress + CyberPanel" instalas Node.js y ejecutas la app. El sitio ya está configurado para el dominio **cronecsrl.com.ar** (metadata, SEO, sitemap, robots).

---

## Requisitos previos

- Acceso **SSH** al servidor (usuario root o con sudo).
- Dominio **cronecsrl.com.ar** (y opcionalmente **www.cronecsrl.com.ar**) apuntando a la IP del servidor.
- Tu proyecto en un repositorio Git **o** posibilidad de subir archivos (SFTP/rsync).

---

## 1. Conectarte por SSH

Desde tu PC (PowerShell o terminal):

```bash
ssh root@TU_IP_DEL_SERVIDOR
```

(o el usuario que te haya dado el proveedor). Acepta la huella si es la primera vez.

---

## 2. Instalar Node.js 20 LTS

En el servidor:

```bash
# Actualizar e instalar curl
sudo apt update
sudo apt install -y curl

# Añadir repositorio de NodeSource para Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Instalar Node.js
sudo apt install -y nodejs

# Verificar
node -v   # debe mostrar v20.x.x
npm -v
```

---

## 3. Instalar PM2 (mantener la app en marcha)

PM2 hace que tu app se reinicie si se cae y siga corriendo al cerrar la sesión SSH:

```bash
sudo npm install -g pm2
```

---

## 4. Subir tu aplicación al servidor

**Opción A – Si tu código está en GitHub/GitLab**

```bash
# Instalar git si no está
sudo apt install -y git

# Crear carpeta para la app (ajusta la ruta si usas otro usuario)
sudo mkdir -p /home/cronec-app
sudo chown $USER:$USER /home/cronec-app
cd /home/cronec-app

# Clonar (reemplaza con tu URL real)
git clone https://github.com/TU_USUARIO/TU_REPO.git .
# o: git clone https://gitlab.com/TU_USUARIO/TU_REPO.git .
```

**Opción B – Subir desde tu PC con rsync (sin Git)**

En tu **PC Windows** (PowerShell), desde la carpeta del proyecto (`cronec srl`):

```powershell
# Primero genera el build en tu PC (opcional pero recomendado para ver que todo va bien)
npm run build

# Subir archivos (excluyendo node_modules y .next del PC; los instalarás en el servidor)
scp -r "c:\Users\Windows\Desktop\cronec srl" root@TU_IP_DEL_SERVIDOR:/home/cronec-app
```

Luego en el **servidor**:

```bash
cd /home/cronec-app/cronec-srl
# o la ruta donde hayas dejado la carpeta del proyecto
```

---

## 5. En el servidor: instalar dependencias y build

Siempre dentro de la carpeta del proyecto en el servidor:

```bash
cd /home/cronec-app   # o cd /home/cronec-app/cronec-srl si subiste la carpeta así

# Instalar dependencias de producción
npm ci --omit=dev
# Si falla, prueba: npm install --production

# Crear archivo de variables de entorno
nano .env.production
```

Dentro de `.env.production` escribe (y ajusta valores):

```env
SESSION_SECRET=pon-aqui-una-clave-aleatoria-de-al-menos-32-caracteres
# Si usas MySQL (opcional):
# MYSQL_HOST=localhost
# MYSQL_PORT=3306
# MYSQL_USER=tu_usuario
# MYSQL_PASSWORD=tu_password
# MYSQL_DATABASE=cronec
```

Guarda (Ctrl+O, Enter) y cierra (Ctrl+X).

Luego:

```bash
# Build de producción
npm run build

# Probar que arranca (puerto 3000)
npm run start
```

Deberías ver que Next.js está escuchando en el puerto 3000. Prueba en el navegador: `http://TU_IP:3000`.  
Para dejarlo en segundo plano con PM2, para la app (Ctrl+C) y sigue al paso 6.

---

## 6. Poner la app en marcha con PM2

En la misma carpeta del proyecto:

```bash
# Arrancar la app con PM2
pm2 start npm --name "cronec" -- start

# Que se inicie al reiniciar el servidor
pm2 startup
# Ejecuta el comando que te muestre PM2 (suele ser algo como: sudo env PATH=... pm2 startup systemd ...)

pm2 save
```

Comandos útiles:

- `pm2 status`     → ver estado  
- `pm2 logs cronec` → ver logs  
- `pm2 restart cronec` → reiniciar  

Tu app queda escuchando en **http://TU_IP:3000**.

---

## 7. DNS: apuntar cronecsrl.com.ar al servidor

En el panel donde gestionas el dominio **cronecsrl.com.ar** (registrador o Cloudflare, etc.) crea o edita:

| Tipo | Nombre      | Valor           | TTL  |
|------|-------------|------------------|------|
| **A**  | `@`         | IP_DE_TU_SERVIDOR | 300  |
| **A**  | `www`       | IP_DE_TU_SERVIDOR | 300  |

Así tanto **cronecsrl.com.ar** como **www.cronecsrl.com.ar** resolverán a tu servidor. Los cambios pueden tardar unos minutos u horas en propagarse.

---

## 8. Abrir el puerto 3000 en el firewall (si usas UFW)

```bash
sudo ufw allow 3000
sudo ufw reload
```

(Si usas el firewall de CyberPanel o otro, abre ahí el puerto 3000.)

---

## 8. Usar tu dominio con Nginx o OpenLiteSpeed (proxy inverso)

Para que la app se vea en **https://tudominio.com** (puerto 80/443) en lugar de `http://IP:3000`:

### Si CyberPanel usa **OpenLiteSpeed**

1. En CyberPanel: **Websites** → tu sitio (o crea uno para la app).
2. En la configuración del sitio, busca **“Rewrite”** o **“Proxy”**.
3. Añade una regla para enviar las peticiones al puerto 3000, por ejemplo:

   - **Proxy URL / origen:** `http://127.0.0.1:3000`  
   - Aplicar a: `/` (todo el sitio) o al path que quieras para la app.

(O bien, en el “vhost” del sitio, configura un proxy hacia `http://127.0.0.1:3000`.)

### Si usas **Nginx** (o puedes crear un “vhost” con Nginx)

Instalar Nginx si no está:

```bash
sudo apt install -y nginx
```

Crear un sitio para tu app:

```bash
sudo nano /etc/nginx/sites-available/cronec
```

Contenido (cambia `tudominio.com` por tu dominio o deja la IP en `server_name`):

```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activar el sitio y recargar Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/cronec /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Si en CyberPanel el puerto 80 lo usa ya otro servicio (p. ej. OpenLiteSpeed), puedes:
- Usar el proxy desde el propio panel hacia `http://127.0.0.1:3000`, o  
- Dejar que Nginx escuche en otro puerto y redirigir desde el panel a ese puerto.

---

## 9. HTTPS (SSL) con Let’s Encrypt

En **CyberPanel** suele haber opción para **SSL** (Let’s Encrypt) por sitio. Actívalo para tu dominio y el panel se encargará del certificado.

Si usas Nginx a mano:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.com -d www.tudominio.com
```

Sigue las preguntas; Certbot configurará HTTPS y la redirección de HTTP a HTTPS.

---

## 11. Datos y persistencia

- Los **mensajes de contacto** y el **contenido del admin** se guardan en archivos dentro de la carpeta **`data/`** del proyecto (por ejemplo `data/messages.json`, `data/settings.json`, etc.).
- Esa carpeta debe tener permisos de escritura para el usuario con el que corre PM2:

```bash
cd /home/cronec-app   # o la ruta de tu proyecto
chmod -R u+w data
```

- Si reinicias o actualizas la app, **no borres** la carpeta `data/` para no perder mensajes ni configuración.
- Haz **copias de seguridad** periódicas de `data/` (por ejemplo con un cron que haga `tar` o `rsync` a otra ruta o servidor).

---

## 12. Actualizar la app en el futuro

Si usas Git:

```bash
cd /home/cronec-app
git pull
npm ci --omit=dev
npm run build
pm2 restart cronec
```

Si subes archivos a mano, vuelve a subir solo lo necesario, luego en el servidor:

```bash
cd /home/cronec-app
npm ci --omit=dev
npm run build
pm2 restart cronec
```

---

## Resumen rápido

| Paso | Acción |
|------|--------|
| 1 | SSH al servidor |
| 2 | Instalar Node.js 20 |
| 3 | Instalar PM2 |
| 4 | Subir proyecto (Git o rsync/scp) |
| 5 | `npm ci --omit=dev`, crear `.env.production`, `npm run build` |
| 6 | `pm2 start npm --name "cronec" -- start` y `pm2 startup` + `pm2 save` |
| 7 | Abrir puerto 3000 en firewall |
| 8 | Configurar proxy (CyberPanel o Nginx) para tu dominio → `http://127.0.0.1:3000` |
| 9 | Activar SSL (Let’s Encrypt) desde CyberPanel o Certbot |
| 10 | Cuidar permisos y backups de la carpeta `data/` |

Si me dices si vas a usar **dominio o solo IP** y si en el panel ves **Nginx u OpenLiteSpeed**, puedo dejarte los pasos 8 y 9 adaptados exactamente a tu caso (incluyendo dónde tocar en CyberPanel si lo usas).
