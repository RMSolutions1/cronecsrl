"use server"

import { readData, writeData, generateId } from "@/lib/data"
import { requireAdmin } from "@/lib/admin-auth"
import { assertDbWritable } from "@/lib/admin-persist"
import { revalidateHeroPage, revalidatePublicContent } from "@/lib/revalidate-public"

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
  const user = await requireAdmin().catch(() => null)
  if (!user) return []
  const list = await readData<HeroImage[]>("hero-images.json")
  return (list || []).filter((h) => h.page === page).sort((a, b) => a.order_index - b.order_index)
}

export async function addHeroImage(data: { page: string; image_url: string; alt_text?: string; order_index?: number }) {
  await requireAdmin()
  assertDbWritable()
  const list = await readData<HeroImage[]>("hero-images.json")
  list.push({
    id: generateId(),
    page: data.page,
    image_url: data.image_url,
    alt_text: data.alt_text ?? null,
    order_index: data.order_index ?? 0,
  })
  await writeData("hero-images.json", list)
  revalidateHeroPage(data.page)
  return list[list.length - 1].id
}

export async function updateHeroImage(id: string, data: { image_url?: string; alt_text?: string }) {
  await requireAdmin()
  assertDbWritable()
  const list = await readData<HeroImage[]>("hero-images.json")
  const idx = list.findIndex((h) => h.id === id)
  if (idx < 0) throw new Error("Imagen no encontrada")
  if (data.image_url !== undefined) list[idx].image_url = data.image_url
  if (data.alt_text !== undefined) list[idx].alt_text = data.alt_text
  await writeData("hero-images.json", list)
  revalidateHeroPage(list[idx].page)
}

export async function deleteHeroImage(id: string) {
  await requireAdmin()
  assertDbWritable()
  const list = await readData<HeroImage[]>("hero-images.json")
  const target = list.find((h) => h.id === id)
  await writeData("hero-images.json", list.filter((h) => h.id !== id))
  if (target?.page) revalidateHeroPage(target.page)
  else revalidatePublicContent(["/"])
}
