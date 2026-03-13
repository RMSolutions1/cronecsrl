import { redirect } from "next/navigation"
import ProjectForm from "@/components/admin/project-form"
import { getCurrentUser } from "@/lib/auth"

export const metadata = {
  title: "Nuevo Proyecto | CRONEC SRL",
  description: "Crear un nuevo proyecto",
}

export default async function NewProjectPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")
  if (!["admin", "superadmin"].includes(user.role)) redirect("/")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Proyecto</h1>
        <p className="mt-2 text-gray-600">Completa los datos del nuevo proyecto</p>
      </div>

      <ProjectForm mode="create" />
    </div>
  )
}
