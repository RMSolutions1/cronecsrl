/**
 * Pruebas del dashboard y sitio como CRONEC.
 * Verifica rutas, APIs y que los datos se lean correctamente.
 * Uso: node scripts/test-dashboard-e2e.js
 * Requiere: servidor corriendo (npm run dev) o solo pruebas de datos (BASE_URL vacío).
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000"
const RUN_HTTP = !!process.env.BASE_URL || process.argv.includes("--http")

async function fetchOk(url, options = {}) {
  const res = await fetch(url, { ...options, redirect: "manual" })
  return { ok: res.ok, status: res.status, url }
}

async function main() {
  const results = { passed: 0, failed: 0, skipped: 0 }
  const log = (name, ok, detail = "") => {
    if (ok) results.passed++
    else results.failed++
    if (results.skipped) return
    console.log(ok ? "[OK]" : "[FAIL]", name, detail || "")
  }

  console.log("\n=== Pruebas CRONEC (dashboard, rutas, APIs) ===\n")

  // 1) Pruebas de datos (sin servidor): leer settings y sections
  try {
    const path = await import("path")
    const fs = await import("fs")
    const projectRoot = path.resolve(process.cwd())
    const envPath = path.join(projectRoot, ".env.local")
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8")
      content.split("\n").forEach((line) => {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
        if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "")
      })
    }
    const dataPath = path.join(projectRoot, "data")
    const settingsPath = path.join(dataPath, "settings.json")
    const sectionsPath = path.join(dataPath, "sections.json")
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"))
      log("Lectura data/settings.json", !!settings && (settings.company_name || settings.heroSlides))
    } else {
      log("Lectura data/settings.json", false, "(archivo no existe o usa solo BD)")
    }
    if (fs.existsSync(sectionsPath)) {
      const sections = JSON.parse(fs.readFileSync(sectionsPath, "utf-8"))
      log("Lectura data/sections.json", !!sections && (sections.whyCronec || sections.process))
    } else {
      log("Lectura data/sections.json", false, "(archivo no existe)")
    }
  } catch (e) {
    log("Pruebas de datos", false, e.message)
  }

  // 2) Pruebas HTTP si BASE_URL está definido o --http
  if (RUN_HTTP) {
    console.log("\n--- Rutas públicas ---")
    const publicRoutes = [
      "/",
      "/servicios",
      "/proyectos",
      "/nosotros",
      "/blog",
      "/contacto",
      "/calculadora",
      "/brochure",
      "/politica-calidad",
      "/politica-privacidad",
      "/terminos-condiciones",
    ]
    for (const route of publicRoutes) {
      try {
        const { ok, status } = await fetchOk(`${BASE_URL}${route}`)
        log(`GET ${route}`, ok || status === 307 || status === 308, `(${status})`)
      } catch (e) {
        log(`GET ${route}`, false, e.message)
      }
    }

    console.log("\n--- Admin (sin sesión → login) ---")
    try {
      const r = await fetch(`${BASE_URL}/admin`, { redirect: "manual" })
      const toLogin = r.status === 307 || r.status === 302
      const location = r.headers.get("location") || ""
      log("GET /admin redirige a login", toLogin && (location.includes("login") || r.status === 307), `(${r.status})`)
    } catch (e) {
      log("GET /admin", false, e.message)
    }
    try {
      const { ok, status } = await fetchOk(`${BASE_URL}/admin/login`)
      log("GET /admin/login", ok, `(${status})`)
    } catch (e) {
      log("GET /admin/login", false, e.message)
    }

    console.log("\n--- APIs ---")
    try {
      const r = await fetch(`${BASE_URL}/api/db-verify`)
      const ok = r.ok || r.status === 401
      log("GET /api/db-verify", ok, `(${r.status})`)
    } catch (e) {
      log("GET /api/db-verify", false, e.message)
    }
    try {
      const r = await fetch(`${BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: "Prueba E2E",
          email: "test@test.com",
          telefono: "3810000000",
          servicio: "Consulta",
          mensaje: "Mensaje de prueba automática",
        }),
      })
      const data = await r.json().catch(() => ({}))
      const ok = r.ok && data.success === true
      const rateLimited = r.status === 429
      log("POST /api/contact", ok || rateLimited, `(${r.status}${rateLimited ? " rate limit" : ""})`)
    } catch (e) {
      log("POST /api/contact", false, e.message)
    }
    try {
      const r = await fetch(`${BASE_URL}/api/upload`, { method: "POST" })
      log("POST /api/upload sin auth → 401", r.status === 401, `(${r.status})`)
    } catch (e) {
      log("POST /api/upload", false, e.message)
    }

    // Cambio de prueba en tiempo real: si usamos JSON, escribimos un texto y comprobamos en /
    const path = await import("path")
    const fs = await import("fs")
    const projectRoot = path.resolve(process.cwd())
    const settingsPath = path.join(projectRoot, "data", "settings.json")
    if (fs.existsSync(settingsPath)) {
      try {
        const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"))
        const backup = JSON.stringify(settings)
        const testValue = "CTA_TEST_CRONEC_" + Date.now()
        settings.site_cta_ver_proyectos = testValue
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), "utf-8")
        await new Promise((r) => setTimeout(r, 500))
        const homeRes = await fetch(BASE_URL + "/")
        const html = await homeRes.text()
        const found = html.includes(testValue)
        fs.writeFileSync(settingsPath, backup, "utf-8")
        log("Cambio en settings reflejado en / (tiempo real)", found, found ? "" : "texto no encontrado en HTML")
      } catch (e) {
        log("Prueba cambio en tiempo real", false, e.message)
      }
    }
  } else {
    console.log("\n(Omitiendo pruebas HTTP. Para probar rutas/APIs ejecute con BASE_URL=http://localhost:3000 node scripts/test-dashboard-e2e.js)")
    console.log("O inicie el servidor con 'npm run dev' y en otra terminal: set BASE_URL=http://localhost:3000 && node scripts/test-dashboard-e2e.js")
  }

  console.log("\n--- Resumen ---")
  console.log("Pasaron:", results.passed)
  console.log("Fallaron:", results.failed)
  process.exit(results.failed > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
