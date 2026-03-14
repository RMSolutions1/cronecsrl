"use client"

import { createContext, useContext, type ReactNode } from "react"

export type ServiceNavItem = { slug: string; title: string }

const ServicesNavContext = createContext<ServiceNavItem[]>([])

export function ServicesNavProvider({ value, children }: { value: ServiceNavItem[]; children: ReactNode }) {
  return <ServicesNavContext.Provider value={value}>{children}</ServicesNavContext.Provider>
}

export function useServicesNav(): ServiceNavItem[] {
  return useContext(ServicesNavContext)
}
