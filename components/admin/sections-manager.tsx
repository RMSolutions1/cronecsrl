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
import { Save, LayoutTemplate, GitBranch, Plus, Trash2 } from "lucide-react"
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- carga única al montar
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
    const result = await saveSections(next)
    setSaving(false)
    if (result.ok) {
      toast({ title: "Secciones guardadas", description: "Los cambios ya están en la página de inicio." })
      setData(next)
    } else {
      toast({ title: "Error", description: result.error ?? "No se pudo guardar", variant: "destructive" })
    }
  }

  const why: WhyCronecSection = {
    ...defaultWhy,
    ...data.whyCronec,
    stats: data.whyCronec?.stats?.length ? data.whyCronec.stats : defaultWhy.stats,
    features: data.whyCronec?.features?.length ? data.whyCronec.features : defaultWhy.features,
    highlights: data.whyCronec?.highlights?.length ? data.whyCronec.highlights : defaultWhy.highlights,
  }
  const process: ProcessSection = {
    ...defaultProcess,
    ...data.process,
    steps: data.process?.steps?.length ? data.process.steps : defaultProcess.steps,
  }

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
                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-medium">Estadísticas</label>
                  <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => setWhy({ stats: [...why.stats, { value: 0, suffix: "+", label: "" }] })}>
                    <Plus className="h-4 w-4" /> Agregar
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                  {why.stats.map((stat, i) => (
                    <div key={i} className="rounded border p-3 space-y-2">
                      <div className="flex justify-end">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" disabled={why.stats.length <= 1} onClick={() => setWhy({ stats: why.stats.filter((_, j) => j !== i) })}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-medium">Características</label>
                  <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => setWhy({ features: [...why.features, { title: "", description: "" }] })}>
                    <Plus className="h-4 w-4" /> Agregar
                  </Button>
                </div>
                <div className="space-y-3 mt-2">
                  {why.features.map((f, i) => (
                    <div key={i} className="rounded border p-3 space-y-2">
                      <div className="flex justify-end">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" disabled={why.features.length <= 1} onClick={() => setWhy({ features: why.features.filter((_, j) => j !== i) })}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
              <CardDescription>Título, subtítulo y pasos del proceso en la página de inicio.</CardDescription>
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
                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-medium">Pasos</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() =>
                      setProcess({
                        steps: [
                          ...process.steps,
                          { number: String(process.steps.length + 1).padStart(2, "0"), title: "", description: "" },
                        ],
                      })
                    }
                  >
                    <Plus className="h-4 w-4" /> Agregar
                  </Button>
                </div>
                <div className="space-y-3 mt-2">
                  {process.steps.map((step, i) => (
                    <div key={i} className="rounded border p-3 space-y-2">
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          disabled={process.steps.length <= 1}
                          onClick={() =>
                            setProcess({
                              steps: process.steps.filter((_, j) => j !== i).map((s, idx) => ({
                                ...s,
                                number: String(idx + 1).padStart(2, "0"),
                              })),
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
