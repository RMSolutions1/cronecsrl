import { notFound, redirect } from "next/navigation"
import ProjectForm from "@/components/admin/project-form"
import { getCurrentUser } from "@/lib/auth"
import { getProjectById } from "@/app/actions/db/projects"

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return [{ id: "static" }]
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")
  if (!["admin", "superadmin"].includes(user.role)) redirect("/")

  const { id } = await params
  const project = await getProjectById(id)
  if (!project) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Editar Proyecto</h1>
        <p className="mt-2 text-gray-600">Modifica la información del proyecto existente</p>
      </div>

      <ProjectForm initialData={project} mode="edit" />
    </div>
  )
}
