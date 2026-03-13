"use client"

import { useState, useEffect } from "react"
import { getContactSubmissions, markContactAsRead, deleteContactSubmission } from "@/app/actions/db/contact"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Trash2, Mail, Phone, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Message {
  id: string
  full_name: string
  email: string
  phone: string
  company: string
  message: string
  service_interest: string
  is_read: boolean
  created_at: string
}

export function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
  const { toast } = useToast()

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    try {
      const data = await getContactSubmissions()
      setMessages((data as Message[]) || [])
    } catch (error) {
      console.error("Error loading messages:", error)
      toast({ title: "Error", description: "No se pudieron cargar los mensajes", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(id: string) {
    try {
      await markContactAsRead(id)
      toast({ title: "Mensaje marcado como leído" })
      loadMessages()
    } catch (error) {
      console.error("Error marking as read:", error)
      toast({ title: "Error", description: "No se pudo marcar como leído", variant: "destructive" })
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de eliminar este mensaje?")) return
    try {
      await deleteContactSubmission(id)
      toast({ title: "Mensaje eliminado exitosamente" })
      loadMessages()
    } catch (error) {
      console.error("Error deleting message:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el mensaje",
        variant: "destructive",
      })
    }
  }

  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread") return !msg.is_read
    if (filter === "read") return msg.is_read
    return true
  })

  const unreadCount = messages.filter((m) => !m.is_read).length

  if (loading) {
    return <div>Cargando mensajes...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Badge
            variant={filter === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("all")}
          >
            Todos ({messages.length})
          </Badge>
          <Badge
            variant={filter === "unread" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("unread")}
          >
            No leídos ({unreadCount})
          </Badge>
          <Badge
            variant={filter === "read" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("read")}
          >
            Leídos ({messages.length - unreadCount})
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No hay mensajes {filter !== "all" && filter}
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message.id} className={!message.is_read ? "border-blue-500 border-2" : ""}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{message.full_name}</h3>
                        {!message.is_read && <Badge variant="default">Nuevo</Badge>}
                        {message.service_interest && <Badge variant="outline">{message.service_interest}</Badge>}
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${message.email}`} className="hover:underline">
                            {message.email}
                          </a>
                        </div>
                        {message.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${message.phone}`} className="hover:underline">
                              {message.phone}
                            </a>
                          </div>
                        )}
                        {message.company && (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Empresa:</span>
                            <span>{message.company}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(message.created_at), "PPP 'a las' HH:mm", { locale: es })}
                        </div>
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      {!message.is_read && (
                        <Button variant="outline" size="sm" onClick={() => markAsRead(message.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(message.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
