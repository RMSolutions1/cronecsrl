"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminRegisterPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <Card className="w-full max-w-md border-2 shadow-xl">
        <CardHeader>
          <CardTitle>Registro de administrador</CardTitle>
          <CardDescription>
            Los usuarios administradores se crean directamente en la base de datos MySQL.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Ejecute en su servidor: <code className="rounded bg-muted px-1">npm run db:seed-admin</code>
              <br />
              O cree un usuario en la tabla <code className="rounded bg-muted px-1">users</code> con email, password_hash (bcrypt) y role = &apos;admin&apos;.
            </AlertDescription>
          </Alert>
          <Button asChild variant="outline" className="w-full">
            <Link href="/admin/login">Volver al inicio de sesión</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
