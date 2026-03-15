"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, Briefcase, MessageSquare, Mail, TrendingUp, CheckCircle2, Clock, Users, Newspaper, Settings, Image, ExternalLink, Pencil, ImageIcon, Globe } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import NextImage from "next/image"

interface DashboardStats {
  totalProjects: number
  publishedProjects: number
  totalServices: number
  activeServices: number
  totalTestimonials: number
  publishedTestimonials: number
  newSubmissions: number
  totalSubmissions: number
  totalPosts?: number
  publishedPosts?: number
}

interface AdminDashboardProps {
  stats: DashboardStats
  user: any
  projects?: Array<{ id: string; title: string; image_url?: string | null; category?: string }>
  services?: Array<{ id: string; title: string; image_url?: string | null; slug?: string }>
}

export function AdminDashboard({ stats, user, projects = [], services = [] }: AdminDashboardProps) {
  const statCards = [
    {
      title: "Proyectos",
      value: stats.totalProjects,
      subtitle: `${stats.publishedProjects} publicados`,
      icon: FolderKanban,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/admin/proyectos",
    },
    {
      title: "Servicios",
      value: stats.totalServices,
      subtitle: `${stats.activeServices} activos`,
      icon: Briefcase,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/admin/servicios",
    },
    {
      title: "Noticias",
      value: stats.totalPosts || 0,
      subtitle: `${stats.publishedPosts || 0} publicadas`,
      icon: Newspaper,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/admin/noticias",
    },
    {
      title: "Testimonios",
      value: stats.totalTestimonials,
      subtitle: `${stats.publishedTestimonials} publicados`,
      icon: MessageSquare,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      href: "/admin/testimonios",
    },
    {
      title: "Mensajes",
      value: stats.totalSubmissions,
      subtitle: `${stats.newSubmissions} nuevos`,
      icon: Mail,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      href: "/admin/mensajes",
    },
  ]

  const quickActions = [
    { label: "Nuevo Proyecto", href: "/admin/proyectos/nuevo", icon: FolderKanban, color: "bg-blue-50 hover:bg-blue-100 text-blue-700" },
    { label: "Nueva Noticia", href: "/admin/noticias", icon: Newspaper, color: "bg-purple-50 hover:bg-purple-100 text-purple-700" },
    { label: "Nuevo Testimonio", href: "/admin/testimonios", icon: MessageSquare, color: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700" },
    { label: "Ver Mensajes", href: "/admin/mensajes", icon: Mail, color: "bg-orange-50 hover:bg-orange-100 text-orange-700" },
    { label: "Imágenes Hero", href: "/admin/imagenes", icon: Image, color: "bg-teal-50 hover:bg-teal-100 text-teal-700" },
    { label: "Configuración", href: "/admin/configuracion", icon: Settings, color: "bg-gray-50 hover:bg-gray-100 text-gray-700" },
  ]

  const manageContent = [
    { label: "Imagenes del Hero", description: "Gestionar carrusel de imagenes principales", href: "/admin/configuracion?tab=hero", icon: Image },
    { label: "Información de Contacto", description: "Teléfono, email, dirección", href: "/admin/configuracion?tab=contacto", icon: Users },
    { label: "Redes Sociales", description: "Facebook, Instagram, LinkedIn", href: "/admin/configuracion?tab=social", icon: ExternalLink },
    { label: "Estadísticas", description: "Años, proyectos, clientes", href: "/admin/configuracion?tab=stats", icon: TrendingUp },
  ]

  return (
    <div className="space-y-8">
      {/* Acceso rápido: Estado del sitio */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Ver estado actual del sitio</p>
              <p className="text-sm text-muted-foreground">Todos los datos que muestra la web en un solo lugar. Edite, reemplace o actualice cualquier contenido sin tocar código.</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/admin/estado-del-sitio" className="gap-2">
              <Globe className="h-4 w-4" />
              Estado del sitio
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bienvenido, {user?.full_name || "Administrador"}</h1>
          <p className="mt-1 text-muted-foreground">Panel de administración de CRONEC SRL</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="py-1.5 px-3">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            Sistema Activo
          </Badge>
          <Button asChild variant="outline">
            <Link href="/" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Sitio
            </Link>
          </Button>
        </div>
      </div>

      {/* Contenido actual del sitio - Proyectos y Servicios con fotos */}
      {(projects.length > 0 || services.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-primary" />
              Contenido actual del sitio
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Proyectos y servicios publicados en la web. Edite desde los enlaces o desde el menú.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {projects.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <FolderKanban className="h-4 w-4" />
                  Proyectos ({projects.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {projects.slice(0, 6).map((p) => (
                    <Link key={p.id} href={`/admin/proyectos/${p.id}/editar`}>
                      <div className="rounded-lg border overflow-hidden hover:border-primary transition-colors group">
                        <div className="relative aspect-video bg-muted">
                          {p.image_url ? (
                            <NextImage
                              src={p.image_url}
                              alt={p.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                              sizes="160px"
                              unoptimized={p.image_url.startsWith("/")}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 flex items-center justify-between gap-1">
                          <span className="text-xs font-medium line-clamp-2 truncate">{p.title}</span>
                          <Pencil className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {projects.length > 6 && (
                  <Button variant="ghost" size="sm" className="mt-2" asChild>
                    <Link href="/admin/proyectos">Ver todos los proyectos</Link>
                  </Button>
                )}
              </div>
            )}
            {services.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Servicios ({services.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {services.slice(0, 6).map((s) => (
                    <Link key={s.id} href="/admin/servicios">
                      <div className="rounded-lg border overflow-hidden hover:border-primary transition-colors group">
                        <div className="relative aspect-video bg-muted">
                          {s.image_url ? (
                            <NextImage
                              src={s.image_url}
                              alt={s.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                              sizes="160px"
                              unoptimized={s.image_url.startsWith("/")}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 flex items-center justify-between gap-1">
                          <span className="text-xs font-medium line-clamp-2 truncate">{s.title}</span>
                          <Pencil className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {services.length > 6 && (
                  <Button variant="ghost" size="sm" className="mt-2" asChild>
                    <Link href="/admin/servicios">Ver todos los servicios</Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="transition-all hover:shadow-lg hover:border-primary/50 h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`rounded-xl p-2.5 ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.subtitle}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Acciones rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button key={action.label} asChild variant="outline" className={`h-auto py-4 flex-col gap-2 ${action.color} border-transparent`}>
                  <Link href={action.href}>
                    <Icon className="h-6 w-6" />
                    <span className="text-xs text-center">{action.label}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Content Management */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Gestionar Contenido del Sitio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {manageContent.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.label} href={item.href}>
                    <div className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted transition-colors">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Messages & Activity */}
        <div className="space-y-6">
          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-orange-600" />
                Mensajes Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.newSubmissions > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                      <Mail className="h-7 w-7 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">
                        {stats.newSubmissions}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stats.newSubmissions === 1 ? "mensaje nuevo" : "mensajes nuevos"}
                      </p>
                    </div>
                  </div>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/admin/mensajes">Ver Mensajes</Link>
                  </Button>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                  <p className="mt-2 font-medium">Todo al dia</p>
                  <p className="text-sm text-muted-foreground">No hay mensajes pendientes</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Site Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Estado del Sitio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Proyectos publicados</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {stats.publishedProjects}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Servicios activos</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {stats.activeServices}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Testimonios publicados</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {stats.publishedTestimonials}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Noticias publicadas</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {stats.publishedPosts || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
