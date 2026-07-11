"use server"

import { readData, writeData } from "@/lib/data"
import { requireAdmin } from "@/lib/admin-auth"
import { assertDbWritable } from "@/lib/admin-persist"
import { revalidatePublicContent, REVALIDATE } from "@/lib/revalidate-public"

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
  await requireAdmin()
  assertDbWritable()
  const current = (await readData<Settings>("settings.json")) || {}
  if (typeof current !== "object" || Array.isArray(current)) {
    await writeData("settings.json", { ...data })
  } else {
    const values = data.values != null ? (Array.isArray(data.values) ? data.values : []) : (current.values as unknown[])
    const heroSlides = data.heroSlides != null && Array.isArray(data.heroSlides) ? data.heroSlides : (current.heroSlides as unknown[] | undefined)
    await writeData("settings.json", {
      ...current,
      ...data,
      values,
      ...(heroSlides && { heroSlides }),
    })
  }
  revalidatePublicContent([...REVALIDATE.settings])
}
