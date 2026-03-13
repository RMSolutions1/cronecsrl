"use client"

import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { logoutAction } from "@/app/actions/auth"
import { useRouter } from "next/navigation"
import type { SessionUser } from "@/lib/auth"

interface AdminPageClientProps {
  user: SessionUser
  stats?: {
    totalProjects: number
    publishedProjects: number
    totalServices: number
    activeServices: number
    totalTestimonials: number
    publishedTestimonials: number
    newSubmissions: number
    totalSubmissions: number
  }
  projects?: Array<{ id: string; title: string; image_url?: string | null; category?: string }>
  services?: Array<{ id: string; title: string; image_url?: string | null; slug?: string }>
}

export default function AdminPageClient({ user, stats, projects = [], services = [] }: AdminPageClientProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await logoutAction()
    router.push("/admin/login")
    router.refresh()
  }

  if (!stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Error</CardTitle>
            <CardDescription className="text-center">No se pudieron cargar las estadísticas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/admin/login">Volver al Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <AdminDashboard stats={stats} user={user} projects={projects} services={services} />
}
