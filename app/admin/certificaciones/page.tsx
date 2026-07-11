import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { CertificationsManager } from "@/components/admin/certifications-manager"

export const metadata = {
  title: "Certificaciones | Admin CRONEC",
  description: "Administrar certificaciones ISO y cumplimiento normativo",
}

export default async function CertificacionesAdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")
  if (!["admin", "superadmin"].includes(user.role)) redirect("/admin/login")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Certificaciones</h1>
        <p className="text-muted-foreground mt-1">
          Gestioná las certificaciones y sellos de cumplimiento (ISO 9001, ISO 14001, ISO 45001, etc.) que se muestran en la página de inicio.
        </p>
      </div>
      <Suspense fallback={<div className="text-muted-foreground">Cargando...</div>}>
        <CertificationsManager />
      </Suspense>
    </div>
  )
}
