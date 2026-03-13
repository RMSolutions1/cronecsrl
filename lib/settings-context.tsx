"use client"

import { createContext, useContext, type ReactNode } from "react"

export type Settings = Record<string, unknown> | null

const SettingsContext = createContext<Settings>(null)

export function SettingsProvider({ value, children }: { value: Settings; children: ReactNode }) {
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): Settings {
  return useContext(SettingsContext)
}
