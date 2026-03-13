import { Suspense } from "react"
import { TestimonialsManager } from "@/components/admin/testimonials-manager"

export default function TestimoniosAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Testimonios</h1>
        <p className="text-muted-foreground mt-2">Administra los testimonios de clientes de CRONEC SRL</p>
      </div>

      <Suspense fallback={<div>Cargando testimonios...</div>}>
        <TestimonialsManager />
      </Suspense>
    </div>
  )
}
