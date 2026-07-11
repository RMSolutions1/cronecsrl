import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacte a CRONEC SRL para obras civiles, instalaciones eléctricas y proyectos en Salta. Teléfono, email, formulario y ubicación.",
  openGraph: {
    title: "Contacto | CRONEC SRL",
    description:
      "Contacte a CRONEC SRL para obras civiles, instalaciones eléctricas y proyectos en Salta.",
  },
}

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
