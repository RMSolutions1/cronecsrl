"use client"

import { useState, useEffect } from "react"
import { getCompanyInfo, saveCompanyInfo } from "@/app/actions/db/company-info"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type HeroSlide = { title: string; paragraph: string }

interface CompanyInfo {
  company_name?: string
  tagline?: string
  description?: string
  mission?: string
  vision?: string
  values?: string[]
  address?: string
  phone?: string
  email?: string
  whatsapp?: string
  whatsapp_default_message?: string
  horario?: string
  facebook_url?: string
  instagram_url?: string
  linkedin_url?: string
  twitter_url?: string
  youtube_url?: string
  founded_year?: number
  cuit?: string
  logo_url?: string
  heroSlides?: HeroSlide[]
  footer_cta_title?: string
  footer_cta_subtitle?: string
  cta_badge?: string
  cta_title?: string
  cta_paragraph?: string
  meta_title?: string
  meta_description?: string
  brochure_pdf_url?: string
  brochure_cta_text?: string
}

export function SettingsManager() {
  const [info, setInfo] = useState<Partial<CompanyInfo>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadInfo()
  }, [])

  async function loadInfo() {
    try {
      const data = await getCompanyInfo()
      if (data) setInfo(data as Partial<CompanyInfo>)
    } catch (error) {
      console.error("Error loading company info:", error)
      toast({ title: "Error", description: "No se pudo cargar la información", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await saveCompanyInfo(info as Record<string, unknown>)
      toast({ title: "Información actualizada exitosamente" })
      loadInfo()
    } catch (error) {
      console.error("Error saving company info:", error)
      toast({ title: "Error", description: "No se pudo guardar la información", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Cargando configuración...</div>
  }

  const defaultHeroSlides: HeroSlide[] = [
    { title: "Construimos el Futuro de Salta", paragraph: "Especialistas en construcción civil, instalaciones eléctricas e infraestructura industrial." },
    { title: "Obras civiles e infraestructura", paragraph: "Puentes, vialidad y edificaciones con los más altos estándares en Salta y el NOA." },
    { title: "Instalaciones eléctricas y soluciones industriales", paragraph: "Desde baja tensión hasta subestaciones. Ingenieros matriculados y equipamiento certificado." },
  ]
  const heroSlides: HeroSlide[] = Array.isArray(info.heroSlides) && info.heroSlides.length >= 3
    ? info.heroSlides.slice(0, 3)
    : defaultHeroSlides

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="flex flex-wrap gap-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hero">Hero (Inicio)</TabsTrigger>
          <TabsTrigger value="contacto">Contacto</TabsTrigger>
          <TabsTrigger value="footer">Footer y CTA</TabsTrigger>
          <TabsTrigger value="redes">Redes Sociales</TabsTrigger>
          <TabsTrigger value="empresa">Sobre la Empresa</TabsTrigger>
          <TabsTrigger value="brochure">Brochure</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>Información básica de la empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre de la Empresa</label>
                <Input
                  value={info.company_name || ""}
                  onChange={(e) => setInfo({ ...info, company_name: e.target.value })}
                  placeholder="CRONEC SRL"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Eslogan (Tagline)</label>
                <Input
                  value={info.tagline || ""}
                  onChange={(e) => setInfo({ ...info, tagline: e.target.value })}
                  placeholder="Construcciones Eléctricas y Civiles"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Descripción</label>
                <Textarea
                  value={info.description || ""}
                  onChange={(e) => setInfo({ ...info, description: e.target.value })}
                  placeholder="Descripción de la empresa..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Año de Fundación</label>
                  <Input
                    type="number"
                    value={info.founded_year || 2009}
                    onChange={(e) => setInfo({ ...info, founded_year: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">CUIT</label>
                  <Input
                    value={info.cuit || ""}
                    onChange={(e) => setInfo({ ...info, cuit: e.target.value })}
                    placeholder="33-71090097-9"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">URL del Logo</label>
                <Input
                  value={info.logo_url || ""}
                  onChange={(e) => setInfo({ ...info, logo_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Slider de la página de inicio</CardTitle>
              <CardDescription>Textos del carrusel principal (título y párrafo por cada diapositiva)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-lg border p-4 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Diapositiva {i + 1}</p>
                  <div>
                    <label className="text-sm font-medium">Título</label>
                    <Input
                      value={heroSlides[i]?.title ?? ""}
                      onChange={(e) => {
                        const next = [...heroSlides]
                        next[i] = { ...next[i], title: e.target.value }
                        setInfo({ ...info, heroSlides: next })
                      }}
                      placeholder="Ej: Construimos el Futuro de Salta"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Párrafo</label>
                    <Textarea
                      value={heroSlides[i]?.paragraph ?? ""}
                      onChange={(e) => {
                        const next = [...heroSlides]
                        next[i] = { ...next[i], paragraph: e.target.value }
                        setInfo({ ...info, heroSlides: next })
                      }}
                      placeholder="Descripción breve..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacto" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
              <CardDescription>Datos de contacto de la empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Dirección</label>
                <Input
                  value={info.address || ""}
                  onChange={(e) => setInfo({ ...info, address: e.target.value })}
                  placeholder="Santa Fe 548 PB 'B', Salta Capital"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Teléfono</label>
                  <Input
                    value={info.phone || ""}
                    onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                    placeholder="+54 9 387 536-1210"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">WhatsApp</label>
                  <Input
                    value={info.whatsapp || ""}
                    onChange={(e) => setInfo({ ...info, whatsapp: e.target.value })}
                    placeholder="+54 9 387 536-1210"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={info.email || ""}
                  onChange={(e) => setInfo({ ...info, email: e.target.value })}
                  placeholder="cronec@cronecsrl.com.ar"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Horario de atención</label>
                <Input
                  value={info.horario || ""}
                  onChange={(e) => setInfo({ ...info, horario: e.target.value })}
                  placeholder="Lun - Vie: 8:00 - 18:00"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Mensaje por defecto (WhatsApp)</label>
                <Input
                  value={info.whatsapp_default_message || ""}
                  onChange={(e) => setInfo({ ...info, whatsapp_default_message: e.target.value })}
                  placeholder="Hola, me gustaría solicitar información..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Footer y CTA</CardTitle>
              <CardDescription>Título y subtítulo del bloque CTA del pie de página</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título del CTA</label>
                <Input
                  value={info.footer_cta_title || ""}
                  onChange={(e) => setInfo({ ...info, footer_cta_title: e.target.value })}
                  placeholder="Inicia tu proyecto con nosotros"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Subtítulo del CTA</label>
                <Input
                  value={info.footer_cta_subtitle || ""}
                  onChange={(e) => setInfo({ ...info, footer_cta_subtitle: e.target.value })}
                  placeholder="Más de 15 años de experiencia..."
                />
              </div>
              <p className="text-sm text-muted-foreground pt-2">Texto del bloque CTA en la página de inicio (sección “Hagamos realidad su proyecto”):</p>
              <div>
                <label className="text-sm font-medium">Badge</label>
                <Input
                  value={info.cta_badge || ""}
                  onChange={(e) => setInfo({ ...info, cta_badge: e.target.value })}
                  placeholder="Contáctenos"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Título CTA inicio</label>
                <Input
                  value={info.cta_title || ""}
                  onChange={(e) => setInfo({ ...info, cta_title: e.target.value })}
                  placeholder="Hagamos Realidad su Proyecto"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Párrafo CTA inicio</label>
                <Textarea
                  value={info.cta_paragraph || ""}
                  onChange={(e) => setInfo({ ...info, cta_paragraph: e.target.value })}
                  placeholder="Estamos listos para transformar su visión..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="redes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociales</CardTitle>
              <CardDescription>Enlaces a redes sociales de la empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Facebook</label>
                <Input
                  value={info.facebook_url || ""}
                  onChange={(e) => setInfo({ ...info, facebook_url: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Instagram</label>
                <Input
                  value={info.instagram_url || ""}
                  onChange={(e) => setInfo({ ...info, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">LinkedIn</label>
                <Input
                  value={info.linkedin_url || ""}
                  onChange={(e) => setInfo({ ...info, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/company/..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Twitter / X</label>
                <Input
                  value={info.twitter_url || ""}
                  onChange={(e) => setInfo({ ...info, twitter_url: e.target.value })}
                  placeholder="https://twitter.com/..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">YouTube</label>
                <Input
                  value={info.youtube_url || ""}
                  onChange={(e) => setInfo({ ...info, youtube_url: e.target.value })}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="empresa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sobre la Empresa</CardTitle>
              <CardDescription>Misión, visión y valores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Misión</label>
                <Textarea
                  value={info.mission || ""}
                  onChange={(e) => setInfo({ ...info, mission: e.target.value })}
                  placeholder="Nuestra misión..."
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Visión</label>
                <Textarea
                  value={info.vision || ""}
                  onChange={(e) => setInfo({ ...info, vision: e.target.value })}
                  placeholder="Nuestra visión..."
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Valores (separados por coma)</label>
                <Textarea
                  value={info.values?.join(", ") || ""}
                  onChange={(e) => setInfo({ ...info, values: e.target.value.split(",").map((v) => v.trim()) })}
                  placeholder="Excelencia, Compromiso, Innovación..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brochure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Brochure corporativo</CardTitle>
              <CardDescription>URL del PDF del brochure y texto del botón de descarga que se muestra en la página /brochure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">URL del PDF del Brochure</label>
                <Input
                  value={info.brochure_pdf_url || ""}
                  onChange={(e) => setInfo({ ...info, brochure_pdf_url: e.target.value })}
                  placeholder="https://... o deje vacío para ocultar el botón de descarga"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Texto del botón de descarga</label>
                <Input
                  value={info.brochure_cta_text || ""}
                  onChange={(e) => setInfo({ ...info, brochure_cta_text: e.target.value })}
                  placeholder="Descargar Brochure PDF"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO (metadatos)</CardTitle>
              <CardDescription>Título y descripción por defecto para buscadores (opcional; el sitio usa valores por defecto si están vacíos)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Meta título</label>
                <Input
                  value={info.meta_title || ""}
                  onChange={(e) => setInfo({ ...info, meta_title: e.target.value })}
                  placeholder="CRONEC SRL | Construcción Civil e Instalaciones Eléctricas"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Meta descripción</label>
                <Textarea
                  value={info.meta_description || ""}
                  onChange={(e) => setInfo({ ...info, meta_description: e.target.value })}
                  placeholder="Empresa Salteña especializada en..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </div>
  )
}
