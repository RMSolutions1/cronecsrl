import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ChangePasswordForm } from "@/components/admin/change-password-form"

export const metadata = {
  title: "Mi cuenta | Admin CRONEC",
  description: "Cambiar contraseña del administrador",
}

export default async function MiCuentaPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Mi cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sesión: <span className="font-medium text-stone-800">{user.email}</span>
          {user.full_name ? ` · ${user.full_name}` : null}
          {user.role ? ` · rol: ${user.role}` : null}
        </p>
      </div>
      <ChangePasswordForm />
    </div>
  )
}
