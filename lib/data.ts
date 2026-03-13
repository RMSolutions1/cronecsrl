/**
 * Capa de datos: usa MySQL si MYSQL_* está configurado, si no archivos JSON en data/.
 */
import { readFile, writeFile, mkdir } from "fs/promises"
import path from "path"
import { isMySQLConfigured } from "@/lib/db"
import * as mysqlData from "@/lib/data-mysql"

const DATA_DIR = path.join(process.cwd(), "data")

const MYSQL_FILES = new Set([
  "projects.json",
  "services.json",
  "blog.json",
  "messages.json",
  "testimonials.json",
  "settings.json",
  "hero-images.json",
  "admins.json",
])

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

export async function readData<T>(filename: string): Promise<T> {
  if (isMySQLConfigured() && MYSQL_FILES.has(filename)) {
    try {
      if (filename === "projects.json") return (await mysqlData.readProjects()) as T
      if (filename === "services.json") return (await mysqlData.readServices()) as T
      if (filename === "blog.json") return (await mysqlData.readBlog()) as T
      if (filename === "messages.json") return (await mysqlData.readMessages()) as T
      if (filename === "testimonials.json") return (await mysqlData.readTestimonials()) as T
      if (filename === "settings.json") return ((await mysqlData.readSettings()) ?? {}) as T
      if (filename === "hero-images.json") return (await mysqlData.readHeroImages()) as T
      if (filename === "admins.json") return (await mysqlData.readAdmins()) as T
    } catch {
      return [] as T
    }
  }
  return readFromFile<T>(filename)
}

export async function writeData(filename: string, data: unknown): Promise<void> {
  if (isMySQLConfigured() && MYSQL_FILES.has(filename)) {
    try {
      if (filename === "projects.json") { await mysqlData.writeProjects(data as unknown[]); return }
      if (filename === "services.json") { await mysqlData.writeServices(data as unknown[]); return }
      if (filename === "blog.json") { await mysqlData.writeBlog(data as unknown[]); return }
      if (filename === "messages.json") { await mysqlData.writeMessages(data as unknown[]); return }
      if (filename === "testimonials.json") { await mysqlData.writeTestimonials(data as unknown[]); return }
      if (filename === "settings.json") { await mysqlData.writeSettings(data as Record<string, unknown>); return }
      if (filename === "hero-images.json") { await mysqlData.writeHeroImages(data as unknown[]); return }
      // admins.json: los usuarios se gestionan con seed-admin y login; no escribimos desde writeData
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
