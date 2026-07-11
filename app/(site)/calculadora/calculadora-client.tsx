"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { 
  Building2, Zap, Factory, HardHat, Calculator, 
  ArrowRight, ArrowLeft, CheckCircle2, Send, Phone, Info
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { images } from "@/lib/images"
import type { CalculadoraData } from "@/lib/data-read"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  civil: Building2,
  electrica: Zap,
  industrial: Factory,
  reforma: HardHat,
}

const defaultProjectTypes = [
  { id: "civil", label: "Obras Civiles", description: "Edificios, viviendas, locales", pricePerM2: 850 },
  { id: "electrica", label: "Obra Electrica", description: "Instalaciones eléctricas", pricePerM2: 450 },
  { id: "industrial", label: "Industrial", description: "Naves, galpones, plantas", pricePerM2: 650 },
  { id: "reforma", label: "Reforma/Refaccion", description: "Remodelaciones y mejoras", pricePerM2: 550 },
]
const defaultQualityLevels = [
  { id: "standard", label: "Estandar", multiplier: 1, description: "Materiales de buena calidad, terminaciones basicas" },
  { id: "premium", label: "Premium", multiplier: 1.35, description: "Materiales superiores, terminaciones de alta gama" },
  { id: "luxury", label: "Lujo", multiplier: 1.8, description: "Materiales exclusivos, diseño personalizado" },
]
const defaultUrgencyLevels = [
  { id: "normal", label: "Normal", multiplier: 1, days: "90-120 dias" },
  { id: "rapido", label: "Rapido", multiplier: 1.15, days: "60-90 dias" },
  { id: "urgente", label: "Urgente", multiplier: 1.3, days: "30-60 dias" },
]

export default function CalculadoraPageClient({ config }: { config: CalculadoraData | null }) {
  const projectTypes = (config?.projectTypes?.length ? config.projectTypes : defaultProjectTypes) as typeof defaultProjectTypes
  const qualityLevels = (config?.qualityLevels?.length ? config.qualityLevels : defaultQualityLevels) as typeof defaultQualityLevels
  const urgencyLevels = (config?.urgencyLevels?.length ? config.urgencyLevels : defaultUrgencyLevels) as typeof defaultUrgencyLevels
  const [step, setStep] = useState(1)
  const [projectType, setProjectType] = useState("")
  const [area, setArea] = useState([100])
  const [quality, setQuality] = useState("standard")
  const [urgency, setUrgency] = useState("normal")
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    details: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedType = projectTypes.find(t => t.id === projectType)
  const selectedQuality = qualityLevels.find(q => q.id === quality)
  const selectedUrgency = urgencyLevels.find(u => u.id === urgency)

  const calculateEstimate = () => {
    if (!selectedType || !selectedQuality || !selectedUrgency) return 0
    const basePrice = selectedType.pricePerM2 * area[0]
    return Math.round(basePrice * selectedQuality.multiplier * selectedUrgency.multiplier)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const serviceLabel = selectedType?.label ?? (projectType || "Cotización")
    const messageBody = [
      `Tipo: ${serviceLabel}`,
      `Área: ${area[0]} m²`,
      `Calidad: ${selectedQuality?.label ?? quality}`,
      `Urgencia: ${selectedUrgency?.label ?? urgency}`,
      `Estimación: $${estimate.toLocaleString("es-AR")}`,
      contactInfo.details ? `\nDetalles: ${contactInfo.details}` : "",
    ].join("\n")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: contactInfo.name,
          email: contactInfo.email,
          telefono: contactInfo.phone,
          empresa: "",
          servicio: `Cotización - ${serviceLabel}`,
          mensaje: messageBody,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.success) {
        toast.success("Solicitud enviada correctamente", {
          description: "Nos pondremos en contacto en las próximas 24 horas.",
        })
        setStep(5)
      } else {
        toast.error("Error al enviar", { description: data.message ?? "Intente nuevamente." })
      }
    } catch {
      toast.error("Error de conexión", { description: "Intente más tarde o contáctenos por teléfono." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const estimate = calculateEstimate()

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="relative pt-32 pb-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
            style={{ backgroundImage: `url(${images.ctaBackground})` }}
            aria-hidden
          />
          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <Badge className="bg-accent/10 text-accent border-accent/20">
                <Calculator className="h-3 w-3 mr-1" />
                Cotizador Online
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
                Calcule el Presupuesto de su{" "}
                <span className="text-primary">Proyecto</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Obtenga una estimacion rapida y gratuita en solo 4 pasos
              </p>
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-all",
                        step >= s ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-muted"
                      )}
                    >
                      {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                    </div>
                  ))}
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }} />
                </div>
              </div>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {step === 1 && "Tipo de Proyecto"}
                    {step === 2 && "Detalles del Proyecto"}
                    {step === 3 && "Su Presupuesto Estimado"}
                    {step === 4 && "Datos de Contacto"}
                    {step === 5 && "Solicitud Enviada"}
                  </CardTitle>
                  <CardDescription>
                    {step === 1 && "Seleccione el tipo de obra que necesita realizar"}
                    {step === 2 && "Configure las caracteristicas de su proyecto"}
                    {step === 3 && "Este es el presupuesto estimado para su proyecto"}
                    {step === 4 && "Complete sus datos para recibir una cotizacion detallada"}
                    {step === 5 && "Hemos recibido su solicitud correctamente"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {step === 1 && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {projectTypes.map((type) => {
                        const Icon = iconMap[type.id] ?? Building2
                        return (
                          <button
                            key={type.id}
                            onClick={() => setProjectType(type.id)}
                            className={cn(
                              "p-6 rounded-xl border-2 text-left transition-all hover:shadow-md",
                              projectType === type.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                            )}
                          >
                            <div className="flex items-start gap-4">
                              <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                projectType === type.id ? "bg-primary text-primary-foreground" : "bg-muted"
                              )}>
                                <Icon className="h-6 w-6" />
                              </div>
                              <div>
                                <div className="font-semibold">{type.label}</div>
                                <div className="text-sm text-muted-foreground">{type.description}</div>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <Label className="text-base font-semibold">Superficie aproximada: {area[0]} m2</Label>
                        <Slider value={area} onValueChange={setArea} min={20} max={1000} step={10} className="py-4" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>20 m2</span>
                          <span>1000 m2</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Label className="text-base font-semibold">Nivel de calidad</Label>
                        <RadioGroup value={quality} onValueChange={setQuality}>
                          {qualityLevels.map((level) => (
                            <div
                              key={level.id}
                              className={cn(
                                "flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                quality === level.id ? "border-primary bg-primary/5" : "border-border"
                              )}
                              onClick={() => setQuality(level.id)}
                            >
                              <RadioGroupItem value={level.id} id={level.id} />
                              <div className="flex-1">
                                <Label htmlFor={level.id} className="font-semibold cursor-pointer">{level.label}</Label>
                                <p className="text-sm text-muted-foreground">{level.description}</p>
                              </div>
                              {level.multiplier > 1 && <Badge variant="secondary">+{Math.round((level.multiplier - 1) * 100)}%</Badge>}
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      <div className="space-y-4">
                        <Label className="text-base font-semibold">Plazo de ejecucion</Label>
                        <RadioGroup value={urgency} onValueChange={setUrgency}>
                          {urgencyLevels.map((level) => (
                            <div
                              key={level.id}
                              className={cn(
                                "flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                urgency === level.id ? "border-primary bg-primary/5" : "border-border"
                              )}
                              onClick={() => setUrgency(level.id)}
                            >
                              <RadioGroupItem value={level.id} id={`urgency-${level.id}`} />
                              <div className="flex-1">
                                <Label htmlFor={`urgency-${level.id}`} className="font-semibold cursor-pointer">{level.label}</Label>
                                <p className="text-sm text-muted-foreground">{level.days}</p>
                              </div>
                              {level.multiplier > 1 && <Badge variant="secondary">+{Math.round((level.multiplier - 1) * 100)}%</Badge>}
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="text-center py-8 px-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border">
                        <div className="text-sm text-muted-foreground mb-2">Presupuesto estimado</div>
                        <div className="text-5xl md:text-6xl font-bold text-primary">${estimate.toLocaleString()}</div>
                        <div className="text-muted-foreground mt-2">USD aproximados</div>
                      </div>
                      <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Info className="h-4 w-4 text-primary" /> Resumen del proyecto
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between"><span className="text-muted-foreground">Tipo de obra:</span><span className="font-medium">{selectedType?.label}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Superficie:</span><span className="font-medium">{area[0]} m2</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Calidad:</span><span className="font-medium">{selectedQuality?.label}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Plazo:</span><span className="font-medium">{selectedUrgency?.days}</span></div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        Este es un presupuesto estimativo. Complete sus datos para recibir una cotizacion detallada y personalizada.
                      </p>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="calc-name">Nombre completo</Label>
                          <Input id="calc-name" value={contactInfo.name} onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })} placeholder="Juan Perez" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="calc-phone">Telefono</Label>
                          <Input id="calc-phone" type="tel" value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} placeholder="+54 387 123-4567" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="calc-email">Email</Label>
                        <Input id="calc-email" type="email" value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} placeholder="juan@empresa.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="calc-details">Detalles adicionales (opcional)</Label>
                        <Textarea id="calc-details" value={contactInfo.details} onChange={(e) => setContactInfo({ ...contactInfo, details: e.target.value })} placeholder="Cuentenos mas sobre su proyecto..." rows={4} />
                      </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="text-center py-8 space-y-6">
                      <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Gracias por su solicitud</h3>
                        <p className="text-muted-foreground">
                          Un asesor se pondra en contacto con usted en las proximas 24 horas para coordinar una visita tecnica y elaborar un presupuesto detallado.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/"><Button variant="outline">Volver al inicio</Button></Link>
                        <a href="tel:+5493875361210">
                          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                            <Phone className="h-4 w-4 mr-2" /> Llamar ahora
                          </Button>
                        </a>
                      </div>
                    </div>
                  )}

                  {step < 5 && (
                    <div className="flex items-center justify-between pt-6 border-t">
                      {step > 1 ? (
                        <Button variant="outline" onClick={() => setStep(step - 1)}>
                          <ArrowLeft className="h-4 w-4 mr-2" /> Anterior
                        </Button>
                      ) : <div />}
                      {step < 4 ? (
                        <Button onClick={() => setStep(step + 1)} disabled={step === 1 && !projectType}>
                          Siguiente <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting || !contactInfo.name || !contactInfo.email || !contactInfo.phone}
                          className="bg-accent hover:bg-accent/90 text-accent-foreground"
                        >
                          {isSubmitting ? "Enviando..." : "Solicitar cotizacion"} <Send className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {step < 5 && (
                <div className="mt-8 text-center">
                  <p className="text-muted-foreground mb-4">Prefiere hablar con un asesor directamente?</p>
                  <a href="tel:+5493875361210">
                    <Button variant="outline" size="lg"><Phone className="h-4 w-4 mr-2" /> +54 9 387 536-1210</Button>
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/50 border-t">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">Por que usar nuestro cotizador</h2>
              <div className="grid sm:grid-cols-3 gap-6 text-center">
                <div className="p-4 rounded-xl bg-card border">
                  <Calculator className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-1">Estimacion rapida</h3>
                  <p className="text-sm text-muted-foreground">Obtenga un rango de presupuesto en minutos sin compromiso.</p>
                </div>
                <div className="p-4 rounded-xl bg-card border">
                  <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-1">Sin compromiso</h3>
                  <p className="text-sm text-muted-foreground">Envie su consulta y reciba una cotizacion detallada a la brevedad.</p>
                </div>
                <div className="p-4 rounded-xl bg-card border">
                  <Info className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-1">Asesoramiento incluido</h3>
                  <p className="text-sm text-muted-foreground">Nuestro equipo lo contactara para afinar detalles y ofrecerle la mejor opcion.</p>
                </div>
              </div>
              <p className="text-center text-muted-foreground mt-6 text-sm">
                La estimacion es orientativa. Una vez enviados sus datos, un profesional revisara su proyecto y le enviara una propuesta formal.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
