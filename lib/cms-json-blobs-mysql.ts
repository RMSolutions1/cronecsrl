import { query } from "@/lib/db-mysql"

export const CMS_JSON_BLOB_KEYS: Record<string, string> = {
  "calculadora.json": "cms_calculadora",
  "sections.json": "cms_sections",
  "nosotros.json": "cms_nosotros",
}

export async function readCmsJsonBlob(filename: string): Promise<unknown | null> {
  const key = CMS_JSON_BLOB_KEYS[filename]
  if (!key) return null
  try {
    const rows = await query<{ value: string | null }[]>(
      "SELECT value FROM site_config WHERE `key` = ? LIMIT 1",
      [key]
    )
    const raw = rows[0]?.value
    if (!raw) return null
    return JSON.parse(String(raw))
  } catch {
    return null
  }
}

export async function writeCmsJsonBlob(filename: string, data: unknown): Promise<void> {
  const key = CMS_JSON_BLOB_KEYS[filename]
  if (!key) throw new Error(`Blob CMS no configurado: ${filename}`)
  await query(
    `INSERT INTO site_config (\`key\`, value, updated_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)
     ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = CURRENT_TIMESTAMP`,
    [key, JSON.stringify(data)]
  )
}
