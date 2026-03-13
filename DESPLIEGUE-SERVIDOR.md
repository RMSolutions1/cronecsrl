# Subir la app a tu servidor

Este flujo está alineado con la guía oficial **[Configurar mi Cloud Server con Node.JS + Nginx](https://soporte.donweb.com/hc/es/articles/19492126815124-Configurar-mi-Cloud-Server-con-Node-JS-Nginx)** de DonWeb (acceso SSH → Nginx → Node/PM2 → firewall → SSL).

## Requisitos en tu PC (Windows)

El script de deploy usa **SSH** y **SCP**. Si al ejecutarlo ves *"ssh no se reconoce"*:

1. Abrí **Configuración** → **Aplicaciones** → **Características opcionales**.
2. **Agregar una característica** → buscá **Cliente OpenSSH** → Instalar.
3. O en PowerShell (como administrador):  
   `Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0`
4. Cerrá y volvé a abrir PowerShell; probá: `ssh -V`.

---

Servidores documentados:

| Servidor | Host / IP | SSH (puerto) |
|----------|-----------|----------------|
| **Dattaweb VPS** | `vps-5753489-x.dattaweb.com` (IP: 66.97.38.130) | **5010** |
| DonWeb / CyberPanel | `200.58.126.34` | 5525 |

Reemplazá en los comandos el host o IP según el servidor que uses.

---

## 1. Instalar Node.js en el servidor (solo la primera vez)

Conectate por SSH.

**Dattaweb (puerto 5010):**
```powershell
ssh -p 5010 root@vps-5753489-x.dattaweb.com
```

**DonWeb / CyberPanel (puerto 5525):**
```powershell
ssh -p 5525 root@200.58.126.34
```

En el servidor, instalá Node.js 20 (LTS):

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
node -v
npm -v
```

Salí con `exit`.

---

## 2. Desplegar la app desde tu PC

En **PowerShell**, desde la carpeta del proyecto:

**Dattaweb VPS (puerto 5010):**
```powershell
cd "C:\Users\Windows\Desktop\cronec srl"
.\deploy-donweb.ps1 -ServerIP "vps-5753489-x.dattaweb.com" -SshPort 5010
```

**DonWeb (puerto 5525):**
```powershell
cd "C:\Users\Windows\Desktop\cronec srl"
.\deploy-donweb.ps1 -ServerIP "200.58.126.34" -SshPort 5525
```

Te va a pedir la contraseña de `root` (para SSH y SCP). El script:

- Crea `~/apps/cronec` en el servidor
- Sube el código (sin node_modules ni .next)
- En el servidor: `npm install --legacy-peer-deps`, `npm run build`, arranca la app con PM2

---

## 3. Abrir el puerto 3000 en el firewall

En el servidor (por SSH):

```bash
ufw allow 3000
ufw reload
```

Si usás el firewall de CyberPanel, abrí también el puerto **3000** (TCP) para tráfico entrante.

---

## 4. Probar la app

En el navegador:

- **Dattaweb:** http://vps-5753489-x.dattaweb.com:3000 o http://66.97.38.130:3000  
- **DonWeb:** http://200.58.126.34:3000

---

## 5. Variables de entorno (MySQL, sesión)

Si usás base de datos y sesión, en el servidor creá el archivo de entorno:

```bash
# Dattaweb:
ssh -p 5010 root@vps-5753489-x.dattaweb.com

# DonWeb:
ssh -p 5525 root@200.58.126.34
```

Luego en el servidor: `nano ~/apps/cronec/.env.production`

Contenido (ajustá los valores):

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=cronec
MYSQL_PASSWORD=tu_password
MYSQL_DATABASE=cronec
SESSION_SECRET=una-clave-aleatoria-de-al-menos-32-caracteres
```

Guardá (Ctrl+O, Enter, Ctrl+X). Reiniciá la app:

```bash
pm2 restart cronec
```

---

## 6. Configurar Nginx (dominio en puerto 80)

Seguí el mismo flujo que la [guía de DonWeb Node.js + Nginx](https://soporte.donweb.com/hc/es/articles/19492126815124-Configurar-mi-Cloud-Server-con-Node-JS-Nginx): la app sigue en el puerto 3000 y Nginx hace de proxy.

**6.1** En el servidor (por SSH), ir al directorio de Nginx y crear el vhost (reemplazá `cronecsrl.com.ar` por tu dominio):

```bash
apt install -y nginx
cd /etc/nginx/sites-available
nano cronecsrl.com.ar
```

**6.2** Contenido del archivo (reemplazá el `server_name` por tu dominio):

```nginx
server {
    listen 80;
    server_name cronecsrl.com.ar www.cronecsrl.com.ar;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Guardá (Ctrl+O, Enter, Ctrl+X).

**6.3** Crear el enlace simbólico, probar Nginx y reiniciar (como en la guía DonWeb):

```bash
cd /etc/nginx/sites-enabled
ln -s /etc/nginx/sites-available/cronecsrl.com.ar cronecsrl.com.ar
nginx -t
service nginx restart
service nginx status
```

Si `nginx -t` muestra *syntax is ok* y *test is successful*, Nginx quedó bien configurado.

**6.4** Apuntá el DNS del dominio (registro A) a la IP del servidor (Dattaweb: **66.97.38.130**; DonWeb: **200.58.126.34**).

---

## 7. Certificado SSL (HTTPS)

Para que el sitio sea “Seguro” en el navegador, instalá el certificado con Certbot (reemplazá el dominio):

```bash
certbot --nginx -d cronecsrl.com.ar -d www.cronecsrl.com.ar
```

Elegí la opción **2** (Redirect) para forzar HTTPS. Al finalizar, el sitio quedará en `https://cronecsrl.com.ar`.

---

## Checklist: despliegue completo (según guía DonWeb)

| Paso | Descripción | Hecho |
|------|-------------|--------|
| 1 | Acceso SSH al servidor | ✓ |
| 2 | Node.js instalado en el servidor | ✓ |
| 3 | App desplegada (código en `~/apps/cronec`) | ✓ |
| 4 | PM2 ejecutando la app (`pm2 start` / `pm2 restart cronec`) | ✓ |
| 5 | Firewall: excepción para puerto 3000 (`ufw allow 3000`) | ✓ |
| 6 | Nginx: vhost creado en `sites-available`, enlace en `sites-enabled`, `nginx -t`, `service nginx restart` | ✓ |
| 7 | DNS del dominio apuntando a la IP del servidor | ✓ |
| 8 | Certificado SSL con `certbot --nginx -d dominio -d www.dominio` | ✓ |

Referencia: [Configurar mi Cloud Server con Node.JS + Nginx – DonWeb](https://soporte.donweb.com/hc/es/articles/19492126815124-Configurar-mi-Cloud-Server-con-Node-JS-Nginx).

---

## Resumen de comandos

**Dattaweb (vps-5753489-x.dattaweb.com, puerto SSH 5010):**

| Paso | Dónde | Comando |
|------|--------|--------|
| Conectar SSH | PC | `ssh -p 5010 root@vps-5753489-x.dattaweb.com` |
| Instalar Node (1ª vez) | Servidor | `curl -fsSL https://deb.nodesource.com/setup_20.x \| bash -` y `apt-get install -y nodejs` |
| Desplegar | PC | `.\deploy-donweb.ps1 -ServerIP "vps-5753489-x.dattaweb.com" -SshPort 5010` |
| Firewall | Servidor | `ufw allow 3000` y `ufw reload` |
| Nginx (dominio) | Servidor | Ver sección 6 (sites-available, enlace, `nginx -t`, `service nginx restart`) |
| SSL | Servidor | `certbot --nginx -d tudominio.com -d www.tudominio.com` |
| Ver app (IP) | Navegador | http://66.97.38.130:3000 |
| Ver app (dominio) | Navegador | https://tudominio.com (tras Nginx + SSL) |

**DonWeb (200.58.126.34, puerto 5525):**

| Paso | Dónde | Comando |
|------|--------|--------|
| Conectar SSH | PC | `ssh -p 5525 root@200.58.126.34` |
| Desplegar | PC | `.\deploy-donweb.ps1 -ServerIP "200.58.126.34" -SshPort 5525` |
| Ver app | Navegador | http://200.58.126.34:3000 |
