"use client"

import { useState, useEffect } from "react"
import { getClientsAdmin, saveClient, deleteClient } from "@/app/actions/db/clients"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { ImageUploader } from "./image-uploader"

type Client = { id: string; name: string; logo_url?: string | null; order_index: number }

export function ClientsManager() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Client>>({})
  const { toast } = useToast()

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- carga única al montar
  }, [])

  async function load() {
    setLoading(true)
    try {
      const list = await getClientsAdmin()
      setClients((list as Client[]) || [])
    } catch (e) {
      console.error(e)
      toast({ title: "Error", description: "No se pudieron cargar los clientes", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    const payload = {
      ...form,
      id: editingId && editingId !== "new" ? editingId : form.id,
      order_index: form.order_index ?? clients.length,
    }
    const result = await saveClient(payload)
    if (result.ok) {
      toast({ title: "Cliente guardado" })
      setEditingId(null)
      setForm({})
      load()
    } else {
      toast({ title: "Error", description: result.error ?? "No se pudo guardar", variant: "destructive" })
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este cliente?")) return
    const result = await deleteClient(id)
    if (result.ok) {
      toast({ title: "Cliente eliminado" })
      load()
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    }
  }

  if (loading) return <div className="text-muted-foreground">Cargando clientes...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes que Confían en Nosotros</CardTitle>
        <CardDescription>
          Organizaciones y empresas que se muestran en la página de inicio. Nombre y logo por cada una.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(editingId || form.name !== undefined) && (
          <div className="rounded-lg border p-4 space-y-3">
            <h4 className="font-medium">{editingId && editingId !== "new" ? "Editar" : "Nuevo"} cliente</h4>
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <Input
                value={form.name ?? ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Gobierno de Salta"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Logo (URL o subir)</label>
              <ImageUploader
                value={form.logo_url ?? ""}
                onChange={(url) => setForm({ ...form, logo_url: url })}
                path="clients"
              />
              <Input
                className="mt-2"
                value={form.logo_url ?? ""}
                onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Orden</label>
              <Input
                type="number"
                value={form.order_index ?? 0}
                onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value, 10) })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
              <Button variant="outline" onClick={() => { setEditingId(null); setForm({}) }}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        )}
        {!editingId && form.name === undefined && (
          <Button onClick={() => { setEditingId("new"); setForm({ name: "", order_index: clients.length }) }}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar cliente
          </Button>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <Card key={c.id}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    {c.logo_url ? (
                      <Image src={c.logo_url} alt={c.name} fill className="object-contain" sizes="64px" unoptimized />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-2xl text-muted-foreground">🏢</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground">Orden: {c.order_index}</p>
                    <div className="flex gap-1 mt-2">
                      <Button size="sm" variant="ghost" onClick={() => { setEditingId(c.id); setForm({ ...c, logo_url: c.logo_url ?? "" }) }}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(c.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {clients.length === 0 && (
          <p className="text-sm text-muted-foreground">No hay clientes cargados. Agregá el primero con el botón de arriba.</p>
        )}
      </CardContent>
    </Card>
  )
}
