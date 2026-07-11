import { revalidatePath } from "next/cache"

/** Invalida páginas públicas tras guardar contenido en el admin. */
export function revalidatePublicContent(paths: string[] = ["/"]) {
  const unique = [...new Set(paths)]
  for (const p of unique) {
    revalidatePath(p)
  }
}

export const REVALIDATE = {
  home: ["/"],
  servicios: ["/", "/servicios"],
  proyectos: ["/", "/proyectos"],
  blog: ["/", "/blog"],
  nosotros: ["/", "/nosotros"],
  contacto: ["/contacto"],
  calculadora: ["/", "/calculadora"],
  brochure: ["/brochure"],
  legal: ["/terminos-condiciones", "/politica-privacidad", "/politica-calidad"],
  settings: ["/", "/contacto", "/nosotros", "/brochure", "/terminos-condiciones", "/politica-privacidad", "/politica-calidad"],
  testimonials: ["/"],
  certifications: ["/"],
  clients: ["/"],
} as const

/** Rutas a invalidar según la página del hero en admin. */
export const HERO_PAGE_PATHS: Record<string, readonly string[]> = {
  home: REVALIDATE.home,
  servicios: REVALIDATE.servicios,
  proyectos: REVALIDATE.proyectos,
  nosotros: REVALIDATE.nosotros,
  contacto: REVALIDATE.contacto,
  blog: REVALIDATE.blog,
}

export function revalidateHeroPage(page: string) {
  revalidatePublicContent([...(HERO_PAGE_PATHS[page] ?? ["/"])])
}
