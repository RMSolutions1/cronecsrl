import { Suspense } from "react"
import { SettingsManager } from "@/components/admin/settings-manager"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export const metadata = {
  title: "Configuracion del Sitio | Admin CRONEC",
  description: "Configuracion general del sitio web de CRONEC SRL",
}

function SettingsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

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
      <Suspense fallback={<SettingsLoadingSkeleton />}>
        <SettingsManager />
      </Suspense>
    </div>
  )
}
