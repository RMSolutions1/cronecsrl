import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { SectionsManager } from "@/components/admin/sections-manager"

export const metadata = {
  title: "Secciones de Inicio | CRONEC SRL",
  description: "Editar secciones Por qué CRONEC y Proceso de trabajo de la página de inicio",
}

export default async function SeccionesAdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")
  if (!["admin", "superadmin"].includes(user.role)) redirect("/admin/login")

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Secciones de Inicio</h1>
      <p className="text-muted-foreground">Edite las secciones &quot;Por qué elegir CRONEC&quot; y &quot;Nuestro Proceso de Trabajo&quot; que se muestran en la página de inicio.</p>
      <SectionsManager />
    </div>
  )
}
