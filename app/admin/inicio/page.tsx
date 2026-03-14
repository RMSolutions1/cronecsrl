import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  LayoutTemplate,
  Image as ImageIcon,
  Settings,
  FolderKanban,
  Briefcase,
  LayoutTemplate as SectionsIcon,
  MessageSquare,
  Award,
  Phone,
  FileText,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCompanyInfo } from "@/lib/data-read"
import { getServicesPublic } from "@/lib/data-read"

const DEFAULT_NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/blog", label: "Noticias" },
  { href: "/calculadora", label: "Cotizador" },
  { href: "/contacto", label: "Contacto" },
  { href: "/brochure", label: "Brochure" },
]

export default async function ContenidoInicioAdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")

  let navLinks = DEFAULT_NAV_LINKS
  let serviceTitles: string[] = []
  try {
    const [settings, services] = await Promise.all([getCompanyInfo(), getServicesPublic()])
    if (Array.isArray(settings?.nav_links) && settings.nav_links.length > 0) {
      navLinks = settings.nav_links as { href: string; label: string }[]
    }
    serviceTitles = (services || [])
      .filter((s) => s.status === "active" || s.is_active === true)
      .map((s) => (s.title as string) || "")
      .filter(Boolean)
  } catch {
    // use defaults
  }

  const sections = [
    {
      title: "Hero (portada)",
      description: "Textos del carrusel, badge y estadísticas «Nuestros números»",
      links: [
        { label: "Textos del slider y badge", href: "/admin/configuracion", tab: "hero", icon: Settings },
        { label: "Imágenes del hero", href: "/admin/imagenes", icon: ImageIcon },
        { label: "Números (Años, Proyectos, Clientes, Equipo)", href: "/admin/secciones", tab: "why", icon: SectionsIcon },
      ],
    },
    {
      title: "Servicios",
      description: "Listado de servicios que se muestra en la página de inicio",
      links: [{ label: "Editar servicios", href: "/admin/servicios", icon: Briefcase }],
    },
    {
      title: "Proyectos",
      description: "Portfolio de proyectos destacados",
      links: [{ label: "Editar proyectos", href: "/admin/proyectos", icon: FolderKanban }],
    },
    {
      title: "Por qué elegir CRONEC",
      description: "Título, estadísticas, características y frases destacadas",
      links: [{ label: "Editar sección", href: "/admin/secciones", tab: "why", icon: LayoutTemplate }],
    },
    {
      title: "Nuestro Proceso de Trabajo",
      description: "Pasos del proceso (consulta, evaluación, propuesta, etc.)",
      links: [{ label: "Editar pasos", href: "/admin/secciones", tab: "process", icon: LayoutTemplate }],
    },
    {
      title: "Testimonios",
      description: "Lo que dicen nuestros clientes",
      links: [{ label: "Editar testimonios", href: "/admin/testimonios", icon: MessageSquare }],
    },
    {
      title: "Certificaciones y Clientes",
      description: "Logos de certificaciones ISO y clientes",
      links: [{ label: "Editar certificaciones y clientes", href: "/admin/certificaciones-clientes", icon: Award }],
    },
    {
      title: "Bloque CTA y contacto",
      description: "«Hagamos realidad su proyecto», teléfono, email, dirección, horario",
      links: [
        { label: "Contacto y CTA", href: "/admin/configuracion", tab: "contacto", icon: Phone },
        { label: "Footer y textos CTA", href: "/admin/configuracion", tab: "footer", icon: FileText },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Contenido de la página de inicio</h1>
        <p className="text-muted-foreground mt-1">
          Todo lo que se ve en{" "}
          <a
            href="https://cronecsrl2026.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            cronecsrl2026.vercel.app
          </a>{" "}
          se puede editar desde aquí. Elija la sección que desea modificar.
        </p>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Menu className="h-5 w-5" />
            Menú del sitio (header y footer)
          </CardTitle>
          <CardDescription>
            Enlaces principales y lista de servicios que se muestran en el menú. Edite o agregue ítems según necesite.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Enlaces actuales:</p>
            <p className="text-sm">
              {navLinks.map((l) => l.label).join(" → ")}
              {navLinks.length === 0 && "Ninguno (se usarán los por defecto)."}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Servicios en el menú:</p>
            <p className="text-sm">
              {serviceTitles.length > 0 ? serviceTitles.join(", ") : "Construcción Civil, Obras Eléctricas, Instalaciones Industriales, Arquitectura e Ingeniería, Mantenimiento, Consultoría (por defecto o desde Admin → Servicios)."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/configuracion?tab=menu" className="gap-2">
                <Menu className="h-4 w-4" />
                Editar enlaces (Inicio, Proyectos, Nosotros, Noticias, Cotizador, Contacto, Brochure)
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/servicios" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Editar servicios (Construcción Civil, Obras Eléctricas, etc.)
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {section.links.map((link, j) => {
                const Icon = link.icon
                const href = link.tab ? `${link.href}?tab=${link.tab}` : link.href
                return (
                  <Button key={j} variant="outline" size="sm" asChild>
                    <Link href={href} className="gap-2">
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Otras páginas del sitio</CardTitle>
          <CardDescription>Noticias, Nosotros, Cotizador, Mensajes de contacto</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/noticias" className="gap-2">
              Noticias / Blog
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/nosotros" className="gap-2">
              Nosotros
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/cotizador" className="gap-2">
              Cotizador
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/mensajes" className="gap-2">
              Mensajes de contacto
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
