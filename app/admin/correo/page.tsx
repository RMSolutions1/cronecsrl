import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EmailSettingsManager } from "@/components/admin/email-settings-manager"

export default async function CorreoAdminPage() {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) redirect("/admin/login")

  return <EmailSettingsManager />
}
