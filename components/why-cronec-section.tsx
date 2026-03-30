"use client"

import { Award, Users, Clock, Shield, Wrench, TrendingUp, CheckCircle2 } from "lucide-react"
import { SectionWrapper } from "@/components/section-wrapper"
import { AnimatedCounter } from "@/components/animated-counter"
import Image from "next/image"
import { useState } from "react"
import { images } from "@/lib/images"

export type WhyCronecData = {
  title?: string
  subtitle?: string
  image_url?: string
  stats?: Array<{ value: number; suffix: string; label: string }>
  features?: Array<{ title: string; description: string }>
  highlights?: string[]
}

const defaultFeatures = [
  { icon: Award, title: "Experiencia Comprobada", description: "Más de 15 años liderando proyectos de infraestructura compleja en toda la región de Salta." },
  { icon: Users, title: "Equipo Profesional", description: "Ingenieros, arquitectos y técnicos certificados en todas las áreas de construcción." },
  { icon: Shield, title: "Certificaciones ISO", description: "Cumplimiento estricto de normativas de calidad, seguridad y medio ambiente." },
  { icon: Wrench, title: "Tecnología Moderna", description: "Maquinaria de última generación y metodologías constructivas innovadoras." },
  { icon: Clock, title: "Compromiso con Plazos", description: "Gestión eficiente de tiempos con planificación rigurosa de cada etapa." },
  { icon: TrendingUp, title: "Mejora Continua", description: "Innovación constante en procesos y técnicas constructivas." },
]
const defaultHighlights = ["Obras públicas y privadas", "Atención personalizada", "Presupuestos competitivos", "Garantía de calidad"]
const defaultStats = [
  { value: 15, suffix: "+", label: "Años" },
  { value: 500, suffix: "+", label: "Proyectos" },
  { value: 150, suffix: "+", label: "Clientes" },
  { value: 50, suffix: "+", label: "Equipo" },
]

// Imagen de respaldo robusta desde Unsplash (construccion profesional)
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop"

// Lista de imagenes posibles para usar
const IMAGE_OPTIONS = [
  "/conec4.jpeg",
  "/hero-construction-1.jpeg", 
  "/proyectos/proyecto-1.jpeg",
  FALLBACK_IMAGE
]

export function WhyCronecSection({ data }: { data?: WhyCronecData | null }) {
  const [imgIndex, setImgIndex] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)
  const title = data?.title ?? "Por qué elegir CRONEC"
  const subtitle = data?.subtitle ?? "Experiencia, profesionalismo y compromiso en cada proyecto."
  const stats = (data?.stats?.length ? data.stats : defaultStats) as Array<{ value: number; suffix: string; label: string }>
  const featuresFromData = data?.features ?? []
  const features = featuresFromData.length
    ? featuresFromData.slice(0, 6).map((f, i) => ({ ...defaultFeatures[i], ...f, icon: defaultFeatures[i]?.icon ?? Award }))
    : defaultFeatures
  const highlights = (data?.highlights?.length ? data.highlights : defaultHighlights) as string[]
  // Usar imagen configurada si existe, si no usar fallbacks
  const configuredImage = data?.image_url
  const whyImgSrc = configuredImage || IMAGE_OPTIONS[imgIndex] || FALLBACK_IMAGE

  return (
    <SectionWrapper className="py-24 md:py-32" background="default" animationType="fade-up">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-muted min-h-[300px]">
              {/* Placeholder mientras carga */}
              {!imgLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              )}
              <Image
                src={whyImgSrc}
                alt="CRONEC SRL - Servicios profesionales de construccion"
                width={600}
                height={500}
                className={`w-full h-auto object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImgLoaded(true)}
                onError={() => {
                  // Intentar la siguiente imagen en la lista
                  if (imgIndex < IMAGE_OPTIONS.length - 1) {
                    setImgIndex(imgIndex + 1)
                  } else {
                    setImgLoaded(true) // Ya probamos todas, mostrar lo que sea
                  }
                }}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-card rounded-2xl p-6 shadow-2xl border border-border max-w-[280px]">
              <div className="grid grid-cols-2 gap-4">
                {stats.slice(0, 4).map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full">Por qué elegirnos</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">{title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{subtitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {features.map((feature, index) => {
                const Icon = (feature as { icon?: React.ComponentType<{ className?: string }> }).icon ?? Award
                return (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
