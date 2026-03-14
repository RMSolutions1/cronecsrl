/**
 * Lectura/escritura desde PostgreSQL (Neon) cuando DATABASE_URL o POSTGRES_URL está configurado.
 * Misma API que data-mysql; placeholders $1, $2...
 */
import { getPool, query } from "@/lib/db-pg"

type Row = Record<string, unknown>

// --- projects
export async function readProjects(): Promise<unknown[]> {
  const rows = await query<Row[]>("SELECT * FROM projects ORDER BY created_at DESC")
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    location: r.location ?? null,
    year: r.year ?? null,
    area: r.area != null ? Number(r.area) : null,
    budget: r.budget ?? null,
    duration: r.duration ?? null,
    client: r.client ?? null,
    image_url: r.image_url,
    status: r.status ?? "draft",
    featured: !!r.featured,
    created_at: r.created_at ? new Date(r.created_at as string).toISOString() : undefined,
    updated_at: r.updated_at ? new Date(r.updated_at as string).toISOString() : undefined,
    created_by: r.created_by ?? undefined,
  }))
}

export async function writeProjects(list: unknown[]): Promise<void> {
  const p = getPool()
  await p.query("DELETE FROM projects")
  for (const r of list as Record<string, unknown>[]) {
    await p.query(
      `INSERT INTO projects (id, title, description, category, location, year, area, budget, duration, client, image_url, status, featured, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [
        r.id, r.title, r.description, r.category, r.location ?? null, r.year ?? null, r.area ?? null,
        r.budget ?? null, r.duration ?? null, r.client ?? null, r.image_url, r.status ?? "draft",
        (r.featured as boolean) ? true : false, r.created_by ?? null,
        r.created_at ?? new Date().toISOString(), r.updated_at ?? new Date().toISOString(),
      ]
    )
  }
}

// --- services
export async function readServices(): Promise<unknown[]> {
  const rows = await query<Row[]>("SELECT * FROM services ORDER BY display_order ASC, order_index ASC")
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    description: r.description ?? null,
    short_description: r.short_description ?? null,
    icon: r.icon ?? null,
    image_url: r.image_url ?? null,
    features: r.features ?? null,
    benefits: r.benefits ?? null,
    display_order: r.display_order ?? 0,
    order_index: r.order_index ?? 0,
    status: r.status ?? "active",
    is_active: r.is_active !== false,
    updated_at: r.updated_at ? new Date(r.updated_at as string).toISOString() : undefined,
    created_by: r.created_by ?? undefined,
  }))
}

export async function writeServices(list: unknown[]): Promise<void> {
  const p = getPool()
  await p.query("DELETE FROM services")
  for (const r of list as Record<string, unknown>[]) {
    await p.query(
      `INSERT INTO services (id, title, slug, description, short_description, icon, image_url, features, benefits, display_order, order_index, status, is_active, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [
        r.id, r.title, r.slug, r.description ?? null, r.short_description ?? null, r.icon ?? "Building2", r.image_url ?? null,
        r.features != null ? JSON.stringify(r.features) : null, r.benefits != null ? JSON.stringify(r.benefits) : null,
        r.display_order ?? 0, r.order_index ?? 0, r.status ?? "active", (r.is_active as boolean) !== false,
        r.created_by ?? null, r.updated_at ?? new Date().toISOString(), r.updated_at ?? new Date().toISOString(),
      ]
    )
  }
}

// --- blog (blog_posts)
export async function readBlog(): Promise<unknown[]> {
  const rows = await query<Row[]>("SELECT * FROM blog_posts ORDER BY created_at DESC")
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt ?? null,
    content: r.content,
    image_url: r.image_url ?? null,
    category: r.category ?? "noticias",
    tags: r.tags ?? null,
    author_id: r.author_id ?? null,
    author_name: r.author_name ?? null,
    status: r.status ?? "draft",
    featured: !!r.featured,
    views: r.views ?? 0,
    published_at: r.published_at ? new Date(r.published_at as string).toISOString() : null,
    created_at: r.created_at ? new Date(r.created_at as string).toISOString() : undefined,
    updated_at: r.updated_at ? new Date(r.updated_at as string).toISOString() : undefined,
  }))
}

export async function writeBlog(list: unknown[]): Promise<void> {
  const p = getPool()
  await p.query("DELETE FROM blog_posts")
  for (const r of list as Record<string, unknown>[]) {
    await p.query(
      `INSERT INTO blog_posts (id, title, slug, excerpt, content, image_url, category, tags, author_id, author_name, status, featured, views, published_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [
        r.id, r.title, r.slug, r.excerpt ?? null, r.content, r.image_url ?? null, r.category ?? "noticias",
        r.tags != null ? JSON.stringify(r.tags) : null, r.author_id ?? null, r.author_name ?? null,
        r.status ?? "draft", (r.featured as boolean) ? true : false, Number(r.views ?? 0), r.published_at ?? null,
        r.created_at ?? new Date().toISOString(), r.updated_at ?? new Date().toISOString(),
      ]
    )
  }
}

// --- messages (contact_submissions)
export async function readMessages(): Promise<unknown[]> {
  const rows = await query<Row[]>("SELECT * FROM contact_submissions ORDER BY created_at DESC")
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone ?? null,
    company: r.company ?? null,
    service: r.service ?? null,
    message: r.message,
    is_read: !!r.is_read,
    created_at: r.created_at ? new Date(r.created_at as string).toISOString() : "",
  }))
}

export async function writeMessages(list: unknown[]): Promise<void> {
  const p = getPool()
  await p.query("DELETE FROM contact_submissions")
  for (const r of list as Record<string, unknown>[]) {
    await p.query(
      `INSERT INTO contact_submissions (id, name, email, phone, company, service, message, status, is_read, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'new', $8, $9, $10)`,
      [
        r.id, r.name, r.email, r.phone ?? null, r.company ?? null, r.service ?? null, r.message,
        (r.is_read as boolean) ? true : false, r.created_at ?? new Date().toISOString(), new Date().toISOString(),
      ]
    )
  }
}

// --- testimonials
export async function readTestimonials(): Promise<unknown[]> {
  const rows = await query<Row[]>("SELECT * FROM testimonials ORDER BY created_at DESC")
  return rows.map((r) => ({
    id: r.id,
    client_name: r.client_name,
    client_company: r.client_company ?? null,
    client_position: r.client_position ?? null,
    content: r.content,
    rating: r.rating ?? 5,
    avatar_url: r.avatar_url ?? null,
    status: r.status ?? "published",
    featured: !!r.featured,
    created_at: r.created_at ? new Date(r.created_at as string).toISOString() : undefined,
    updated_at: r.updated_at ? new Date(r.updated_at as string).toISOString() : undefined,
    created_by: r.created_by ?? undefined,
  }))
}

export async function writeTestimonials(list: unknown[]): Promise<void> {
  const p = getPool()
  await p.query("DELETE FROM testimonials")
  for (const r of list as Record<string, unknown>[]) {
    await p.query(
      `INSERT INTO testimonials (id, client_name, client_company, client_position, content, rating, avatar_url, status, featured, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        r.id, r.client_name, r.client_company ?? null, r.client_position ?? null, r.content, Number(r.rating ?? 5),
        r.avatar_url ?? null, r.status ?? "published", (r.featured as boolean) ? true : false, r.created_by ?? null,
        r.created_at ?? new Date().toISOString(), r.updated_at ?? new Date().toISOString(),
      ]
    )
  }
}

// --- settings (company_info)
const COMPANY_INFO_ID = "00000000-0000-0000-0000-000000000001"

export async function readSettings(): Promise<Record<string, unknown> | null> {
  const rows = await query<Row[]>("SELECT * FROM company_info WHERE id = $1 LIMIT 1", [COMPANY_INFO_ID])
  const r = rows[0]
  if (!r) return null
  const extra = (r.extra as Record<string, unknown>) ?? {}
  return {
    company_name: r.company_name ?? null,
    tagline: r.tagline ?? null,
    description: r.description ?? null,
    mission: r.mission ?? null,
    vision: r.vision ?? null,
    values: (r as Record<string, unknown>).values ?? [],
    address: r.address ?? null,
    phone: r.phone ?? null,
    email: r.email ?? null,
    whatsapp: r.whatsapp ?? null,
    facebook_url: r.facebook_url ?? null,
    instagram_url: r.instagram_url ?? null,
    linkedin_url: r.linkedin_url ?? null,
    twitter_url: r.twitter_url ?? null,
    youtube_url: r.youtube_url ?? null,
    founded_year: r.founded_year ?? null,
    cuit: r.cuit ?? null,
    logo_url: r.logo_url ?? null,
    ...extra,
  }
}

export async function writeSettings(data: Record<string, unknown>): Promise<void> {
  const known = [
    "company_name", "tagline", "description", "mission", "vision", "values",
    "address", "phone", "email", "whatsapp", "facebook_url", "instagram_url",
    "linkedin_url", "twitter_url", "youtube_url", "founded_year", "cuit", "logo_url",
  ]
  const extra: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(data)) {
    if (!known.includes(k)) extra[k] = v
  }
  const valuesJson = data.values != null ? JSON.stringify(data.values) : null
  const extraJson = Object.keys(extra).length ? JSON.stringify(extra) : null
  await query(
    `INSERT INTO company_info (id, company_name, tagline, description, mission, vision, "values", address, phone, email, whatsapp, facebook_url, instagram_url, linkedin_url, twitter_url, youtube_url, founded_year, cuit, logo_url, extra, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, CURRENT_TIMESTAMP)
     ON CONFLICT (id) DO UPDATE SET
       company_name = EXCLUDED.company_name, tagline = EXCLUDED.tagline, description = EXCLUDED.description,
       mission = EXCLUDED.mission, vision = EXCLUDED.vision, "values" = EXCLUDED."values",
       address = EXCLUDED.address, phone = EXCLUDED.phone, email = EXCLUDED.email, whatsapp = EXCLUDED.whatsapp,
       facebook_url = EXCLUDED.facebook_url, instagram_url = EXCLUDED.instagram_url, linkedin_url = EXCLUDED.linkedin_url,
       twitter_url = EXCLUDED.twitter_url, youtube_url = EXCLUDED.youtube_url, founded_year = EXCLUDED.founded_year,
       cuit = EXCLUDED.cuit, logo_url = EXCLUDED.logo_url, extra = EXCLUDED.extra, updated_at = CURRENT_TIMESTAMP`,
    [
      COMPANY_INFO_ID,
      data.company_name ?? null, data.tagline ?? null, data.description ?? null, data.mission ?? null, data.vision ?? null,
      valuesJson, data.address ?? null, data.phone ?? null, data.email ?? null, data.whatsapp ?? null,
      data.facebook_url ?? null, data.instagram_url ?? null, data.linkedin_url ?? null, data.twitter_url ?? null, data.youtube_url ?? null,
      data.founded_year ?? null, data.cuit ?? null, data.logo_url ?? null, extraJson,
    ]
  )
}

// --- hero_images
export async function readHeroImages(): Promise<unknown[]> {
  const rows = await query<Row[]>("SELECT * FROM hero_images ORDER BY page, order_index ASC")
  return rows.map((r) => ({
    id: r.id,
    page: r.page,
    image_url: r.image_url,
    alt_text: r.alt_text ?? null,
    order_index: r.order_index ?? 0,
  }))
}

export async function writeHeroImages(list: unknown[]): Promise<void> {
  const p = getPool()
  await p.query("DELETE FROM hero_images")
  for (const r of list as Record<string, unknown>[]) {
    await p.query(
      `INSERT INTO hero_images (id, page, image_url, alt_text, order_index, active)
       VALUES ($1, $2, $3, $4, $5, true)`,
      [r.id, r.page, r.image_url, r.alt_text ?? null, r.order_index ?? 0]
    )
  }
}

// --- certifications
export async function readCertifications(): Promise<unknown[]> {
  const rows = await query<Row[]>("SELECT * FROM certifications ORDER BY order_index ASC")
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    logo_url: r.logo_url ?? null,
    order_index: r.order_index ?? 0,
    updated_at: r.updated_at ? new Date(r.updated_at as string).toISOString() : undefined,
  }))
}

export async function writeCertifications(list: unknown[]): Promise<void> {
  const p = getPool()
  await p.query("DELETE FROM certifications")
  for (const r of list as Record<string, unknown>[]) {
    await p.query(
      `INSERT INTO certifications (id, name, logo_url, order_index, updated_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [r.id, r.name, r.logo_url ?? null, r.order_index ?? 0, r.updated_at ?? new Date().toISOString()]
    )
  }
}

// --- clients
export async function readClients(): Promise<unknown[]> {
  const rows = await query<Row[]>("SELECT * FROM clients ORDER BY order_index ASC")
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    logo_url: r.logo_url ?? null,
    order_index: r.order_index ?? 0,
    updated_at: r.updated_at ? new Date(r.updated_at as string).toISOString() : undefined,
  }))
}

export async function writeClients(list: unknown[]): Promise<void> {
  const p = getPool()
  await p.query("DELETE FROM clients")
  for (const r of list as Record<string, unknown>[]) {
    await p.query(
      `INSERT INTO clients (id, name, logo_url, order_index, updated_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [r.id, r.name, r.logo_url ?? null, r.order_index ?? 0, r.updated_at ?? new Date().toISOString()]
    )
  }
}

// --- admins (users)
export async function readAdmins(): Promise<unknown[]> {
  const rows = await query<Row[]>("SELECT id, email, full_name, role, password_hash FROM users ORDER BY email")
  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    full_name: r.full_name ?? null,
    role: r.role ?? "admin",
    password_hash: r.password_hash,
  }))
}

export async function writeAdmins(list: unknown[]): Promise<void> {
  const p = getPool()
  await p.query("DELETE FROM users")
  const now = new Date().toISOString()
  for (const r of list as Record<string, unknown>[]) {
    await p.query(
      `INSERT INTO users (id, email, password_hash, full_name, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        r.id,
        r.email,
        r.password_hash ?? "",
        r.full_name ?? null,
        r.role ?? "admin",
        now,
        now,
      ]
    )
  }
}

export async function markContactRead(id: string): Promise<void> {
  await query("UPDATE contact_submissions SET is_read = true WHERE id = $1", [id])
}

export async function deleteContactSubmission(id: string): Promise<void> {
  await query("DELETE FROM contact_submissions WHERE id = $1", [id])
}
