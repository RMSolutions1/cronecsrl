"use client"

import { useState, useEffect } from "react"
import { getCertificationsAdmin, saveCertification, deleteCertification } from "@/app/actions/db/certifications"
import { getClientsAdmin, saveClient, deleteClient } from "@/app/actions/db/clients"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Pencil, Trash2, Save, X, Award, Building2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { ImageUploader } from "./image-uploader"

type Certification = { id: string; name: string; logo_url?: string | null; order_index: number }
type Client = { id: string; name: string; logo_url?: string | null; order_index: number }

export function CertificationsClientsManager() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [certEditingId, setCertEditingId] = useState<string | null>(null)
  const [clientEditingId, setClientEditingId] = useState<string | null>(null)
  const [certForm, setCertForm] = useState<Partial<Certification>>({})
  const [clientForm, setClientForm] = useState<Partial<Client>>({})
  const { toast } = useToast()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const [certs, clis] = await Promise.all([getCertificationsAdmin(), getClientsAdmin()])
      setCertifications((certs as Certification[]) || [])
      setClients((clis as Client[]) || [])
    } catch (e) {
      console.error(e)
      toast({ title: "Error", description: "No se pudo cargar", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveCert() {
    const payload = {
      ...certForm,
      id: certEditingId && certEditingId !== "new" ? certEditingId : certForm.id,
      order_index: certForm.order_index ?? certifications.length,
    }
    const result = await saveCertification(payload)
    if (result.ok) {
      toast({ title: "Certificación guardada" })
      setCertEditingId(null)
      setCertForm({})
      load()
    } else {
      toast({ title: "Error", description: result.error ?? "No se pudo guardar", variant: "destructive" })
    }
  }

  async function handleSaveClient() {
    const payload = {
      ...clientForm,
      id: clientEditingId && clientEditingId !== "new" ? clientEditingId : clientForm.id,
      order_index: clientForm.order_index ?? clients.length,
    }
    const result = await saveClient(payload)
    if (result.ok) {
      toast({ title: "Cliente guardado" })
      setClientEditingId(null)
      setClientForm({})
      load()
    } else {
      toast({ title: "Error", description: result.error ?? "No se pudo guardar", variant: "destructive" })
    }
  }

  async function handleDeleteCert(id: string) {
    if (!confirm("¿Eliminar esta certificación?")) return
    const result = await deleteCertification(id)
    if (result.ok) {
      toast({ title: "Certificación eliminada" })
      load()
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    }
  }

  async function handleDeleteClient(id: string) {
    if (!confirm("¿Eliminar este cliente?")) return
    const result = await deleteClient(id)
    if (result.ok) {
      toast({ title: "Cliente eliminado" })
      load()
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    }
  }

  if (loading) return <div className="text-muted-foreground">Cargando...</div>

  return (
    <div className="space-y-6">
      <Tabs defaultValue="certifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="certifications" className="gap-2">
            <Award className="h-4 w-4" />
            Certificaciones
          </TabsTrigger>
          <TabsTrigger value="clients" className="gap-2">
            <Building2 className="h-4 w-4" />
            Clientes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Certificaciones y Cumplimiento</CardTitle>
              <CardDescription>
                Títulos e imágenes que se muestran en la sección &quot;Certificaciones y Cumplimiento&quot; de la página de inicio (ej. ISO 9001, ISO 14001, ISO 45001).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(certEditingId || certForm.name !== undefined) && (
                <div className="rounded-lg border p-4 space-y-3">
                  <h4 className="font-medium">{certEditingId && certEditingId !== "new" ? "Editar" : "Nueva"} certificación</h4>
                  <div>
                    <label className="text-sm font-medium">Nombre</label>
                    <Input
                      value={certForm.name ?? ""}
                      onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                      placeholder="Ej: ISO 9001"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Logo (URL o subir)</label>
                    <ImageUploader
                      value={certForm.logo_url ?? ""}
                      onChange={(url) => setCertForm({ ...certForm, logo_url: url })}
                      path="certifications"
                    />
                    <Input
                      className="mt-2"
                      value={certForm.logo_url ?? ""}
                      onChange={(e) => setCertForm({ ...certForm, logo_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Orden</label>
                    <Input
                      type="number"
                      value={certForm.order_index ?? 0}
                      onChange={(e) => setCertForm({ ...certForm, order_index: parseInt(e.target.value, 10) })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveCert}><Save className="h-4 w-4 mr-2" />Guardar</Button>
                    <Button variant="outline" onClick={() => { setCertEditingId(null); setCertForm({}) }}><X className="h-4 w-4 mr-2" />Cancelar</Button>
                  </div>
                </div>
              )}
              {!certEditingId && certForm.name === undefined && (
                <Button onClick={() => { setCertEditingId("new"); setCertForm({ name: "", order_index: certifications.length }) }}>
                  <Plus className="h-4 w-4 mr-2" />Agregar certificación
                </Button>
              )}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {certifications.map((c) => (
                  <Card key={c.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="relative w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                          {c.logo_url ? (
                            <Image src={c.logo_url} alt={c.name} fill className="object-contain" sizes="64px" unoptimized />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-2xl text-muted-foreground">🏅</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{c.name}</p>
                          <p className="text-xs text-muted-foreground">Orden: {c.order_index}</p>
                          <div className="flex gap-1 mt-2">
                            <Button size="sm" variant="ghost" onClick={() => { setCertEditingId(c.id); setCertForm({ ...c, logo_url: c.logo_url ?? "" }) }}><Pencil className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDeleteCert(c.id)}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clientes que Confían en Nosotros</CardTitle>
              <CardDescription>
                Lista de clientes/organizaciones que se muestran en la página de inicio. Nombre y logo por cada uno.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(clientEditingId || clientForm.name !== undefined) && (
                <div className="rounded-lg border p-4 space-y-3">
                  <h4 className="font-medium">{clientEditingId && clientEditingId !== "new" ? "Editar" : "Nuevo"} cliente</h4>
                  <div>
                    <label className="text-sm font-medium">Nombre</label>
                    <Input
                      value={clientForm.name ?? ""}
                      onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                      placeholder="Ej: Gobierno de Salta"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Logo (URL o subir)</label>
                    <ImageUploader
                      value={clientForm.logo_url ?? ""}
                      onChange={(url) => setClientForm({ ...clientForm, logo_url: url })}
                      path="clients"
                    />
                    <Input
                      className="mt-2"
                      value={clientForm.logo_url ?? ""}
                      onChange={(e) => setClientForm({ ...clientForm, logo_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Orden</label>
                    <Input
                      type="number"
                      value={clientForm.order_index ?? 0}
                      onChange={(e) => setClientForm({ ...clientForm, order_index: parseInt(e.target.value, 10) })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveClient}><Save className="h-4 w-4 mr-2" />Guardar</Button>
                    <Button variant="outline" onClick={() => { setClientEditingId(null); setClientForm({}) }}><X className="h-4 w-4 mr-2" />Cancelar</Button>
                  </div>
                </div>
              )}
              {!clientEditingId && clientForm.name === undefined && (
                <Button onClick={() => { setClientEditingId("new"); setClientForm({ name: "", order_index: clients.length }) }}>
                  <Plus className="h-4 w-4 mr-2" />Agregar cliente
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
                            <Button size="sm" variant="ghost" onClick={() => { setClientEditingId(c.id); setClientForm({ ...c, logo_url: c.logo_url ?? "" }) }}><Pencil className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDeleteClient(c.id)}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
