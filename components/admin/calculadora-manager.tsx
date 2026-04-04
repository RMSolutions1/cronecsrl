"use client"

import { useState, useEffect } from "react"
import { getCalculadoraAdmin, saveCalculadora } from "@/app/actions/db/calculadora"
import type { CalculadoraData, ProjectTypeItem, QualityLevelItem, UrgencyLevelItem } from "@/app/actions/db/calculadora"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Calculator, Gauge, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
    } catch (e) {
      toast({ title: "Error", description: "No se pudo cargar", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(updates: Partial<CalculadoraData>) {
    setSaving(true)
    try {
      await saveCalculadora({ ...data, ...updates })
      setData((prev) => ({ ...prev, ...updates }))
      toast({ title: "Cotizador guardado" })
      load()
    } catch (e) {
      toast({ title: "Error", description: "No se pudo guardar", variant: "destructive" })
    } finally {
      setSaving(false)
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
              <CardDescription>ID, etiqueta, descripción y precio por m².</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectTypes.map((t, i) => (
                <div key={i} className="rounded border p-4 flex flex-wrap gap-2">
                  <Input className="w-24" placeholder="ID" value={t.id} onChange={(e) => {
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
                </div>
              ))}
              <Button onClick={() => handleSave({ projectTypes })} disabled={saving} className="gap-2"><Save className="h-4 w-4" /> Guardar</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle>Niveles de calidad</CardTitle>
              <CardDescription>ID, etiqueta, multiplicador y descripción.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {qualityLevels.map((q, i) => (
                <div key={i} className="rounded border p-4 flex flex-wrap gap-2">
                  <Input className="w-24" placeholder="ID" value={q.id} onChange={(e) => {
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
                </div>
              ))}
              <Button onClick={() => handleSave({ qualityLevels })} disabled={saving} className="gap-2"><Save className="h-4 w-4" /> Guardar</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="urgency">
          <Card>
            <CardHeader>
              <CardTitle>Plazos</CardTitle>
              <CardDescription>ID, etiqueta, multiplicador y texto de días.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {urgencyLevels.map((u, i) => (
                <div key={i} className="rounded border p-4 flex flex-wrap gap-2">
                  <Input className="w-24" placeholder="ID" value={u.id} onChange={(e) => {
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
                </div>
              ))}
              <Button onClick={() => handleSave({ urgencyLevels })} disabled={saving} className="gap-2"><Save className="h-4 w-4" /> Guardar</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
