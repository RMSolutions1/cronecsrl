"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function BlogNewsletterForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error("Ingrese su correo electrónico")
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.success) {
        toast.success(data.message ?? "¡Suscripción confirmada!")
        setEmail("")
      } else {
        toast.error(data.message ?? "No se pudo completar la suscripción.")
      }
    } catch {
      toast.error("Error de conexión. Intente más tarde.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        name="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Su correo electrónico"
        aria-label="Correo electrónico para suscripción al boletín"
        className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        {isSubmitting ? "Enviando..." : "Suscribirse"}
      </Button>
    </form>
  )
}
