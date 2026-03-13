import { HeroImagesManager } from "@/components/admin/hero-images-manager"

export default function ImagenesAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Imágenes del sitio</h1>
        <p className="text-muted-foreground">
          Administre las imágenes hero por página (inicio, proyectos, servicios, contacto, etc.).
        </p>
      </div>
      <HeroImagesManager />
    </div>
  )
}
