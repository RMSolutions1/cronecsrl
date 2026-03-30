import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { SectionsManager } from "@/components/admin/sections-manager"

export const metadata = {
  title: "Secciones de Inicio | CRONEC SRL",
  description: "Editar todas las secciones de texto de la página de inicio",
}

export default async function SeccionesAdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")
  if (!["admin", "superadmin"].includes(user.role)) redirect("/admin/login")

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Secciones de Inicio</h1>
      <p className="text-muted-foreground">
        Edite todos los textos, títulos y descripciones de las secciones de la página de inicio: Por qué CRONEC, Proceso de Trabajo, Certificaciones y Clientes, y el bloque CTA de contacto.
      </p>
      <SectionsManager />
    </div>
  )
}
