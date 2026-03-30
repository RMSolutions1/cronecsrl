import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProfileManager } from "@/components/admin/profile-manager"

export const metadata = {
  title: "Mi Perfil | Admin CRONEC",
  description: "Gestiona tu perfil y cambia tu contraseña",
}

export default async function PerfilAdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona tu informacion personal y cambia tu contraseña.
        </p>
      </div>
      <ProfileManager user={user} />
    </div>
  )
}
