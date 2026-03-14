/**
 * Capa de datos: Postgres (Neon) si DATABASE_URL/POSTGRES_URL; si no MySQL si MYSQL_*; si no archivos JSON en data/.
 */
import { readFile, writeFile, mkdir } from "fs/promises"
import path from "path"
import { isPostgresConfigured } from "@/lib/db-pg"
import { isMySQLConfigured } from "@/lib/db"
import * as pgData from "@/lib/data-pg"
import * as mysqlData from "@/lib/data-mysql"

const DATA_DIR = path.join(process.cwd(), "data")

const DB_FILES = new Set([
  "projects.json",
  "services.json",
  "blog.json",
  "messages.json",
  "testimonials.json",
  "settings.json",
  "hero-images.json",
  "certifications.json",
  "clients.json",
  "admins.json",
])

function usePostgres(): boolean {
  return isPostgresConfigured()
}
function useMySQL(): boolean {
  return !usePostgres() && isMySQLConfigured()
}

export function getDataPath(filename: string): string {
  return path.join(DATA_DIR, filename)
}

async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true })
  } catch {
    // ya existe
  }
}

async function readFromFile<T>(filename: string): Promise<T> {
  await ensureDataDir()
  const filePath = getDataPath(filename)
  try {
    const raw = await readFile(filePath, "utf-8")
    return JSON.parse(raw) as T
  } catch {
    return [] as T
  }
}

async function writeToFile(filename: string, data: unknown): Promise<void> {
  await ensureDataDir()
  const filePath = getDataPath(filename)
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}

/** Archivos que son listas; si la BD devuelve array vacío, hacemos fallback a JSON */
const LIST_FILES = new Set(["projects.json", "services.json", "blog.json", "messages.json", "testimonials.json", "hero-images.json", "certifications.json", "clients.json"])

async function readFromDb<T>(filename: string): Promise<T | null> {
  const db = usePostgres() ? pgData : mysqlData
  try {
    if (filename === "projects.json") {
      const data = await db.readProjects()
      return (Array.isArray(data) ? data : []) as T
    }
    if (filename === "services.json") {
      const data = await db.readServices()
      return (Array.isArray(data) ? data : []) as T
    }
    if (filename === "blog.json") {
      const data = await db.readBlog()
      return (Array.isArray(data) ? data : []) as T
    }
    if (filename === "messages.json") {
      const data = await db.readMessages()
      return (Array.isArray(data) ? data : []) as T
    }
    if (filename === "testimonials.json") {
      const data = await db.readTestimonials()
      return (Array.isArray(data) ? data : []) as T
    }
    if (filename === "settings.json") {
      const data = await db.readSettings()
      return (data && typeof data === "object" ? data : {}) as T
    }
    if (filename === "hero-images.json") {
      const data = await db.readHeroImages()
      return (Array.isArray(data) ? data : []) as T
    }
    if (filename === "certifications.json") {
      const data = await db.readCertifications()
      return (Array.isArray(data) ? data : []) as T
    }
    if (filename === "clients.json") {
      const data = await db.readClients()
      return (Array.isArray(data) ? data : []) as T
    }
    if (filename === "admins.json") {
      const data = await db.readAdmins()
      return (Array.isArray(data) ? data : []) as T
    }
  } catch {
    // BD falló (ej. tabla no existe): fallback a JSON
  }
  return null
}

export async function readData<T>(filename: string): Promise<T> {
  if ((usePostgres() || useMySQL()) && DB_FILES.has(filename)) {
    const fromDb = await readFromDb<T>(filename)
    if (fromDb !== null) return fromDb
    if (LIST_FILES.has(filename) || filename === "settings.json" || filename === "admins.json") {
      return readFromFile<T>(filename)
    }
  }
  return readFromFile<T>(filename)
}

export async function writeData(filename: string, data: unknown): Promise<void> {
  if (usePostgres() && DB_FILES.has(filename)) {
    try {
      if (filename === "projects.json") { await pgData.writeProjects(data as unknown[]); return }
      if (filename === "services.json") { await pgData.writeServices(data as unknown[]); return }
      if (filename === "blog.json") { await pgData.writeBlog(data as unknown[]); return }
      if (filename === "messages.json") { await pgData.writeMessages(data as unknown[]); return }
      if (filename === "testimonials.json") { await pgData.writeTestimonials(data as unknown[]); return }
      if (filename === "settings.json") { await pgData.writeSettings(data as Record<string, unknown>); return }
      if (filename === "hero-images.json") { await pgData.writeHeroImages(data as unknown[]); return }
      if (filename === "certifications.json") { await pgData.writeCertifications(data as unknown[]); return }
      if (filename === "clients.json") { await pgData.writeClients(data as unknown[]); return }
      return
    } catch (e) {
      throw e
    }
  }
  if (useMySQL() && DB_FILES.has(filename)) {
    try {
      if (filename === "projects.json") { await mysqlData.writeProjects(data as unknown[]); return }
      if (filename === "services.json") { await mysqlData.writeServices(data as unknown[]); return }
      if (filename === "blog.json") { await mysqlData.writeBlog(data as unknown[]); return }
      if (filename === "messages.json") { await mysqlData.writeMessages(data as unknown[]); return }
      if (filename === "testimonials.json") { await mysqlData.writeTestimonials(data as unknown[]); return }
      if (filename === "settings.json") { await mysqlData.writeSettings(data as Record<string, unknown>); return }
      if (filename === "hero-images.json") { await mysqlData.writeHeroImages(data as unknown[]); return }
      if (filename === "certifications.json") { await mysqlData.writeCertifications(data as unknown[]); return }
      if (filename === "clients.json") { await mysqlData.writeClients(data as unknown[]); return }
      return
    } catch (e) {
      throw e
    }
  }
  await writeToFile(filename, data)
}

export function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
