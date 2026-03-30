import { Suspense } from "react"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MessagesManager } from "@/components/admin/messages-manager"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Mensajes de Contacto | Admin CRONEC",
  description: "Gestión de mensajes recibidos desde el formulario de contacto",
}

function MessagesLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-4 pb-4">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-4 pb-4">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64 mb-4" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default async function MensajesAdminPage() {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) redirect("/admin/login")
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mensajes de Contacto</h1>
        <p className="text-muted-foreground mt-2">
          Gestione los mensajes recibidos desde el formulario de contacto. Puede ver, responder por email, agregar notas internas y cambiar el estado de cada mensaje.
        </p>
      </div>

      <Suspense fallback={<MessagesLoadingSkeleton />}>
        <MessagesManager />
      </Suspense>
    </div>
  )
}
