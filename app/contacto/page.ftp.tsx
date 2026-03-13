"use client"

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroCarousel } from "@/components/hero-carousel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { images } from "@/lib/images"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Facebook, Instagram, Linkedin, AlertCircle } from "lucide-react"

const heroImages = [
  { src: images.heroContacto[0], alt: "Contacto CRONEC" },
  { src: images.heroContacto[1], alt: "Oficinas CRONEC" },
  { src: images.heroContacto[2], alt: "Construcción CRONEC" },
]

type ContactInfoItem = {
  icon: typeof Phone
  title: string
  details: string[]
  link: string | null
}

const defaultContactInfo: ContactInfoItem[] = [
  { icon: Phone, title: "Teléfono", details: ["+54 9 (387) 536-1210", "Disponible en horario de oficina"], link: "tel:+5493875361210" },
  { icon: Mail, title: "Email", details: ["cronec@cronecsrl.com.ar", "Respuesta en 24 horas"], link: "mailto:cronec@cronecsrl.com.ar" },
  { icon: MapPin, title: "Dirección", details: ['Santa Fe 548 PB "B"', "Salta Capital, Argentina (4400)"], link: "https://maps.google.com/?q=Santa+Fe+548,+Salta+Capital" },
  { icon: Clock, title: "Horario de Atención", details: ["Lunes a Viernes: 8:00 - 18:00"], link: null },
]

const defaultServices = [
  "Obras Civiles",
  "Obras Eléctricas",
  "Arquitectura e Ingeniería",
  "Instalaciones Industriales",
  "Obras Generales",
  "Servicios Especiales",
  "Mantenimiento de Infraestructura",
  "Otro",
]

export default function ContactoPageFtp() {
  const [formData, setFormData] = useState({ nombre: "", empresa: "", email: "", telefono: "", servicio: "", mensaje: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    const formspreeId = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "") : ""
    if (!formspreeId) {
      setSubmitStatus({ type: "error", message: "Formulario no configurado. Configure NEXT_PUBLIC_FORMSPREE_ID." })
      setIsSubmitting(false)
      return
    }
    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          empresa: formData.empresa,
          email: formData.email,
          telefono: formData.telefono,
          servicio: formData.servicio,
          mensaje: formData.mensaje,
        }),
      })
      const data = await res.json().catch(() => ({}))
      setIsSubmitting(false)
      if (res.ok && !data.error) {
        setSubmitStatus({ type: "success", message: "Gracias por contactarnos. Responderemos a la brevedad." })
        setFormData({ nombre: "", empresa: "", email: "", telefono: "", servicio: "", mensaje: "" })
        setTimeout(() => setSubmitStatus(null), 3000)
      } else {
        setSubmitStatus({ type: "error", message: data.error || "Error al enviar. Intente nuevamente." })
      }
    } catch {
      setIsSubmitting(false)
      setSubmitStatus({ type: "error", message: "Error de conexión. Intente más tarde." })
    }
  }

  return (
    <>
      <Header />
      <main>
        <HeroCarousel
          images={heroImages}
          badge="Contáctenos"
          title="Hablemos de Su Proyecto"
          subtitle="Estamos listos para asesorarlo. Comuníquese con nosotros."
          primaryAction={{ label: "Solicitar Cotización", href: "#formulario" }}
          secondaryAction={{ label: "Ver Ubicación", href: "#mapa" }}
        />
        <section className="py-16 bg-background border-b" aria-labelledby="contact-info-heading">
          <h2 id="contact-info-heading" className="sr-only">Información de contacto</h2>
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {defaultContactInfo.map((info, index) => {
                const Icon = info.icon
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mx-auto mb-3" aria-hidden="true">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{info.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {info.details.map((detail, idx) => (
                          <p key={idx}>
                            {info.link && idx === 0 ? (
                              <a href={info.link} className="hover:text-primary transition-colors">{detail}</a>
                            ) : (
                              detail
                            )}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
        <section className="py-20 md:py-28 bg-secondary/30" id="formulario">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Solicite una <span className="text-primary">Cotización</span></h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">Complete el formulario y nuestro equipo se comunicará con usted en menos de 24 horas.</p>
                </div>
                <Card className="border-2">
                  <CardContent className="pt-6">
                    {submitStatus?.type === "success" ? (
                      <div className="text-center py-12 space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto">
                          <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold">Mensaje Enviado</h3>
                        <p className="text-muted-foreground">{submitStatus.message}</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {submitStatus?.type === "error" && (
                          <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{submitStatus.message}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre Completo <span className="text-red-500">*</span></Label>
                            <Input id="nombre" name="nombre" type="text" placeholder="Juan Pérez" value={formData.nombre} onChange={(e) => handleChange("nombre", e.target.value)} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="empresa">Empresa</Label>
                            <Input id="empresa" name="empresa" type="text" placeholder="Mi Empresa SA" value={formData.empresa} onChange={(e) => handleChange("empresa", e.target.value)} />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                            <Input id="email" name="email" type="email" placeholder="ejemplo@email.com" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono <span className="text-red-500">*</span></Label>
                            <Input id="telefono" name="telefono" type="tel" placeholder="+54 387 123-4567" value={formData.telefono} onChange={(e) => handleChange("telefono", e.target.value)} required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="servicio">Servicio de Interés <span className="text-red-500">*</span></Label>
                          <Select name="servicio" value={formData.servicio} onValueChange={(value) => handleChange("servicio", value)} required>
                            <SelectTrigger id="servicio"><SelectValue placeholder="Seleccione un servicio" /></SelectTrigger>
                            <SelectContent>
                              {defaultServices.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mensaje">Mensaje <span className="text-red-500">*</span></Label>
                          <Textarea id="mensaje" name="mensaje" placeholder="Cuéntenos sobre su proyecto..." value={formData.mensaje} onChange={(e) => handleChange("mensaje", e.target.value)} rows={5} required />
                        </div>
                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? <>⏳ Enviando...</> : <>Enviar Mensaje <Send className="ml-2 h-5 w-5" /></>}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">Al enviar acepta nuestra política de privacidad.</p>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6" id="mapa">
                <Card className="overflow-hidden">
                  <div className="aspect-[4/3] bg-secondary relative">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.8642813844845!2d-65.41110892407795!3d-24.788892478101386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941bc3a70f1f1f1f%3A0x1f1f1f1f1f1f1f1f!2sSanta%20Fe%20548%2C%20A4400%20Salta!5e0!3m2!1ses-419!2sar!4v1699999999999!5m2!1ses-419!2sar" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ubicación CRONEC SRL" />
                  </div>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Información Adicional</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Emergencias 24/7</h3>
                      <a href="tel:+5493875361210" className="text-sm text-primary hover:underline">+54 9 (387) 536-1210</a>
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">Síguenos</h3>
                      <div className="flex gap-3">
                        <a href="#" className="inline-flex w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground items-center justify-center" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
                        <a href="#" className="inline-flex w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground items-center justify-center" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
                        <a href="#" className="inline-flex w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground items-center justify-center" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Preguntas <span className="text-primary">Frecuentes</span></h2>
              <p className="text-lg text-muted-foreground">Respuestas a las consultas más comunes.</p>
            </div>
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                { q: "¿Cuál es el tiempo de respuesta para una cotización?", a: "Nuestro equipo se comunica en menos de 24 horas hábiles." },
                { q: "¿Trabajan en toda la provincia de Salta?", a: "Sí, realizamos proyectos en Salta y el NOA." },
                { q: "¿Ofrecen garantías?", a: "Todos nuestros proyectos incluyen garantía según normativas vigentes." },
              ].map((faq, i) => (
                <Card key={i}>
                  <CardHeader><CardTitle className="text-lg">{faq.q}</CardTitle></CardHeader>
                  <CardContent><CardDescription className="text-base">{faq.a}</CardDescription></CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
