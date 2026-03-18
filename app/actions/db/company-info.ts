"use server"

import { readData, writeData } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"

type Settings = Record<string, unknown>

export async function getCompanyInfo() {
  try {
    const data = await readData<Settings>("settings.json")
    if (data && typeof data === "object" && !Array.isArray(data)) return data as Record<string, unknown>
    return null
  } catch {
    return null
  }
}

export async function saveCompanyInfo(data: Record<string, unknown>) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("No autorizado")
  const current = (await readData<Settings>("settings.json")) || {}
  if (typeof current !== "object" || Array.isArray(current)) {
    await writeData("settings.json", { ...data })
    return
  }
  const values = data.values != null ? (Array.isArray(data.values) ? data.values : []) : (current.values as unknown[])
  const heroSlides = data.heroSlides != null && Array.isArray(data.heroSlides) ? data.heroSlides : (current.heroSlides as unknown[] | undefined)
  await writeData("settings.json", {
    ...current,
    ...data,
    values,
    ...(heroSlides && { heroSlides }),
  })
}
