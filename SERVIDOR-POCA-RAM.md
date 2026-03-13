# Servidor con poca RAM – Qué hacer

**Si tu plan tiene suficiente RAM (ej. 4 GB o más, o 16 GB):** no necesitás límites. En el servidor usá el arranque normal:  
`pm2 delete cronec; cd ~/apps/cronec; pm2 start npm --name cronec -- start; pm2 save`

---

Si el panel (Dattaweb, DonWeb, etc.) muestra **"Tu cloud está siendo afectado por falta de memoria RAM"** o uso por encima del 100%, la app Node/Next.js puede estar usando demasiada memoria. Sigue los pasos siguientes.

---

## 1. Activar swap (recomendado)

El **swap** usa disco como “RAM extra”. El servidor deja de quedarse sin memoria tan fácilmente (a cambio de algo de lentitud en picos).

En el servidor por SSH:

```bash
# Ver si ya hay swap
free -h

# Crear archivo de swap de 1 GB
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Hacerlo permanente (que se active al reiniciar)
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Comprobar
free -h
```

Deberías ver una línea “Swap” con algo de uso. Con 1 GB de swap suele bastar para que la app no caiga por falta de RAM.

---

## 2. Limitar la memoria de la app Node (PM2)

Para que Next.js no use más de **512 MB** de RAM (ajustable):

**Opción A – Cambiar el proceso que ya tenés con PM2**

En el servidor:

```bash
pm2 delete cronec
cd ~/apps/cronec
NODE_OPTIONS="--max-old-space-size=512" pm2 start npm --name cronec -- start
pm2 save
```

**Opción B – Usar el script “lowmem” del proyecto**

En el servidor:

```bash
pm2 delete cronec
cd ~/apps/cronec
pm2 start npm --name cronec -- run start:lowmem
pm2 save
```

Eso ejecuta `next start` con un tope de ~512 MB. Si el VPS tiene muy poca RAM (ej. 512 MB total), podés bajar a 256:

```bash
NODE_OPTIONS="--max-old-space-size=256" pm2 start npm --name cronec -- start
pm2 save
```

---

## 3. No hacer el build en el servidor (opcional)

El paso que **más** RAM consume es `npm run build`. Si tu VPS tiene poca RAM:

- Hacé el **build en tu PC** (donde tenés el proyecto).
- Subí solo la carpeta **`.next`** (y el resto del proyecto, pero **sin** volver a ejecutar `npm run build` en el servidor).

Así en el servidor solo corrés `npm install --production` (o `npm install --legacy-peer-deps`) y `pm2 start npm --name cronec -- start`. El script actual `deploy-donweb.ps1` hace build en el servidor; si querés evitar eso, podés subir también `.next` desde tu PC (por SCP o ajustando el script) y en el servidor ejecutar solo install + start.

---

## 4. Revisar qué gasta memoria

En el servidor:

```bash
# Uso de RAM y swap
free -h

# Procesos por uso de memoria
ps aux --sort=-%mem | head -15
```

Si hay otros servicios (MySQL, Nginx, etc.) podés cerrar los que no necesites o valorar un plan con más RAM.

---

## 5. Subir de plan (si sigue faltando RAM)

Si después de swap + límite de Node la máquina sigue muy justa o el aviso no desaparece, la opción más estable es **aumentar la RAM del VPS** (Dattaweb/DonWeb suelen permitir cambiar de plan o añadir recursos).

---

## Resumen rápido

| Acción | Comando / pasos |
|--------|------------------|
| Activar swap 1 GB | `sudo fallocate -l 1G /swapfile` → `chmod 600` → `mkswap` → `swapon` → añadir a `/etc/fstab` |
| Limitar Node a 512 MB | `pm2 delete cronec` → `NODE_OPTIONS="--max-old-space-size=512" pm2 start npm --name cronec -- start` → `pm2 save` |
| Usar script lowmem | `pm2 start npm --name cronec -- run start:lowmem` |

Con **swap + límite de memoria** para Node suele ser suficiente para que el aviso de falta de RAM desaparezca o se reduzca mucho.

---

## Si sigue "más del 100% de RAM"

Cuando el panel sigue mostrando uso por encima del 100%:

### A. Aumentar swap a 2 GB

En el servidor (por SSH):

```bash
sudo swapoff /swapfile
sudo rm /swapfile
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

(Si ya tenés `/swapfile` en `/etc/fstab`, no hace falta tocarlo. Si creaste uno nuevo de 2G, el fstab puede seguir apuntando al mismo path `/swapfile`; si lo borraste y recreaste, ya está activo con `swapon`.)

### B. Limitar Node a 256 MB y usar solo la app CRONEC

En el servidor:

```bash
pm2 stop app
pm2 delete cronec
cd ~/apps/cronec
pm2 start npm --name cronec -- run start:minimal
pm2 save
```

Así la app usa como máximo **256 MB** y, si había otro proceso "app" (por defecto del VPS), deja de consumir RAM.

### C. Ver qué está gastando

```bash
free -h
ps aux --sort=-%mem | head -10
```

Si después de esto el uso sigue por encima del 100%, la opción más estable es **subir la RAM del VPS** (cambiar de plan en Dattaweb/DonWeb).
