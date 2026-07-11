import type { HeroImagePublic } from "@/lib/data-read"

export type HeroSlide = { src: string; alt: string }

/** Usa imágenes del admin (BD) o fallback estático si no hay ninguna. */
export function resolveHeroSlides(
  fromDb: HeroImagePublic[],
  fallbacks: HeroSlide[]
): HeroSlide[] {
  if (fromDb.length > 0) {
    return fromDb.map((h) => ({
      src: h.image_url,
      alt: h.alt_text?.trim() || "CRONEC SRL",
    }))
  }
  return fallbacks
}
