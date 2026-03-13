"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminRecoverPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <Card className="w-full max-w-md border-2 shadow-xl">
        <CardHeader>
          <CardTitle>Recuperar contraseña</CardTitle>
          <CardDescription>
            La recuperación de contraseña por correo no está disponible con MySQL.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Contacte al administrador del sistema para restablecer su contraseña, o ejecute en el servidor un script que actualice el campo <code className="rounded bg-muted px-1">password_hash</code> en la tabla <code className="rounded bg-muted px-1">users</code> con un nuevo hash bcrypt.
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
