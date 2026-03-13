import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { PortfolioSection } from "@/components/portfolio-section"
import { WhyCronecSection } from "@/components/why-cronec-section"
import { ProcessSection } from "@/components/process-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ClientsSection } from "@/components/clients-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePageFtp() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection servicesFromDb={[]} />
        <PortfolioSection projectsFromDb={[]} />
        <WhyCronecSection />
        <ProcessSection />
        <TestimonialsSection />
        <ClientsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
