"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react"

type TableStatus = Record<string, number | "missing" | "error">

type Res = { backend: string; tables: TableStatus; ok: boolean; message: string }

export function DbVerifyCard() {
  const [res, setRes] = useState<Res | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/db-verify")
      .then((r) => r.json())
      .then((data) => {
        setRes(data)
      })
      .catch(() => setRes({ backend: "error", tables: {}, ok: false, message: "Error al conectar con /api/db-verify" }))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!res) return null

  const backendLabel = res.backend === "postgres" ? "PostgreSQL (Neon)" : res.backend === "mysql" ? "MySQL" : res.backend === "json" ? "Solo archivos JSON" : res.backend

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {res.ok ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : res.backend === "error" ? <XCircle className="h-5 w-5 text-red-600" /> : <AlertCircle className="h-5 w-5 text-amber-600" />}
          Conexión y tablas
        </CardTitle>
        <CardDescription>
          Backend: <Badge variant={res.ok ? "default" : "secondary"}>{backendLabel}</Badge>
          {res.message && <span className="ml-2">{res.message}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(res.tables).length > 0 && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(res.tables).map(([table, count]) => (
              <div key={table} className="flex justify-between rounded border px-3 py-2">
                <span>{table}</span>
                {count === "missing" ? (
                  <Badge variant="destructive">falta tabla</Badge>
                ) : count === "error" ? (
                  <Badge variant="destructive">error</Badge>
                ) : (
                  <span className="text-muted-foreground">{count} filas</span>
                )}
              </div>
            ))}
          </div>
        )}
        {res.backend === "json" && (
          <p className="text-sm text-muted-foreground">
            Sin DATABASE_URL ni MySQL: los datos se leen y guardan en data/*.json. Para usar Neon, configurá DATABASE_URL y ejecutá scripts/postgres/schema.sql.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
