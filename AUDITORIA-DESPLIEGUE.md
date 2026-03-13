# Auditoría de despliegue – CRONEC SRL

**Fecha:** Verificación post-configuración (sin swap; servidor con 16 GB RAM).  
**Objetivo:** Confirmar que código, scripts y documentación están correctos y alineados para producción.

---

## 1. Resumen ejecutivo

| Área | Estado | Notas |
|------|--------|--------|
| Script de deploy | OK | SSH/SCP con argumentos separados; usa `pm2 start npm -- name cronec -- start` (sin límite de RAM). |
| Verificación servidor | OK | Script verifica carpeta, .next, Node, PM2 y puerto 3000. |
| Variables de entorno | OK | `.env.local.example` y docs indican `.env.production` en servidor. |
| Base de datos | OK | Schema y API contact alineados; seed-admin corregido para leer `.env.production` en servidor. |
| Formularios y cotizaciones | OK | Contacto y calculadora envían a `/api/contact` → `contact_submissions`; Admin → Mensajes. |
| Documentación | OK | DESPLIEGUE-SERVIDOR, DESPLIEGUE-100-PORCIENTO, SERVIDOR-POCA-RAM consistentes; swap opcional. |

**Corrección aplicada:** `scripts/mysql/seed-admin.js` ahora carga `.env.local`, `.env.production` o `.env` (en ese orden), para que `npm run db:seed-admin` funcione en el servidor con `.env.production` sin crear `.env.local`.

---

## 2. Deploy (`deploy-donweb.ps1`)

- Parámetros: `ServerIP`, `SshPort` (opcional).
- SSH: opciones como array (`-o StrictHostKeyChecking=accept-new`, `-p` si aplica). Correcto para Windows.
- SCP: `-P` puerto cuando `SshPort > 0`; argumentos separados. Correcto.
- Excluye: `node_modules`, `.next`, `.git`, `deploy-donweb.ps1`. Correcto.
- En el servidor: `mkdir -p ~/apps/cronec`, luego `npm install --legacy-peer-deps`, `npm run build`, `pm2 delete cronec`, `pm2 start npm --name cronec -- start`, `pm2 save`. Usa arranque normal (sin lowmem/minimal). Correcto para 16 GB RAM.

---

## 3. Verificación (`verificar-servidor.ps1`)

- Default: `vps-5753489-x.dattaweb.com`, puerto `5010`.
- SSH con argumentos separados y `ConnectTimeout=15`. Correcto.
- Comprueba: existencia de `~/apps/cronec`, carpeta `.next`, Node/npm, lista PM2, puerto 3000. Correcto.

---

## 4. Variables de entorno

- **Desarrollo:** `.env.local` (copiar desde `.env.local.example`).
- **Servidor:** `.env.production` en `~/apps/cronec` con `MYSQL_*` y `SESSION_SECRET`; no definir `NEXT_PUBLIC_FORMSPREE_ID` para que contacto y cotizaciones vayan a la BD.
- **Next.js:** En `next start` con `NODE_ENV=production` se cargan automáticamente las variables de `.env.production`.
- **lib/db.ts:** Usa `process.env.MYSQL_*` con valores por defecto razonables. Correcto.
- **lib/auth.ts:** Usa `SESSION_SECRET` con fallback solo para desarrollo; en producción debe estar definido. Documentado en guías.

---

## 5. Base de datos

- **Schema (`scripts/mysql/schema.sql`):** Tablas `users`, `projects`, `services`, `testimonials`, `company_info`, `contact_submissions`, `blog_posts`, `hero_images`, etc. Coinciden con el uso en la app.
- **API `/api/contact`:** Inserta en `contact_submissions` con campos `id, name, email, phone, company, service, message`. Validación de campos y email. Correcto.
- **Seed admin:** Tras la corrección, lee `.env.production` en el servidor; crea usuario con rol `admin`; por defecto `admin@cronecsrl.com` / `admin123`. Documentado cambiar contraseña.

---

## 6. Formularios y flujos

- **Contacto (`app/contacto/page.tsx`):** Si existe `NEXT_PUBLIC_FORMSPREE_ID` usa Formspree; si no, POST a `/api/contact`. En producción sin Formspree → BD → Admin → Mensajes. Correcto.
- **Calculadora (`app/calculadora/page.tsx`):** POST a `/api/contact` con `servicio: "Cotización - ..."` y mensaje con tipo, área, calidad, urgencia, estimación. Misma tabla y panel Admin → Mensajes. Correcto.

---

## 7. Documentación

- **DESPLIEGUE-SERVIDOR.md:** Host Dattaweb (puerto 5010), DonWeb, Nginx, SSL, requisitos OpenSSH en PC. Sin obligación de swap.
- **DESPLIEGUE-100-PORCIENTO.md:** Pasos para BD, `.env.production`, seed-admin, verificación de contacto/cotizaciones y dashboard. Checklist final.
- **SERVIDOR-POCA-RAM.md:** Indica que con 4 GB+ o 16 GB no hace falta swap ni start:lowmem; opciones lowmem/minimal y swap solo para planes con poca RAM.

---

## 8. Checklist rápido (sin swap)

Para que todo quede a la perfección en tu entorno (16 GB RAM, sin swap):

1. **Deploy desde PC:**  
   `.\deploy-donweb.ps1 -ServerIP "vps-5753489-x.dattaweb.com" -SshPort 5010`
2. **En el servidor:** Crear BD, ejecutar `scripts/mysql/schema.sql`, crear `~/apps/cronec/.env.production` con `MYSQL_*` y `SESSION_SECRET`.
3. **Crear admin en el servidor:**  
   `cd ~/apps/cronec && npm run db:seed-admin` (ahora lee `.env.production`).
4. **Reiniciar app:**  
   `pm2 restart cronec` (o el deploy ya lo deja con `pm2 start ... start`).
5. **Verificar:**  
   `.\verificar-servidor.ps1` y probar contacto, calculadora y Admin → Mensajes.

No es necesario configurar swap ni usar `start:lowmem`/`start:minimal` con 16 GB RAM.

---

**Conclusión:** El proyecto está listo para despliegue y operación al 100%. La única corrección aplicada en esta auditoría fue el soporte de `.env.production` en `scripts/mysql/seed-admin.js` para ejecutar el seed en el servidor sin crear `.env.local`.
