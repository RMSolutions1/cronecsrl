import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { ClientsManager } from "@/components/admin/clients-manager"

export const metadata = {
  title: "Clientes | Admin CRONEC",
  description: "Administrar logos de clientes en la página de inicio",
}

export default async function ClientesAdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")
  if (!["admin", "superadmin"].includes(user.role)) redirect("/admin/login")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clientes</h1>
        <p className="text-muted-foreground mt-1">
          Gestioná la lista de clientes y organizaciones que confían en CRONEC SRL. Se muestran en la sección &quot;Clientes que confían en nosotros&quot; del inicio.
        </p>
      </div>
      <Suspense fallback={<div className="text-muted-foreground">Cargando...</div>}>
        <ClientsManager />
      </Suspense>
    </div>
  )
}
