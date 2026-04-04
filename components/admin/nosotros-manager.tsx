"use client"

import { useState, useEffect } from "react"
import { getNosotrosAdmin, saveNosotros } from "@/app/actions/db/nosotros"
import type { NosotrosData } from "@/app/actions/db/nosotros"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, User, Award, History, Heart, Users, FileCheck, Megaphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function NosotrosManager() {
  const [data, setData] = useState<NosotrosData>({})
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
      const d = await getNosotrosAdmin()
      setData(d ?? {})
    } catch (e) {
      console.error(e)
      toast({ title: "Error", description: "No se pudo cargar", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(updates: Partial<NosotrosData>) {
    setSaving(true)
    try {
      const next = { ...data, ...updates }
      await saveNosotros(next)
      setData(next)
      toast({ title: "Nosotros guardado" })
      load()
    } catch (e) {
      toast({ title: "Error", description: "No se pudo guardar", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-muted-foreground">Cargando...</div>

  const defaultStats = [
    { value: "15+", label: "Años de Experiencia" },
    { value: "500+", label: "Proyectos Completados" },
    { value: "50+", label: "Profesionales" },
    { value: "98%", label: "Satisfacción del Cliente" },
  ]
  const hero = data.hero ?? {}
  const stats = Array(4).fill(null).map((_, i) => (data.stats ?? defaultStats)[i] ?? { value: "", label: "" })
  const historySection = data.historySection ?? {}
  const timeline = data.timeline ?? []
  const valuesSection = data.valuesSection ?? {}
  const values = data.values ?? []
  const teamSection = data.teamSection ?? {}
  const team = data.team ?? []
  const certSection = data.certSection ?? {}
  const certifications = data.certifications ?? []
  const cta = data.cta ?? {}

  return (
    <div className="space-y-6">
      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex flex-wrap gap-1">
          <TabsTrigger value="hero" className="gap-2"><Megaphone className="h-4 w-4" /> Hero</TabsTrigger>
          <TabsTrigger value="stats" className="gap-2"><Award className="h-4 w-4" /> Estadísticas</TabsTrigger>
          <TabsTrigger value="history" className="gap-2"><History className="h-4 w-4" /> Historia</TabsTrigger>
          <TabsTrigger value="values" className="gap-2"><Heart className="h-4 w-4" /> Valores</TabsTrigger>
          <TabsTrigger value="team" className="gap-2"><Users className="h-4 w-4" /> Equipo</TabsTrigger>
          <TabsTrigger value="certs" className="gap-2"><FileCheck className="h-4 w-4" /> Certificaciones</TabsTrigger>
          <TabsTrigger value="cta" className="gap-2"><Save className="h-4 w-4" /> CTA</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero página Nosotros</CardTitle>
              <CardDescription>Badge, título y subtítulo del carrusel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><label className="text-sm font-medium">Badge</label><Input value={hero.badge ?? ""} onChange={(e) => setData((d) => ({ ...d, hero: { ...d.hero, badge: e.target.value } }))} className="mt-1" /></div>
              <div><label className="text-sm font-medium">Título</label><Input value={hero.title ?? ""} onChange={(e) => setData((d) => ({ ...d, hero: { ...d.hero, title: e.target.value } }))} className="mt-1" /></div>
              <div><label className="text-sm font-medium">Subtítulo</label><Textarea value={hero.subtitle ?? ""} onChange={(e) => setData((d) => ({ ...d, hero: { ...d.hero, subtitle: e.target.value } }))} rows={2} className="mt-1" /></div>
              <Button onClick={() => handleSave({ hero: { ...hero } })} disabled={saving} className="gap-2"><Save className="h-4 w-4" /> Guardar Hero</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas (4 ítems)</CardTitle>
              <CardDescription>Valor y etiqueta de cada estadística.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[0, 1, 2, 3].map((i) => {
                const s = stats[i] ?? { value: "", label: "" }
                return (
                  <div key={i} className="flex gap-2 items-center">
                    <Input placeholder="Valor" value={s.value} onChange={(e) => {
                      const next = [...stats]
                      next[i] = { ...s, value: e.target.value }
                      setData((d) => ({ ...d, stats: next }))
                    }} className="w-24" />
                    <Input placeholder="Etiqueta" value={s.label} onChange={(e) => {
                      const next = [...stats]
                      next[i] = { ...s, label: e.target.value }
                      setData((d) => ({ ...d, stats: next }))
                    }} className="flex-1" />
                  </div>
                )
              })}
              <Button onClick={() => handleSave({ stats })} disabled={saving} className="gap-2"><Save className="h-4 w-4" /> Guardar Estadísticas</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historia</CardTitle>
              <CardDescription>Título y subtítulo de la sección, y línea de tiempo (año, título, descripción).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><label className="text-sm font-medium">Título sección</label><Input value={historySection.title ?? ""} onChange={(e) => setData((d) => ({ ...d, historySection: { ...d.historySection, title: e.target.value } }))} className="mt-1" /></div>
              <div><label className="text-sm font-medium">Subtítulo</label><Textarea value={historySection.subtitle ?? ""} onChange={(e) => setData((d) => ({ ...d, historySection: { ...d.historySection, subtitle: e.target.value } }))} rows={2} className="mt-1" /></div>
              <div><label className="text-sm font-medium">Línea de tiempo</label>
                <div className="space-y-2 mt-2">
                  {(timeline.length ? timeline : [{ year: "", title: "", description: "" }]).map((item, i) => (
                    <div key={i} className="rounded border p-3 grid gap-2">
                      <Input placeholder="Año" value={item.year} onChange={(e) => setData((d) => ({ ...d, timeline: (d.timeline ?? []).map((t, j) => j === i ? { ...t, year: e.target.value } : t).length ? (d.timeline ?? []).map((t, j) => j === i ? { ...t, year: e.target.value } : t) : [...(d.timeline ?? []).slice(0, i), { ...item, year: e.target.value }, ...(d.timeline ?? []).slice(i + 1)] }))} className="w-20" />
                      <Input placeholder="Título" value={item.title} onChange={(e) => setData((d) => ({ ...d, timeline: (d.timeline ?? []).map((t, j) => j === i ? { ...t, title: e.target.value } : t).length ? (d.timeline ?? []).map((t, j) => j === i ? { ...t, title: e.target.value } : t) : [...(d.timeline ?? []).slice(0, i), { ...item, title: e.target.value }, ...(d.timeline ?? []).slice(i + 1)] }))} />
                      <Textarea placeholder="Descripción" value={item.description} onChange={(e) => setData((d) => ({ ...d, timeline: (d.timeline ?? []).map((t, j) => j === i ? { ...t, description: e.target.value } : t).length ? (d.timeline ?? []).map((t, j) => j === i ? { ...t, description: e.target.value } : t) : [...(d.timeline ?? []).slice(0, i), { ...item, description: e.target.value }, ...(d.timeline ?? []).slice(i + 1)] }))} rows={2} />
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={() => handleSave({ historySection, timeline: timeline.length ? timeline : data.timeline })} disabled={saving} className="gap-2"><Save className="h-4 w-4" /> Guardar Historia</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="values">
          <Card>
            <CardHeader>
              <CardTitle>Valores (6)</CardTitle>
              <CardDescription>Título y subtítulo de la sección y cada valor (título, descripción).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><label className="text-sm font-medium">Título sección</label><Input value={valuesSection.title ?? ""} onChange={(e) => setData((d) => ({ ...d, valuesSection: { ...d.valuesSection, title: e.target.value } }))} className="mt-1" /></div>
              <div><label className="text-sm font-medium">Subtítulo</label><Input value={valuesSection.subtitle ?? ""} onChange={(e) => setData((d) => ({ ...d, valuesSection: { ...d.valuesSection, subtitle: e.target.value } }))} className="mt-1" /></div>
              {(values.length ? values : Array(6).fill({ title: "", description: "" })).slice(0, 6).map((v, i) => (
                <div key={i} className="rounded border p-3 space-y-2">
                  <Input placeholder="Título valor" value={v.title} onChange={(e) => setData((d) => ({ ...d, values: (d.values ?? []).map((x, j) => j === i ? { ...x, title: e.target.value } : x).length ? (d.values ?? []).map((x, j) => j === i ? { ...x, title: e.target.value } : x) : [...(d.values ?? []).slice(0, i), { ...v, title: e.target.value }, ...(d.values ?? []).slice(i + 1)] }))} />
                  <Textarea placeholder="Descripción" value={v.description} onChange={(e) => setData((d) => ({ ...d, values: (d.values ?? []).map((x, j) => j === i ? { ...x, description: e.target.value } : x).length ? (d.values ?? []).map((x, j) => j === i ? { ...x, description: e.target.value } : x) : [...(d.values ?? []).slice(0, i), { ...v, description: e.target.value }, ...(d.values ?? []).slice(i + 1)] }))} rows={2} />
                </div>
              ))}
              <Button onClick={() => handleSave({ valuesSection, values: values.length ? values : data.values })} disabled={saving} className="gap-2"><Save className="h-4 w-4" /> Guardar Valores</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Equipo directivo</CardTitle>
              <CardDescription>Título y subtítulo de la sección y cada miembro (nombre, cargo, descripción).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><label className="text-sm font-medium">Título sección</label><Input value={teamSection.title ?? ""} onChange={(e) => setData((d) => ({ ...d, teamSection: { ...d.teamSection, title: e.target.value } }))} className="mt-1" /></div>
              <div><label className="text-sm font-medium">Subtítulo</label><Input value={teamSection.subtitle ?? ""} onChange={(e) => setData((d) => ({ ...d, teamSection: { ...d.teamSection, subtitle: e.target.value } }))} className="mt-1" /></div>
              {(team.length ? team : Array(2).fill({ name: "", position: "", description: "" })).map((m, i) => (
                <div key={i} className="rounded border p-3 space-y-2">
                  <Input placeholder="Nombre" value={m.name} onChange={(e) => setData((d) => ({ ...d, team: (d.team ?? []).map((x, j) => j === i ? { ...x, name: e.target.value } : x).length ? (d.team ?? []).map((x, j) => j === i ? { ...x, name: e.target.value } : x) : [...(d.team ?? []).slice(0, i), { ...m, name: e.target.value }, ...(d.team ?? []).slice(i + 1)] }))} />
                  <Input placeholder="Cargo" value={m.position} onChange={(e) => setData((d) => ({ ...d, team: (d.team ?? []).map((x, j) => j === i ? { ...x, position: e.target.value } : x).length ? (d.team ?? []).map((x, j) => j === i ? { ...x, position: e.target.value } : x) : [...(d.team ?? []).slice(0, i), { ...m, position: e.target.value }, ...(d.team ?? []).slice(i + 1)] }))} />
                  <Textarea placeholder="Descripción" value={m.description} onChange={(e) => setData((d) => ({ ...d, team: (d.team ?? []).map((x, j) => j === i ? { ...x, description: e.target.value } : x).length ? (d.team ?? []).map((x, j) => j === i ? { ...x, description: e.target.value } : x) : [...(d.team ?? []).slice(0, i), { ...m, description: e.target.value }, ...(d.team ?? []).slice(i + 1)] }))} rows={2} />
                </div>
              ))}
              <Button onClick={() => handleSave({ teamSection, team: team.length ? team : data.team })} disabled={saving} className="gap-2"><Save className="h-4 w-4" /> Guardar Equipo</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certs">
          <Card>
            <CardHeader>
              <CardTitle>Certificaciones</CardTitle>
              <CardDescription>Título y subtítulo de la sección y cada certificación.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><label className="text-sm font-medium">Título sección</label><Input value={certSection.title ?? ""} onChange={(e) => setData((d) => ({ ...d, certSection: { ...d.certSection, title: e.target.value } }))} className="mt-1" /></div>
              <div><label className="text-sm font-medium">Subtítulo</label><Input value={certSection.subtitle ?? ""} onChange={(e) => setData((d) => ({ ...d, certSection: { ...d.certSection, subtitle: e.target.value } }))} className="mt-1" /></div>
              {(certifications.length ? certifications : Array(4).fill({ title: "", description: "" })).slice(0, 4).map((c, i) => (
                <div key={i} className="rounded border p-3 space-y-2">
                  <Input placeholder="Título" value={c.title} onChange={(e) => setData((d) => ({ ...d, certifications: (d.certifications ?? []).map((x, j) => j === i ? { ...x, title: e.target.value } : x).length ? (d.certifications ?? []).map((x, j) => j === i ? { ...x, title: e.target.value } : x) : [...(d.certifications ?? []).slice(0, i), { ...c, title: e.target.value }, ...(d.certifications ?? []).slice(i + 1)] }))} />
                  <Input placeholder="Descripción" value={c.description} onChange={(e) => setData((d) => ({ ...d, certifications: (d.certifications ?? []).map((x, j) => j === i ? { ...x, description: e.target.value } : x).length ? (d.certifications ?? []).map((x, j) => j === i ? { ...x, description: e.target.value } : x) : [...(d.certifications ?? []).slice(0, i), { ...c, description: e.target.value }, ...(d.certifications ?? []).slice(i + 1)] }))} />
                </div>
              ))}
              <Button onClick={() => handleSave({ certSection, certifications: certifications.length ? certifications : data.certifications })} disabled={saving} className="gap-2"><Save className="h-4 w-4" /> Guardar Certificaciones</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta">
          <Card>
            <CardHeader>
              <CardTitle>CTA final</CardTitle>
              <CardDescription>Título y párrafo del llamado a la acción al final de la página.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><label className="text-sm font-medium">Título</label><Input value={cta.title ?? ""} onChange={(e) => setData((d) => ({ ...d, cta: { ...d.cta, title: e.target.value } }))} className="mt-1" /></div>
              <div><label className="text-sm font-medium">Párrafo</label><Textarea value={cta.paragraph ?? ""} onChange={(e) => setData((d) => ({ ...d, cta: { ...d.cta, paragraph: e.target.value } }))} rows={2} className="mt-1" /></div>
              <Button onClick={() => handleSave({ cta: { ...cta } })} disabled={saving} className="gap-2"><Save className="h-4 w-4" /> Guardar CTA</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
