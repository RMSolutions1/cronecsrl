"use client"

import { useState, useEffect } from "react"
import { getCalculadoraAdmin, saveCalculadora } from "@/app/actions/db/calculadora"
import type { CalculadoraData, ProjectTypeItem, QualityLevelItem, UrgencyLevelItem } from "@/app/actions/db/calculadora"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Calculator, Gauge, Clock, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

function newItemId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`
}

export function CalculadoraManager() {
  const [data, setData] = useState<CalculadoraData>({})
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
      const d = await getCalculadoraAdmin()
      setData(d ?? {})
    } catch {
      toast({ title: "Error", description: "No se pudo cargar", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(updates: Partial<CalculadoraData>) {
    setSaving(true)
    const next = { ...data, ...updates }
    const result = await saveCalculadora(next)
    setSaving(false)
    if (result.ok) {
      setData(next)
      toast({ title: "Cotizador guardado", description: "Los cambios ya están en la web pública." })
    } else {
      toast({ title: "Error", description: result.error ?? "No se pudo guardar", variant: "destructive" })
    }
  }

  if (loading) return <div className="text-muted-foreground">Cargando...</div>

  const projectTypes: ProjectTypeItem[] = data.projectTypes ?? []
  const qualityLevels: QualityLevelItem[] = data.qualityLevels ?? []
  const urgencyLevels: UrgencyLevelItem[] = data.urgencyLevels ?? []

  return (
    <div className="space-y-6">
      <Tabs defaultValue="types" className="space-y-4">
        <TabsList>
          <TabsTrigger value="types" className="gap-2"><Calculator className="h-4 w-4" /> Tipos</TabsTrigger>
          <TabsTrigger value="quality" className="gap-2"><Gauge className="h-4 w-4" /> Calidad</TabsTrigger>
          <TabsTrigger value="urgency" className="gap-2"><Clock className="h-4 w-4" /> Plazos</TabsTrigger>
        </TabsList>
        <TabsContent value="types">
          <Card>
            <CardHeader>
              <CardTitle>Tipos de proyecto</CardTitle>
              <CardDescription>Podés agregar todos los tipos y precios por m² que necesites. ID único (sin espacios).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectTypes.map((t, i) => (
                <div key={t.id || i} className="rounded border p-4 flex flex-wrap gap-2 items-start">
                  <Input className="w-28" placeholder="ID" value={t.id} onChange={(e) => {
                    const n = [...projectTypes]
                    n[i] = { ...n[i], id: e.target.value }
                    setData((d) => ({ ...d, projectTypes: n }))
                  }} />
                  <Input className="flex-1 min-w-32" placeholder="Etiqueta" value={t.label} onChange={(e) => {
                    const n = [...projectTypes]
                    n[i] = { ...n[i], label: e.target.value }
                    setData((d) => ({ ...d, projectTypes: n }))
                  }} />
                  <Input className="flex-1 min-w-32" placeholder="Descripción" value={t.description} onChange={(e) => {
                    const n = [...projectTypes]
                    n[i] = { ...n[i], description: e.target.value }
                    setData((d) => ({ ...d, projectTypes: n }))
                  }} />
                  <Input type="number" className="w-28" placeholder="Precio/m²" value={t.pricePerM2} onChange={(e) => {
                    const n = [...projectTypes]
                    n[i] = { ...n[i], pricePerM2: Number(e.target.value) || 0 }
                    setData((d) => ({ ...d, projectTypes: n }))
                  }} />
                  <Button type="button" size="icon" variant="ghost" className="text-red-600 shrink-0" onClick={() => {
                    setData((d) => ({ ...d, projectTypes: projectTypes.filter((_, j) => j !== i) }))
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  setData((d) => ({
                    ...d,
                    projectTypes: [...projectTypes, { id: newItemId("tipo"), label: "", description: "", pricePerM2: 0 }],
                  }))
                }}>
                  <Plus className="h-4 w-4 mr-2" /> Agregar tipo
                </Button>
                <Button onClick={() => handleSave({ projectTypes })} disabled={saving} className="gap-2"><Save className="h-4 w-4" /> Guardar tipos</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle>Niveles de calidad</CardTitle>
              <CardDescription>Multiplicadores sobre el precio base. Agregá o quitá niveles libremente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {qualityLevels.map((q, i) => (
                <div key={q.id || i} className="rounded border p-4 flex flex-wrap gap-2 items-start">
                  <Input className="w-28" placeholder="ID" value={q.id} onChange={(e) => {
                    const n = [...qualityLevels]
                    n[i] = { ...n[i], id: e.target.value }
                    setData((d) => ({ ...d, qualityLevels: n }))
                  }} />
                  <Input className="min-w-28" placeholder="Etiqueta" value={q.label} onChange={(e) => {
                    const n = [...qualityLevels]
                    n[i] = { ...n[i], label: e.target.value }
                    setData((d) => ({ ...d, qualityLevels: n }))
                  }} />
                  <Input type="number" step="0.01" className="w-24" placeholder="Mult." value={q.multiplier} onChange={(e) => {
                    const n = [...qualityLevels]
                    n[i] = { ...n[i], multiplier: Number(e.target.value) || 1 }
                    setData((d) => ({ ...d, qualityLevels: n }))
                  }} />
                  <Input className="flex-1 min-w-40" placeholder="Descripción" value={q.description} onChange={(e) => {
                    const n = [...qualityLevels]
                    n[i] = { ...n[i], description: e.target.value }
                    setData((d) => ({ ...d, qualityLevels: n }))
                  }} />
                  <Button type="button" size="icon" variant="ghost" className="text-red-600" onClick={() => {
                    setData((d) => ({ ...d, qualityLevels: qualityLevels.filter((_, j) => j !== i) }))
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  setData((d) => ({
                    ...d,
                    qualityLevels: [...qualityLevels, { id: newItemId("calidad"), label: "", multiplier: 1, description: "" }],
                  }))
                }}>
                  <Plus className="h-4 w-4 mr-2" /> Agregar nivel
                </Button>
                <Button onClick={() => handleSave({ qualityLevels })} disabled={saving} className="gap-2"><Save className="h-4 w-4" /> Guardar calidad</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="urgency">
          <Card>
            <CardHeader>
              <CardTitle>Plazos</CardTitle>
              <CardDescription>Multiplicador y texto de días estimados por urgencia.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {urgencyLevels.map((u, i) => (
                <div key={u.id || i} className="rounded border p-4 flex flex-wrap gap-2 items-start">
                  <Input className="w-28" placeholder="ID" value={u.id} onChange={(e) => {
                    const n = [...urgencyLevels]
                    n[i] = { ...n[i], id: e.target.value }
                    setData((d) => ({ ...d, urgencyLevels: n }))
                  }} />
                  <Input className="min-w-24" placeholder="Etiqueta" value={u.label} onChange={(e) => {
                    const n = [...urgencyLevels]
                    n[i] = { ...n[i], label: e.target.value }
                    setData((d) => ({ ...d, urgencyLevels: n }))
                  }} />
                  <Input type="number" step="0.01" className="w-24" placeholder="Mult." value={u.multiplier} onChange={(e) => {
                    const n = [...urgencyLevels]
                    n[i] = { ...n[i], multiplier: Number(e.target.value) || 1 }
                    setData((d) => ({ ...d, urgencyLevels: n }))
                  }} />
                  <Input className="min-w-32" placeholder="Días" value={u.days} onChange={(e) => {
                    const n = [...urgencyLevels]
                    n[i] = { ...n[i], days: e.target.value }
                    setData((d) => ({ ...d, urgencyLevels: n }))
                  }} />
                  <Button type="button" size="icon" variant="ghost" className="text-red-600" onClick={() => {
                    setData((d) => ({ ...d, urgencyLevels: urgencyLevels.filter((_, j) => j !== i) }))
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  setData((d) => ({
                    ...d,
                    urgencyLevels: [...urgencyLevels, { id: newItemId("plazo"), label: "", multiplier: 1, days: "" }],
                  }))
                }}>
                  <Plus className="h-4 w-4 mr-2" /> Agregar plazo
                </Button>
                <Button onClick={() => handleSave({ urgencyLevels })} disabled={saving} className="gap-2"><Save className="h-4 w-4" /> Guardar plazos</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
