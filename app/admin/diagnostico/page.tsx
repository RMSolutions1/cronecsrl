import { getCurrentUser } from "@/lib/auth"
import { readData } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import { redirect } from "next/navigation"
import { DbVerifyCard } from "@/components/admin/db-verify-card"

export default async function DiagnosticoPage() {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) redirect("/admin/login")

  let admins: { id: string; email: string; full_name?: string; role: string }[] = []
  try {
    admins = await readData("admins.json")
  } catch {
    // sin datos
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Diagnóstico del sistema</h1>

        <DbVerifyCard />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Administradores (data/admins.json)</CardTitle>
            <CardDescription>Total: {admins.length}. Para crear el primero: node scripts/seed-admin-json.js</CardDescription>
          </CardHeader>
          <CardContent>
            {admins.length > 0 ? (
              <div className="space-y-2">
                {admins.map((u) => (
                  <div key={u.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{u.email}</p>
                      <p className="text-sm text-gray-600">{u.full_name ?? ""}</p>
                    </div>
                    <Badge variant={u.role === "superadmin" ? "default" : "secondary"}>{u.role}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No hay administradores. Ejecute: node scripts/seed-admin-json.js</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Archivos de datos (carpeta data/)</CardTitle>
            <CardDescription>Con BD configurada se usa Postgres/MySQL; si no, se usan archivos en data/.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {["projects.json", "services.json", "messages.json", "blog.json", "testimonials.json", "certifications.json", "clients.json", "hero-images.json", "settings.json", "admins.json"].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>{t}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
