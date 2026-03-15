"use client"

import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Clock, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/lib/settings-context"
import { useServicesNav } from "@/lib/services-nav-context"

const DEFAULT_LOGO = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_mini-CRONEC-pjPMvEYWU2s5qGxTrNDnxIWWufI0oB.png"

const FALLBACK_NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/blog", label: "Noticias" },
  { href: "/calculadora", label: "Cotizador" },
  { href: "/contacto", label: "Contacto" },
  { href: "/brochure", label: "Brochure" },
]

const FALLBACK_SERVICE_LABELS = [
  "Construcción Civil",
  "Obras Eléctricas",
  "Instalaciones Industriales",
  "Arquitectura e Ingeniería",
  "Mantenimiento",
  "Consultoria",
]

export function Footer() {
  const currentYear = new Date().getFullYear()
  const s = useSettings()
  const servicesNav = useServicesNav()
  const footerNavLinks = (Array.isArray(s?.nav_links) && s.nav_links.length > 0 ? s.nav_links : FALLBACK_NAV_LINKS) as { href: string; label: string }[]
  const footerServiceLabels = servicesNav.length > 0 ? servicesNav.map((x) => x.title) : FALLBACK_SERVICE_LABELS
  const companyName = (s?.company_name as string) ?? "CRONEC SRL"
  const tagline = (s?.tagline as string) ?? "Construcciones eléctricas y civiles"
  const description = (s?.description as string) ?? "Empresa Salteña dedicada a Obras Públicas, obras de saneamiento, infraestructura y Obras Eléctricas. Calidad y compromiso desde 2009."
  const logoUrl = (s?.logo_url as string) || DEFAULT_LOGO
  const address = (s?.address as string) ?? "Santa Fe 548 PB \"B\", Salta Capital (4400)"
  const phone = (s?.phone as string) ?? "+54 9 (387) 536-1210"
  const email = (s?.email as string) ?? "cronec@cronecsrl.com.ar"
  const horario = (s?.horario as string) ?? "Lun - Vie: 8:00 - 18:00"
  const facebook = (s?.facebook_url as string) ?? "https://www.facebook.com/cronecsrl"
  const instagram = (s?.instagram_url as string) ?? "https://www.instagram.com/cronecsrl"
  const linkedin = (s?.linkedin_url as string) ?? "https://www.linkedin.com/company/cronecsrl"
  const cuit = (s?.cuit as string) ?? "33-71090097-9"
  const ctaTitle = (s?.footer_cta_title as string) ?? "Inicia tu proyecto con nosotros"
  const ctaSubtitle = (s?.footer_cta_subtitle as string) ?? "Más de 15 años de experiencia en construcción civil y eléctrica"
  const ctaContactenos = (s?.site_cta_contactenos as string) || "Contáctenos"

  return (
    <footer className="relative bg-[oklch(0.15_0.02_240)] text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* CTA Section */}
      <div className="relative border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-accent/10 rounded-2xl p-8 border border-accent/20">
            <div>
              <h3 className="text-2xl font-bold mb-2">{ctaTitle}</h3>
              <p className="text-white/70">{ctaSubtitle}</p>
            </div>
            <Link href="/contacto">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 shadow-lg">
                {ctaContactenos}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Logo and description */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative h-8 w-8 flex-shrink-0">
                <Image
                  src={logoUrl}
                  alt={`${companyName} Logo`}
                  fill
                  className="object-contain brightness-0 invert"
                  sizes="32px"
                />
              </div>
              <div>
                <span className="font-bold text-lg">{companyName}</span>
                <span className="text-xs text-white/60 block">{tagline}</span>
              </div>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed">{description}</p>
            <div className="flex items-center gap-3">
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-5">
            <h3 className="font-semibold text-lg">Enlaces</h3>
            <nav className="flex flex-col space-y-3 text-sm">
              {footerNavLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="text-white/70 hover:text-accent transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/50 group-hover:bg-accent transition-colors" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-5">
            <h3 className="font-semibold text-lg">Servicios</h3>
            <nav className="flex flex-col space-y-3 text-sm">
              {footerServiceLabels.map((label, i) => (
                <Link 
                  key={label + i}
                  href={servicesNav[i] ? `/servicios/${servicesNav[i].slug}` : "/servicios"} 
                  className="text-white/70 hover:text-accent transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/50 group-hover:bg-accent transition-colors" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-5">
            <h3 className="font-semibold text-lg">Contacto</h3>
            <div className="space-y-4 text-sm">
              {address && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-white/90 font-medium">Oficina Central</p>
                    <p className="text-white/60">{address}</p>
                  </div>
                </div>
              )}
              {phone && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-white/90 font-medium">Telefono</p>
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-white/60 hover:text-accent transition-colors">{phone}</a>
                  </div>
                </div>
              )}
              {email && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-white/90 font-medium">Email</p>
                    <a href={`mailto:${email}`} className="text-white/60 hover:text-accent transition-colors">{email}</a>
                  </div>
                </div>
              )}
              {horario && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-white/90 font-medium">Horario</p>
                    <p className="text-white/60">{horario}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="relative border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p><span suppressHydrationWarning>{currentYear}</span> {companyName}. Todos los derechos reservados.{cuit ? ` CUIT: ${cuit}` : ""}</p>
            <div className="flex items-center gap-6">
              <Link href="/politica-privacidad" className="hover:text-white transition-colors">
                Privacidad
              </Link>
              <Link href="/terminos-condiciones" className="hover:text-white transition-colors">
                Términos
              </Link>
              <Link href="/politica-calidad" className="hover:text-white transition-colors">
                Calidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
