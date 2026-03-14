import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  getCompanyInfo,
  getSectionsPublic,
  getServicesPublic,
  getProjectsPublic,
  getTestimonialsPublic,
  getCertificationsPublic,
  getClientsPublic,
  getHeroImagesPublic,
  getNosotrosPublic,
  getBlogPostsPublic,
} from "@/lib/data-read"
import { readData } from "@/lib/data"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  FileText,
  Image as ImageIcon,
  Menu,
  LayoutTemplate,
  FolderKanban,
  Briefcase,
  MessageSquare,
  Award,
  Mail,
  Phone,
  Scale,
  Gavel,
  Shield,
  ExternalLink,
  Edit,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function EstadoDelSitioPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")

  const [
    settings,
    sections,
    services,
    projects,
    testimonials,
    certifications,
    clients,
    heroImages,
    nosotros,
    blogPosts,
    messagesRaw,
  ] = await Promise.all([
    getCompanyInfo(),
    getSectionsPublic(),
    getServicesPublic(),
    getProjectsPublic(),
    getTestimonialsPublic(),
    getCertificationsPublic(),
    getClientsPublic(),
    getHeroImagesPublic("home"),
    getNosotrosPublic(),
    getBlogPostsPublic(),
    readData<unknown[]>("messages.json").catch(() => []),
  ])

  const messages = Array.isArray(messagesRaw) ? messagesRaw : []
  const navLinks = (Array.isArray(settings?.nav_links) && settings.nav_links.length > 0
    ? settings.nav_links
    : [
        { href: "/", label: "Inicio" },
        { href: "/proyectos", label: "Proyectos" },
        { href: "/nosotros", label: "Nosotros" },
        { href: "/blog", label: "Noticias" },
        { href: "/calculadora", label: "Cotizador" },
        { href: "/contacto", label: "Contacto" },
        { href: "/brochure", label: "Brochure" },
      ]) as { href: string; label: string }[]

  const companyName = (settings?.company_name as string) || "CRONEC SRL"
  const tagline = (settings?.tagline as string) || ""
  const phone = (settings?.phone as string) || ""
  const email = (settings?.email as string) || ""
  const address = (settings?.address as string) || ""
  const horario = (settings?.horario as string) || ""

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Estado actual del sitio</h1>
        <p className="text-muted-foreground">
          Vista de todos los datos que hoy muestra la web. Use los botones &quot;Editar&quot; para cambiar cualquier contenido sin tocar código.
        </p>
        <Button asChild variant="outline" size="sm" className="w-fit gap-2">
          <Link href="https://cronecsrl2026.vercel.app" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            Ver sitio en vivo
          </Link>
        </Button>
      </div>

      {/* Datos generales de la empresa */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Datos de la empresa
            </CardTitle>
            <CardDescription>Nombre, eslogan, contacto y datos legales</CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href="/admin/configuracion?tab=general" className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <p><strong>Nombre:</strong> {companyName}</p>
          <p><strong>Eslogan:</strong> {tagline || "—"}</p>
          <p><strong>Teléfono:</strong> {phone || "—"}</p>
          <p><strong>Email:</strong> {email || "—"}</p>
          <p><strong>Dirección:</strong> {address || "—"}</p>
          <p><strong>Horario:</strong> {horario || "—"}</p>
        </CardContent>
      </Card>

      {/* Menú y enlaces */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Menu className="h-5 w-5" />
              Menú del sitio
            </CardTitle>
            <CardDescription>Enlaces del header y footer</CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href="/admin/configuracion?tab=menu" className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">Actual: {navLinks.map((l) => l.label).join(" → ")}</p>
          <p className="text-sm">Servicios en menú: {services.length} ítems (desde Admin → Servicios)</p>
        </CardContent>
      </Card>

      {/* Hero inicio */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Hero e inicio
            </CardTitle>
            <CardDescription>Slides, imágenes hero, textos y números</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/configuracion?tab=hero">Hero</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/imagenes">Imágenes</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/secciones?tab=why">Números</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="text-sm">
          <p><strong>Slides:</strong> {(settings?.heroSlides as unknown[])?.length ?? 0} diapositivas</p>
          <p><strong>Imágenes hero (inicio):</strong> {heroImages.length} imágenes</p>
          <p><strong>Estadísticas (Por qué CRONEC):</strong> {(sections?.whyCronec as { stats?: unknown[] })?.stats?.length ?? 0} ítems</p>
        </CardContent>
      </Card>

      {/* Secciones de inicio */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <LayoutTemplate className="h-5 w-5" />
              Secciones de inicio
            </CardTitle>
            <CardDescription>Por qué CRONEC, proceso de trabajo</CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href="/admin/secciones" className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p><strong>Por qué elegir CRONEC:</strong> título, estadísticas, características</p>
          <p><strong>Proceso de trabajo:</strong> {(sections?.process as { steps?: unknown[] })?.steps?.length ?? 0} pasos</p>
        </CardContent>
      </Card>

      {/* Servicios */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Servicios
            </CardTitle>
            <CardDescription>Listado de servicios (menú y página /servicios)</CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href="/admin/servicios" className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {services.slice(0, 12).map((s) => (
              <Badge key={String(s.id ?? s.slug)} variant="secondary">
                {(s.title as string) || String(s.slug)}
              </Badge>
            ))}
            {services.length > 12 && <Badge variant="outline">+{services.length - 12} más</Badge>}
          </div>
        </CardContent>
      </Card>

      {/* Proyectos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5" />
              Proyectos
            </CardTitle>
            <CardDescription>Portfolio publicado en la web</CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href="/admin/proyectos" className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm"><strong>{projects.length}</strong> proyectos publicados</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {projects.slice(0, 6).map((p) => (
              <Badge key={String(p.id)} variant="outline">{(p.title as string) || ""}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Testimonios */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Testimonios
            </CardTitle>
            <CardDescription>Lo que dicen los clientes</CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href="/admin/testimonios" className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm"><strong>{testimonials.length}</strong> testimonios publicados</p>
        </CardContent>
      </Card>

      {/* Certificaciones y clientes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certificaciones y clientes
            </CardTitle>
            <CardDescription>Logos y marcas</CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href="/admin/certificaciones-clientes" className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Certificaciones: <strong>{certifications.length}</strong> · Clientes: <strong>{clients.length}</strong></p>
        </CardContent>
      </Card>

      {/* Noticias / Blog */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Noticias (blog)
            </CardTitle>
            <CardDescription>Entradas publicadas</CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href="/admin/noticias" className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm"><strong>{blogPosts.length}</strong> entradas</p>
        </CardContent>
      </Card>

      {/* Nosotros */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Página Nosotros
            </CardTitle>
            <CardDescription>Historia, equipo, estadísticas</CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href="/admin/nosotros" className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="text-sm">
          <p>Contenido cargado desde datos de Nosotros</p>
        </CardContent>
      </Card>

      {/* Cotizador */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Cotizador
            </CardTitle>
            <CardDescription>Tipos de proyecto, niveles de calidad y plazos</CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href="/admin/cotizador" className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="text-sm">
          <p>Precios y multiplicadores editables desde Admin → Cotizador</p>
        </CardContent>
      </Card>

      {/* Mensajes de contacto */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Mensajes de contacto
            </CardTitle>
            <CardDescription>Consultas recibidas por el formulario</CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href="/admin/mensajes" className="gap-2">
              <Edit className="h-4 w-4" />
              Ver mensajes
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm"><strong>{messages.length}</strong> mensajes recibidos</p>
        </CardContent>
      </Card>

      {/* Textos del sitio y páginas legales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Textos del sitio y páginas legales
            </CardTitle>
            <CardDescription>Botones (Ver Proyectos, Solicitar Cotización, etc.), Política de Calidad, Privacidad, Términos</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/configuracion?tab=textos">Textos</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/configuracion?tab=legal">
                <Gavel className="h-4 w-4 mr-1" />
                Legales
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>Botones y CTAs: Configuración → Textos del sitio</p>
          <p>Política de Calidad, Privacidad, Términos: Configuración → Páginas legales</p>
        </CardContent>
      </Card>

      {/* CTA y contacto */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              CTA y bloque de contacto
            </CardTitle>
            <CardDescription>Título, párrafo y datos de contacto del bloque «Hagamos realidad su proyecto»</CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href="/admin/configuracion?tab=footer" className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="text-sm">
          <p><strong>Título CTA:</strong> {(settings?.cta_title as string) || "—"}</p>
          <p><strong>Contacto:</strong> Configuración → Contacto</p>
        </CardContent>
      </Card>
    </div>
  )
}
