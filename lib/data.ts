/**
 * Capa de datos basada en archivos JSON (sin base de datos).
 * Todo el contenido se administra desde el dashboard y se persiste en data/*.json
 */
import { readFile, writeFile, mkdir } from "fs/promises"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

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

export async function readData<T>(filename: string): Promise<T> {
  await ensureDataDir()
  const filePath = getDataPath(filename)
  try {
    const raw = await readFile(filePath, "utf-8")
    return JSON.parse(raw) as T
  } catch {
    return [] as T
  }
}

export async function writeData(filename: string, data: unknown): Promise<void> {
  await ensureDataDir()
  const filePath = getDataPath(filename)
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}

export function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
