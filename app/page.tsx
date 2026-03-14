import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection, type ServiceFromDb } from "@/components/services-section"
import { PortfolioSection } from "@/components/portfolio-section"
import { WhyCronecSection, type WhyCronecData } from "@/components/why-cronec-section"
import { ProcessSection, type ProcessData } from "@/components/process-section"
import { TestimonialsSection, type TestimonialFromDb } from "@/components/testimonials-section"
import { ClientsSection, type CertificationFromDb, type ClientFromDb } from "@/components/clients-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { getServicesPublic, getProjectsPublic, getCompanyInfo, getTestimonialsPublic, getCertificationsPublic, getClientsPublic, getSectionsPublic, getHeroImagesPublic } from "@/lib/data-read"

/** Sin caché: los cambios del dashboard se ven al recargar la página */
export const dynamic = "force-dynamic"

export default async function HomePage() {
  let servicesFromDb: ServiceFromDb[] = []
  let projectsFromDb: Awaited<ReturnType<typeof getProjectsPublic>> = []
  let heroSlidesFromSettings: { title: string; paragraph: string }[] | undefined
  let testimonialsFromDb: TestimonialFromDb[] = []
  let certificationsFromDb: CertificationFromDb[] = []
  let clientsFromDb: ClientFromDb[] = []
  let sectionsData: Awaited<ReturnType<typeof getSectionsPublic>> = {}
  let heroImagesFromDb: { src: string; alt: string }[] = []
  try {
    const [services, projects, settings, testimonials, certs, clis, sections, heroImgs] = await Promise.all([
      getServicesPublic(),
      getProjectsPublic(),
      getCompanyInfo(),
      getTestimonialsPublic(),
      getCertificationsPublic(),
      getClientsPublic(),
      getSectionsPublic(),
      getHeroImagesPublic("home"),
    ])
    servicesFromDb = services as unknown as ServiceFromDb[]
    projectsFromDb = projects
    testimonialsFromDb = testimonials as unknown as TestimonialFromDb[]
    certificationsFromDb = certs as unknown as CertificationFromDb[]
    clientsFromDb = clis as unknown as ClientFromDb[]
    sectionsData = sections ?? {}
    if (settings?.heroSlides && Array.isArray(settings.heroSlides) && settings.heroSlides.length >= 3) {
      heroSlidesFromSettings = settings.heroSlides as { title: string; paragraph: string }[]
    }
    if (Array.isArray(heroImgs) && heroImgs.length >= 1) {
      heroImagesFromDb = heroImgs.map((h) => ({ src: h.image_url, alt: h.alt_text ?? h.page }))
    }
  } catch {
    // Error leyendo data/*.json: se usan listas estáticas en las secciones
  }

  return (
    <>
      <Header />
      <main>
        <HeroSection
          heroSlidesFromSettings={heroSlidesFromSettings}
          heroImagesFromDb={heroImagesFromDb.length >= 1 ? heroImagesFromDb : undefined}
          heroStats={(sectionsData?.whyCronec as { stats?: Array<{ value: number; suffix: string; label: string }> } | undefined)?.stats}
        />
        <ServicesSection servicesFromDb={servicesFromDb} />
        <PortfolioSection projectsFromDb={projectsFromDb} />
        <WhyCronecSection data={sectionsData.whyCronec as WhyCronecData | null | undefined} />
        <ProcessSection data={sectionsData.process as ProcessData | null | undefined} />
        <TestimonialsSection testimonialsFromDb={testimonialsFromDb} />
        <ClientsSection certificationsFromDb={certificationsFromDb} clientsFromDb={clientsFromDb} />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
