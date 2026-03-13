import { ProjectsList } from "@/components/admin/projects-list"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getProjectsAdmin } from "@/app/actions/db/projects"

export const metadata = {
  title: "Gestión de Proyectos | CRONEC SRL",
  description: "Administrar proyectos",
}

export default async function AdminProjectsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")

  const projects = await getProjectsAdmin()

  return <ProjectsList projects={projects} />
}
