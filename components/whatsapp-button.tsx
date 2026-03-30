"use client"

import { MessageCircle } from "lucide-react"
import { useState } from "react"
import { useSettings } from "@/lib/settings-context"

function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (digits.startsWith("54")) return digits
  if (digits.startsWith("9") && digits.length >= 10) return "54" + digits
  return "54" + digits
}

export function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false)
  const s = useSettings()
  const rawPhone = (s?.whatsapp as string) || "5493875361210"
  const phoneNumber = rawPhone ? normalizePhone(rawPhone) : "5493875361210"
  const message = (s?.whatsapp_default_message as string) || "Hola, me gustaría solicitar información sobre sus servicios."
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-4 text-white shadow-lg transition-all duration-300 hover:bg-[#128C7E] hover:shadow-xl hover:scale-110 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 md:bottom-8 md:right-8 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
    >
      {/* Pulse ring animation */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 group-hover:opacity-0 transition-opacity" />
      
      <MessageCircle className="h-6 w-6 md:h-7 md:w-7 relative z-10" strokeWidth={2} />

      {/* Tooltip que aparece en hover en desktop */}
      <span
        className={`hidden whitespace-nowrap text-sm font-medium transition-all duration-300 md:inline-block relative z-10 ${
          isHovered ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0"
        }`}
        style={{ overflow: "hidden" }}
      >
        Chateá con nosotros
      </span>
    </a>
  )
}
