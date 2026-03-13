"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, Mail, ChevronDown, Building2, Zap, Factory, Ruler, Wrench, HardHat, User } from "lucide-react"
import { cn } from "@/lib/utils"

const services = [
  { 
    href: "/servicios/obras-civiles", 
    label: "Obras Civiles", 
    icon: HardHat,
    description: "Construccion y mantenimiento de infraestructura"
  },
  { 
    href: "/servicios/obras-electricas", 
    label: "Obras Electricas", 
    icon: Zap,
    description: "Instalaciones de baja, media y alta tension"
  },
  { 
    href: "/servicios/arquitectura-ingenieria", 
    label: "Arquitectura e Ingenieria", 
    icon: Ruler,
    description: "Diseño, proyecto y dirección de obras"
  },
  { 
    href: "/servicios/instalaciones-industriales", 
    label: "Instalaciones Industriales", 
    icon: Factory,
    description: "Naves industriales y montajes"
  },
  { 
    href: "/servicios/obras-generales", 
    label: "Obras Generales", 
    icon: Building2,
    description: "Infraestructura ferroviaria y transporte"
  },
  { 
    href: "/servicios/servicios-especiales", 
    label: "Servicios Especiales", 
    icon: Wrench,
    description: "Reparacion de puentes y estructuras"
  },
]

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/blog", label: "Noticias" },
  { href: "/calculadora", label: "Cotizador" },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const isServicesActive = () => {
    return pathname.startsWith("/servicios")
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setMobileServicesOpen(false)
  }, [pathname])

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-background/95 backdrop-blur-lg shadow-lg border-b border-border/50" 
          : "bg-background/80 backdrop-blur-md"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Top bar */}
        <div 
          className={cn(
            "hidden md:flex items-center justify-between py-2 text-sm border-b border-border/30 transition-all duration-300",
            scrolled ? "h-0 py-0 opacity-0 overflow-hidden" : "h-auto opacity-100"
          )}
        >
          <div className="flex items-center gap-6">
            <a 
              href="tel:+5493875361210" 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>+54 9 (387) 536-1210</span>
            </a>
            <a
              href="mailto:cronec@cronecsrl.com.ar"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>cronec@cronecsrl.com.ar</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-xs">
              Lun - Vie: 8:00 - 18:00
            </span>
            {process.env.NEXT_PUBLIC_HIDE_ADMIN_LINK !== "1" && (
              <Link 
                href="/admin/login"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs"
              >
                <User className="h-3.5 w-3.5" />
                <span>Acceso Admin</span>
              </Link>
            )}
          </div>
        </div>

        {/* Main navigation */}
        <div className={cn(
          "flex items-center justify-between transition-all duration-300",
          scrolled ? "h-16" : "h-20"
        )}>
          <Link href="/" className="flex items-center space-x-3 group">
            <div className={cn(
              "relative flex-shrink-0 transition-all duration-300",
              scrolled ? "h-8 w-8" : "h-10 w-10"
            )}>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_mini-CRONEC-pjPMvEYWU2s5qGxTrNDnxIWWufI0oB.png"
                alt="CRONEC SRL"
                fill
                className="object-contain object-left"
                sizes="40px"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-bold text-primary leading-none transition-all duration-300",
                scrolled ? "text-lg" : "text-xl"
              )}>
                CRONEC SRL
              </span>
              <span className="text-[9px] text-muted-foreground tracking-widest uppercase">
                Construcciones eléctricas y civiles
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link href="/">
              <Button 
                variant="ghost" 
                className={cn(
                  "text-sm font-medium relative",
                  isActive("/") 
                    ? "text-accent after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-0.5 after:bg-accent" 
                    : "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-3/4"
                )}
              >
                Inicio
              </Button>
            </Link>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button 
                variant="ghost" 
                className={cn(
                  "text-sm font-medium relative",
                  isServicesActive() 
                    ? "text-accent after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-0.5 after:bg-accent" 
                    : "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-3/4"
                )}
                onClick={() => setServicesOpen(!servicesOpen)}
                onMouseEnter={() => setServicesOpen(true)}
              >
                Servicios
                <ChevronDown className={cn(
                  "ml-1 h-4 w-4 transition-transform duration-200",
                  servicesOpen ? "rotate-180" : ""
                )} />
              </Button>

              {/* Dropdown Menu */}
              <div 
                className={cn(
                  "absolute top-full left-0 mt-2 w-80 bg-background rounded-xl shadow-xl border border-border/50 overflow-hidden transition-all duration-300 origin-top-left",
                  servicesOpen 
                    ? "opacity-100 scale-100 translate-y-0" 
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                )}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <div className="p-2">
                  <div className="px-3 py-2 mb-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nuestros Servicios</p>
                  </div>
                  {services.map((service) => {
                    const Icon = service.icon
                    const isServiceActive = pathname === service.href
                    return (
                      <Link 
                        key={service.href} 
                        href={service.href}
                        onClick={() => setServicesOpen(false)}
                      >
                        <div className={cn(
                          "flex items-start gap-3 p-3 rounded-lg transition-colors group/item",
                          isServiceActive 
                            ? "bg-accent/10 border border-accent/20" 
                            : "hover:bg-muted"
                        )}>
                          <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                            isServiceActive 
                              ? "bg-accent/20" 
                              : "bg-primary/10 group-hover/item:bg-primary/20"
                          )}>
                            <Icon className={cn(
                              "h-5 w-5",
                              isServiceActive ? "text-accent" : "text-primary"
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-medium",
                              isServiceActive ? "text-accent" : "text-foreground"
                            )}>{service.label}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{service.description}</p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                  <div className="border-t border-border/50 mt-2 pt-2">
                    <Link 
                      href="/servicios"
                      onClick={() => setServicesOpen(false)}
                    >
                      <div className={cn(
                        "flex items-center justify-between p-3 rounded-lg transition-colors",
                        pathname === "/servicios" 
                          ? "bg-accent/10 text-accent" 
                          : "hover:bg-accent/10 text-accent"
                      )}>
                        <span className="text-sm font-medium">Ver todos los servicios</span>
                        <ChevronDown className="h-4 w-4 -rotate-90" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {navItems.slice(1).map((item) => (
              <Link key={item.href} href={item.href}>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "text-sm font-medium relative",
                    isActive(item.href) 
                      ? "text-accent after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-0.5 after:bg-accent" 
                      : "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-3/4"
                  )}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <Link href="/contacto">
              <Button 
                className={cn(
                  "ml-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5",
                  isActive("/contacto") 
                    ? "bg-accent/80 text-accent-foreground" 
                    : "bg-accent hover:bg-accent/90 text-accent-foreground"
                )}
              >
                Solicitar Cotización
              </Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={cn(
          "lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border/50 transition-all duration-300 overflow-hidden",
          mobileMenuOpen ? "max-h-[80vh] opacity-100 overflow-y-auto" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col space-y-1">
          <Link href="/">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-base",
                isActive("/") && "text-accent bg-accent/10"
              )}
            >
              Inicio
            </Button>
          </Link>
          
          {/* Mobile Services Accordion */}
          <div>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-between text-base",
                isServicesActive() && "text-accent bg-accent/10"
              )}
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
            >
              Servicios
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform duration-200",
                mobileServicesOpen ? "rotate-180" : ""
              )} />
            </Button>
            <div className={cn(
              "overflow-hidden transition-all duration-300",
              mobileServicesOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}>
              <div className="pl-4 space-y-1 py-2">
                {services.map((service) => {
                  const Icon = service.icon
                  const isServiceActive = pathname === service.href
                  return (
                    <Link 
                      key={service.href} 
                      href={service.href}
                    >
                      <Button 
                        variant="ghost" 
                        className={cn(
                          "w-full justify-start text-sm gap-3",
                          isServiceActive && "text-accent bg-accent/10"
                        )}
                      >
                        <Icon className={cn(
                          "h-4 w-4",
                          isServiceActive ? "text-accent" : "text-primary"
                        )} />
                        {service.label}
                      </Button>
                    </Link>
                  )
                })}
                <Link href="/servicios">
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "w-full justify-start text-sm",
                      pathname === "/servicios" ? "text-accent bg-accent/10" : "text-accent"
                    )}
                  >
                    Ver todos los servicios
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {navItems.slice(1).map((item) => (
            <Link key={item.href} href={item.href}>
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start text-base",
                  isActive(item.href) && "text-accent bg-accent/10"
                )}
              >
                {item.label}
              </Button>
            </Link>
          ))}
          
          <div className="pt-3 mt-2 border-t border-border/50">
            <Link href="/contacto">
              <Button 
                className={cn(
                  "w-full",
                  isActive("/contacto") 
                    ? "bg-accent/80 text-accent-foreground" 
                    : "bg-accent hover:bg-accent/90 text-accent-foreground"
                )}
              >
                Solicitar Cotización
              </Button>
            </Link>
          </div>
          
          <div className="pt-4 space-y-3 border-t border-border/50 mt-3">
            <a href="tel:+5493875361210" className="flex items-center gap-3 text-muted-foreground text-sm">
              <Phone className="h-4 w-4 text-accent" />
              <span>+54 9 (387) 536-1210</span>
            </a>
            <a href="mailto:cronec@cronecsrl.com.ar" className="flex items-center gap-3 text-muted-foreground text-sm">
              <Mail className="h-4 w-4 text-accent" />
              <span>cronec@cronecsrl.com.ar</span>
            </a>
            {process.env.NEXT_PUBLIC_HIDE_ADMIN_LINK !== "1" && (
              <Link 
                href="/admin/login"
                className="flex items-center gap-3 text-muted-foreground text-sm hover:text-primary transition-colors"
              >
                <User className="h-4 w-4 text-accent" />
                <span>Acceso Administrador</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
