"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { AdminNav } from "./admin-nav"
import type { SessionUser } from "@/lib/auth"

const NO_NAV_PATHS = ["/admin/login", "/admin/recuperar", "/admin/registro"]

export function AdminShell({ user, children }: { user: SessionUser | null; children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const hideNav = NO_NAV_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))

  useEffect(() => {
    if (!hideNav && !user) {
      router.replace("/admin/login")
    }
  }, [hideNav, user, router])

  if (hideNav) {
    return <>{children}</>
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">Redirigiendo al inicio de sesión...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50/80">
      <AdminNav user={user} />
      <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  )
}
