"use client"

import { useState, useEffect } from "react"
import { getCertificationsAdmin, saveCertification, deleteCertification } from "@/app/actions/db/certifications"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { ImageUploader } from "./image-uploader"

type Certification = { id: string; name: string; logo_url?: string | null; order_index: number }

export function CertificationsManager() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Certification>>({})
  const { toast } = useToast()

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- carga única al montar
  }, [])

  async function load() {
    setLoading(true)
    try {
      const certs = await getCertificationsAdmin()
      setCertifications((certs as Certification[]) || [])
    } catch (e) {
      console.error(e)
      toast({ title: "Error", description: "No se pudieron cargar las certificaciones", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    const payload = {
      ...form,
      id: editingId && editingId !== "new" ? editingId : form.id,
      order_index: form.order_index ?? certifications.length,
    }
    const result = await saveCertification(payload)
    if (result.ok) {
      toast({ title: "Certificación guardada" })
      setEditingId(null)
      setForm({})
      load()
    } else {
      toast({ title: "Error", description: result.error ?? "No se pudo guardar", variant: "destructive" })
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta certificación?")) return
    const result = await deleteCertification(id)
    if (result.ok) {
      toast({ title: "Certificación eliminada" })
      load()
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    }
  }

  if (loading) return <div className="text-muted-foreground">Cargando certificaciones...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificaciones y Cumplimiento</CardTitle>
        <CardDescription>
          Títulos e imágenes de la sección &quot;Certificaciones y Cumplimiento&quot; en la página de inicio (ej. ISO 9001, ISO 14001, ISO 45001).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(editingId || form.name !== undefined) && (
          <div className="rounded-lg border p-4 space-y-3">
            <h4 className="font-medium">{editingId && editingId !== "new" ? "Editar" : "Nueva"} certificación</h4>
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <Input
                value={form.name ?? ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: ISO 9001"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Logo (URL o subir)</label>
              <ImageUploader
                value={form.logo_url ?? ""}
                onChange={(url) => setForm({ ...form, logo_url: url })}
                path="certifications"
              />
              <Input
                className="mt-2"
                value={form.logo_url ?? ""}
                onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Orden</label>
              <Input
                type="number"
                value={form.order_index ?? 0}
                onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value, 10) })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
              <Button variant="outline" onClick={() => { setEditingId(null); setForm({}) }}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        )}
        {!editingId && form.name === undefined && (
          <Button onClick={() => { setEditingId("new"); setForm({ name: "", order_index: certifications.length }) }}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar certificación
          </Button>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c) => (
            <Card key={c.id}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    {c.logo_url ? (
                      <Image src={c.logo_url} alt={c.name} fill className="object-contain" sizes="64px" unoptimized />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-2xl text-muted-foreground">🏅</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground">Orden: {c.order_index}</p>
                    <div className="flex gap-1 mt-2">
                      <Button size="sm" variant="ghost" onClick={() => { setEditingId(c.id); setForm({ ...c, logo_url: c.logo_url ?? "" }) }}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(c.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {certifications.length === 0 && (
          <p className="text-sm text-muted-foreground">No hay certificaciones cargadas. Agregá la primera con el botón de arriba.</p>
        )}
      </CardContent>
    </Card>
  )
}
