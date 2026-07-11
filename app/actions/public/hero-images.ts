"use server"

import { getHeroImagesPublic } from "@/lib/data-read"
import { resolveHeroSlides, type HeroSlide } from "@/lib/hero-images"

/** Hero slides para páginas client (contacto, etc.). */
export async function fetchHeroSlidesForPage(page: string, fallbacks: HeroSlide[]): Promise<HeroSlide[]> {
  try {
    const heroes = await getHeroImagesPublic(page)
    return resolveHeroSlides(heroes, fallbacks)
  } catch {
    return fallbacks
  }
}
