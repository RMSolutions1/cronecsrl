"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Zap, Factory, PencilRuler, Wrench, HardHat, ArrowRight, ArrowUpRight, Hammer, ShieldCheck, Settings, ClipboardList } from "lucide-react"
import Link from "next/link"
import { SectionWrapper } from "@/components/section-wrapper"
import { images, defaultServiceImages } from "@/lib/images"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Zap,
  Factory,
  Ruler: PencilRuler,
  PencilRuler,
  Wrench,
  HardHat,
  Hammer,
  ShieldCheck,
  Settings,
  ClipboardList,
}

// Todos los servicios con páginas propias
const staticServices = [
  { icon: HardHat, title: "Obras Civiles", description: "Construcción de edificios, viviendas, locales comerciales y obras de infraestructura general con los más altos estándares de calidad.", features: ["Edificios", "Viviendas", "Locales comerciales"], image: images.services.obrasCiviles },
  { icon: Zap, title: "Obras Eléctricas", description: "Instalaciones eléctricas de baja, media y alta tensión. Subestaciones transformadoras y sistemas de distribución eléctrica.", features: ["Media tensión", "Subestaciones", "Mantenimiento"], image: images.services.obrasElectricas },
  { icon: PencilRuler, title: "Arquitectura e Ingeniería", description: "Proyecto, dirección y construcción de obras civiles con asesoramiento técnico integral y profesional.", features: ["Proyectos", "Dirección", "Consultoría"], image: images.services.arquitectura },
  { icon: Factory, title: "Instalaciones Industriales", description: "Naves industriales, galpones y montajes electromecánicos para el sector industrial y productivo de la región.", features: ["Naves industriales", "Montajes", "Galpones"], image: images.services.instalacionesIndustriales },
  { icon: Hammer, title: "Obras Generales", description: "Renovación de alambrados, mantenimiento de infraestructura ferroviaria y obras públicas con altos estándares de calidad.", features: ["Infraestructura ferroviaria", "Alambrados", "Obras públicas"], image: images.services.obrasGenerales },
  { icon: ShieldCheck, title: "Servicios Especiales", description: "Reparación de estructuras metálicas, puentes, estribos y mantenimiento especializado de infraestructura crítica.", features: ["Puentes metálicos", "Estribos", "Mantenimiento"], image: images.services.serviciosEspeciales },
  { icon: Settings, title: "Mantenimiento", description: "Mantenimiento preventivo y correctivo de instalaciones, edificios e infraestructura industrial.", features: ["Preventivo", "Correctivo", "Inspecciones"], image: images.services.obrasGenerales },
  { icon: ClipboardList, title: "Consultoría", description: "Asesoramiento técnico, proyectos y dirección de obras. Consultoría en construcción e ingeniería.", features: ["Proyectos", "Dirección de obra", "Asesoramiento"], image: images.services.arquitectura },
]

export interface ServiceFromDb {
  id: string
  title: string
  slug?: string | null
  description?: string | null
  short_description?: string | null
  icon?: string | null
  image_url?: string | null
  features?: unknown
}

export function ServicesSection({ servicesFromDb = [] }: { servicesFromDb?: ServiceFromDb[] }) {
  const services =
    servicesFromDb.length > 0
      ? servicesFromDb.map((s) => {
          const slug = (s.slug ?? "").toLowerCase().replace(/\s+/g, "-")
          const features = Array.isArray(s.features) ? s.features as string[] : typeof s.features === "string" ? (() => { try { return JSON.parse(s.features) as string[] } catch { return [] } })() : []
          return {
            icon: iconMap[s.icon ?? "Building2"] ?? Building2,
            title: s.title,
            description: s.short_description || s.description || "",
            features: features.length ? features : ["Servicio integral"],
            image: (s.image_url && s.image_url.trim()) ? s.image_url : (defaultServiceImages[slug] ?? images.services.obrasCiviles),
          }
        })
      : staticServices

  return (
    <SectionWrapper 
      id="servicios" 
      className="py-24 md:py-32" 
      background="muted"
      animationType="fade-up"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
            Nuestros Servicios
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
            Soluciones Integrales de{" "}
            <span className="text-primary">Construcción</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Ofrecemos servicios completos desde el diseño hasta la entrega final, 
            con profesionales especializados en cada área.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <article 
                key={index} 
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-card">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent text-accent-foreground shadow-lg">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base leading-relaxed">
                      {service.description}
                    </CardDescription>
                    
                    {/* Features tags */}
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, i) => (
                        <span 
                          key={i}
                          className="px-2.5 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <Link href="/servicios" className="block pt-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between text-primary hover:bg-primary/5 p-0"
                      >
                        Ver mas detalles
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </article>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Link href="/servicios">
              <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg">
                Explorar Todos los Servicios
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/calculadora">
              <Button size="lg" variant="outline" className="border-2">
                Calcular Presupuesto
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
