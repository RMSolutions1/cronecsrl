"use client"

import { useEffect, useState } from "react"
import {
  getEmailSettingsAction,
  saveEmailSettingsAction,
  type SaveEmailSettingsInput,
} from "@/app/actions/db/email-settings"
import { sendTestEmailAction } from "@/app/actions/admin/test-email"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, AlertCircle, Mail, Save, Send, Server } from "lucide-react"
import type { EmailSettingsPublic } from "@/lib/email-settings-store"

export function EmailSettingsManager() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testTo, setTestTo] = useState("")
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null)
  const [form, setForm] = useState<SaveEmailSettingsInput>({
    smtpHost: "",
    smtpPort: 465,
    smtpSecure: true,
    smtpUser: "",
    smtpPass: "",
    smtpFrom: "",
    replyTo: "",
    notifyTo: "",
    imapPort: 993,
    pop3Port: 995,
  })
  const [hasPassword, setHasPassword] = useState(false)

  useEffect(() => {
    void loadSettings()
  }, [])

  async function loadSettings() {
    setLoading(true)
    try {
      const data = await getEmailSettingsAction()
      applySettings(data)
    } catch {
      toast({ title: "Error", description: "No se pudo cargar la configuración de correo.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  function applySettings(data: EmailSettingsPublic) {
    setForm({
      smtpHost: data.smtpHost,
      smtpPort: data.smtpPort,
      smtpSecure: data.smtpSecure,
      smtpUser: data.smtpUser,
      smtpPass: "",
      smtpFrom: data.smtpFrom,
      replyTo: data.replyTo,
      notifyTo: data.notifyTo,
      imapPort: data.imapPort,
      pop3Port: data.pop3Port,
    })
    setHasPassword(data.hasPassword)
    setTestTo(data.notifyTo || data.smtpUser)
  }

  function updateField<K extends keyof SaveEmailSettingsInput>(key: K, value: SaveEmailSettingsInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setTestResult(null)
    const result = await saveEmailSettingsAction(form)
    setSaving(false)
    if (result.ok) {
      toast({ title: "Guardado", description: result.message })
      await loadSettings()
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" })
    }
  }

  async function handleTest() {
    setTesting(true)
    setTestResult(null)
    const fd = new FormData()
    fd.set("to", testTo)
    const result = await sendTestEmailAction(fd)
    setTestResult(result)
    setTesting(false)
  }

  if (loading) {
    return <div className="p-8 text-muted-foreground">Cargando configuración de correo...</div>
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold">Correo electrónico</h1>
        <p className="mt-2 text-muted-foreground">
          Configurá el casillero Ferozo/DonWeb desde el panel. No hace falta cargar variables en Vercel.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant={hasPassword ? "default" : "destructive"}>
          {hasPassword ? "Contraseña guardada" : "Falta contraseña"}
        </Badge>
        <Badge variant="outline">Servidor: {form.smtpHost}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Servidor Ferozo (precargado)
          </CardTitle>
          <CardDescription>
            Datos del panel DonWeb/Ferozo. El sitio usa SMTP saliente para enviar notificaciones y recuperación de clave.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
            <h3 className="font-semibold">Correo entrante</h3>
            <dl className="space-y-1 text-sm">
              <div><dt className="text-muted-foreground inline">Servidor: </dt><dd className="inline font-mono">{form.smtpHost}</dd></div>
              <div><dt className="text-muted-foreground inline">SSL: </dt><dd className="inline">Sí</dd></div>
              <div><dt className="text-muted-foreground inline">IMAP: </dt><dd className="inline">{form.imapPort}</dd></div>
              <div><dt className="text-muted-foreground inline">POP3: </dt><dd className="inline">{form.pop3Port}</dd></div>
            </dl>
          </div>
          <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
            <h3 className="font-semibold">Correo saliente (SMTP)</h3>
            <dl className="space-y-1 text-sm">
              <div><dt className="text-muted-foreground inline">Servidor: </dt><dd className="inline font-mono">{form.smtpHost}</dd></div>
              <div><dt className="text-muted-foreground inline">SSL: </dt><dd className="inline">Sí</dd></div>
              <div><dt className="text-muted-foreground inline">Puerto SMTP: </dt><dd className="inline">{form.smtpPort}</dd></div>
            </dl>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Casillero y credenciales
          </CardTitle>
          <CardDescription>Email y contraseña del casillero (ej. info@cronecsrl.com.ar).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtp-user">Email (usuario SMTP)</Label>
              <Input
                id="smtp-user"
                type="email"
                value={form.smtpUser}
                onChange={(e) => updateField("smtpUser", e.target.value)}
                placeholder="info@cronecsrl.com.ar"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-pass">Contraseña</Label>
              <Input
                id="smtp-pass"
                type="password"
                value={form.smtpPass}
                onChange={(e) => updateField("smtpPass", e.target.value)}
                placeholder={hasPassword ? "Dejar vacío para mantener la actual" : "Contraseña del casillero"}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">Servidor SMTP</Label>
              <Input
                id="smtp-host"
                value={form.smtpHost}
                onChange={(e) => updateField("smtpHost", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">Puerto SMTP</Label>
              <Input
                id="smtp-port"
                type="number"
                value={form.smtpPort}
                onChange={(e) => updateField("smtpPort", Number(e.target.value))}
              />
            </div>
            <div className="flex items-end gap-3 pb-2">
              <Switch
                id="smtp-secure"
                checked={form.smtpSecure}
                onCheckedChange={(v) => updateField("smtpSecure", v)}
              />
              <Label htmlFor="smtp-secure">SSL / TLS</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtp-from">Remitente (From)</Label>
            <Input
              id="smtp-from"
              value={form.smtpFrom}
              onChange={(e) => updateField("smtpFrom", e.target.value)}
              placeholder="CRONEC SRL <info@cronecsrl.com.ar>"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reply-to">Responder a (Reply-To)</Label>
              <Input
                id="reply-to"
                type="email"
                value={form.replyTo}
                onChange={(e) => updateField("replyTo", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notify-to">Notificaciones admin</Label>
              <Input
                id="notify-to"
                value={form.notifyTo}
                onChange={(e) => updateField("notifyTo", e.target.value)}
                placeholder="info@cronecsrl.com.ar"
              />
              <p className="text-xs text-muted-foreground">Separar varios emails con coma.</p>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar configuración"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Probar envío</CardTitle>
          <CardDescription>Guardá primero y luego enviá un correo de prueba.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="test-to">Enviar prueba a</Label>
              <Input id="test-to" type="email" value={testTo} onChange={(e) => setTestTo(e.target.value)} />
            </div>
            <Button onClick={handleTest} disabled={testing || !hasPassword} variant="secondary" className="gap-2">
              <Send className="h-4 w-4" />
              {testing ? "Enviando..." : "Probar correo"}
            </Button>
          </div>
          {!hasPassword && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Guardá la contraseña del casillero antes de probar el envío.</AlertDescription>
            </Alert>
          )}
          {testResult && (
            <Alert variant={testResult.ok ? "default" : "destructive"}>
              {testResult.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{testResult.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
