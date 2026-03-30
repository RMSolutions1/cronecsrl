"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { changePasswordAction, updateProfileAction } from "@/app/actions/auth"
import { User, Lock, Save, Eye, EyeOff, Shield, Mail } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

type UserData = {
  id: string
  email: string
  full_name: string | null
  role: string
}

export function ProfileManager({ user }: { user: UserData }) {
  const { toast } = useToast()
  
  // Estado para perfil
  const [fullName, setFullName] = useState(user.full_name || "")
  const [savingProfile, setSavingProfile] = useState(false)
  
  // Estado para contraseña
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const handleUpdateProfile = async () => {
    setSavingProfile(true)
    try {
      const result = await updateProfileAction(fullName)
      if (result.ok) {
        toast({ title: "Perfil actualizado", description: "Tu nombre ha sido actualizado correctamente." })
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "No se pudo actualizar el perfil", variant: "destructive" })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    // Validaciones
    if (!currentPassword) {
      toast({ title: "Error", description: "Ingresa tu contraseña actual", variant: "destructive" })
      return
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "La nueva contraseña debe tener al menos 6 caracteres", variant: "destructive" })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Las contraseñas no coinciden", variant: "destructive" })
      return
    }

    setSavingPassword(true)
    try {
      const result = await changePasswordAction(currentPassword, newPassword)
      if (result.ok) {
        toast({ title: "Contraseña actualizada", description: "Tu contraseña ha sido cambiada correctamente." })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "No se pudo cambiar la contraseña", variant: "destructive" })
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <Tabs defaultValue="perfil" className="space-y-6">
      <TabsList>
        <TabsTrigger value="perfil" className="gap-2">
          <User className="h-4 w-4" />
          Perfil
        </TabsTrigger>
        <TabsTrigger value="seguridad" className="gap-2">
          <Lock className="h-4 w-4" />
          Seguridad
        </TabsTrigger>
      </TabsList>

      <TabsContent value="perfil">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informacion del Perfil
            </CardTitle>
            <CardDescription>Actualiza tu informacion personal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Info de cuenta (solo lectura) */}
            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Rol</p>
                  <Badge variant={user.role === "superadmin" ? "default" : "secondary"}>
                    {user.role === "superadmin" ? "Super Administrador" : "Administrador"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Nombre editable */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre completo"
              />
            </div>

            <Button onClick={handleUpdateProfile} disabled={savingProfile} className="gap-2">
              <Save className="h-4 w-4" />
              {savingProfile ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="seguridad">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Cambiar Contraseña
            </CardTitle>
            <CardDescription>
              Actualiza tu contraseña de acceso. La nueva contraseña debe tener al menos 6 caracteres.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Contraseña actual */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña actual</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Nueva contraseña */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ingresa tu nueva contraseña"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {newPassword && newPassword.length < 6 && (
                <p className="text-sm text-destructive">La contraseña debe tener al menos 6 caracteres</p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-destructive">Las contraseñas no coinciden</p>
              )}
            </div>

            <Button 
              onClick={handleChangePassword} 
              disabled={savingPassword || !currentPassword || newPassword.length < 6 || newPassword !== confirmPassword}
              className="gap-2"
            >
              <Lock className="h-4 w-4" />
              {savingPassword ? "Cambiando..." : "Cambiar Contraseña"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
