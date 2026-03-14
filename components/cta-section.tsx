"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Send, ArrowRight, Clock } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { images } from "@/lib/images"
import { useSettings } from "@/lib/settings-context"

export function CTASection() {
  const s = useSettings()
  const badge = (s?.site_cta_contactenos as string) || (s?.cta_badge as string) || "Contáctenos"
  const ctaTitle = (s?.cta_title as string) || "Hagamos Realidad su Proyecto"
  const ctaParagraph = (s?.cta_paragraph as string) || "Estamos listos para transformar su visión en realidad. Solicite una cotización sin compromiso y descubra cómo podemos ayudarlo."
  const phone = (s?.phone as string) || "+54 9 387 536-1210"
  const email = (s?.email as string) || "cronec@cronecsrl.com.ar"
  const address = (s?.address as string) || "Santa Fe 548 PB \"B\", Salta"
  const horario = (s?.horario as string) || "Lun - Vie: 8:00 - 18:00"

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.name,
          email: formData.email,
          telefono: formData.phone,
          empresa: "",
          servicio: "Consulta desde inicio",
          mensaje: formData.message,
        }),
      })
      const result = await res.json().catch(() => ({}))
      if (res.ok && result.success) {
        toast.success("Mensaje enviado correctamente", {
          description: "Nos pondremos en contacto pronto."
        })
        setFormData({ name: "", email: "", phone: "", message: "" })
      } else {
        toast.error("Error al enviar", { description: result.message ?? "Intente nuevamente." })
      }
    } catch {
      toast.error("Error de conexión", { description: "Intente más tarde o contáctenos por teléfono." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[oklch(0.15_0.02_240)]" />
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${images.ctaBackground}')` }}
        />
      </div>

      <div className="container relative mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: CTA Content */}
          <div className="space-y-8 text-white">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent text-sm font-medium rounded-full">
                {badge}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
                {ctaTitle.split(" ").map((word, i, arr) =>
                  i === arr.length - 1 && word.length > 0 ? (
                    <span key={i} className="text-accent">{word}</span>
                  ) : (
                    <span key={i}>{word}{" "}</span>
                  )
                )}
              </h2>
              <p className="text-lg text-white/80 leading-relaxed max-w-lg">
                {ctaParagraph}
              </p>
            </div>

            {/* Contact cards */}
            <div className="space-y-4">
              <a 
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent text-accent-foreground">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-white/60">Teléfono</div>
                  <div className="text-lg font-semibold group-hover:text-accent transition-colors">{phone}</div>
                </div>
                <ArrowRight className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              <a 
                href={`mailto:${email}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent text-accent-foreground">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-white/60">Email</div>
                  <div className="text-lg font-semibold group-hover:text-accent transition-colors">{email}</div>
                </div>
                <ArrowRight className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent text-accent-foreground">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-white/60">Oficina</div>
                  <div className="text-lg font-semibold">{address}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent text-accent-foreground">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-white/60">Horario</div>
                  <div className="text-lg font-semibold">{horario}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-card text-card-foreground rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">Solicite una cotización</h3>
            <p className="text-muted-foreground mb-6">Complete el formulario y le responderemos en menos de 24 horas.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="cta-name" className="block text-sm font-medium mb-2">
                  Nombre Completo
                </label>
                <Input
                  id="cta-name"
                  type="text"
                  placeholder="Juan Perez"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-muted/50"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cta-email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="cta-email"
                    type="email"
                    placeholder="juan@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <label htmlFor="cta-phone" className="block text-sm font-medium mb-2">
                    Teléfono
                  </label>
                  <Input
                    id="cta-phone"
                    type="tel"
                    placeholder="+54 387 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="bg-muted/50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cta-message" className="block text-sm font-medium mb-2">
                  Cuéntenos sobre su proyecto
                </label>
                <Textarea
                  id="cta-message"
                  placeholder="Descripción del proyecto, ubicación, plazos estimados..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={4}
                  className="bg-muted/50 resize-none"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Consulta"}
                <Send className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Al enviar acepta nuestra{" "}
                <Link href="/politica-privacidad" className="underline hover:text-foreground">
                  política de privacidad
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
