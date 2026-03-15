"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AdminNav } from "./admin-nav"
import type { SessionUser } from "@/lib/auth"

const NO_NAV_PATHS = ["/admin/login", "/admin/recuperar", "/admin/registro"]
const SIDEBAR_COLLAPSED_KEY = "cronec-sidebar-collapsed"

export function AdminShell({ user, children }: { user: SessionUser | null; children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const hideNav = NO_NAV_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
      if (stored !== null) setSidebarCollapsed(stored === "true")
    } catch {
      // ignore
    }
  }, [])

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
    <div className="min-h-screen bg-gray-50/80">
      <AdminNav
        user={user}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <main
        className={`min-h-screen p-6 md:p-8 overflow-auto transition-[margin] duration-200 ease-in-out ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}
      >
        {children}
      </main>
    </div>
  )
}
