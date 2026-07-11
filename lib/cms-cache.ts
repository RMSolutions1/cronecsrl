import { PUBLIC_PAGE_REVALIDATE } from "@/lib/cache-config"

/** Tags de caché para datos CMS públicos (unstable_cache + revalidateTag). */
export const CMS_CACHE_TAGS = {
  settings: "cms-settings",
  services: "cms-services",
  projects: "cms-projects",
  blog: "cms-blog",
  heroImages: "cms-hero-images",
  testimonials: "cms-testimonials",
  certifications: "cms-certifications",
  clients: "cms-clients",
  sections: "cms-sections",
  nosotros: "cms-nosotros",
  calculadora: "cms-calculadora",
  all: "cms-all",
} as const

export const CMS_TAG_LIST = Object.values(CMS_CACHE_TAGS)

export const PUBLIC_ISR_REVALIDATE = PUBLIC_PAGE_REVALIDATE
