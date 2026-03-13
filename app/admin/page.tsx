import { redirect } from "next/navigation"
import AdminPageClient from "./admin-page-client"
import { getCurrentUser } from "@/lib/auth"
import { getAdminStats } from "@/app/actions/db/admin-stats"
import { getProjectsAdmin } from "@/app/actions/db/projects"
import { getServicesAdmin } from "@/app/actions/db/services"

export const metadata = {
  title: "Dashboard Administrativo | CRONEC SRL",
  description: "Panel de administración de contenido",
}

export default async function AdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")

  const [raw, projects, services] = await Promise.all([
    getAdminStats(),
    getProjectsAdmin(),
    getServicesAdmin(),
  ])
  const stats = {
    totalProjects: raw.projects,
    publishedProjects: raw.projects,
    totalServices: raw.services,
    activeServices: raw.services,
    totalTestimonials: raw.testimonials,
    publishedTestimonials: raw.testimonials,
    newSubmissions: 0,
    totalSubmissions: raw.contact_submissions,
    totalPosts: raw.blog_posts ?? 0,
    publishedPosts: raw.blog_published ?? 0,
  }

  return <AdminPageClient stats={stats} user={user} projects={projects} services={services} />
}
