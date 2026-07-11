"use server"

import { hashPassword } from "@/lib/auth"
import { readData, writeData } from "@/lib/data"
import { isPostgresConfigured } from "@/lib/db-pg"
import { isMySQLConfigured } from "@/lib/db-mysql"
import * as pgData from "@/lib/data-pg"
import * as mysqlData from "@/lib/data-mysql"
import { consumePasswordResetToken, validatePasswordResetToken } from "@/lib/password-reset"

export type ResetPasswordResult = { ok: boolean; message: string }

type AdminRow = { id: string; email: string; full_name: string | null; role: string; password_hash: string }

export async function resetPasswordWithTokenAction(
  token: string,
  formData: FormData
): Promise<ResetPasswordResult> {
  const password = String(formData.get("password") ?? "")
  const confirm = String(formData.get("confirm") ?? "")

  if (password.length < 8) {
    return { ok: false, message: "La contraseña debe tener al menos 8 caracteres." }
  }
  if (password !== confirm) {
    return { ok: false, message: "Las contraseñas no coinciden." }
  }

  const validation = await validatePasswordResetToken(token)
  if (!validation.ok || !validation.email) {
    return { ok: false, message: "El enlace expiró o no es válido. Solicite uno nuevo." }
  }

  const hash = await hashPassword(password)
  const email = validation.email

  let updated = false
  if (isPostgresConfigured()) {
    updated = await pgData.updateUserPasswordByEmail(email, hash)
  } else if (isMySQLConfigured()) {
    updated = await mysqlData.updateUserPasswordByEmail(email, hash)
  } else {
    const admins = await readData<AdminRow[]>("admins.json")
    const idx = admins.findIndex((a) => a.email.trim().toLowerCase() === email)
    if (idx >= 0) {
      admins[idx] = { ...admins[idx], password_hash: hash }
      await writeData("admins.json", admins)
      updated = true
    }
  }

  if (!updated) {
    return { ok: false, message: "No se encontró la cuenta de administrador." }
  }

  await consumePasswordResetToken(token)
  return { ok: true, message: "Contraseña actualizada. Ya puede iniciar sesión." }
}
