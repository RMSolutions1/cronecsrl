"use server"

import { readData, writeData, generateId } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"
import { isPostgresConfigured } from "@/lib/db-pg"
import { isMySQLConfigured } from "@/lib/db-mysql"
import * as pgData from "@/lib/data-pg"
import * as mysqlData from "@/lib/data-mysql"
import { assertDbWritable, formatAdminPersistError } from "@/lib/admin-persist"

export type Client = {
  id: string
  name: string
  logo_url?: string | null
  order_index: number
  updated_at?: string
}

async function readClientsList(): Promise<Client[]> {
  if (isPostgresConfigured()) {
    return (await pgData.readClients()) as Client[]
  }
  if (isMySQLConfigured()) {
    return (await mysqlData.readClients()) as Client[]
  }
  return await readData<Client[]>("clients.json")
}

export async function getClientsPublic() {
  try {
    const list = await readClientsList()
    return (list || []).sort((a, b) => a.order_index - b.order_index)
  } catch {
    return []
  }
}

export async function getClientsAdmin() {
  try {
    const user = await getCurrentUser()
    if (!user || !["admin", "superadmin"].includes(user.role)) return []
    const list = await readClientsList()
    return (list || []).sort((a, b) => a.order_index - b.order_index)
  } catch {
    return []
  }
}

export async function saveClient(data: Record<string, unknown>): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const user = await getCurrentUser()
    if (!user || !["admin", "superadmin"].includes(user.role)) return { ok: false, error: "No autorizado" }
    assertDbWritable()

    const id = (data.id as string) ?? generateId()
    const record: Client = {
      id,
      name: (data.name as string) ?? "",
      logo_url: (data.logo_url as string) ?? null,
      order_index: Number(data.order_index ?? data.order ?? 0),
      updated_at: new Date().toISOString(),
    }

    if (isPostgresConfigured()) {
      await pgData.upsertClient(record as unknown as Record<string, unknown>)
      return { ok: true, id }
    }
    if (isMySQLConfigured()) {
      await mysqlData.upsertClient(record as unknown as Record<string, unknown>)
      return { ok: true, id }
    }

    const list = await readData<Client[]>("clients.json")
    const idx = list.findIndex((c) => c.id === id)
    if (idx >= 0) list[idx] = { ...list[idx], ...record }
    else list.push(record)
    list.sort((a, b) => a.order_index - b.order_index)
    await writeData("clients.json", list)
    return { ok: true, id }
  } catch (e) {
    console.error("saveClient:", e)
    return { ok: false, error: formatAdminPersistError(e, "guardar") }
  }
}

export async function deleteClient(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user || !["admin", "superadmin"].includes(user.role)) return { ok: false, error: "No autorizado" }
    assertDbWritable()

    if (isPostgresConfigured()) {
      await pgData.deleteClientById(id)
      return { ok: true }
    }
    if (isMySQLConfigured()) {
      await mysqlData.deleteClientById(id)
      return { ok: true }
    }

    const list = await readData<Client[]>("clients.json")
    await writeData("clients.json", list.filter((c) => c.id !== id))
    return { ok: true }
  } catch (e) {
    console.error("deleteClient:", e)
    return { ok: false, error: formatAdminPersistError(e, "eliminar") }
  }
}
