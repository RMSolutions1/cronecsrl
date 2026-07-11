"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { resetPasswordWithTokenAction } from "@/app/actions/auth/reset-password"

export default function AdminResetPasswordPage() {
  const params = useParams()
  const router = useRouter()
  const token = typeof params.token === "string" ? params.token : ""
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)
    const fd = new FormData()
    fd.set("password", password)
    fd.set("confirm", confirm)
    const res = await resetPasswordWithTokenAction(token, fd)
    setResult(res)
    setIsLoading(false)
    if (res.ok) {
      setTimeout(() => router.push("/admin/login"), 2500)
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Enlace inválido.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <Card className="w-full max-w-md border-2 shadow-xl">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Lock className="h-6 w-6 text-blue-900" />
          </div>
          <CardTitle className="text-center">Nueva contraseña</CardTitle>
          <CardDescription className="text-center">
            Elija una contraseña segura de al menos 8 caracteres.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar contraseña</Label>
              <Input
                id="confirm"
                type="password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {result && (
              <Alert variant={result.ok ? "default" : "destructive"}>
                {result.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Restablecer contraseña"}
            </Button>
          </form>
          <Button asChild variant="outline" className="w-full">
            <Link href="/admin/login">Volver al inicio de sesión</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
