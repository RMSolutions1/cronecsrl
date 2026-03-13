"use server"

import { readData, writeData, generateId } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"

type HeroImage = { id: string; page: string; image_url: string; alt_text?: string | null; order_index: number }

export async function getHeroImages(page: string) {
  try {
    const list = await readData<HeroImage[]>("hero-images.json")
    return (list || []).filter((h) => h.page === page).sort((a, b) => a.order_index - b.order_index)
  } catch {
    return []
  }
}

export async function getHeroImagesAdmin(page: string) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) return []
  const list = await readData<HeroImage[]>("hero-images.json")
  return (list || []).filter((h) => h.page === page).sort((a, b) => a.order_index - b.order_index)
}

export async function addHeroImage(data: { page: string; image_url: string; alt_text?: string; order_index?: number }) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("No autorizado")
  const list = await readData<HeroImage[]>("hero-images.json")
  list.push({
    id: generateId(),
    page: data.page,
    image_url: data.image_url,
    alt_text: data.alt_text ?? null,
    order_index: data.order_index ?? 0,
  })
  await writeData("hero-images.json", list)
  return list[list.length - 1].id
}

export async function deleteHeroImage(id: string) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("No autorizado")
  const list = await readData<HeroImage[]>("hero-images.json")
  await writeData("hero-images.json", list.filter((h) => h.id !== id))
}
