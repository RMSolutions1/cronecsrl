import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { SettingsProvider } from "@/lib/settings-context"
import { getCompanyInfo } from "@/app/actions/db/company-info"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e3a5f" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1629" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: {
    default: "CRONEC SRL | Construcción Civil e Instalaciones Eléctricas en Salta",
    template: "%s | CRONEC SRL",
  },
  description:
    "Empresa Salteña especializada en Obras Públicas, construcción civil, instalaciones eléctricas e infraestructura industrial. 15+ años de experiencia desde 2009 en proyectos de calidad en el noroeste argentino.",
  keywords: [
    "construcción Salta",
    "obras públicas",
    "instalaciones eléctricas",
    "infraestructura",
    "CRONEC SRL",
    "ingeniería civil",
    "arquitectura Salta",
    "obras industriales",
    "constructora Salta",
    "empresa constructora NOA",
  ],
  authors: [{ name: "CRONEC SRL" }],
  creator: "CRONEC SRL",
  publisher: "CRONEC SRL",
  metadataBase: new URL("https://cronecsrl.com.ar"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://cronecsrl.com.ar",
    title: "CRONEC SRL | Construcción Civil e Instalaciones Eléctricas en Salta",
    description:
      "Empresa Salteña especializada en Obras Públicas, construcción civil e instalaciones eléctricas. 15+ años de experiencia en el noroeste argentino.",
    siteName: "CRONEC SRL",
    images: [
      {
        url: "https://images.unsplash.com/photo-1504309092620-4d0e8a54959e?w=1200&h=630&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "CRONEC SRL - Construcción Civil e Instalaciones Eléctricas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CRONEC SRL | Construcción Civil e Instalaciones Eléctricas",
    description: "Empresa Salteña especializada en Obras Públicas y construcción civil. 15+ años de experiencia.",
    images: ["https://images.unsplash.com/photo-1504309092620-4d0e8a54959e?w=1200&h=630&fit=crop&q=80"],
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: { google: "..." } — agregar código real cuando tengas verificación de Google Search Console
}

function buildJsonLd(settings: Record<string, unknown> | null) {
  const name = (settings?.company_name as string) ?? "CRONEC SRL"
  const desc = (settings?.description as string) ?? "Empresa constructora especializada en obras civiles, instalaciones eléctricas e infraestructura industrial en Salta, Argentina."
  const tel = (settings?.phone as string) ?? "+54-9-387-536-1210"
  const email = (settings?.email as string) ?? "cronec@cronecsrl.com.ar"
  const addressStr = (settings?.address as string) ?? "Santa Fe 548 PB B, Salta"
  const sameAs: string[] = []
  if (settings?.facebook_url) sameAs.push(settings.facebook_url as string)
  if (settings?.instagram_url) sameAs.push(settings.instagram_url as string)
  if (settings?.linkedin_url) sameAs.push(settings.linkedin_url as string)
  if (sameAs.length === 0) sameAs.push("https://www.facebook.com/cronecsrl", "https://www.instagram.com/cronecsrl", "https://www.linkedin.com/company/cronecsrl")
  const founding = (settings?.founded_year as number) ?? 2009
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://cronecsrl.com.ar",
    name,
    alternateName: name,
    description: desc,
    url: "https://cronecsrl.com.ar",
    telephone: tel.replace(/\s/g, ""),
    email,
    address: { "@type": "PostalAddress", streetAddress: addressStr, addressLocality: "Salta", addressRegion: "Salta", postalCode: "4400", addressCountry: "AR" },
    geo: { "@type": "GeoCoordinates", latitude: -24.7821, longitude: -65.4232 },
    openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
    sameAs,
    priceRange: "$$",
    image: "https://images.unsplash.com/photo-1504309092620-4d0e8a54959e?w=1200&h=630&fit=crop&q=80",
    areaServed: { "@type": "GeoCircle", geoMidpoint: { "@type": "GeoCoordinates", latitude: -24.7821, longitude: -65.4232 }, geoRadius: "500000" },
    serviceType: ["Construccion Civil", "Instalaciones Electricas", "Obras Publicas", "Infraestructura Industrial"],
    foundingDate: String(founding),
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: 50, maxValue: 100 },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getCompanyInfo()
  const jsonLd = buildJsonLd(settings)
  return (
    <html lang="es" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} font-sans antialiased`} suppressHydrationWarning>
        <SettingsProvider value={settings}>
          {children}
          <WhatsAppButton />
          <Toaster position="top-center" richColors />
          <Analytics />
        </SettingsProvider>
      </body>
    </html>
  )
}
