import { Suspense } from "react"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MessagesManager } from "@/components/admin/messages-manager"

export default async function MensajesAdminPage() {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) redirect("/admin/login")
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mensajes de Contacto</h1>
        <p className="text-muted-foreground mt-2">
          Revisa y gestiona los mensajes recibidos a través del formulario de contacto
        </p>
      </div>

      <Suspense fallback={<div>Cargando mensajes...</div>}>
        <MessagesManager />
      </Suspense>
    </div>
  )
}
