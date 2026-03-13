import { Suspense } from "react"
import { SettingsManager } from "@/components/admin/settings-manager"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ConfiguracionAdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración del Sitio</h1>
        <p className="text-muted-foreground mt-1">
          Información corporativa, contacto, redes sociales, textos del hero de inicio y datos de la empresa.
        </p>
      </div>
      <Suspense fallback={<div className="text-muted-foreground">Cargando configuración...</div>}>
        <SettingsManager />
      </Suspense>
    </div>
  )
}
