import { notFound, redirect } from "next/navigation"
import ProjectForm from "@/components/admin/project-form"
import { getCurrentUser } from "@/lib/auth"
import { getProjectById } from "@/app/actions/db/projects"

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return [{ id: "static" }]
}

/** Objeto plano y serializable para pasar al Client Component (evita errores ESM/serialización en producción). */
function toSerializableProject(project: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!project) return null
  return {
    id: project.id != null ? String(project.id) : "",
    title: project.title != null ? String(project.title) : "",
    description: project.description != null ? String(project.description) : "",
    category: project.category != null ? String(project.category) : "",
    location: project.location != null ? String(project.location) : null,
    year: project.year != null ? Number(project.year) : null,
    area: project.area != null ? (typeof project.area === "number" ? project.area : String(project.area)) : null,
    budget: project.budget != null ? String(project.budget) : null,
    duration: project.duration != null ? String(project.duration) : null,
    client: project.client != null ? String(project.client) : null,
    image_url: project.image_url != null ? String(project.image_url) : "",
    status: project.status != null ? String(project.status) : "draft",
    featured: Boolean(project.featured),
    created_at: project.created_at != null ? String(project.created_at) : undefined,
    updated_at: project.updated_at != null ? String(project.updated_at) : undefined,
    created_by: project.created_by != null ? String(project.created_by) : undefined,
  }
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  let user
  try {
    user = await getCurrentUser()
  } catch {
    redirect("/admin/login")
  }
  if (!user) redirect("/admin/login")
  if (!["admin", "superadmin"].includes(user.role)) redirect("/")

  let id: string
  let project: Record<string, unknown> | null = null
  try {
    const resolved = await params
    id = typeof resolved?.id === "string" ? resolved.id : ""
    if (!id) notFound()
    const raw = await getProjectById(id)
    project = toSerializableProject(raw as Record<string, unknown> | null)
  } catch {
    notFound()
  }

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
