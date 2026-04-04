"use client"

import { useState, useEffect, useCallback } from "react"
import { getHeroImagesAdmin, addHeroImage, updateHeroImage, deleteHeroImage } from "@/app/actions/db/hero-images"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Save, Upload, Trash2, Plus, Pencil, Image as ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface HeroImage {
  id: string
  page: string
  image_url: string
  alt_text: string
  order_index: number
}

const pages = [
  { id: "home", name: "Inicio", description: "Imagenes del hero principal" },
  { id: "servicios", name: "Servicios", description: "Imagenes de la pagina de servicios" },
  { id: "proyectos", name: "Proyectos", description: "Imagenes de la pagina de proyectos" },
  { id: "nosotros", name: "Nosotros", description: "Imagenes de la pagina sobre nosotros" },
  { id: "contacto", name: "Contacto", description: "Imagenes de la pagina de contacto" },
  { id: "blog", name: "Blog", description: "Imagenes de la pagina de noticias" },
]

export function HeroImagesManager() {
  const [images, setImages] = useState<HeroImage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedPage, setSelectedPage] = useState("home")
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newImageAlt, setNewImageAlt] = useState("")
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editUrl, setEditUrl] = useState("")
  const [editAlt, setEditAlt] = useState("")
  const [savingEdit, setSavingEdit] = useState(false)
  const { toast } = useToast()

  const loadImages = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getHeroImagesAdmin(selectedPage)
      setImages((data as HeroImage[]) || [])
    } catch (error) {
      console.error("Error loading images:", error)
      setImages([])
    } finally {
      setLoading(false)
    }
  }, [selectedPage])

  useEffect(() => {
    void loadImages()
  }, [loadImages])

  async function handleAddImage() {
    if (!newImageUrl.trim()) {
      toast({ title: "Error", description: "Por favor ingrese una URL de imagen", variant: "destructive" })
      return
    }
    setSaving(true)
    try {
      await addHeroImage({
        page: selectedPage,
        image_url: newImageUrl,
        alt_text: newImageAlt || `Imagen de ${selectedPage}`,
        order_index: images.length,
      })
      toast({ title: "Imagen agregada exitosamente" })
      setNewImageUrl("")
      setNewImageAlt("")
      loadImages()
    } catch (error) {
      console.error("Error adding image:", error)
      toast({ title: "Error", description: "No se pudo agregar la imagen.", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  function startEdit(img: HeroImage) {
    setEditingId(img.id)
    setEditUrl(img.image_url ?? "")
    setEditAlt(img.alt_text ?? "")
  }

  async function handleSaveEdit() {
    if (!editingId) return
    setSavingEdit(true)
    try {
      await updateHeroImage(editingId, { image_url: editUrl, alt_text: editAlt })
      toast({ title: "Imagen actualizada" })
      setEditingId(null)
      loadImages()
    } catch (error) {
      console.error("Error updating image:", error)
      toast({ title: "Error", description: "No se pudo actualizar la imagen", variant: "destructive" })
    } finally {
      setSavingEdit(false)
    }
  }

  async function handleDeleteImage(id: string) {
    if (!confirm("¿Está seguro de eliminar esta imagen?")) return
    try {
      await deleteHeroImage(id)
      toast({ title: "Imagen eliminada" })
      setEditingId(null)
      loadImages()
    } catch (error) {
      console.error("Error deleting image:", error)
      toast({ title: "Error", description: "No se pudo eliminar la imagen", variant: "destructive" })
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("path", "hero")
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Error al subir")
      const url = data.url
      if (url) {
        setNewImageUrl(url)
        toast({ title: "Imagen subida exitosamente" })
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      const message = error instanceof Error ? error.message : "No se pudo subir la imagen."
      toast({
        title: "Error al subir",
        description: message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const pageImages = images.filter(img => img.page === selectedPage)
  const currentPage = pages.find(p => p.id === selectedPage)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Imagenes Hero del Sitio</h2>
        <p className="text-muted-foreground">
          Administre las imagenes de los carruseles hero de cada pagina (recomendado: 3 imagenes por pagina)
        </p>
      </div>

      <Tabs value={selectedPage} onValueChange={setSelectedPage}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          {pages.map((page) => (
            <TabsTrigger key={page.id} value={page.id} className="text-sm">
              {page.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {pages.map((page) => (
          <TabsContent key={page.id} value={page.id} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Imagenes de {page.name}
                </CardTitle>
                <CardDescription>{page.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Imagenes actuales */}
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Cargando imagenes...</div>
                ) : pageImages.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No hay imagenes configuradas para esta pagina</p>
                    <p className="text-sm text-muted-foreground/70">Agregue imagenes usando el formulario de abajo</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {pageImages.map((img, index) => (
                      <div key={img.id} className="rounded-lg overflow-hidden border">
                        {editingId === img.id ? (
                          <div className="p-4 space-y-3 bg-muted/50">
                            <p className="text-sm font-medium">Editar imagen #{index + 1}</p>
                            <Input
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                              placeholder="URL de la imagen"
                            />
                            <Input
                              value={editAlt}
                              onChange={(e) => setEditAlt(e.target.value)}
                              placeholder="Texto alternativo"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleSaveEdit} disabled={savingEdit}>
                                <Save className="h-3 w-3 mr-1" /> Guardar
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancelar</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="relative group">
                            <div className="aspect-video relative">
                              <Image
                                src={img.image_url}
                                alt={img.alt_text}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button variant="secondary" size="sm" onClick={() => startEdit(img)}>
                                <Pencil className="h-4 w-4" /> Editar
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteImage(img.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="absolute top-2 left-2">
                              <Badge variant="secondary" className="text-xs">#{index + 1}</Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Agregar nueva imagen */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar Nueva Imagen
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-1 block">URL de la Imagen</label>
                        <Input
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="https://example.com/imagen.jpg o suba una imagen"
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={uploading}
                          />
                          <Button variant="outline" disabled={uploading} asChild>
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              {uploading ? "Subiendo..." : "Subir"}
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Texto Alternativo (accesibilidad)</label>
                      <Input
                        value={newImageAlt}
                        onChange={(e) => setNewImageAlt(e.target.value)}
                        placeholder="Descripcion de la imagen para lectores de pantalla"
                      />
                    </div>

                    {newImageUrl && (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Vista previa:</p>
                        <div className="relative aspect-video max-w-md rounded overflow-hidden">
                          <Image
                            src={newImageUrl}
                            alt="Vista previa"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <Button onClick={handleAddImage} disabled={saving || !newImageUrl}>
                      <Plus className="h-4 w-4 mr-2" />
                      {saving ? "Agregando..." : "Agregar Imagen"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">Nota Importante</h4>
          <p className="text-sm text-blue-800">
            Las imagenes del hero se muestran en un carrusel automatico. Se recomienda usar 
            imagenes de alta calidad con relacion de aspecto 16:9 y un tamaño minimo de 1920x1080 pixeles.
            Las imagenes deben estar optimizadas para web (formato JPG o WebP).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
