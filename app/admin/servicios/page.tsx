import { Suspense } from "react"
import { ServicesManager } from "@/components/admin/services-manager"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ServiciosAdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Servicios</h1>
        <p className="text-muted-foreground mt-1">Administre los servicios ofrecidos por CRONEC SRL (imagen, título, descripción, características).</p>
      </div>
      <Suspense fallback={<div className="text-muted-foreground">Cargando servicios...</div>}>
        <ServicesManager />
      </Suspense>
    </div>
  )
}
