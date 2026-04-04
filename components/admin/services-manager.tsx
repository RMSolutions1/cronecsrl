"use client"

import { useState, useEffect } from "react"
import { getServicesAdmin, saveService, deleteService } from "@/app/actions/db/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Save, X, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ImageUploader } from "./image-uploader"

interface Service {
  id: string
  title: string
  slug: string
  short_description?: string
  description?: string
  full_description?: string
  icon: string
  image_url: string
  features?: string[]
  benefits?: string[]
  projects?: string
  display_order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Service>>({})
  const { toast } = useToast()

  useEffect(() => {
    loadServices()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- carga única al montar
  }, [])

  async function loadServices() {
    try {
      const data = await getServicesAdmin()
      setServices(
        data.map((s) => ({
          ...s,
          full_description: s.description ?? s.short_description ?? "",
          short_description: s.short_description ?? undefined,
          description: s.description ?? undefined,
          icon: s.icon ?? "",
          image_url: s.image_url ?? "",
        })) as Service[]
      )
    } catch (error) {
      console.error("Error loading services:", error)
      toast({ title: "Error", description: "No se pudieron cargar los servicios", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      await saveService({
        ...formData,
        id: editingId === "new" ? undefined : editingId ?? undefined,
        description: formData.full_description ?? formData.description,
        projects: formData.projects ?? undefined,
      })
      toast({ title: editingId === "new" ? "Servicio creado exitosamente" : "Servicio actualizado exitosamente" })
      setEditingId(null)
      setFormData({})
      loadServices()
    } catch (error) {
      console.error("Error saving service:", error)
      toast({ title: "Error", description: "No se pudo guardar el servicio", variant: "destructive" })
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de eliminar este servicio?")) return
    try {
      await deleteService(id)
      toast({ title: "Servicio eliminado exitosamente" })
      loadServices()
    } catch (error) {
      console.error("Error deleting service:", error)
      toast({ title: "Error", description: "No se pudo eliminar el servicio", variant: "destructive" })
    }
  }

  function startEdit(service: Service) {
    setEditingId(service.id)
    setFormData(service)
  }

  function cancelEdit() {
    setEditingId(null)
    setFormData({})
  }

  if (loading) {
    return <div>Cargando servicios...</div>
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => setEditingId("new")}>
        <Plus className="h-4 w-4 mr-2" />
        Agregar Servicio
      </Button>

      {editingId && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId === "new" ? "Nuevo Servicio" : "Editar Servicio"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título</label>
              <Input
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Obras Generales"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Slug (URL)</label>
              <Input
                value={formData.slug || ""}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="obras-generales"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Descripción Corta</label>
              <Textarea
                value={formData.short_description || ""}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Descripción breve para cards"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Descripción Completa</label>
              <Textarea
                value={formData.full_description || ""}
                onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                placeholder="Descripción detallada del servicio"
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Imagen del servicio</label>
              <p className="text-xs text-muted-foreground mb-1">Suba una imagen o pegue una URL (ej. Unsplash). Si está vacío, se usará una imagen por defecto en la web.</p>
              <ImageUploader
                value={formData.image_url || ""}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                path="services"
              />
              <Input
                className="mt-2"
                value={formData.image_url || ""}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="O pegue URL: https://..."
              />
            </div>

            <div>
              <label className="text-sm font-medium">Proyectos (ej. 180+)</label>
              <Input
                value={formData.projects || ""}
                onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                placeholder="180+"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Características (una por línea)</label>
              <Textarea
                value={(formData.features || []).join("\n")}
                onChange={(e) => setFormData({ ...formData, features: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                placeholder="Refacción de baños&#10;Impermeabilización..."
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Beneficios (una por línea)</label>
              <Textarea
                value={(formData.benefits || []).join("\n")}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                placeholder="Materiales de primera calidad&#10;Garantía..."
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Icono (Lucide Icon)</label>
              <Input
                value={formData.icon || ""}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Building2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Orden de Visualización</label>
              <Input
                type="number"
                value={formData.display_order || 0}
                onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) })}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active ?? true}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4"
              />
              <label className="text-sm font-medium">Servicio Activo</label>
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
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="pt-0 p-0 overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0 bg-muted">
                  {service.image_url ? (
                    <Image
                      src={service.image_url}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="192px"
                      unoptimized={service.image_url.startsWith("/")}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl text-muted-foreground">📷</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{service.title}</h3>
                      {service.is_active ? (
                        <Badge variant="default">Activo</Badge>
                      ) : (
                        <Badge variant="secondary">Inactivo</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2 line-clamp-2">{service.short_description}</p>
                    <p className="text-sm text-muted-foreground">Slug: /servicios/{service.slug}</p>
                    <p className="text-sm text-muted-foreground">Orden: {service.display_order}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {service.projects && <span>Proyectos: {service.projects}</span>}
                      {(service.features?.length ?? 0) > 0 && <span>• {service.features!.length} características</span>}
                      {(service.benefits?.length ?? 0) > 0 && <span>• {service.benefits!.length} beneficios</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 flex-wrap">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/servicios/${service.slug}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => startEdit(service)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
