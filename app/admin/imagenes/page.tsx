import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { HeroImagesManager } from "@/components/admin/hero-images-manager"

export default async function ImagenesAdminPage() {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) redirect("/admin/login")
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
