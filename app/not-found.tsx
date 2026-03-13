import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/back-button"
import { Home, Phone, Building2 } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="relative h-12 w-12 flex-shrink-0">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_mini-CRONEC-pjPMvEYWU2s5qGxTrNDnxIWWufI0oB.png"
                alt="CRONEC SRL"
                fill
                className="object-contain"
                sizes="48px"
              />
            </div>
            <span className="font-bold text-2xl text-primary">CRONEC</span>
          </Link>

          {/* 404 Visual */}
          <div className="relative mb-8">
            <div className="text-[180px] md:text-[240px] font-bold text-muted/20 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-accent/10 flex items-center justify-center">
                <Building2 className="w-16 h-16 text-accent" />
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Página en{" "}
            <span className="text-primary">construcción</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Parece que esta página no existe o está siendo remodelada. 
            No se preocupe, nuestro equipo trabaja en ello.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/">
              <Button size="lg" className="gap-2">
                <Home className="h-4 w-4" />
                Ir al Inicio
              </Button>
            </Link>
            <BackButton />
          </div>

          {/* Quick Links */}
          <div className="border-t pt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Quizás estabas buscando:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/servicios">
                <Button variant="ghost" size="sm">Servicios</Button>
              </Link>
              <Link href="/proyectos">
                <Button variant="ghost" size="sm">Proyectos</Button>
              </Link>
              <Link href="/contacto">
                <Button variant="ghost" size="sm">Contacto</Button>
              </Link>
              <Link href="/calculadora">
                <Button variant="ghost" size="sm">Cotizador</Button>
              </Link>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-12 p-6 rounded-2xl bg-muted/50 border">
            <p className="text-muted-foreground mb-4">
              ¿Necesita ayuda? Contáctenos directamente
            </p>
            <a href="tel:+5493875361210">
              <Button variant="outline" className="gap-2">
                <Phone className="h-4 w-4" />
                +54 9 387 536-1210
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
