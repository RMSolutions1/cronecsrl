import { getCurrentUser } from "@/lib/auth"

export type AdminUser = {
  id: string
  email: string
  full_name?: string | null
  role?: string
}

/** Verifica sesión admin; lanza si no hay permiso. */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role ?? "")) {
    throw new Error("No autorizado")
  }
  return user as AdminUser
}

export async function isAdminSession(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user && ["admin", "superadmin"].includes(user.role ?? "")
}
