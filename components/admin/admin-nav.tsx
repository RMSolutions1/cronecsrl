"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { logoutAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import {
  LayoutDashboard,
  Home,
  Globe,
  FolderKanban,
  Briefcase,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Mail,
  Newspaper,
  Image as ImageIcon,
  ExternalLink,
  Award,
  LayoutTemplate,
  User,
  Calculator,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import Image from "next/image"

const SIDEBAR_COLLAPSED_KEY = "cronec-sidebar-collapsed"

type NavItem = { href: string; icon: React.ComponentType<{ className?: string }>; label: string; exact?: boolean }

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "General",
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
      { href: "/admin/estado-del-sitio", icon: Globe, label: "Estado del sitio" },
      { href: "/admin/inicio", icon: Home, label: "Contenido de Inicio" },
    ],
  },
  {
    title: "Contenido",
    items: [
      { href: "/admin/proyectos", icon: FolderKanban, label: "Proyectos" },
      { href: "/admin/servicios", icon: Briefcase, label: "Servicios" },
      { href: "/admin/noticias", icon: Newspaper, label: "Noticias" },
      { href: "/admin/secciones", icon: LayoutTemplate, label: "Secciones de Inicio" },
      { href: "/admin/imagenes", icon: ImageIcon, label: "Imágenes Hero" },
      { href: "/admin/testimonios", icon: MessageSquare, label: "Testimonios" },
      { href: "/admin/certificaciones-clientes", icon: Award, label: "Certificaciones y Clientes" },
      { href: "/admin/nosotros", icon: User, label: "Nosotros" },
      { href: "/admin/cotizador", icon: Calculator, label: "Cotizador" },
    ],
  },
  {
    title: "Comunicación",
    items: [
      { href: "/admin/mensajes", icon: Mail, label: "Mensajes" },
    ],
  },
  {
    title: "Sistema",
    items: [
      { href: "/admin/configuracion", icon: Settings, label: "Configuración" },
      { href: "/admin/diagnostico", icon: Stethoscope, label: "Diagnóstico" },
    ],
  },
]

function getGroupContainingPath(pathname: string): number {
  for (let i = 0; i < navGroups.length; i++) {
    const hasMatch = navGroups[i].items.some((item) => {
      if (item.exact) return pathname === item.href
      return pathname === item.href || pathname.startsWith(item.href + "/")
    })
    if (hasMatch) return i
  }
  return 0
}

interface AdminNavProps {
  user: { id: string; email: string; full_name?: string | null; role?: string }
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

export function AdminNav({ user, collapsed = false, onCollapsedChange }: AdminNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const toggleCollapsed = () => {
    const next = !collapsed
    onCollapsedChange?.(next)
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next))
    } catch {
      // ignore
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logoutAction()
    router.push("/admin/login")
    router.refresh()
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + "/")
  }

  const openGroupIndex = getGroupContainingPath(pathname)

  const linkClass = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
      active
        ? "bg-primary-foreground/20 text-primary-foreground"
        : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground",
    )

  const NavLink = ({ item, collapsedMode }: { item: NavItem; collapsedMode?: boolean }) => {
    const Icon = item.icon
    const active = isActive(item.href, item.exact)
    const content = (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={cn(linkClass(active), collapsedMode && "justify-center px-2")}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!collapsedMode && <span className="truncate">{item.label}</span>}
      </Link>
    )
    if (collapsedMode) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {item.label}
          </TooltipContent>
        </Tooltip>
      )
    }
    return content
  }

  return (
    <>
      <button
        type="button"
        aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg border bg-background p-2 shadow-lg lg:hidden"
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-primary text-primary-foreground transition-[width] duration-200 ease-in-out",
          mobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 lg:translate-x-0",
          "lg:w-16",
          !collapsed && "lg:w-64",
        )}
      >
        <div className="flex h-full min-h-0 flex-col">
          {/* Header: logo + collapse */}
          <div className="relative flex flex-shrink-0 items-center justify-between border-b border-primary-foreground/10 p-3 lg:px-3">
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className={cn("flex items-center gap-3 overflow-hidden min-w-0", collapsed && "lg:justify-center lg:gap-0")}
            >
              <div className="relative h-8 w-8 flex-shrink-0">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_mini-CRONEC-pjPMvEYWU2s5qGxTrNDnxIWWufI0oB.png"
                  alt="CRONEC"
                  fill
                  className="object-contain brightness-0 invert"
                  sizes="32px"
                />
              </div>
              {(!collapsed || mobileOpen) && (
                <div className="min-w-0">
                  <h2 className="text-lg font-bold truncate">CRONEC</h2>
                  <p className="text-xs text-primary-foreground/70 hidden lg:block">Panel Admin</p>
                </div>
              )}
            </Link>
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
              className="hidden lg:flex flex-shrink-0 rounded-md p-1.5 text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </div>

          {/* Nav: scrollable */}
          <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-2">
              {collapsed ? (
                <div className="space-y-1">
                  {navGroups.flatMap((g) => g.items).map((item) => (
                    <NavLink key={item.href} item={item} collapsedMode />
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {navGroups.map((group, idx) => (
                    <Collapsible
                      key={group.title}
                      defaultOpen={idx === openGroupIndex}
                      className="group/coll"
                    >
                      <CollapsibleTrigger
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground",
                        )}
                      >
                        <span>{group.title}</span>
                        <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/coll:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-0.5 pt-0.5">
                        {group.items.map((item) => (
                          <NavLink key={item.href} item={item} />
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
          </nav>

          {/* Footer: Ver sitio + usuario + cerrar sesión (siempre visible) */}
          <div className="flex flex-shrink-0 flex-col border-t border-primary-foreground/10 p-2">
            {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/"
                      target="_blank"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center rounded-lg px-2 py-2.5 text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground lg:mx-auto"
                    >
                      <ExternalLink className="h-5 w-5 flex-shrink-0" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    Ver Sitio Web
                  </TooltipContent>
                </Tooltip>
            ) : (
              <Link
                href="/"
                target="_blank"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <ExternalLink className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Ver Sitio Web</span>
              </Link>
            )}
            <div className={cn("mt-2 rounded-lg bg-primary-foreground/10 p-2", collapsed && "lg:flex lg:flex-col lg:items-center")}>
              <p className={cn("text-sm font-medium truncate", collapsed && "lg:text-center lg:truncate lg:max-w-[2rem] lg:overflow-hidden")} title={user?.full_name || user?.email}>
                {collapsed ? (user?.full_name || user?.email || "").slice(0, 1).toUpperCase() : (user?.full_name || user?.email)}
              </p>
              {!collapsed && (
                <p className="text-xs text-primary-foreground/70">
                  {user?.role === "superadmin" ? "Super Admin" : "Administrador"}
                </p>
              )}
            </div>
            {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      variant="ghost"
                      size="sm"
                      className="mt-2 w-full justify-center px-2 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground lg:mx-auto"
                    >
                      <LogOut className="h-5 w-5 flex-shrink-0" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
                  </TooltipContent>
                </Tooltip>
            ) : (
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="ghost"
                size="sm"
                className="mt-2 w-full justify-start gap-3 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                <span>{isLoggingOut ? "Cerrando..." : "Cerrar sesión"}</span>
              </Button>
            )}
          </div>
        </div>
      </aside>
      </TooltipProvider>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}
    </>
  )
}
