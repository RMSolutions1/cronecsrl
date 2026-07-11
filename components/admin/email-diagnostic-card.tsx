"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Send, CheckCircle2, AlertCircle, Settings } from "lucide-react"
import { sendTestEmailAction } from "@/app/actions/admin/test-email"

type EmailSummary = {
  configured: boolean
  provider: string | null
  from: string
  adminTo: string[]
  smtpHost: string
  smtpPort: number
  smtpUser: string
  hasPassword: boolean
  source?: string
  storedInDb?: boolean
}

export function EmailDiagnosticCard({ summary }: { summary: EmailSummary }) {
  const [to, setTo] = useState(summary.adminTo[0] ?? "")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  const handleTest = async () => {
    setLoading(true)
    setResult(null)
    const fd = new FormData()
    fd.set("to", to)
    const res = await sendTestEmailAction(fd)
    setResult(res)
    setLoading(false)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Correo electrónico (SMTP)
        </CardTitle>
        <CardDescription>
          Notificaciones de contacto, boletín y recuperación de contraseña admin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant={summary.configured ? "default" : "destructive"}>
            {summary.configured ? "Configurado" : "Sin configurar"}
          </Badge>
          {summary.provider && <Badge variant="outline">Proveedor: {summary.provider.toUpperCase()}</Badge>}
          {summary.storedInDb && <Badge variant="outline">Guardado en panel</Badge>}
        </div>
        <dl className="grid gap-2 text-sm">
          <div><dt className="text-muted-foreground inline">Remitente: </dt><dd className="inline">{summary.from}</dd></div>
          <div><dt className="text-muted-foreground inline">Notificaciones admin: </dt><dd className="inline">{summary.adminTo.join(", ")}</dd></div>
          <div><dt className="text-muted-foreground inline">SMTP Ferozo: </dt><dd className="inline">{summary.smtpUser} @ {summary.smtpHost}:{summary.smtpPort}</dd></div>
          <div><dt className="text-muted-foreground inline">Contraseña SMTP: </dt><dd className="inline">{summary.hasPassword ? "Configurada" : "Falta contraseña"}</dd></div>
        </dl>
        {!summary.configured && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Configurá el correo en{" "}
              <Link href="/admin/correo" className="font-medium underline">
                Admin → Correo
              </Link>
              : email, contraseña y servidor Ferozo (c2751446.ferozo.com:465).
            </AlertDescription>
          </Alert>
        )}
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/admin/correo">
              <Settings className="h-4 w-4" />
              Configurar correo
            </Link>
          </Button>
        </div>
        {summary.configured && (
          <div className="flex flex-col sm:flex-row gap-3 items-end pt-2 border-t">
            <div className="flex-1 space-y-2 w-full">
              <Label htmlFor="test-email-to">Enviar prueba a</Label>
              <Input id="test-email-to" type="email" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <Button onClick={handleTest} disabled={loading} className="gap-2">
              <Send className="h-4 w-4" />
              {loading ? "Enviando..." : "Probar correo"}
            </Button>
          </div>
        )}
        {result && (
          <Alert variant={result.ok ? "default" : "destructive"}>
            {result.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
