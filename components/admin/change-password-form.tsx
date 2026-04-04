"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { changePasswordAction } from "@/app/actions/auth/change-password"
import { AlertCircle, CheckCircle2, KeyRound } from "lucide-react"

export function ChangePasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)
    try {
      const fd = new FormData(e.currentTarget)
      const result = await changePasswordAction(fd)
      if (result.ok) {
        setSuccess(true)
        e.currentTarget.reset()
      } else {
        setError(result.error ?? "No se pudo cambiar la contraseña")
      }
    } catch {
      setError("Error inesperado. Intentá de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md border-stone-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <KeyRound className="h-5 w-5" />
          Cambiar contraseña
        </CardTitle>
        <CardDescription>
          Ingresá tu contraseña actual y elegí una nueva (mínimo 8 caracteres). Los datos se guardan en la base o en{" "}
          <code className="rounded bg-muted px-1 text-xs">data/admins.json</code> si no hay BD.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-900 dark:bg-green-950/30 dark:text-green-100">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Contraseña actualizada. La próxima vez que cierres sesión usá la nueva clave.</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña actual</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full bg-stone-900 hover:bg-stone-800" disabled={loading}>
            {loading ? "Guardando…" : "Guardar nueva contraseña"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
