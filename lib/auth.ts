import { getIronSession, type SessionOptions } from "iron-session"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { readData } from "@/lib/data"

export interface SessionUser {
  id: string
  email: string
  full_name: string | null
  role: string
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? "cronec-session-secret-min-32-chars-long",
  cookieName: "cronec_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 días
    sameSite: "lax" as const,
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<{ user?: SessionUser }>(cookieStore, sessionOptions)
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession()
  return session.user ?? null
}

export async function setSession(user: SessionUser) {
  const session = await getSession()
  session.user = user
  await session.save()
}

export async function destroySession() {
  const session = await getSession()
  session.destroy()
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

type AdminRow = { id: string; email: string; full_name: string | null; role: string; password_hash: string }

export async function loginWithCredentials(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const admins = await readData<AdminRow[]>("admins.json")
  const user = admins.find((a) => a.email.toLowerCase() === email.toLowerCase())
  if (!user || !user.password_hash) {
    return { ok: false, error: "Credenciales incorrectas" }
  }
  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) {
    return { ok: false, error: "Credenciales incorrectas" }
  }
  await setSession({
    id: user.id,
    email: user.email,
    full_name: user.full_name ?? null,
    role: user.role ?? "admin",
  })
  return { ok: true }
}
