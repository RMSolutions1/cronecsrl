"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Award, ChevronDown } from "lucide-react"
import Link from "next/link"
import { AnimatedCounter } from "@/components/animated-counter"
import { HeroCarousel } from "@/components/hero-carousel"
import { useEffect, useState } from "react"
import { images } from "@/lib/images"
import { useSettings } from "@/lib/settings-context"

const defaultSlides = [
  { src: images.hero[0], alt: "Obra de construcción con grúa - CRONEC", title: "Construimos el Futuro de Salta", paragraph: "Especialistas en construcción civil, instalaciones eléctricas e infraestructura industrial. Calidad certificada y compromiso con cada proyecto." },
  { src: images.hero[1], alt: "Proyecto de ingeniería civil - CRONEC", title: "Obras civiles e infraestructura que transforman la región", paragraph: "Puentes, vialidad y edificaciones con los más altos estándares de seguridad y durabilidad. Más de 15 años ejecutando proyectos en Salta y el NOA." },
  { src: images.hero[2], alt: "Instalaciones industriales - CRONEC", title: "Instalaciones eléctricas y soluciones industriales", paragraph: "Desde baja tensión hasta subestaciones y redes. Ingenieros matriculados y equipamiento certificado para cada tipo de proyecto." },
]

/** Imágenes del hero desde admin (hero-images por página). Si se pasan, se usan para el carrusel. */
export type HeroImageFromDb = { src: string; alt: string }

/** Estadísticas del hero "Nuestros números". Si se pasan, se editan desde Admin > Secciones de Inicio. */
export type HeroStat = { value: number; suffix: string; label: string }

const defaultHeroStats: HeroStat[] = [
  { value: 15, suffix: "+", label: "Años de experiencia" },
  { value: 500, suffix: "+", label: "Proyectos Completados" },
  { value: 150, suffix: "+", label: "Clientes Satisfechos" },
  { value: 50, suffix: "+", label: "Profesionales" },
]

function formatTitle(text: string) {
  const parts = text.split(/(Futuro|infraestructura|eléctricas)/i)
  return (
    <>
      {parts.map((p, i) => {
        if (/^(Futuro|infraestructura|eléctricas)$/i.test(p)) return <span key={i} className="text-accent">{p}</span>
        return <span key={i}>{p}</span>
      })}
    </>
  )
}

export function HeroSection({
  heroSlidesFromSettings,
  heroImagesFromDb,
  heroStats: heroStatsFromProps,
}: {
  heroSlidesFromSettings?: { title: string; paragraph: string }[]
  heroImagesFromDb?: HeroImageFromDb[]
  /** Números del bloque "Nuestros números". Se editan en Admin > Secciones de Inicio > Por qué CRONEC > Estadísticas. */
  heroStats?: HeroStat[]
}) {
  const settings = useSettings()
  const heroBadge = (settings?.hero_badge as string) || "Desde 2009 - Más de 15 años de excelencia"
  const ctaVerProyectos = (settings?.site_cta_ver_proyectos as string) || "Ver Proyectos"
  const ctaSolicitarCotizacion = (settings?.site_cta_solicitar_cotizacion as string) || "Solicitar Cotización"
  const scrollLabel = (settings?.site_hero_scroll_label as string) || "Descubrir"
  const heroStats = (heroStatsFromProps?.length ? heroStatsFromProps : defaultHeroStats) as HeroStat[]
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const baseSlides =
    heroImagesFromDb && heroImagesFromDb.length >= 1
      ? heroImagesFromDb.map((img, i) => ({
          src: img.src,
          alt: img.alt,
          title: defaultSlides[i]?.title ?? "",
          paragraph: defaultSlides[i]?.paragraph ?? "",
        }))
      : defaultSlides

  const heroSlides =
    heroSlidesFromSettings && heroSlidesFromSettings.length >= 3
      ? baseSlides.map((s, i) => ({
          ...s,
          title: heroSlidesFromSettings[i]?.title ?? s.title,
          paragraph: heroSlidesFromSettings[i]?.paragraph ?? s.paragraph,
        }))
      : baseSlides

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const slide = heroSlides[currentIndex]
  const imagesForCarousel = heroSlides.map((s) => ({ src: s.src, alt: s.alt }))

  return (
    <HeroCarousel
      images={imagesForCarousel}
      interval={6000}
      currentIndex={currentIndex}
      onSlideChange={setCurrentIndex}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Left content - cambia con cada slide */}
            <div className="lg:col-span-3 space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div 
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                <Award className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-white">{heroBadge}</span>
              </div>

              <h1 
                key={`title-${currentIndex}`}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] text-white animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
              >
                {typeof slide.title === "string" ? formatTitle(slide.title) : slide.title}
              </h1>

              <p 
                key={`para-${currentIndex}`}
                className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both delay-150"
              >
                {slide.paragraph}
              </p>

              {/* CTAs */}
              <div 
                className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                <Link href="/proyectos">
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 shadow-xl hover:shadow-accent/25 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {ctaVerProyectos}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contacto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/30 text-white hover:bg-white hover:text-primary font-semibold px-8 bg-white/5 backdrop-blur-sm"
                  >
                    {ctaSolicitarCotizacion}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right stats card */}
            <div 
              className={`lg:col-span-2 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-6">Nuestros números</h3>
                <div className="space-y-6">
                  {heroStats.slice(0, 4).map((stat, i) => (
                    <div
                      key={i}
                      className={i < 3 ? "flex items-center justify-between border-b border-white/10 pb-4" : "flex items-center justify-between"}
                    >
                      <span className="text-white/70">{stat.label}</span>
                      <span className="text-3xl font-bold text-accent">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Trust badges */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-xs text-white/50 mb-3">Certificaciones</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                      <span className="text-xs font-medium text-white">ISO 9001</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                      <span className="text-xs font-medium text-white">ISO 14001</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                      <span className="text-xs font-medium text-white">ISO 45001</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <a href="#servicios" className="flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors">
          <span className="text-xs uppercase tracking-widest">{scrollLabel}</span>
          <ChevronDown className="h-5 w-5" />
        </a>
      </div>
    </HeroCarousel>
  )
}
