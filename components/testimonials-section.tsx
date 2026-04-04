"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { images } from "@/lib/images"

export type TestimonialFromDb = {
  id: string
  client_name: string
  client_company?: string | null
  client_position?: string | null
  content: string
  avatar_url?: string | null
}

const defaultTestimonials = [
  { quote: "CRONEC SRL superó nuestras expectativas en cada aspecto del proyecto. Su profesionalismo y compromiso con los plazos fueron excepcionales.", author: "María González", position: "Directora de Infraestructura", company: "Gobierno de Salta", image: images.testimonials[0] },
  { quote: "La experiencia técnica del equipo de Cronec fue fundamental para completar nuestra planta industrial a tiempo y dentro del presupuesto.", author: "Carlos Fernández", position: "Gerente General", company: "Industrias del Norte SA", image: images.testimonials[1] },
  { quote: "Trabajar con Cronec nos dio la tranquilidad de saber que nuestro proyecto estaba en manos expertas. Excelente gestión de seguridad.", author: "Ana Martínez", position: "Coordinadora de Proyectos", company: "Desarrollo Urbano Salta", image: images.testimonials[2] },
]

export function TestimonialsSection({ testimonialsFromDb = [] }: { testimonialsFromDb?: TestimonialFromDb[] }) {
  const testimonials =
    testimonialsFromDb.length > 0
      ? testimonialsFromDb.map((t) => ({
          quote: t.content,
          author: t.client_name,
          position: t.client_position ?? "",
          company: t.client_company ?? "",
          image: t.avatar_url || images.testimonials[0],
        }))
      : defaultTestimonials

  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const len = testimonials.length
    if (len === 0) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % len)
    }, 6000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <section
      className="py-24 md:py-32 bg-primary text-primary-foreground relative overflow-hidden"
      aria-labelledby="testimonials-heading"
      aria-live="polite"
    >
      {/* Decorative quote marks */}
      <div className="absolute top-10 left-10 opacity-10" aria-hidden="true">
        <Quote className="h-32 w-32" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10 rotate-180" aria-hidden="true">
        <Quote className="h-32 w-32" />
      </div>

      <div className="container relative mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance"
          >
            Lo Que Dicen Nuestros <span className="text-accent">Clientes</span>
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed text-pretty">
            La confianza de nuestros clientes es nuestro mayor logro.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20">
            <CardContent className="p-8 md:p-12">
              <div className="space-y-8">
                {/* Quote */}
                <div className="relative">
                  <Quote className="absolute -top-4 -left-2 h-12 w-12 text-accent opacity-50" aria-hidden="true" />
                  <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-primary-foreground relative z-10 pl-8">
                    {testimonials[currentIndex].quote}
                  </blockquote>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-primary-foreground/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={typeof testimonials[currentIndex].image === "string" ? testimonials[currentIndex].image : "/placeholder.svg"}
                    alt={`${testimonials[currentIndex].author}, ${testimonials[currentIndex].company}`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-accent"
                  />
                  <div>
                    <cite className="not-italic font-semibold text-lg text-primary-foreground">
                      {testimonials[currentIndex].author}
                    </cite>
                    <div className="text-sm text-primary-foreground/70">{testimonials[currentIndex].position}</div>
                    <div className="text-sm text-accent font-medium">{testimonials[currentIndex].company}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <nav className="flex items-center justify-center gap-4 mt-8" aria-label="Navegación de testimonios">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              aria-label="Testimonio anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2" role="tablist" aria-label="Seleccionar testimonio">
              {testimonials.map((testimonial, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-accent w-8" : "bg-primary-foreground/30 hover:bg-primary-foreground/50"
                  }`}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`Ver testimonio de ${testimonial.author}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </div>
    </section>
  )
}
