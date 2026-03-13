"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroCarousel } from "@/components/hero-carousel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Award,
  Users,
  Target,
  Heart,
  Shield,
  TrendingUp,
  CheckCircle2,
  Building2,
  Lightbulb,
  Handshake,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { images } from "@/lib/images"
import type { NosotrosData } from "@/app/actions/db/nosotros"

const heroImages = [
  { src: images.heroNosotros[0], alt: "Equipo CRONEC" },
  { src: images.heroNosotros[1], alt: "Nosotros CRONEC" },
  { src: images.heroNosotros[2], alt: "Trabajo en equipo CRONEC" },
]

const statIcons = [Award, Building2, Users, TrendingUp]
const valueIcons = [Shield, Heart, Users, Lightbulb, Target, Handshake]

const defaultStats = [
  { value: "15+", label: "Años de Experiencia" },
  { value: "500+", label: "Proyectos Completados" },
  { value: "50+", label: "Profesionales" },
  { value: "98%", label: "Satisfacción del Cliente" },
]

const defaultMission =
  "Proveer soluciones integrales en Obras Públicas, saneamiento, infraestructura y Obras Eléctricas en general, manteniendo los más altos estándares de calidad y seguridad. Contamos con personal permanentemente capacitado y asesores especializados en Medio Ambiente, Higiene y Seguridad Industrial, profesionales en ingeniería, arquitectura, geología, topografía, y sistemas."

const defaultVision =
  "Consolidarnos como la empresa líder en infraestructura del noroeste argentino, reconocida por nuestra capacidad técnica multidisciplinaria, compromiso con la capacitación continua de nuestro personal, y la excelencia en cada proyecto que emprendemos."

export function NosotrosPageContent({
  data,
  mission,
  vision,
}: {
  data: NosotrosData
  mission?: string | null
  vision?: string | null
}) {
  const hero = data?.hero ?? {}
  const stats = (data?.stats?.length ? data.stats : defaultStats).slice(0, 4)
  const historySection = data?.historySection ?? { title: "Nuestra Historia", subtitle: "Desde 2009, CRONEC SRL mantiene su compromiso con la excelencia en construcción y servicios técnicos." }
  const timeline = data?.timeline?.length ? data.timeline : []
  const valuesSection = data?.valuesSection ?? { title: "Nuestros Valores", subtitle: "Los principios que guían cada decisión y acción en nuestra organización." }
  const values = data?.values?.length ? data.values : []
  const teamSection = data?.teamSection ?? { title: "Equipo Directivo", subtitle: "Profesionales experimentados liderando cada área de nuestra organización." }
  const team = data?.team?.length ? data.team : []
  const certSection = data?.certSection ?? { title: "Certificaciones y Reconocimientos", subtitle: "Comprometidos con los más altos estándares internacionales de calidad y seguridad." }
  const certifications = data?.certifications?.length ? data.certifications : []
  const cta = data?.cta ?? { title: "Construyamos Juntos el Futuro", paragraph: "Únase a los cientos de clientes que confían en CRONEC SRL para sus proyectos más importantes." }

  const missionText = (mission && String(mission).trim()) || defaultMission
  const visionText = (vision && String(vision).trim()) || defaultVision

  const displayValues = values.length >= 6 ? values : [
    { title: "Compromiso con la Calidad", description: "Mantenemos los más altos estándares en cada proyecto, garantizando resultados excepcionales y duraderos." },
    { title: "Integridad y Transparencia", description: "Actuamos con honestidad y transparencia en todas nuestras relaciones comerciales y profesionales." },
    { title: "Trabajo en Equipo", description: "Fomentamos la colaboración y el respeto mutuo entre nuestro personal y colaboradores." },
    { title: "Innovación Constante", description: "Incorporamos las últimas tecnologías y metodologías para optimizar nuestros procesos." },
    { title: "Orientación a Resultados", description: "Enfocamos nuestros esfuerzos en cumplir y superar las expectativas de nuestros clientes." },
    { title: "Responsabilidad Social", description: "Contribuimos al desarrollo sostenible de las comunidades donde operamos." },
  ]

  const displayTimeline = timeline.length >= 1 ? timeline : [
    { year: "2009", title: "Fundación de CRONEC SRL", description: "Iniciamos operaciones como empresa Salteña dedicada a Obras Públicas y Eléctricas en general." },
    { year: "2024", title: "15 Años de Trayectoria", description: "Celebramos 15 años de compromiso con la calidad y excelencia en cada proyecto." },
  ]

  const displayTeam = team.length >= 1 ? team : [
    { name: "Tomas Zamorano", position: "Socio Gerente", description: "Liderazgo estratégico y dirección general de la empresa." },
    { name: "Cr. Carlos Zamorano", position: "Socio Apoderado", description: "Gestión administrativa y representación legal de la empresa." },
  ]

  const displayCerts = certifications.length >= 1 ? certifications : [
    { title: "ISO 9001:2015", description: "Sistema de Gestión de Calidad" },
    { title: "ISO 14001:2015", description: "Gestión Ambiental" },
    { title: "ISO 45001:2018", description: "Seguridad y Salud Ocupacional" },
    { title: "IRAM 3800", description: "Gestión de Seguridad e Higiene" },
  ]

  return (
    <>
      <Header />
      <main>
        <HeroCarousel
          images={heroImages}
          badge={hero.badge ?? "Sobre CRONEC SRL"}
          title={hero.title ?? "Construyendo el Futuro desde 2009"}
          subtitle={hero.subtitle ?? "15+ años de experiencia nos respaldan como especialistas en construcción civil, instalaciones eléctricas e infraestructura industrial en el noroeste argentino."}
          primaryAction={{ label: "Conozca Nuestra Historia", href: "#historia" }}
          secondaryAction={{ label: "Ver Proyectos", href: "/proyectos" }}
        />

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = statIcons[index] ?? Award
                return (
                  <div key={index} className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="historia" className="py-20 md:py-28 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
                {historySection.title === "Nuestra Historia" ? <>Nuestra <span className="text-primary">Historia</span></> : (historySection.title ?? "Nuestra Historia")}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">{historySection.subtitle}</p>
            </div>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />
              <div className="space-y-12">
                {displayTimeline.map((item, index) => (
                  <div key={index} className="relative flex gap-8 items-start">
                    <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0 relative z-10">
                      {item.year.slice(-2)}
                    </div>
                    <Card className="flex-1">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary">{item.year}</Badge>
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base leading-relaxed">{item.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-3xl">Nuestra Misión</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{missionText}</CardDescription>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                    <Lightbulb className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-3xl">Nuestra Visión</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{visionText}</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
                {valuesSection.title?.includes("Valores") ? <>Nuestros <span className="text-primary">Valores</span></> : valuesSection.title}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">{valuesSection.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {displayValues.slice(0, 6).map((value, index) => {
                const Icon = valueIcons[index] ?? Shield
                return (
                  <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mx-auto mb-4">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">{value.description}</CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
                {teamSection.title?.includes("Directivo") ? <>Equipo <span className="text-primary">Directivo</span></> : teamSection.title}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">{teamSection.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {displayTeam.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 mx-auto mb-4 flex items-center justify-center text-primary-foreground text-xl font-bold">
                      {member.name.split(" ").slice(-1)[0].substring(0, 2).toUpperCase()}
                    </div>
                    <CardTitle className="text-base">{member.name}</CardTitle>
                    <Badge variant="secondary" className="mx-auto text-xs">{member.position}</Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">{member.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
                {certSection.title?.includes("Reconocimientos") ? <>Certificaciones y <span className="text-primary">Reconocimientos</span></> : certSection.title}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">{certSection.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {displayCerts.map((cert, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mx-auto mb-3">
                      <Award className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-lg">{cert.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{cert.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">{cta.title}</h2>
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed text-pretty">{cta.paragraph}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/contacto">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Contáctenos
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/proyectos">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
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
