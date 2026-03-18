import { notFound } from "next/navigation"
import { getServiceBySlug, getServicesPublic } from "@/lib/data-read"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { images, defaultServiceImages } from "@/lib/images"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

const defaultServiceSlugs = Object.keys(defaultServiceImages)

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const services = await getServicesPublic()
    const slugs = services.map((s) => s.slug).filter((s): s is string => Boolean(s))
    if (slugs.length > 0) return slugs.map((slug) => ({ slug }))
  } catch {
    // Build estático sin BD: usar slugs por defecto
  }
  return defaultServiceSlugs.map((slug) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return { title: "Servicio | CRONEC SRL" }
  const title = String(service.title ?? "Servicio")
  const desc = service.short_description ?? service.description
  const description = typeof desc === "string" ? desc : `Servicio ${title} - CRONEC SRL Salta`
  const imageUrl = (service.image_url && String(service.image_url).trim()) ? String(service.image_url) : (defaultServiceImages[slug] ?? undefined)
  const fullImageUrl = imageUrl?.startsWith("http") ? imageUrl : imageUrl ? `${typeof process.env.NEXT_PUBLIC_SITE_URL === "string" ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "") : "https://cronecsrl.com.ar"}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}` : undefined
  return {
    title: `${title} | CRONEC SRL`,
    description,
    openGraph: {
      title: `${title} | CRONEC SRL`,
      description,
      ...(fullImageUrl && { images: [{ url: fullImageUrl, width: 1200, height: 630, alt: title }] }),
    },
  }
}

type ServiceShape = { title?: string; description?: string; short_description?: string; image_url?: string; features?: unknown; benefits?: unknown }

export default async function ServicioSlugPage({ params }: Props) {
  const { slug } = await params
  const service = await getServiceBySlug(slug) as ServiceShape | null
  if (!service) notFound()

  const imageSrc = (service.image_url && service.image_url.trim()) ? service.image_url : (defaultServiceImages[slug] ?? images.services.obrasCiviles)
  const features = Array.isArray(service.features) ? service.features : []
  const benefits = Array.isArray(service.benefits) ? service.benefits : []

  return (
    <>
      <Header />
      <main>
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${imageSrc})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <Badge className="bg-accent text-accent-foreground mb-6">Servicio Especializado</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
                {service.title}
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-8 text-pretty">
                {service.description || service.short_description || ""}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contacto">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Solicitar Presupuesto
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/servicios">
                  <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Ver todos los servicios
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {(features.length > 0 || benefits.length > 0) && (
          <section className="py-20 md:py-28 bg-background">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {features.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Servicios Incluidos</h2>
                    <ul className="space-y-3">
                      {features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {benefits.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Beneficios</h2>
                    <ul className="space-y-3">
                      {benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-4">¿Necesita asesoramiento?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Nuestro equipo está listo para evaluar su proyecto y ofrecerle la mejor solución.
            </p>
            <Button size="lg" asChild>
              <Link href="/contacto">Contactar</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
