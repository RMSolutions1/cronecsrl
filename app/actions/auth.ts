"use server"

import { destroySession, getCurrentUser, verifyPassword, hashPassword } from "@/lib/auth"
import { readData, writeData } from "@/lib/data"
import { query, isPostgresConfigured } from "@/lib/db-pg"

export async function logoutAction() {
  await destroySession()
}

type AdminRow = { id: string; email: string; full_name: string | null; role: string; password_hash: string }

export async function changePasswordAction(currentPassword: string, newPassword: string): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser()
  if (!user) {
    return { ok: false, error: "No autenticado" }
  }

  // Validar nueva contraseña
  if (newPassword.length < 6) {
    return { ok: false, error: "La nueva contraseña debe tener al menos 6 caracteres" }
  }

  // Obtener el usuario actual con su hash de contraseña
  let userWithHash: AdminRow | undefined

  if (isPostgresConfigured()) {
    try {
      const rows = await query<AdminRow[]>("SELECT * FROM users WHERE id = $1", [user.id])
      userWithHash = rows[0]
    } catch (error) {
      console.error("[changePasswordAction] DB error:", error)
    }
  }

  // Fallback a JSON si no hay BD o no se encontró
  if (!userWithHash) {
    const admins = await readData<AdminRow[]>("admins.json")
    userWithHash = admins.find((a) => a.id === user.id)
  }

  if (!userWithHash) {
    return { ok: false, error: "Usuario no encontrado" }
  }

  // Verificar contraseña actual
  const validCurrent = await verifyPassword(currentPassword, userWithHash.password_hash)
  if (!validCurrent) {
    return { ok: false, error: "La contraseña actual es incorrecta" }
  }

  // Hashear nueva contraseña
  const newHash = await hashPassword(newPassword)

  // Actualizar en BD o JSON
  if (isPostgresConfigured()) {
    try {
      await query("UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [newHash, user.id])
      return { ok: true }
    } catch (error) {
      console.error("[changePasswordAction] DB update error:", error)
    }
  }

  // Fallback: actualizar en JSON
  const admins = await readData<AdminRow[]>("admins.json")
  const idx = admins.findIndex((a) => a.id === user.id)
  if (idx >= 0) {
    admins[idx].password_hash = newHash
    await writeData("admins.json", admins)
  }

  return { ok: true }
}

export async function updateProfileAction(fullName: string): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser()
  if (!user) {
    return { ok: false, error: "No autenticado" }
  }

  if (isPostgresConfigured()) {
    try {
      await query("UPDATE users SET full_name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [fullName, user.id])
      return { ok: true }
    } catch (error) {
      console.error("[updateProfileAction] DB error:", error)
    }
  }

  // Fallback a JSON
  const admins = await readData<AdminRow[]>("admins.json")
  const idx = admins.findIndex((a) => a.id === user.id)
  if (idx >= 0) {
    admins[idx].full_name = fullName
    await writeData("admins.json", admins)
  }

  return { ok: true }
}
