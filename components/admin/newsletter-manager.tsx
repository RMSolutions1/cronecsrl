"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Download } from "lucide-react"
import type { NewsletterSubscriber } from "@/lib/newsletter-store"

export function NewsletterManager({ initialSubscribers }: { initialSubscribers: NewsletterSubscriber[] }) {
  const [subscribers] = useState(initialSubscribers)

  const exportCsv = () => {
    const header = "email,suscrito_en\n"
    const rows = subscribers.map((s) => `${s.email},${s.subscribed_at}`).join("\n")
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `boletin-cronec-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {subscribers.length} suscriptor{subscribers.length === 1 ? "" : "es"}
          </CardTitle>
          <CardDescription>Lista exportable para campañas de email marketing.</CardDescription>
        </div>
        {subscribers.length > 0 && (
          <Button variant="outline" size="sm" onClick={exportCsv} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {subscribers.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aún no hay suscriptores. Aparecerán aquí cuando alguien se registre en el blog.</p>
        ) : (
          <ul className="divide-y rounded-md border max-h-[480px] overflow-y-auto">
            {subscribers.map((s) => (
              <li key={s.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>{s.email}</span>
                <span className="text-muted-foreground text-xs">
                  {new Date(s.subscribed_at).toLocaleDateString("es-AR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
