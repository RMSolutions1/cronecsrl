"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface HeroCarouselProps {
  images: {
    src: string
    alt: string
  }[]
  interval?: number
  children?: React.ReactNode
  overlay?: "light" | "dark" | "gradient"
  className?: string
  currentIndex?: number
  onSlideChange?: (index: number) => void
  /** Contenido opcional: badge, título, subtítulo y botones (cuando no se usan children) */
  badge?: string
  title?: string
  subtitle?: string
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
}

export function HeroCarousel({ 
  images, 
  interval = 5000, 
  children,
  overlay = "gradient",
  className,
  currentIndex: controlledIndex,
  onSlideChange,
  badge,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
}: HeroCarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const isControlled = controlledIndex !== undefined && onSlideChange !== undefined
  const currentIndex = isControlled ? controlledIndex : internalIndex
  const setCurrentIndex = isControlled ? onSlideChange : setInternalIndex

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 700)
  }, [isTransitioning, setCurrentIndex])

  const goToNext = useCallback(() => {
    goToSlide((currentIndex + 1) % images.length)
  }, [currentIndex, images.length, goToSlide])

  const goToPrev = useCallback(() => {
    goToSlide((currentIndex - 1 + images.length) % images.length)
  }, [currentIndex, images.length, goToSlide])

  useEffect(() => {
    const timer = setInterval(goToNext, interval)
    return () => clearInterval(timer)
  }, [goToNext, interval])

  const overlayClasses = {
    light: "bg-white/30",
    dark: "bg-black/50",
    gradient: "bg-gradient-to-br from-[oklch(0.15_0.02_240)]/95 via-[oklch(0.20_0.03_240)]/85 to-[oklch(0.15_0.02_240)]/80"
  }

  return (
    <section className={cn("relative min-h-screen flex items-center justify-center overflow-hidden", className)}>
      {/* Background images */}
      {images.map((image, index) => (
        <div
          key={image.src}
          className={cn(
            "absolute inset-0 z-0 transition-opacity duration-700",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
            quality={85}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className={cn("absolute inset-0 z-[1]", overlayClasses[overlay])} />

      {/* Grid pattern */}
      <div className="absolute inset-0 z-[2] opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} 
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        {children ?? (badge != null || title != null || subtitle != null ? (
          <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-32 pb-20">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {badge != null && badge !== "" && (
                <Badge className="bg-accent/20 text-accent border-accent/30">{badge}</Badge>
              )}
              {title != null && title !== "" && (
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white text-balance">{title}</h1>
              )}
              {subtitle != null && subtitle !== "" && (
                <p className="text-lg md:text-xl text-white/80 leading-relaxed text-pretty max-w-2xl mx-auto">{subtitle}</p>
              )}
              {(primaryAction != null || secondaryAction != null) && (
                <div className="flex flex-wrap gap-4 justify-center pt-4">
                  {primaryAction != null && (
                    <Link href={primaryAction.href}>
                      <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        {primaryAction.label}
                      </Button>
                    </Link>
                  )}
                  {secondaryAction != null && (
                    <Link href={secondaryAction.href}>
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary bg-transparent">
                        {secondaryAction.label}
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null)}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="h-6 w-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
        aria-label="Imagen siguiente"
      >
        <ChevronRight className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentIndex 
                ? "w-8 bg-accent" 
                : "bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[5]" />
    </section>
  )
}
