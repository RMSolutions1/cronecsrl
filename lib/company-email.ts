import { CRONEC_OFFICIAL } from "@/lib/company-defaults"

/** Email corporativo oficial (ARCA / comunicaciones). */
export const COMPANY_EMAIL = "cronec@cronecsrl.com.ar"

export function resolveCompanyEmail(settings?: { email?: unknown } | null): string {
  const fromSettings = settings?.email
  if (typeof fromSettings === "string" && fromSettings.trim()) return fromSettings.trim()
  return COMPANY_EMAIL
}

export function resolveCompanyPhone(settings?: { phone?: unknown } | null): string {
  const fromSettings = settings?.phone
  if (typeof fromSettings === "string" && fromSettings.trim()) return fromSettings.trim()
  return "+54 9 387 536-1210"
}

export function resolveCompanyName(settings?: { company_name?: unknown } | null): string {
  const fromSettings = settings?.company_name
  if (typeof fromSettings === "string" && fromSettings.trim()) return fromSettings.trim()
  return CRONEC_OFFICIAL.displayName
}
