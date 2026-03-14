/**
 * Migra el contenido de data/*.json a Neon (Postgres).
 * Uso: node scripts/postgres/seed-from-json.js
 * Requiere DATABASE_URL o POSTGRES_URL en .env.local
 */
const path = require("path")
const fs = require("fs")
const { Pool } = require("pg")

const projectRoot = path.resolve(__dirname, "../..")
const dataDir = path.join(projectRoot, "data")
const envPath = path.join(projectRoot, ".env.local")

function loadEnv() {
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8")
    content.split("\n").forEach((line) => {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
      if (m) {
        let val = m[2].trim()
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
          val = val.slice(1, -1)
        process.env[m[1]] = val
      }
    })
  }
}

function readJson(name) {
  const file = path.join(dataDir, name)
  if (!fs.existsSync(file)) return []
  try {
    const raw = fs.readFileSync(file, "utf-8")
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : data && typeof data === "object" ? [data] : []
  } catch {
    return []
  }
}

function readJsonObject(name) {
  const file = path.join(dataDir, name)
  if (!fs.existsSync(file)) return null
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"))
  } catch {
    return null
  }
}

async function main() {
  loadEnv()
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!connectionString) {
    console.error("Falta DATABASE_URL o POSTGRES_URL en .env.local")
    process.exit(1)
  }

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=require") || connectionString.includes("verify-full") ? { rejectUnauthorized: true } : undefined,
  })

  const client = await pool.connect()
  const now = new Date().toISOString()

  try {
    console.log("=== Migración data/*.json → Neon ===\n")

    // 1. Projects
    const projects = readJson("projects.json")
    await client.query("DELETE FROM projects")
    for (const r of projects) {
      await client.query(
        `INSERT INTO projects (id, title, description, category, location, year, area, budget, duration, client, image_url, status, featured, created_by, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          r.id, r.title, r.description || "", r.category || "general", r.location ?? null, r.year ?? null, r.area ?? null,
          r.budget ?? null, r.duration ?? null, r.client ?? null, r.image_url || "/placeholder.jpg", r.status ?? "draft",
          !!r.featured, r.created_by ?? null, r.created_at ?? now, r.updated_at ?? now,
        ]
      )
    }
    console.log("projects:", projects.length)

    // 2. Services
    const services = readJson("services.json")
    await client.query("DELETE FROM services")
    for (const r of services) {
      await client.query(
        `INSERT INTO services (id, title, slug, description, short_description, icon, image_url, features, benefits, display_order, order_index, status, is_active, created_by, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          r.id, r.title, r.slug || r.title?.toLowerCase().replace(/\s+/g, "-") || "svc", r.description ?? "", r.short_description ?? null,
          r.icon ?? "Building2", r.image_url ?? null, r.features != null ? JSON.stringify(r.features) : null, r.benefits != null ? JSON.stringify(r.benefits) : null,
          r.display_order ?? 0, r.order_index ?? 0, r.status ?? "active", r.is_active !== false, r.created_by ?? null,
          r.updated_at ?? now, r.updated_at ?? now,
        ]
      )
    }
    console.log("services:", services.length)

    // 3. Blog
    const blog = readJson("blog.json")
    await client.query("DELETE FROM blog_posts")
    for (const r of blog) {
      await client.query(
        `INSERT INTO blog_posts (id, title, slug, excerpt, content, image_url, category, tags, author_id, author_name, status, featured, views, published_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          r.id, r.title, r.slug || r.id, r.excerpt ?? null, r.content || "", r.image_url ?? null, r.category ?? "noticias",
          r.tags != null ? JSON.stringify(r.tags) : null, r.author_id ?? null, r.author_name ?? null,
          r.status ?? "draft", !!r.featured, Number(r.views ?? 0), r.published_at ?? null,
          r.created_at ?? now, r.updated_at ?? now,
        ]
      )
    }
    console.log("blog_posts:", blog.length)

    // 4. Testimonials
    const testimonials = readJson("testimonials.json")
    await client.query("DELETE FROM testimonials")
    for (const r of testimonials) {
      await client.query(
        `INSERT INTO testimonials (id, client_name, client_company, client_position, content, rating, avatar_url, status, featured, created_by, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          r.id, r.client_name || r.author || "Cliente", r.client_company ?? null, r.client_position ?? null, r.content || "",
          Number(r.rating ?? 5), r.avatar_url ?? null, r.status ?? "published", !!r.featured, r.created_by ?? null,
          r.created_at ?? now, r.updated_at ?? now,
        ]
      )
    }
    console.log("testimonials:", testimonials.length)

    // 5. Hero images
    const heroImages = readJson("hero-images.json")
    await client.query("DELETE FROM hero_images")
    for (const r of heroImages) {
      await client.query(
        `INSERT INTO hero_images (id, page, image_url, alt_text, order_index, active) VALUES ($1, $2, $3, $4, $5, true)`,
        [r.id, r.page, r.image_url || "", r.alt_text ?? null, r.order_index ?? 0]
      )
    }
    console.log("hero_images:", heroImages.length)

    // 6. Certifications
    const certifications = readJson("certifications.json")
    await client.query("DELETE FROM certifications")
    for (const r of certifications) {
      await client.query(
        `INSERT INTO certifications (id, name, logo_url, order_index, updated_at) VALUES ($1, $2, $3, $4, $5)`,
        [r.id, r.name, r.logo_url ?? null, r.order_index ?? 0, r.updated_at ?? now]
      )
    }
    console.log("certifications:", certifications.length)

    // 7. Clients
    const clients = readJson("clients.json")
    await client.query("DELETE FROM clients")
    for (const r of clients) {
      await client.query(
        `INSERT INTO clients (id, name, logo_url, order_index, updated_at) VALUES ($1, $2, $3, $4, $5)`,
        [r.id, r.name, r.logo_url ?? null, r.order_index ?? 0, r.updated_at ?? now]
      )
    }
    console.log("clients:", clients.length)

    // 8. Settings (company_info) - actualiza con settings.json (heroSlides y otros van en extra)
    const settings = readJsonObject("settings.json")
    if (settings && typeof settings === "object" && Object.keys(settings).length > 0) {
      const known = ["company_name", "tagline", "description", "mission", "vision", "values", "address", "phone", "email", "whatsapp", "facebook_url", "instagram_url", "linkedin_url", "twitter_url", "youtube_url", "founded_year", "cuit", "logo_url"]
      const extra = {}
      for (const [k, v] of Object.entries(settings)) {
        if (!known.includes(k)) extra[k] = v
      }
      const valuesJson = settings.values != null ? JSON.stringify(settings.values) : null
      const extraJson = Object.keys(extra).length > 0 ? JSON.stringify(extra) : null
      await client.query(
        `INSERT INTO company_info (id, company_name, tagline, description, mission, vision, "values", address, phone, email, whatsapp, facebook_url, instagram_url, linkedin_url, twitter_url, youtube_url, founded_year, cuit, logo_url, extra, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, CURRENT_TIMESTAMP)
         ON CONFLICT (id) DO UPDATE SET
           company_name = COALESCE(EXCLUDED.company_name, company_info.company_name),
           tagline = COALESCE(EXCLUDED.tagline, company_info.tagline),
           description = COALESCE(EXCLUDED.description, company_info.description),
           mission = COALESCE(EXCLUDED.mission, company_info.mission),
           vision = COALESCE(EXCLUDED.vision, company_info.vision),
           "values" = COALESCE(EXCLUDED."values", company_info."values"),
           address = COALESCE(EXCLUDED.address, company_info.address),
           phone = COALESCE(EXCLUDED.phone, company_info.phone),
           email = COALESCE(EXCLUDED.email, company_info.email),
           whatsapp = COALESCE(EXCLUDED.whatsapp, company_info.whatsapp),
           facebook_url = COALESCE(EXCLUDED.facebook_url, company_info.facebook_url),
           instagram_url = COALESCE(EXCLUDED.instagram_url, company_info.instagram_url),
           linkedin_url = COALESCE(EXCLUDED.linkedin_url, company_info.linkedin_url),
           twitter_url = COALESCE(EXCLUDED.twitter_url, company_info.twitter_url),
           youtube_url = COALESCE(EXCLUDED.youtube_url, company_info.youtube_url),
           founded_year = COALESCE(EXCLUDED.founded_year, company_info.founded_year),
           cuit = COALESCE(EXCLUDED.cuit, company_info.cuit),
           logo_url = COALESCE(EXCLUDED.logo_url, company_info.logo_url),
           extra = COALESCE(EXCLUDED.extra::jsonb, company_info.extra),
           updated_at = CURRENT_TIMESTAMP`,
        [
          "00000000-0000-0000-0000-000000000001",
          settings.company_name ?? null, settings.tagline ?? null, settings.description ?? null, settings.mission ?? null, settings.vision ?? null,
          valuesJson, settings.address ?? null, settings.phone ?? null, settings.email ?? null, settings.whatsapp ?? null,
          settings.facebook_url ?? null, settings.instagram_url ?? null, settings.linkedin_url ?? null, settings.twitter_url ?? null, settings.youtube_url ?? null,
          settings.founded_year ?? null, settings.cuit ?? null, settings.logo_url ?? null, extraJson,
        ]
      )
      console.log("company_info: actualizado desde settings.json")
    }

    console.log("\n=== Migración terminada ===")
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
