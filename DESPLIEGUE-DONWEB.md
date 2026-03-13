# Subir la app CRONEC al Cloud Server (DonWeb)

Sustituye `TU_IP_SERVIDOR` por la IP que te muestra DonWeb en el panel del Cloud Server (ej. `190.xx.xx.xx`).

---

## 1. Conectarte por SSH (desde Windows)

En **PowerShell**:

```powershell
ssh root@TU_IP_SERVIDOR
```

Si te pide confirmar la huella del servidor, escribe `yes`. Si configuraste la clave SSH pública en DonWeb, no te pedirá contraseña.

---

## 2. En el servidor: preparar Node y la carpeta de la app

Ya tienes Node.js si elegiste la imagen "Node.js 22 en Ubuntu 24.04". Comprueba:

```bash
node -v
npm -v
```

Crea la carpeta donde vivirá la app (ej. en el home de root):

```bash
mkdir -p ~/apps
cd ~/apps
```

---

## 3. Subir los archivos de la app desde tu PC

**Opción A – Con SCP (desde PowerShell en tu PC, en la carpeta del proyecto):**

```powershell
cd "C:\Users\Windows\Downloads\cronec srl"

# Excluir node_modules y .next para ir más rápido
scp -r * root@TU_IP_SERVIDOR:~/apps/cronec/
```

Antes de eso, en el servidor crea la carpeta:

```bash
mkdir -p ~/apps/cronec
```

Luego ejecuta el `scp` desde tu PC.

**Opción B – Si tienes el proyecto en Git (GitHub/GitLab):**

En el servidor:

```bash
cd ~/apps
git clone https://github.com/TU_USUARIO/TU_REPO.git cronec
cd cronec
```

(Sustituye la URL por la de tu repositorio.)

---

## 4. En el servidor: instalar dependencias y compilar

```bash
cd ~/apps/cronec

# Dependencias
npm install --legacy-peer-deps

# Variables de entorno (producción)
nano .env.production
```

En `.env.production` agrega (ajusta valores):

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=cronec
MYSQL_PASSWORD=tu_password_mysql
MYSQL_DATABASE=cronec
SESSION_SECRET=una-clave-aleatoria-de-al-menos-32-caracteres-aqui
```

Guarda (Ctrl+O, Enter) y cierra (Ctrl+X). Luego:

```bash
npm run build
```

---

## 5. Dejar la app corriendo con PM2

Instala PM2 (una sola vez):

```bash
npm install -g pm2
```

Arranca la app:

```bash
cd ~/apps/cronec
pm2 start npm --name "cronec" -- start
```

Para que se reinicie al reiniciar el servidor:

```bash
pm2 startup
pm2 save
```

Comandos útiles:

- `pm2 status`     → ver estado
- `pm2 logs cronec` → ver logs
- `pm2 restart cronec` → reiniciar

---

## 6. Abrir el puerto 3000 en el firewall

Next.js escucha en el puerto 3000. Si el servidor tiene firewall (ufw):

```bash
ufw allow 3000
ufw reload
```

En DonWeb, revisa en el panel del Cloud Server si hay un firewall de red y permite tráfico al puerto **3000** (TCP).

---

## 7. Probar la app

En el navegador:

```
http://TU_IP_SERVIDOR:3000
```

Si ves la web de CRONEC, la app está subida y corriendo.

---

## 8. (Opcional) Dominio y Nginx

Para usar un dominio (ej. `www.cronecsrl.com`) y quitar el `:3000`:

1. En DonWeb → Dominios: apunta el dominio a la IP del servidor (registro A).
2. En el servidor instala Nginx y configúralo como proxy hacia `http://127.0.0.1:3000`.

Ejemplo de sitio en Nginx (`/etc/nginx/sites-available/cronec`):

```nginx
server {
    listen 80;
    server_name www.cronecsrl.com cronecsrl.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Habilitar y recargar:

```bash
ln -s /etc/nginx/sites-available/cronec /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## Resumen rápido

| Paso | Dónde   | Acción |
|------|---------|--------|
| 1    | PC      | `ssh root@TU_IP_SERVIDOR` |
| 2    | Servidor| `mkdir -p ~/apps/cronec` |
| 3    | PC      | `scp -r * root@TU_IP_SERVIDOR:~/apps/cronec/` (desde la carpeta del proyecto) |
| 4    | Servidor| `cd ~/apps/cronec` → crear `.env.production` → `npm install --legacy-peer-deps` → `npm run build` |
| 5    | Servidor| `pm2 start npm --name "cronec" -- start` → `pm2 startup` → `pm2 save` |
| 6    | Servidor| `ufw allow 3000` (y abrir 3000 en DonWeb si aplica) |
| 7    | Navegador| `http://TU_IP_SERVIDOR:3000` |

Si algo falla, revisa `pm2 logs cronec` en el servidor para ver el error.
