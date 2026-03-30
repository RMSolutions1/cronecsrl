"use client"

import { useState, useEffect } from "react"
import { 
  getContactSubmissions, 
  markContactAsRead, 
  deleteContactSubmission,
  updateContactNotes,
  updateContactStatus,
  saveAdminReply
} from "@/app/actions/db/contact"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CheckCircle, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  Building2, 
  MessageSquare, 
  Send, 
  MoreVertical,
  Eye,
  Reply,
  StickyNote,
  Clock,
  CheckCheck,
  XCircle,
  Search,
  RefreshCw,
  Inbox,
  AlertCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format, formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface Message {
  id: string
  full_name: string
  email: string
  phone?: string | null
  company?: string | null
  message: string
  service_interest?: string | null
  is_read: boolean
  status?: string
  notes?: string | null
  admin_reply?: string | null
  replied_at?: string | null
  replied_by?: string | null
  created_at: string
  updated_at?: string | null
}

const STATUS_OPTIONS = [
  { value: "new", label: "Nuevo", color: "bg-blue-500" },
  { value: "in_progress", label: "En proceso", color: "bg-yellow-500" },
  { value: "replied", label: "Respondido", color: "bg-green-500" },
  { value: "closed", label: "Cerrado", color: "bg-gray-500" },
  { value: "spam", label: "Spam", color: "bg-red-500" },
]

export function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [notesContent, setNotesContent] = useState("")
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    setLoading(true)
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
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m))
      toast({ title: "Mensaje marcado como leído" })
    } catch (error) {
      console.error("Error marking as read:", error)
      toast({ title: "Error", description: "No se pudo marcar como leído", variant: "destructive" })
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de eliminar este mensaje? Esta acción no se puede deshacer.")) return
    try {
      await deleteContactSubmission(id)
      setMessages(messages.filter(m => m.id !== id))
      toast({ title: "Mensaje eliminado exitosamente" })
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
        setIsViewDialogOpen(false)
      }
    } catch (error) {
      console.error("Error deleting message:", error)
      toast({ title: "Error", description: "No se pudo eliminar el mensaje", variant: "destructive" })
    }
  }

  async function handleStatusChange(id: string, status: string) {
    try {
      await updateContactStatus(id, status)
      setMessages(messages.map(m => m.id === id ? { ...m, status } : m))
      toast({ title: "Estado actualizado" })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({ title: "Error", description: "No se pudo actualizar el estado", variant: "destructive" })
    }
  }

  async function handleSaveNotes() {
    if (!selectedMessage) return
    try {
      await updateContactNotes(selectedMessage.id, notesContent)
      setMessages(messages.map(m => m.id === selectedMessage.id ? { ...m, notes: notesContent } : m))
      setIsNotesDialogOpen(false)
      toast({ title: "Notas guardadas" })
    } catch (error) {
      console.error("Error saving notes:", error)
      toast({ title: "Error", description: "No se pudieron guardar las notas", variant: "destructive" })
    }
  }

  async function handleSendReply() {
    if (!selectedMessage || !replyContent.trim()) return
    
    setSending(true)
    try {
      // Guardar la respuesta en la BD
      await saveAdminReply(selectedMessage.id, replyContent)
      
      // Abrir el cliente de email con el contenido pre-llenado
      const subject = encodeURIComponent(`Re: Consulta de ${selectedMessage.full_name} - CRONEC SRL`)
      const body = encodeURIComponent(replyContent)
      window.open(`mailto:${selectedMessage.email}?subject=${subject}&body=${body}`, "_blank")
      
      // Actualizar el estado local
      setMessages(messages.map(m => m.id === selectedMessage.id ? { 
        ...m, 
        status: "replied", 
        is_read: true,
        admin_reply: replyContent,
        replied_at: new Date().toISOString()
      } : m))
      
      setIsReplyDialogOpen(false)
      setReplyContent("")
      toast({ title: "Respuesta registrada", description: "Se abrió tu cliente de email para enviar la respuesta" })
    } catch (error) {
      console.error("Error sending reply:", error)
      toast({ title: "Error", description: "No se pudo registrar la respuesta", variant: "destructive" })
    } finally {
      setSending(false)
    }
  }

  function openReplyDialog(message: Message) {
    setSelectedMessage(message)
    setReplyContent(`Estimado/a ${message.full_name},\n\nGracias por contactarnos.\n\n\n\nSaludos cordiales,\nEquipo CRONEC SRL`)
    setIsReplyDialogOpen(true)
    if (!message.is_read) {
      markAsRead(message.id)
    }
  }

  function openNotesDialog(message: Message) {
    setSelectedMessage(message)
    setNotesContent(message.notes || "")
    setIsNotesDialogOpen(true)
  }

  function openViewDialog(message: Message) {
    setSelectedMessage(message)
    setIsViewDialogOpen(true)
    if (!message.is_read) {
      markAsRead(message.id)
    }
  }

  function getStatusBadge(status?: string) {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0]
    return (
      <Badge className={`${statusOption.color} text-white`}>
        {statusOption.label}
      </Badge>
    )
  }

  const filteredMessages = messages.filter((msg) => {
    // Filtro por estado
    if (filter === "unread" && msg.is_read) return false
    if (filter === "new" && msg.status !== "new") return false
    if (filter === "in_progress" && msg.status !== "in_progress") return false
    if (filter === "replied" && msg.status !== "replied") return false
    if (filter === "closed" && msg.status !== "closed") return false
    
    // Filtro por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        msg.full_name?.toLowerCase().includes(query) ||
        msg.email?.toLowerCase().includes(query) ||
        msg.company?.toLowerCase().includes(query) ||
        msg.message?.toLowerCase().includes(query) ||
        msg.service_interest?.toLowerCase().includes(query)
      )
    }
    
    return true
  })

  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.is_read).length,
    new: messages.filter(m => m.status === "new" || !m.status).length,
    inProgress: messages.filter(m => m.status === "in_progress").length,
    replied: messages.filter(m => m.status === "replied").length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setFilter("all")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Inbox className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className={`cursor-pointer hover:border-primary transition-colors ${filter === "unread" ? "border-primary" : ""}`} onClick={() => setFilter("unread")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sin leer</p>
                <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className={`cursor-pointer hover:border-primary transition-colors ${filter === "new" ? "border-primary" : ""}`} onClick={() => setFilter("new")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nuevos</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.new}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className={`cursor-pointer hover:border-primary transition-colors ${filter === "in_progress" ? "border-primary" : ""}`} onClick={() => setFilter("in_progress")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En proceso</p>
                <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className={`cursor-pointer hover:border-primary transition-colors ${filter === "replied" ? "border-primary" : ""}`} onClick={() => setFilter("replied")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Respondidos</p>
                <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
              </div>
              <CheckCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email, empresa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={loadMessages} className="shrink-0">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? "No se encontraron mensajes con esa búsqueda" : "No hay mensajes"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card 
              key={message.id} 
              className={`transition-all hover:shadow-md ${!message.is_read ? "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20" : ""}`}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold truncate">{message.full_name}</h3>
                      {!message.is_read && <Badge variant="default" className="bg-blue-500">Nuevo</Badge>}
                      {getStatusBadge(message.status)}
                      {message.service_interest && (
                        <Badge variant="outline">{message.service_interest}</Badge>
                      )}
                      {message.notes && (
                        <Badge variant="secondary" className="gap-1">
                          <StickyNote className="h-3 w-3" />
                          Notas
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                      <a href={`mailto:${message.email}`} className="flex items-center gap-1 hover:text-primary hover:underline">
                        <Mail className="h-3.5 w-3.5" />
                        {message.email}
                      </a>
                      {message.phone && (
                        <a href={`tel:${message.phone}`} className="flex items-center gap-1 hover:text-primary hover:underline">
                          <Phone className="h-3.5 w-3.5" />
                          {message.phone}
                        </a>
                      )}
                      {message.company && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {message.company}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: es })}
                      </span>
                    </div>

                    <p className="text-sm text-foreground line-clamp-2">{message.message}</p>

                    {message.admin_reply && (
                      <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1 flex items-center gap-1">
                          <CheckCheck className="h-3 w-3" />
                          Respondido {message.replied_at && format(new Date(message.replied_at), "dd/MM/yyyy HH:mm")}
                        </p>
                        <p className="text-sm text-green-800 dark:text-green-200 line-clamp-2">{message.admin_reply}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => openViewDialog(message)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="default" size="sm" onClick={() => openReplyDialog(message)}>
                      <Reply className="h-4 w-4 mr-1" />
                      Responder
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {!message.is_read && (
                          <DropdownMenuItem onClick={() => markAsRead(message.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marcar como leído
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => openNotesDialog(message)}>
                          <StickyNote className="h-4 w-4 mr-2" />
                          {message.notes ? "Editar notas" : "Agregar notas"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Cambiar estado</DropdownMenuLabel>
                        {STATUS_OPTIONS.map(status => (
                          <DropdownMenuItem 
                            key={status.value}
                            onClick={() => handleStatusChange(message.id, status.value)}
                            className={message.status === status.value ? "bg-muted" : ""}
                          >
                            <div className={`h-2 w-2 rounded-full ${status.color} mr-2`} />
                            {status.label}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(message.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Mensaje de {selectedMessage?.full_name}
            </DialogTitle>
            <DialogDescription>
              Recibido {selectedMessage && format(new Date(selectedMessage.created_at), "PPP 'a las' HH:mm", { locale: es })}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {getStatusBadge(selectedMessage.status)}
                {selectedMessage.service_interest && (
                  <Badge variant="outline">{selectedMessage.service_interest}</Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="font-medium">
                    <a href={`mailto:${selectedMessage.email}`} className="hover:underline text-primary">
                      {selectedMessage.email}
                    </a>
                  </p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Teléfono</Label>
                    <p className="font-medium">
                      <a href={`tel:${selectedMessage.phone}`} className="hover:underline text-primary">
                        {selectedMessage.phone}
                      </a>
                    </p>
                  </div>
                )}
                {selectedMessage.company && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Empresa</Label>
                    <p className="font-medium">{selectedMessage.company}</p>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Mensaje</Label>
                <div className="p-4 bg-background border rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {selectedMessage.notes && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block flex items-center gap-1">
                    <StickyNote className="h-3 w-3" />
                    Notas internas
                  </Label>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="whitespace-pre-wrap text-sm">{selectedMessage.notes}</p>
                  </div>
                </div>
              )}

              {selectedMessage.admin_reply && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block flex items-center gap-1">
                    <CheckCheck className="h-3 w-3 text-green-500" />
                    Respuesta enviada {selectedMessage.replied_at && `(${format(new Date(selectedMessage.replied_at), "dd/MM/yyyy HH:mm")})`}
                  </Label>
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="whitespace-pre-wrap text-sm">{selectedMessage.admin_reply}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => openNotesDialog(selectedMessage!)}>
              <StickyNote className="h-4 w-4 mr-2" />
              {selectedMessage?.notes ? "Editar notas" : "Agregar notas"}
            </Button>
            <Button onClick={() => { setIsViewDialogOpen(false); openReplyDialog(selectedMessage!); }}>
              <Reply className="h-4 w-4 mr-2" />
              Responder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Reply className="h-5 w-5" />
              Responder a {selectedMessage?.full_name}
            </DialogTitle>
            <DialogDescription>
              Se abrirá tu cliente de email para enviar la respuesta a {selectedMessage?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Mensaje original:</p>
              <p className="text-sm line-clamp-3">{selectedMessage?.message}</p>
            </div>

            <div>
              <Label htmlFor="reply">Tu respuesta</Label>
              <Textarea
                id="reply"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={10}
                className="mt-2 font-mono text-sm"
                placeholder="Escribe tu respuesta aquí..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendReply} disabled={sending || !replyContent.trim()}>
              {sending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar respuesta
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5" />
              Notas internas
            </DialogTitle>
            <DialogDescription>
              Estas notas son privadas y solo visibles para administradores.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            value={notesContent}
            onChange={(e) => setNotesContent(e.target.value)}
            rows={6}
            placeholder="Agrega notas sobre este contacto, seguimiento, etc..."
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotesDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveNotes}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Guardar notas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
