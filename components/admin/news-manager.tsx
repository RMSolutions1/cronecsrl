"use client"

import { useState } from "react"
import { saveBlogPost, deleteBlogPost } from "@/app/actions/db/blog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, Newspaper, Calendar, Star, StarOff } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ImageUploader } from "./image-uploader"

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  image_url?: string | null
  category?: string | null
  tags?: string[] | null
  author_name?: string | null
  status: string
  featured: boolean
  published_at?: string | null
  created_at?: string
}

interface NewsManagerProps {
  posts: Post[]
}

const categories = [
  { value: "noticias", label: "Noticias" },
  { value: "proyectos", label: "Proyectos" },
  { value: "empresa", label: "Empresa" },
  { value: "industria", label: "Industria" },
]

export function NewsManager({ posts: initialPosts }: NewsManagerProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    category: "noticias",
    tags: "",
    author_name: "",
    status: "draft",
    featured: false,
  })

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image_url: "",
      category: "noticias",
      tags: "",
      author_name: "",
      status: "draft",
      featured: false,
    })
    setEditingPost(null)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: editingPost ? prev.slug : generateSlug(value)
    }))
  }

  const openEditDialog = (post: Post) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      image_url: post.image_url || "",
      category: post.category ?? "",
      tags: post.tags?.join(", ") || "",
      author_name: post.author_name || "",
      status: post.status ?? "draft",
      featured: post.featured,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Titulo y contenido son requeridos")
      return
    }

    setIsLoading(true)

    const postData = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      excerpt: formData.excerpt || null,
      content: formData.content,
      image_url: formData.image_url || null,
      category: formData.category,
      tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : null,
      author_name: formData.author_name || null,
      status: formData.status,
      featured: formData.featured,
      published_at: formData.status === "published" ? new Date().toISOString() : null,
    }

    try {
      await saveBlogPost({
        ...(editingPost?.id && { id: editingPost.id }),
        ...postData,
        tags: postData.tags,
      })
      if (editingPost) {
        setPosts(posts.map(p => p.id === editingPost.id ? { ...p, ...postData } : p))
        toast.success("Noticia actualizada correctamente")
      } else {
        setPosts([{ ...postData, id: "", created_at: new Date().toISOString() } as Post, ...posts])
        toast.success("Noticia creada correctamente")
      }
      setIsDialogOpen(false)
      resetForm()
      router.refresh()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error al guardar la noticia")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleStatus = async (post: Post) => {
    const newStatus = post.status === "published" ? "draft" : "published"
    try {
      await saveBlogPost({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image_url: post.image_url,
        category: post.category,
        tags: post.tags,
        author_name: post.author_name,
        status: newStatus,
        featured: post.featured,
        published_at: newStatus === "published" ? new Date().toISOString() : null,
      })
      setPosts(posts.map(p => p.id === post.id ? { ...p, status: newStatus } : p))
      toast.success(`Noticia ${newStatus === "published" ? "publicada" : "despublicada"}`)
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error")
    }
  }

  const toggleFeatured = async (post: Post) => {
    try {
      await saveBlogPost({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image_url: post.image_url,
        category: post.category,
        tags: post.tags,
        author_name: post.author_name,
        status: post.status,
        featured: !post.featured,
        published_at: post.published_at,
      })
      setPosts(posts.map(p => p.id === post.id ? { ...p, featured: !p.featured } : p))
      toast.success(`Noticia ${!post.featured ? "destacada" : "sin destacar"}`)
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error")
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm("Esta seguro de eliminar esta noticia?")) return
    try {
      await deleteBlogPost(id)
      setPosts(posts.filter(p => p.id !== id))
      toast.success("Noticia eliminada correctamente")
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error")
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || post.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestion de Noticias</h1>
          <p className="text-muted-foreground">Crear y administrar articulos del blog</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Noticia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? "Editar Noticia" : "Nueva Noticia"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titulo *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Titulo de la noticia"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-de-la-noticia"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData(prev => ({ ...prev, status: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="archived">Archivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="excerpt">Extracto</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Breve descripcion de la noticia"
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Contenido *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Contenido completo de la noticia..."
                  rows={8}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image_url">Imagen destacada</Label>
                <ImageUploader
                  value={formData.image_url ?? ""}
                  onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                  path="blog"
                  label="Imagen"
                />
                <Input
                  id="image_url"
                  className="mt-2"
                  value={formData.image_url ?? ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="O pegar URL: https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="author_name">Autor</Label>
                  <Input
                    id="author_name"
                    value={formData.author_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                    placeholder="Nombre del autor"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (separados por coma)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="construccion, proyectos, noticias"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="featured">Destacar esta noticia</Label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Guardando..." : editingPost ? "Guardar Cambios" : "Crear Noticia"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar noticias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="published">Publicados</SelectItem>
                <SelectItem value="draft">Borradores</SelectItem>
                <SelectItem value="archived">Archivados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Noticias ({filteredPosts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No hay noticias</h3>
              <p className="text-muted-foreground">Comienza creando una nueva noticia</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Titulo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="w-16 h-12 rounded-lg bg-muted overflow-hidden relative">
                        {post.image_url ? (
                          <Image src={post.image_url} alt={post.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Newspaper className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium line-clamp-1">{post.title}</p>
                        {post.excerpt && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.status === "published" ? "default" : "secondary"}>
                        {post.status === "published" ? "Publicado" : post.status === "draft" ? "Borrador" : "Archivado"}
                      </Badge>
                      {post.featured && (
                        <Badge variant="outline" className="ml-1 bg-yellow-50 text-yellow-700 border-yellow-200">
                          Destacado
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(post.created_at ?? "").toLocaleDateString("es-AR")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => toggleFeatured(post)} title={post.featured ? "Quitar destacado" : "Destacar"}>
                          {post.featured ? <StarOff className="h-4 w-4 text-yellow-500" /> : <Star className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toggleStatus(post)} title={post.status === "published" ? "Despublicar" : "Publicar"}>
                          {post.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(post)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deletePost(post.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
