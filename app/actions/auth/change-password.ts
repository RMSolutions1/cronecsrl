"use server"

import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth"
import { readData, writeData } from "@/lib/data"
import { isPostgresConfigured } from "@/lib/db-pg"
import { isMySQLConfigured } from "@/lib/db-mysql"
import * as pgData from "@/lib/data-pg"
import * as mysqlData from "@/lib/data-mysql"

type AdminRow = { id: string; email: string; full_name: string | null; role: string; password_hash: string }

export type ChangePasswordResult = { ok: boolean; error?: string }

export async function changePasswordAction(formData: FormData): Promise<ChangePasswordResult> {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) {
    return { ok: false, error: "No iniciaste sesión o no tenés permiso." }
  }

  const currentPassword = String(formData.get("currentPassword") ?? "")
  const newPassword = String(formData.get("newPassword") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { ok: false, error: "Completá todos los campos." }
  }
  if (newPassword !== confirmPassword) {
    return { ok: false, error: "La nueva contraseña y la confirmación no coinciden." }
  }
  if (newPassword.length < 8) {
    return { ok: false, error: "La nueva contraseña debe tener al menos 8 caracteres." }
  }
  if (newPassword === currentPassword) {
    return { ok: false, error: "La nueva contraseña debe ser distinta a la actual." }
  }

  const admins = await readData<AdminRow[]>("admins.json")
  const row = admins.find((a) => a.email.toLowerCase() === user.email.toLowerCase())
  if (!row?.password_hash) {
    return { ok: false, error: "No se encontró tu usuario en el sistema." }
  }
  const valid = await verifyPassword(currentPassword, row.password_hash)
  if (!valid) {
    return { ok: false, error: "La contraseña actual es incorrecta." }
  }

  const newHash = await hashPassword(newPassword)

  if (isPostgresConfigured()) {
    const updated = await pgData.updateUserPasswordByEmail(user.email, newHash)
    if (!updated) return { ok: false, error: "No se pudo actualizar en la base de datos." }
    return { ok: true }
  }

  if (isMySQLConfigured()) {
    const updated = await mysqlData.updateUserPasswordByEmail(user.email, newHash)
    if (!updated) return { ok: false, error: "No se pudo actualizar en la base de datos." }
    return { ok: true }
  }

  const next = admins.map((a) =>
    a.email.toLowerCase() === user.email.toLowerCase() ? { ...a, password_hash: newHash } : a
  )
  await writeData("admins.json", next)
  return { ok: true }
}
