"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { AlertCircle, Lock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"
import { loginAction } from "./actions"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get("next")
  const redirectTo = nextUrl && nextUrl.startsWith("/admin") && !nextUrl.startsWith("/admin/login") ? nextUrl : "/admin"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.set("email", email)
      formData.set("password", password)
      const result = await loginAction(formData)

      if (result.ok) {
        router.push(redirectTo)
        router.refresh()
      } else {
        setError(result.error ?? "Error al iniciar sesión")
      }
    } catch {
      setError("Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_mini-CRONEC-pjPMvEYWU2s5qGxTrNDnxIWWufI0oB.png"
              alt="CRONEC SRL Logo"
              width={80}
              height={80}
              className="h-20 w-20"
            />
          </div>
          <h1 className="text-3xl font-bold text-blue-900">Panel Administrativo</h1>
          <p className="mt-2 text-gray-600">CRONEC SRL</p>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-1 pb-6">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Lock className="h-6 w-6 text-blue-900" />
            </div>
            <CardTitle className="text-center text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">Ingrese sus credenciales de administrador</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@cronecsrl.com.ar"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="h-11 w-full bg-blue-900 hover:bg-blue-800" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              <div className="flex flex-col space-y-2 text-center text-sm">
                <Link href="/admin/registro" className="text-blue-900 hover:underline">
                  ¿No tiene cuenta? Registrarse
                </Link>
                <Link href="/admin/recuperar" className="text-blue-900 hover:underline">
                  ¿Olvidó su contraseña?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-gray-600">Sistema de gestión de contenido CRONEC SRL</p>
      </div>
    </div>
  )
}
