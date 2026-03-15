import { MetadataRoute } from "next"
import { getServicesPublic, getBlogPostsPublic } from "@/lib/data-read"

export const dynamic = "force-dynamic"

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "https://cronecsrl.com.ar"
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/servicios`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/proyectos`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/nosotros`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/contacto`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/calculadora`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/brochure`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/politica-privacidad`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terminos-condiciones`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/politica-calidad`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ]

  try {
    const [services, blogPosts] = await Promise.all([
      getServicesPublic(),
      getBlogPostsPublic(),
    ])

    const serviceRoutes: MetadataRoute.Sitemap = (services || [])
      .filter((s) => s.slug || (s as { id?: string }).id)
      .map((s) => ({
        url: `${baseUrl}/servicios/${encodeURIComponent((s.slug ?? (s as { id: string }).id) ?? "")}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }))

    const blogRoutes: MetadataRoute.Sitemap = (blogPosts || [])
      .filter((p) => (p.slug ?? (p as { id?: string }).id))
      .map((p) => ({
        url: `${baseUrl}/blog/${encodeURIComponent((p.slug ?? (p as { id: string }).id) ?? "")}`,
        lastModified: new Date((p as { published_at?: string }).published_at ?? (p as { created_at?: string }).created_at ?? Date.now()),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))

    return [...staticRoutes, ...serviceRoutes, ...blogRoutes]
  } catch {
    return staticRoutes
  }
}
