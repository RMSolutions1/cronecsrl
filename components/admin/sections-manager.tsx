"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { getSectionsAdmin, saveSections } from "@/app/actions/db/sections"
import type { SectionsData, WhyCronecSection, ProcessSection } from "@/app/actions/db/sections"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, LayoutTemplate, GitBranch } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const defaultWhy: WhyCronecSection = {
  title: "Por qué elegir CRONEC",
  subtitle: "Experiencia, profesionalismo y compromiso en cada proyecto de construcción e infraestructura.",
  stats: [
    { value: 15, suffix: "+", label: "Años" },
    { value: 500, suffix: "+", label: "Proyectos" },
    { value: 150, suffix: "+", label: "Clientes" },
    { value: 50, suffix: "+", label: "Equipo" },
  ],
  features: [
    { title: "Experiencia Comprobada", description: "Más de 15 años liderando proyectos de infraestructura compleja en toda la región de Salta." },
    { title: "Equipo Profesional", description: "Ingenieros, arquitectos y técnicos certificados en todas las áreas de construcción." },
    { title: "Certificaciones ISO", description: "Cumplimiento estricto de normativas de calidad, seguridad y medio ambiente." },
    { title: "Tecnología Moderna", description: "Maquinaria de última generación y metodologías constructivas innovadoras." },
    { title: "Compromiso con Plazos", description: "Gestión eficiente de tiempos con planificación rigurosa de cada etapa." },
    { title: "Mejora Continua", description: "Innovación constante en procesos y técnicas constructivas." },
  ],
  highlights: ["Obras públicas y privadas", "Atención personalizada", "Presupuestos competitivos", "Garantía de calidad"],
}

const defaultProcess: ProcessSection = {
  title: "Nuestro Proceso de Trabajo",
  subtitle: "Metodología probada que garantiza resultados excepcionales en cada etapa de su proyecto.",
  steps: [
    { number: "01", title: "Consulta Inicial", description: "Análisis detallado de sus necesidades, objetivos y requisitos técnicos del proyecto." },
    { number: "02", title: "Evaluación Técnica", description: "Estudio de factibilidad, inspección del sitio y desarrollo de anteproyecto." },
    { number: "03", title: "Propuesta Personalizada", description: "Presentación de solución técnica, cronograma detallado y presupuesto ajustado." },
    { number: "04", title: "Ejecución Profesional", description: "Construcción con control de calidad continuo, gestión de seguridad y comunicación constante." },
    { number: "05", title: "Entrega y Garantía", description: "Inspección final, documentación completa y servicio de garantía post-entrega." },
  ],
}

export function SectionsManager() {
  const [data, setData] = useState<SectionsData>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const sections = await getSectionsAdmin()
      setData(sections ?? {})
    } catch (e) {
      console.error(e)
      toast({ title: "Error", description: "No se pudo cargar", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(next: SectionsData) {
    setSaving(true)
    try {
      await saveSections(next)
      toast({ title: "Secciones guardadas" })
      setData(next)
      load()
    } catch (e) {
      toast({ title: "Error", description: "No se pudo guardar", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const why: WhyCronecSection = { ...defaultWhy, ...data.whyCronec }
  const process: ProcessSection = { ...defaultProcess, ...data.process }

  const setWhy = (updates: Partial<WhyCronecSection>) => {
    setData((d) => ({ ...d, whyCronec: { ...defaultWhy, ...d.whyCronec, ...updates } }))
  }
  const setProcess = (updates: Partial<ProcessSection>) => {
    setData((d) => ({ ...d, process: { ...defaultProcess, ...d.process, ...updates } }))
  }

  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get("tab") || "why"
  const defaultTab = tabFromUrl === "process" ? "process" : "why"

  if (loading) return <div className="text-muted-foreground">Cargando...</div>

  return (
    <div className="space-y-6">
      <Tabs key={defaultTab} defaultValue={defaultTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="why" className="gap-2">
            <LayoutTemplate className="h-4 w-4" />
            Por qué CRONEC
          </TabsTrigger>
          <TabsTrigger value="process" className="gap-2">
            <GitBranch className="h-4 w-4" />
            Proceso de trabajo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="why" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sección Por qué elegir CRONEC</CardTitle>
              <CardDescription>Texto, estadísticas y características que se muestran en la página de inicio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input value={why.title} onChange={(e) => setWhy({ title: e.target.value })} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Subtítulo</label>
                <Textarea value={why.subtitle} onChange={(e) => setWhy({ subtitle: e.target.value })} className="mt-1" rows={2} />
              </div>
              <div>
                <label className="text-sm font-medium">Estadísticas (4 ítems)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                  {why.stats.map((stat, i) => (
                    <div key={i} className="rounded border p-3 space-y-2">
                      <Input type="number" placeholder="Valor" value={stat.value} onChange={(e) => {
                        const v = Number(e.target.value) || 0
                        setWhy({ stats: why.stats.map((s, j) => (j === i ? { ...s, value: v } : s)) })
                      }} />
                      <Input placeholder="Sufijo" value={stat.suffix} onChange={(e) => setWhy({ stats: why.stats.map((s, j) => (j === i ? { ...s, suffix: e.target.value } : s)) })} />
                      <Input placeholder="Etiqueta" value={stat.label} onChange={(e) => setWhy({ stats: why.stats.map((s, j) => (j === i ? { ...s, label: e.target.value } : s)) })} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Características (6)</label>
                <div className="space-y-3 mt-2">
                  {why.features.map((f, i) => (
                    <div key={i} className="rounded border p-3 space-y-2">
                      <Input placeholder="Título" value={f.title} onChange={(e) => setWhy({ features: why.features.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} />
                      <Textarea placeholder="Descripción" value={f.description} onChange={(e) => setWhy({ features: why.features.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)) })} rows={2} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Highlights (uno por línea)</label>
                <Textarea
                  placeholder="Uno por línea"
                  value={why.highlights.join("\n")}
                  onChange={(e) => setWhy({ highlights: e.target.value.split("\n").filter(Boolean) })}
                  rows={4}
                  className="mt-1"
                />
              </div>
              <Button onClick={() => handleSave({ ...data, whyCronec: why })} disabled={saving} className="gap-2">
                <Save className="h-4 w-4" /> Guardar Por qué CRONEC
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sección Nuestro Proceso de Trabajo</CardTitle>
              <CardDescription>Título, subtítulo y los 5 pasos del proceso en la página de inicio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input value={process.title} onChange={(e) => setProcess({ title: e.target.value })} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Subtítulo</label>
                <Textarea value={process.subtitle} onChange={(e) => setProcess({ subtitle: e.target.value })} className="mt-1" rows={2} />
              </div>
              <div>
                <label className="text-sm font-medium">Pasos (5)</label>
                <div className="space-y-3 mt-2">
                  {process.steps.map((step, i) => (
                    <div key={i} className="rounded border p-3 space-y-2">
                      <Input placeholder="Número" value={step.number} onChange={(e) => setProcess({ steps: process.steps.map((s, j) => (j === i ? { ...s, number: e.target.value } : s)) })} className="w-20" />
                      <Input placeholder="Título del paso" value={step.title} onChange={(e) => setProcess({ steps: process.steps.map((s, j) => (j === i ? { ...s, title: e.target.value } : s)) })} />
                      <Textarea placeholder="Descripción" value={step.description} onChange={(e) => setProcess({ steps: process.steps.map((s, j) => (j === i ? { ...s, description: e.target.value } : s)) })} rows={2} />
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={() => handleSave({ ...data, process })} disabled={saving} className="gap-2">
                <Save className="h-4 w-4" /> Guardar Proceso
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
