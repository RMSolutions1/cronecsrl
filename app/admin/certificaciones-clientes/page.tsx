import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { CertificationsClientsManager } from "@/components/admin/certifications-clients-manager"

export const metadata = {
  title: "Certificaciones y Clientes | CRONEC SRL",
  description: "Administrar certificaciones (ISO, etc.) y clientes que confían en nosotros",
}

export default async function CertificacionesClientesAdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")
  if (!["admin", "superadmin"].includes(user.role)) redirect("/admin/login")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Certificaciones y Clientes</h1>
        <p className="text-muted-foreground mt-1">
          Gestione las certificaciones (ISO 9001, ISO 14001, ISO 45001) y la lista de clientes que se muestran en la página de inicio. Los cambios se aplican automáticamente en la web.
        </p>
      </div>
      <CertificationsClientsManager />
    </div>
  )
}
