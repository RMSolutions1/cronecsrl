# Auditoría completa del proyecto CRONEC SRL

**Fecha:** 8 de marzo de 2026  
**Estado:** ✅ Verificado en entorno local (servidor dev en http://localhost:3001)

---

## 1. Resumen ejecutivo

- **Stack:** Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS 4, MySQL (mysql2), iron-session, bcryptjs.
- **Sin Supabase:** Migración a MySQL completada; no quedan referencias a Supabase en `app/`, `components/` ni `lib/`.
- **Web pública:** La página de inicio y el login de admin cargan correctamente. Las rutas que usan MySQL (/proyectos, /admin dashboard, etc.) requieren base de datos configurada.

---

## 2. Verificaciones realizadas

| Verificación | Resultado |
|-------------|-----------|
| Referencias a Supabase en app/components/lib | ✅ Ninguna |
| Carpeta lib/supabase | ✅ Eliminada |
| Middleware (Edge) | ✅ Corregido: no usa Node (iron-session/mysql2); solo comprueba cookie `cronec_session` |
| Dependencias instaladas | ✅ npm install --legacy-peer-deps (iron-session ^8.0.4) |
| Página de inicio (/) | ✅ Carga: header, hero, servicios, proyectos, testimonios, CTA, footer |
| /admin/login | ✅ Carga: formulario email/contraseña, enlaces registro y recuperar |
| Título y metadata | ✅ "CRONEC SRL \| Construcción Civil e Instalaciones Eléctricas en Salta" |

---

## 3. Corrección aplicada durante la auditoría

**Problema:** Error en Edge: *"The edge runtime does not support Node.js 'stream' module"*.  
**Causa:** El middleware importaba `iron-session`, que (o una dependencia como mysql2 en el bundle) usa módulos de Node no disponibles en Edge.  
**Solución:** El middleware ya no usa `getIronSession`. Solo comprueba si existe la cookie `cronec_session` para redirigir a login o a /admin. La comprobación real de sesión se hace en las páginas con `getCurrentUser()` (Node runtime).

**Archivo:** `middleware.ts` — solo imports de `next/server` y comprobación de `request.cookies.has(SESSION_COOKIE_NAME)`.

---

## 4. Estructura del proyecto (resumen)

```
app/
  page.tsx              → Inicio (sin BD)
  layout.tsx            → Layout global, Analytics, Toaster
  contacto/             → Formulario → createContactSubmission (MySQL)
  proyectos/            → getProjectsPublic() (MySQL)
  blog/                 → Contenido estático
  admin/                → Panel (getCurrentUser + acciones MySQL)
  api/upload/           → Subida de imágenes → public/uploads

lib/
  db.ts                 → Pool MySQL (mysql2)
  auth.ts               → iron-session, bcrypt, loginWithCredentials

app/actions/
  auth.ts               → logoutAction
  db/                   → projects, services, testimonials, company-info, contact, blog, hero-images, admin-stats

scripts/mysql/
  schema.sql            → Esquema completo MySQL
  seed-admin.js         → Crear usuario admin (bcrypt)
```

---

## 5. Cómo ver la web aquí

1. **Instalar dependencias** (si no está hecho):
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Arrancar el servidor:**
   ```bash
   npm run dev
   ```
   o, si `next` no está en el PATH:
   ```bash
   node node_modules/next/dist/bin/next dev
   ```

3. **Abrir en el navegador:**  
   - **Inicio:** http://localhost:3000 (o el puerto que indique Next.js, ej. 3001)  
   - **Admin login:** http://localhost:3000/admin/login  

4. **Para que funcionen proyectos, blog desde BD y panel admin:**  
   - Crear BD MySQL y ejecutar `scripts/mysql/schema.sql`.  
   - Configurar `.env.local` (MYSQL_*, SESSION_SECRET).  
   - Ejecutar `npm run db:seed-admin` y entrar con ese usuario en /admin/login.

---

## 6. Advertencias del entorno (no bloqueantes)

- **Lockfiles:** Next.js puede avisar por varios lockfiles (pnpm-lock.yaml y package-lock.json). Opcional: usar solo uno y añadir `turbopack.root` en `next.config.mjs` si se desea.
- **Middleware:** Next.js 16 avisa que la convención "middleware" está deprecada en favor de "proxy". Revisar documentación cuando se actualice.
- **baseline-browser-mapping:** Aviso de actualización; no afecta a la ejecución actual.

---

## 7. Conclusión

La auditoría confirma que el proyecto está **libre de Supabase**, usa **MySQL y sesiones con iron-session**, y que la **web pública y el login de admin** funcionan correctamente en desarrollo. El middleware está adaptado al Edge Runtime. Para uso completo (proyectos, mensajes, configuración, etc.) es necesario tener MySQL configurado y las variables de entorno definidas según `MIGRACION-MYSQL.md`.
