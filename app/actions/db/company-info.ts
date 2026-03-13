"use server"

import { readData, writeData } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"

type Settings = Record<string, unknown>

export async function getCompanyInfo() {
  try {
    const data = await readData<Settings>("settings.json")
    if (data && typeof data === "object" && !Array.isArray(data)) return data as Record<string, unknown>
    return null
  } catch {
    return null
  }
}

export async function saveCompanyInfo(data: Record<string, unknown>) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("No autorizado")
  const current = (await readData<Settings>("settings.json")) || {}
  if (typeof current !== "object" || Array.isArray(current)) {
    await writeData("settings.json", { ...data })
    return
  }
  const values = data.values != null ? (Array.isArray(data.values) ? data.values : []) : (current.values as unknown[])
  const heroSlides = data.heroSlides != null && Array.isArray(data.heroSlides) ? data.heroSlides : (current.heroSlides as unknown[] | undefined)
  await writeData("settings.json", {
    ...current,
    company_name: data.company_name ?? current.company_name,
    tagline: data.tagline ?? current.tagline,
    description: data.description ?? current.description,
    mission: data.mission ?? current.mission,
    vision: data.vision ?? current.vision,
    values,
    address: data.address ?? current.address,
    phone: data.phone ?? current.phone,
    email: data.email ?? current.email,
    whatsapp: data.whatsapp ?? current.whatsapp,
    whatsapp_default_message: data.whatsapp_default_message ?? current.whatsapp_default_message,
    facebook_url: data.facebook_url ?? current.facebook_url,
    instagram_url: data.instagram_url ?? current.instagram_url,
    linkedin_url: data.linkedin_url ?? current.linkedin_url,
    twitter_url: data.twitter_url ?? current.twitter_url,
    youtube_url: data.youtube_url ?? current.youtube_url,
    founded_year: data.founded_year ?? current.founded_year,
    cuit: data.cuit ?? current.cuit,
    logo_url: data.logo_url ?? current.logo_url,
    footer_cta_title: data.footer_cta_title ?? current.footer_cta_title,
    footer_cta_subtitle: data.footer_cta_subtitle ?? current.footer_cta_subtitle,
    cta_badge: data.cta_badge ?? current.cta_badge,
    cta_title: data.cta_title ?? current.cta_title,
    cta_paragraph: data.cta_paragraph ?? current.cta_paragraph,
    horario: data.horario ?? current.horario,
    meta_title: data.meta_title ?? current.meta_title,
    meta_description: data.meta_description ?? current.meta_description,
    brochure_pdf_url: data.brochure_pdf_url ?? current.brochure_pdf_url,
    brochure_cta_text: data.brochure_cta_text ?? current.brochure_cta_text,
    ...(heroSlides && { heroSlides }),
  })
}
