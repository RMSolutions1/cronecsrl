"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeroCarousel } from "@/components/hero-carousel"
import { AnimatedCounter } from "@/components/animated-counter"
import {
  Building2,
  Zap,
  Factory,
  Ruler,
  Wrench,
  HardHat,
  CheckCircle2,
  ArrowRight,
  Users,
  Award,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { images } from "@/lib/images"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  HardHat,
  Zap,
  Ruler,
  Factory,
  Building2,
  Wrench,
}
const colors = ["text-green-600", "text-amber-600", "text-primary", "text-orange-600", "text-blue-600", "text-red-600", "text-slate-600", "text-indigo-600"]
const bgColors = ["bg-green-50", "bg-amber-50", "bg-primary/10", "bg-orange-50", "bg-blue-50", "bg-red-50", "bg-slate-50", "bg-indigo-50"]

const heroImages = [
  { src: images.heroServicios[0], alt: "Equipo de ingenieros CRONEC" },
  { src: images.heroServicios[1], alt: "Construcción de estructura metálica CRONEC" },
  { src: images.heroServicios[2], alt: "Obra civil en construcción CRONEC" },
]

const defaultServiceImages: Record<string, string> = {
  "obras-civiles": images.services.obrasCiviles,
  "obras-electricas": images.services.obrasElectricas,
  "arquitectura-ingenieria": images.services.arquitectura,
  "instalaciones-industriales": images.services.instalacionesIndustriales,
  "obras-generales": images.services.obrasGenerales,
  "servicios-especiales": images.services.serviciosEspeciales,
}

export type ServiceFromDb = {
  id: string
  title: string
  slug: string
  description?: string | null
  short_description?: string | null
  image_url?: string | null
  icon?: string | null
  features?: string[] | null
  benefits?: string[] | null
  projects?: string | null
  display_order?: number
}

const stats = [
  { icon: Award, value: 15, suffix: "+", label: "Anos de Experiencia" },
  { icon: Users, value: 500, suffix: "+", label: "Proyectos Completados" },
  { icon: TrendingUp, value: 98, suffix: "%", label: "Satisfaccion del Cliente" },
]

const defaultServicesDetail = [
  { id: "obras-civiles", icon: HardHat, title: "Obras Civiles", href: "/servicios/obras-civiles", description: "Especialistas en refaccion y mantenimiento de instalaciones civiles.", projects: "180+", color: "text-green-600", bgColor: "bg-green-50", image: images.services.obrasCiviles, features: ["Refacción de baños", "Impermeabilizacion", "Albanileria general"], benefits: ["Materiales de primera calidad", "Garantia en trabajos"], },
  { id: "obras-electricas", icon: Zap, title: "Obras Electricas", href: "/servicios/obras-electricas", description: "Instalaciones eléctricas de baja, media y alta tensión.", projects: "160+", color: "text-amber-600", bgColor: "bg-amber-50", image: images.services.obrasElectricas, features: ["Baja y media tension", "Subestaciones"], benefits: ["Ingenieros matriculados", "Normativas AEA"], },
  { id: "arquitectura-ingenieria", icon: Ruler, title: "Arquitectura e Ingenieria", href: "/servicios/arquitectura-ingenieria", description: "Proyecto, dirección y construcción de obras civiles.", projects: "150+", color: "text-primary", bgColor: "bg-primary/10", image: images.services.arquitectura, features: ["Proyecto y dirección", "Mantenimiento"], benefits: ["Arquitectos e ingenieros matriculados"], },
  { id: "instalaciones-industriales", icon: Factory, title: "Instalaciones Industriales", href: "/servicios/instalaciones-industriales", description: "Naves industriales, galpones y montaje electromecanico.", projects: "120+", color: "text-orange-600", bgColor: "bg-orange-50", image: images.services.instalacionesIndustriales, features: ["Naves industriales", "Montajes"], benefits: ["Diseno optimizado"], },
  { id: "obras-generales", icon: Building2, title: "Obras Generales", href: "/servicios/obras-generales", description: "Renovacion y mantenimiento de infraestructura ferroviaria.", projects: "200+", color: "text-blue-600", bgColor: "bg-blue-50", image: images.services.obrasGenerales, features: ["Alambrados", "Obras publicas"], benefits: ["15+ años de experiencia"], },
  { id: "servicios-especiales", icon: Wrench, title: "Servicios Especiales", href: "/servicios/servicios-especiales", description: "Reparacion y mantenimiento de infraestructura critica.", projects: "140+", color: "text-red-600", bgColor: "bg-red-50", image: images.services.serviciosEspeciales, features: ["Puentes metalicos", "Estribos"], benefits: ["Estructuras metalicas"], },
]

export function ServiciosPageContent({ servicesFromDb = [] }: { servicesFromDb?: ServiceFromDb[] }) {
  const servicesDetail =
    servicesFromDb.length > 0
      ? servicesFromDb.map((s, i) => {
          const slug = (s.slug ?? "").toLowerCase()
          const Icon = iconMap[s.icon ?? "Building2"] ?? Building2
          return {
            id: slug,
            icon: Icon,
            title: s.title,
            href: `/servicios/${slug}`,
            description: s.description || s.short_description || "",
            projects: s.projects || "—",
            color: colors[i % colors.length],
            bgColor: bgColors[i % bgColors.length],
            image: (s.image_url && s.image_url.trim()) ? s.image_url : (defaultServiceImages[slug] ?? images.services.obrasCiviles),
            features: Array.isArray(s.features) ? s.features : [],
            benefits: Array.isArray(s.benefits) ? s.benefits : [],
          }
        })
      : defaultServicesDetail

  return (
    <>
      <Header />
      <main>
        <HeroCarousel images={heroImages} interval={5000}>
          <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-32 pb-20">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge className="bg-accent/20 text-accent border-accent/30">Servicios Integrales</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white text-balance">
                Soluciones Completas para Su <span className="text-accent">Proyecto</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed text-pretty max-w-2xl mx-auto">
                Empresa Salteña dedicada a Obras Publicas, obras de saneamiento, infraestructura y Obras Electricas en general. 15+ años de experiencia desde 2009.
              </p>
            </div>
          </div>
        </HeroCarousel>

        <section className="py-12 bg-background border-b">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="flex items-center justify-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {servicesDetail.length > 0 ? (
          <section className="py-20 md:py-28 bg-background">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <div className="space-y-20">
                {servicesDetail.map((service, index) => {
                  const Icon = service.icon
                  const isEven = index % 2 === 0
                  return (
                    <div key={service.id} id={service.id} className="scroll-mt-20">
                      <Card className="overflow-hidden border-2">
                        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${isEven ? "" : "lg:flex-row-reverse"}`}>
                          <div className={`p-8 md:p-12 ${isEven ? "" : "lg:order-2"}`}>
                            <CardHeader className="p-0 mb-6">
                              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${service.bgColor}`}>
                                <Icon className={`h-8 w-8 ${service.color}`} />
                              </div>
                              <CardTitle className="text-3xl font-bold">{service.title}</CardTitle>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary">{service.projects} Proyectos</Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-0 space-y-6">
                              <CardDescription className="text-base leading-relaxed">{service.description}</CardDescription>
                              {service.features.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-lg mb-3">Servicios Incluidos:</h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {service.features.map((feature, idx) => (
                                      <div key={idx} className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                        <span className="text-sm">{feature}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {service.benefits.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-lg mb-3">Beneficios Clave:</h4>
                                  <ul className="space-y-2">
                                    {service.benefits.map((benefit, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                                        <span>{benefit}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              <div className="flex flex-col sm:flex-row gap-3">
                                <Link href={service.href}>
                                  <Button variant="outline" className="w-full sm:w-auto">
                                    Ver Detalles
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link href="/contacto">
                                  <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                                    Solicitar Cotizacion
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </div>
                          <div className={`relative min-h-[400px] bg-muted overflow-hidden ${isEven ? "" : "lg:order-1"}`}>
                            <Image
                              src={service.image || "/placeholder.svg"}
                              alt={`Servicio de ${service.title} - CRONEC SRL Salta`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                              unoptimized={typeof service.image === "string" && service.image.startsWith("/")}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-primary/20 to-transparent" />
                            <div className={`absolute bottom-6 left-6 flex items-center justify-center w-14 h-14 rounded-xl ${service.bgColor} shadow-lg`}>
                              <Icon className={`h-7 w-7 ${service.color}`} />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )
                })}
            </div>
          </div>
        </section>
        ) : null}

        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-[oklch(0.15_0.02_240)]" />
          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance">
                Listo para Iniciar Su <span className="text-accent">Proyecto</span>?
              </h2>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed text-pretty">
                Nuestro equipo de expertos esta preparado para asesorarlo y desarrollar la solucion perfecta para sus necesidades.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/contacto">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">
                    Contactar Ahora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/proyectos">
                  <Button size="lg" variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white hover:text-primary">
                    Ver Proyectos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
