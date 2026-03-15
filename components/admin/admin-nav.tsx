"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { logoutAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
} from "lucide-react"
import Image from "next/image"

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/estado-del-sitio", icon: Globe, label: "Estado del sitio" },
  { href: "/admin/inicio", icon: Home, label: "Contenido de Inicio" },
  { href: "/admin/proyectos", icon: FolderKanban, label: "Proyectos" },
  { href: "/admin/servicios", icon: Briefcase, label: "Servicios" },
  { href: "/admin/noticias", icon: Newspaper, label: "Noticias" },
  { href: "/admin/secciones", icon: LayoutTemplate, label: "Secciones de Inicio" },
  { href: "/admin/imagenes", icon: ImageIcon, label: "Imágenes Hero" },
  { href: "/admin/testimonios", icon: MessageSquare, label: "Testimonios" },
  { href: "/admin/certificaciones-clientes", icon: Award, label: "Certificaciones y Clientes" },
  { href: "/admin/nosotros", icon: User, label: "Nosotros" },
  { href: "/admin/cotizador", icon: Calculator, label: "Cotizador" },
  { href: "/admin/mensajes", icon: Mail, label: "Mensajes" },
  { href: "/admin/configuracion", icon: Settings, label: "Configuración" },
  { href: "/admin/diagnostico", icon: Stethoscope, label: "Diagnóstico" },
]

interface AdminNavProps {
  user: { id: string; email: string; full_name?: string | null; role?: string }
}

export function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

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

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-background p-2 shadow-lg border lg:hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-primary text-primary-foreground transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo and title */}
          <div className="flex items-center gap-3 border-b border-primary-foreground/10 p-6">
            <div className="relative h-8 w-8 flex-shrink-0">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_mini-CRONEC-pjPMvEYWU2s5qGxTrNDnxIWWufI0oB.png"
                alt="CRONEC Logo"
                fill
                className="object-contain brightness-0 invert"
                sizes="32px"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold">CRONEC</h2>
              <p className="text-xs text-primary-foreground/70">Panel Admin</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href, item.exact)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    active 
                      ? "bg-primary-foreground/20 text-primary-foreground" 
                      : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}

            <div className="pt-4 border-t border-primary-foreground/10 mt-4">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
                Ver Sitio Web
              </Link>
            </div>
          </nav>

          {/* User info and logout */}
          <div className="border-t border-primary-foreground/10 p-4">
            <div className="mb-3 rounded-lg bg-primary-foreground/10 p-3">
              <p className="text-sm font-medium truncate">{user?.full_name || user?.email}</p>
              <p className="text-xs text-primary-foreground/70">{user?.role === "superadmin" ? "Super Admin" : "Administrador"}</p>
            </div>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="ghost"
              className="w-full justify-start gap-3 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <LogOut className="h-5 w-5" />
              {isLoggingOut ? "Cerrando..." : "Cerrar Sesion"}
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
