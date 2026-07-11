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
} as const
