"use client"

import { useState, useEffect } from "react"
import { getTestimonialsAdmin, saveTestimonial, deleteTestimonial } from "@/app/actions/db/testimonials"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ImageUploader } from "./image-uploader"

interface Testimonial {
  id: string
  client_name: string
  client_position: string
  client_company: string
  testimonial_text: string
  rating: number
  project_name: string
  image_url: string
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Testimonial>>({})
  const { toast } = useToast()

  useEffect(() => {
    loadTestimonials()
  }, [])

  async function loadTestimonials() {
    try {
      const data = await getTestimonialsAdmin()
      setTestimonials(
        (data as Record<string, unknown>[]).map((r) => ({
          ...r,
          testimonial_text: r.content,
          image_url: (r.avatar_url ?? r.image_url) as string,
          is_featured: Boolean(r.featured),
          is_active: r.status === "published",
        })) as Testimonial[]
      )
    } catch (error) {
      console.error("Error loading testimonials:", error)
      toast({ title: "Error", description: "No se pudieron cargar los testimonios", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      await saveTestimonial({
        ...formData,
        id: editingId && editingId !== "new" ? editingId : undefined,
        content: formData.testimonial_text ?? (formData as { content?: string }).content,
        featured: formData.is_featured ?? false,
      })
      toast({ title: editingId === "new" ? "Testimonio creado exitosamente" : "Testimonio actualizado exitosamente" })
      setEditingId(null)
      setFormData({})
      loadTestimonials()
    } catch (error) {
      console.error("Error saving testimonial:", error)
      toast({ title: "Error", description: "No se pudo guardar el testimonio", variant: "destructive" })
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de eliminar este testimonio?")) return
    try {
      await deleteTestimonial(id)
      toast({ title: "Testimonio eliminado exitosamente" })
      loadTestimonials()
    } catch (error) {
      console.error("Error deleting testimonial:", error)
      toast({ title: "Error", description: "No se pudo eliminar el testimonio", variant: "destructive" })
    }
  }

  function startEdit(testimonial: Testimonial) {
    setEditingId(testimonial.id)
    setFormData(testimonial)
  }

  function cancelEdit() {
    setEditingId(null)
    setFormData({})
  }

  if (loading) {
    return <div>Cargando testimonios...</div>
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => setEditingId("new")}>
        <Plus className="h-4 w-4 mr-2" />
        Agregar Testimonio
      </Button>

      {editingId && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId === "new" ? "Nuevo Testimonio" : "Editar Testimonio"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nombre del Cliente</label>
                <Input
                  value={formData.client_name || ""}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Cargo</label>
                <Input
                  value={formData.client_position || ""}
                  onChange={(e) => setFormData({ ...formData, client_position: e.target.value })}
                  placeholder="Director de Operaciones"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Empresa</label>
                <Input
                  value={formData.client_company || ""}
                  onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                  placeholder="Empresa SA"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Proyecto</label>
                <Input
                  value={formData.project_name || ""}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  placeholder="Nombre del proyecto"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Testimonio</label>
              <Textarea
                value={formData.testimonial_text || ""}
                onChange={(e) => setFormData({ ...formData, testimonial_text: e.target.value })}
                placeholder="El testimonio del cliente..."
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Imagen / avatar (opcional)</label>
              <ImageUploader
                value={formData.image_url || ""}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                path="testimonials"
                label="Avatar"
              />
              <Input
                className="mt-2"
                value={formData.image_url || ""}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="O pegar URL: https://..."
              />
            </div>

            <div>
              <label className="text-sm font-medium">Calificación (1-5)</label>
              <Input
                type="number"
                min="1"
                max="5"
                value={formData.rating || 5}
                onChange={(e) => setFormData({ ...formData, rating: Number.parseInt(e.target.value) })}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured ?? false}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="h-4 w-4"
                />
                <label className="text-sm font-medium">Destacado</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active ?? true}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4"
                />
                <label className="text-sm font-medium">Activo</label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{testimonial.client_name}</h3>
                    {testimonial.is_featured && <Badge>Destacado</Badge>}
                    {testimonial.is_active ? (
                      <Badge variant="default">Activo</Badge>
                    ) : (
                      <Badge variant="secondary">Inactivo</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {testimonial.client_position} - {testimonial.client_company}
                  </p>
                  <p className="text-sm mb-2">{testimonial.testimonial_text}</p>
                  <p className="text-sm text-muted-foreground">Proyecto: {testimonial.project_name}</p>
                  <p className="text-sm text-yellow-600">★ {testimonial.rating}/5</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(testimonial)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(testimonial.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
