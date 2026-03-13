"use server"

import { loginWithCredentials } from "@/lib/auth"

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim()
  const password = formData.get("password") as string

  if (!email || !password) {
    return { ok: false, error: "Email y contraseña son requeridos" }
  }

  return loginWithCredentials(email, password)
}
