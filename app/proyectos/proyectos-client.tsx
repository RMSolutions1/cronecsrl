"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Building2, Zap, Factory } from "lucide-react"
import Link from "next/link"
import { ProjectsGrid } from "@/components/projects-grid"
import { AnimatedCounter } from "@/components/animated-counter"
import { HeroCarousel } from "@/components/hero-carousel"
import { images } from "@/lib/images"

interface Project {
  id: string
  title: string
  description: string
  category: string
  year?: number | null
  featured: boolean
  image_url?: string | null
  client?: string | null
  location?: string | null
}

interface ProyectosClientProps {
  initialProjects: Project[]
}

const heroImages = [
  { src: images.heroProyectos[0], alt: "Edificio comercial moderno CRONEC" },
  { src: images.heroProyectos[1], alt: "Complejo industrial CRONEC" },
  { src: images.heroProyectos[2], alt: "Centro de salud CRONEC" },
]

const stats = [
  { value: 500, suffix: "+", label: "Proyectos Completados" },
  { value: 15, suffix: "+", label: "Anos de Experiencia" },
  { value: 98, suffix: "%", label: "Clientes Satisfechos" },
  { value: 4, suffix: "", label: "Areas Especializadas" },
]

export function ProyectosClient({ initialProjects }: ProyectosClientProps) {
  return (
    <>
      {/* Hero Section with Carousel */}
      <HeroCarousel images={heroImages} interval={5000}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="bg-accent/20 text-accent border-accent/30">
              Nuestro Portfolio
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white text-balance">
              Proyectos que{" "}
              <span className="text-accent">Construyen</span>
              {" "}el Futuro
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Explore nuestra amplia trayectoria en obras de infraestructura civil, 
              eléctrica e industrial en toda la región del noroeste argentino.
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-3xl md:text-4xl font-bold text-accent">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </HeroCarousel>

      {/* Category highlights */}
      <section className="py-12 bg-muted/50 border-b">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold">Obras Civiles</div>
                <div className="text-sm text-muted-foreground">Edificios, viviendas e infraestructura</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <div>
                <div className="font-semibold">Obras Electricas</div>
                <div className="text-sm text-muted-foreground">Instalaciones y subestaciones</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Factory className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold">Industrial</div>
                <div className="text-sm text-muted-foreground">Naves, galpones y montajes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <ProjectsGrid initialProjects={initialProjects} />

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[oklch(0.15_0.02_240)]" />
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${images.blueprint})` }}
          />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance">
              Tiene un Proyecto en{" "}
              <span className="text-accent">Mente</span>?
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Cuentenos sobre su proyecto y descubra como podemos ayudarlo a convertirlo 
              en realidad con nuestra experiencia y compromiso.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/contacto">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">
                  Solicitar Cotizacion
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/calculadora">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white/30 hover:bg-white hover:text-primary"
                >
                  Calcular Presupuesto
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
