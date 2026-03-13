import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { NosotrosManager } from "@/components/admin/nosotros-manager"

export const metadata = {
  title: "Nosotros | CRONEC SRL Admin",
  description: "Editar contenido de la página Nosotros",
}

export default async function NosotrosAdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")
  if (!["admin", "superadmin"].includes(user.role)) redirect("/admin/login")

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Página Nosotros</h1>
      <p className="text-muted-foreground">Edite el hero, estadísticas, historia, valores, equipo, certificaciones y CTA de la página Nosotros. Misión y visión se editan en Configuración.</p>
      <NosotrosManager />
    </div>
  )
}
