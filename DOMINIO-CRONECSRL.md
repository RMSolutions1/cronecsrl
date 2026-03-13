# Mostrar la app en cronecsrl.com.ar

Necesitas dos cosas: **apuntar el dominio al servidor** y **configurar Nginx** en el servidor para que sirva la app.

---

## Paso 1: Apuntar el dominio al servidor (DNS)

Donde tengas gestionado **cronecsrl.com.ar** (DonWeb Dominios, o el registrador):

1. Creá o editá el **registro A** del dominio:
   - **Nombre/Host:** `@` (o vacío) → **Valor/Destino:** `66.97.38.130`
2. Creá otro **registro A** para el subdominio **www**:
   - **Nombre/Host:** `www` → **Valor/Destino:** `66.97.38.130`

Si usás DonWeb:
- **DonWeb** → **Dominios** → elegí **cronecsrl.com.ar** → **DNS** / **Zona DNS** / **Gestionar registros**.
- Añadí los dos registros A como arriba y guardá. La propagación puede tardar unos minutos u horas.

---

## Paso 2: Nginx en el servidor (proxy hacia la app)

Conectate por SSH al servidor:

```powershell
ssh root@66.97.38.130
```

Luego ejecutá estos comandos **en el servidor** (copiá y pegá de a bloques si hace falta).

### 2.1 Instalar Nginx (si no está)

```bash
apt update && apt install -y nginx
```

### 2.2 Crear la configuración del sitio

```bash
nano /etc/nginx/sites-available/cronecsrl
```

Pegá este contenido (reemplaza solo si tu dominio fuera otro):

```nginx
server {
    listen 80;
    server_name cronecsrl.com.ar www.cronecsrl.com.ar;
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

Guardá: **Ctrl+O**, Enter, **Ctrl+X**.

### 2.3 Activar el sitio y recargar Nginx

```bash
ln -sf /etc/nginx/sites-available/cronecsrl /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

Si `nginx -t` muestra "syntax is ok", la configuración está bien.

### 2.4 Comprobar que la app esté corriendo

```bash
pm2 status
```

Si **cronec** no está en "online", arrancala:

```bash
cd ~/apps/cronec && pm2 start npm --name cronec -- start
pm2 save
```

---

## Paso 3: Probar

Cuando el DNS ya esté propagado, abrí en el navegador:

- **http://cronecsrl.com.ar**
- **http://www.cronecsrl.com.ar**

Deberías ver la web de CRONEC.

---

## Paso 4 (opcional): HTTPS con SSL

Para que funcione **https://cronecsrl.com.ar**:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d cronecsrl.com.ar -d www.cronecsrl.com.ar
```

Seguí las preguntas (email, aceptar términos). Certbot configurará el certificado y Nginx para HTTPS.

---

## Resumen

| Paso | Dónde | Acción |
|------|--------|--------|
| 1 | DonWeb / DNS del dominio | Registros A: @ y www → 66.97.38.130 |
| 2 | Servidor (SSH) | Instalar Nginx, crear site cronecsrl, activar, reload |
| 3 | Navegador | http://cronecsrl.com.ar |
| 4 (opcional) | Servidor | certbot --nginx para HTTPS |

Si algo no carga, revisá: `pm2 status` y `pm2 logs cronec`, y que el puerto 80 esté abierto en el firewall de DonWeb.
