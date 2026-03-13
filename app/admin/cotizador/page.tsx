import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { CalculadoraManager } from "@/components/admin/calculadora-manager"

export const metadata = {
  title: "Cotizador | CRONEC SRL Admin",
  description: "Configurar tipos de proyecto, niveles de calidad y plazos del cotizador.",
}

export default async function CotizadorAdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")
  if (!["admin", "superadmin"].includes(user.role)) redirect("/admin/login")

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cotizador</h1>
      <p className="text-muted-foreground">Edite los tipos de proyecto, niveles de calidad y plazos que se muestran en la página Cotizador (/calculadora).</p>
      <CalculadoraManager />
    </div>
  )
}
