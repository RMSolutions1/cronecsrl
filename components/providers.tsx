"use client"

import type { ReactNode } from "react"
import { SettingsProvider } from "@/lib/settings-context"
import { ServicesNavProvider, type ServiceNavItem } from "@/lib/services-nav-context"

export function Providers({
  settings,
  servicesNav,
  children,
}: {
  settings: Record<string, unknown> | null
  servicesNav: ServiceNavItem[]
  children: ReactNode
}) {
  return (
    <SettingsProvider value={settings}>
      <ServicesNavProvider value={servicesNav}>{children}</ServicesNavProvider>
    </SettingsProvider>
  )
}
