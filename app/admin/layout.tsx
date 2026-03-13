import type React from "react"
import { getCurrentUser } from "@/lib/auth"
import { AdminShell } from "@/components/admin/admin-shell"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  return <AdminShell user={user}>{children}</AdminShell>
}
