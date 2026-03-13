import type { Metadata } from "next"
import {
  Building2,
  Award,
  Target,
  Users,
  CheckCircle2,
  Download,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  TrendingUp,
  Shield,
  Wrench,
  Lightbulb,
  Construction,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { images } from "@/lib/images"
import { getCompanyInfo } from "@/app/actions/db/company-info"

export const metadata: Metadata = {
  title: "Brochure Corporativo | CRONEC SRL",
  description:
    "Brochure corporativo de CRONEC SRL - Construcción, ingeniería e infraestructura de excelencia en Salta desde 2009.",
}

export default async function BrochurePage() {
  let companyName = "CRONEC SRL"
  let tagline = "Construcciones Eléctricas y Civiles"
  let intro = "15+ años construyendo infraestructura de excelencia en Salta"
  let brochurePdfUrl = ""
  let brochureCtaText = "Descargar Brochure PDF"
  try {
    const settings = await getCompanyInfo()
    if (settings && typeof settings === "object") {
      if (typeof settings.company_name === "string" && settings.company_name.trim()) companyName = settings.company_name
      if (typeof settings.tagline === "string" && settings.tagline.trim()) tagline = settings.tagline
      if (typeof settings.description === "string" && settings.description.trim()) intro = settings.description.slice(0, 120) + (settings.description.length > 120 ? "…" : "")
      if (typeof settings.brochure_pdf_url === "string" && settings.brochure_pdf_url.trim()) brochurePdfUrl = settings.brochure_pdf_url
      if (typeof settings.brochure_cta_text === "string" && settings.brochure_cta_text.trim()) brochureCtaText = settings.brochure_cta_text
    }
  } catch {
    // usar valores por defecto
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Cover Page */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 text-white overflow-hidden py-20">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${images.whyCronec})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="mb-8 flex justify-center">
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <Building2 className="h-24 w-24 text-blue-900" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">{companyName}</h1>
          <p className="text-3xl md:text-4xl mb-4 text-blue-100 font-light">{tagline}</p>
          <div className="w-32 h-1 bg-orange-500 mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-16">
            {intro}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {brochurePdfUrl ? (
              <a href={brochurePdfUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Download className="h-5 w-5 mr-2" />
                  {brochureCtaText}
                </Button>
              </a>
            ) : (
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white" disabled>
                <Download className="h-5 w-5 mr-2" />
                {brochureCtaText}
              </Button>
            )}
            <Link href="/contacto">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-900 bg-transparent"
              >
                Solicitar Cotización
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quiénes Somos */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-blue-100 text-blue-900 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Nuestra Empresa
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">Quiénes Somos</h2>
              <div className="w-20 h-1 bg-orange-500 mb-6"></div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong className="text-blue-900">CRONEC SRL</strong> es una empresa Salteña constituida en 2009,
                dedicada a Obras Públicas, obras de saneamiento, infraestructura y Obras Eléctricas en general.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Con 15+ años de experiencia en el mercado, nos hemos posicionado como referentes en construcción civil,
                instalaciones eléctricas industriales y desarrollo de infraestructura en la Provincia de Salta y
                regiones aledañas.
              </p>
              <div className="bg-blue-50 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span className="text-gray-800">
                    <strong>Inscripción:</strong> Febrero 2009
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span className="text-gray-800">
                    <strong>CUIT:</strong> 33-71090097-9
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span className="text-gray-800">
                    <strong>Forma Jurídica:</strong> S.R.L.
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={images.companyBuilding}
                  alt="Oficinas CRONEC SRL"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-900 text-white rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold mb-1">15+</p>
                  <p className="text-sm">Años de Experiencia</p>
                </div>
                <div className="bg-orange-500 text-white rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold mb-1">500+</p>
                  <p className="text-sm">Proyectos</p>
                </div>
                <div className="bg-blue-900 text-white rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold mb-1">100%</p>
                  <p className="text-sm">Comprometidos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Misión y Visión</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-blue-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Proveer servicios de construcción, ingeniería e instalaciones de la más alta calidad, cumpliendo con los
                estándares técnicos y normativas vigentes, garantizando la satisfacción de nuestros clientes mediante la
                entrega oportuna de obras seguras, funcionales y duraderas, sustentadas en la capacitación continua de
                nuestro personal y el compromiso con la excelencia operativa.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Consolidarnos como la empresa líder de construcción e infraestructura en el noroeste argentino,
                reconocida por nuestra integridad, innovación tecnológica y compromiso con el desarrollo sostenible,
                siendo el socio estratégico preferido por instituciones públicas y privadas para la ejecución de
                proyectos de gran envergadura y complejidad técnica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Principios fundamentales que guían nuestro actuar diario
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-900 transition-colors">
                <Shield className="h-12 w-12 text-blue-900 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Integridad</h3>
              <p className="text-gray-600 leading-relaxed">
                Actuamos con honestidad, transparencia y ética en todas nuestras relaciones comerciales y operaciones.
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-900 transition-colors">
                <Award className="h-12 w-12 text-blue-900 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Excelencia</h3>
              <p className="text-gray-600 leading-relaxed">
                Buscamos la calidad superior en cada proyecto, superando expectativas y estándares de la industria.
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-900 transition-colors">
                <Users className="h-12 w-12 text-blue-900 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trabajo en Equipo</h3>
              <p className="text-gray-600 leading-relaxed">
                Fomentamos la colaboración, el respeto mutuo y la comunicación efectiva entre todos nuestros
                colaboradores.
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-900 transition-colors">
                <Lightbulb className="h-12 w-12 text-blue-900 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovación</h3>
              <p className="text-gray-600 leading-relaxed">
                Incorporamos tecnologías y metodologías modernas para optimizar procesos y resultados.
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-900 transition-colors">
                <TrendingUp className="h-12 w-12 text-blue-900 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Compromiso</h3>
              <p className="text-gray-600 leading-relaxed">
                Cumplimos con nuestras promesas, plazos y especificaciones técnicas en cada proyecto que emprendemos.
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-900 transition-colors">
                <Shield className="h-12 w-12 text-blue-900 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Seguridad</h3>
              <p className="text-gray-600 leading-relaxed">
                Priorizamos la protección de nuestro personal, clientes y el medio ambiente en todas nuestras
                operaciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-24 bg-gradient-to-br from-blue-900 to-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Servicios</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Soluciones integrales en construcción, ingeniería e infraestructura
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
              <Construction className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Construcción de Edificios</h3>
              <p className="text-blue-100 mb-4">
                Proyectos residenciales y no residenciales con los más altos estándares de calidad y cumplimiento
                normativo.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Edificios comerciales e industriales</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Viviendas unifamiliares y multifamiliares</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Refacciones y ampliaciones</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
              <Wrench className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Obras de Infraestructura</h3>
              <p className="text-blue-100 mb-4">
                Desarrollo de infraestructura de transporte y servicios públicos con ingeniería de precisión.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Caminos y obras viales</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Puentes y estructuras especiales</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Obras ferroviarias</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
              <Lightbulb className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Instalaciones Eléctricas</h3>
              <p className="text-blue-100 mb-4">
                Proyectos eléctricos industriales y comerciales conforme a normativas AEA vigentes.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Tableros eléctricos industriales</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Montajes electromecánicos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Instalaciones de media y baja tensión</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
              <Building2 className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Redes de Distribución</h3>
              <p className="text-blue-100 mb-4">
                Construcción de redes para distribución de servicios esenciales en zonas urbanas y rurales.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Redes eléctricas de distribución</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Gasoductos y redes de gas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Acueductos y cloacas</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
              <Briefcase className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Arquitectura e Ingeniería</h3>
              <p className="text-blue-100 mb-4">
                Servicios profesionales de diseño, cálculo, proyecto y dirección técnica de obras.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Proyectos arquitectónicos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Cálculo estructural</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Dirección técnica de obra</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
              <Wrench className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Instalaciones Industriales</h3>
              <p className="text-blue-100 mb-4">
                Construcción y montaje de instalaciones para procesos industriales complejos.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Naves industriales y galpones</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Montajes electromecánicos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Instalaciones de proceso</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Equipo Profesional */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Equipo Multidisciplinario</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profesionales altamente capacitados y en constante actualización
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl p-8 md:p-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-4xl mx-auto">
              CRONEC SRL mantiene a su personal permanentemente actualizado a través de diferentes Cursos de
              Capacitación, contando dentro de sus asesores con personal especializado y profesionales referentes en
              diversas áreas.
            </p>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-900" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Ingenieros Civiles</h3>
                <p className="text-sm text-gray-600">Diseño y cálculo estructural</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-blue-900" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Ingenieros Electricistas</h3>
                <p className="text-sm text-gray-600">Instalaciones eléctricas</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-blue-900" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Arquitectos</h3>
                <p className="text-sm text-gray-600">Diseño y dirección de obra</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-blue-900" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Geólogos</h3>
                <p className="text-sm text-gray-600">Estudios de suelos</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-900" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Topógrafos</h3>
                <p className="text-sm text-gray-600">Mediciones y replanteos</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-900" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Higiene y Seguridad</h3>
                <p className="text-sm text-gray-600">Prevención de riesgos</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-blue-900" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Medio Ambiente</h3>
                <p className="text-sm text-gray-600">Gestión ambiental</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-blue-900" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Contadores y Abogados</h3>
                <p className="text-sm text-gray-600">Asesoramiento integral</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por Qué Elegirnos */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">¿Por Qué Elegir CRONEC?</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Atributos diferenciales que nos posicionan como líderes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
              <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Experiencia Comprobada</h3>
              <p className="text-gray-600">
                Más de 15 años ejecutando proyectos de gran envergadura en Salta y regiones del NOA con resultados
                exitosos.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
              <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Equipo Multidisciplinario</h3>
              <p className="text-gray-600">
                Profesionales especializados en todas las áreas: ingeniería, arquitectura, seguridad y gestión
                ambiental.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
              <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Certificaciones y Cumplimiento</h3>
              <p className="text-gray-600">
                Cumplimiento estricto de normativas IRAM, AEA, códigos de edificación y legislación vigente.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
              <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 font-bold text-xl">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tecnología de Punta</h3>
              <p className="text-gray-600">
                Equipamiento moderno y uso de software especializado para planificación, diseño y control de proyectos.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
              <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 font-bold text-xl">
                5
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Compromiso con Plazos</h3>
              <p className="text-gray-600">
                Gestión eficiente que garantiza entregas en tiempo y forma según cronogramas establecidos.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
              <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 font-bold text-xl">
                6
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Seguridad Integral</h3>
              <p className="text-gray-600">
                Protocolos rigurosos de higiene y seguridad laboral, con cobertura ART completa para todo el personal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto Final */}
      <section className="py-24 bg-gradient-to-r from-blue-900 to-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Construyamos Juntos su Próximo Proyecto</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Contáctenos para recibir asesoramiento profesional y una cotización personalizada sin compromiso
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Phone className="h-8 w-8 mx-auto mb-4 text-orange-500" />
              <h3 className="font-semibold mb-2">Teléfono</h3>
              <a href="tel:+5493875361210" className="text-blue-100 hover:text-white transition-colors">
                +54 9 (387) 536-1210
              </a>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Mail className="h-8 w-8 mx-auto mb-4 text-orange-500" />
              <h3 className="font-semibold mb-2">Email</h3>
              <a href="mailto:cronec@cronecsrl.com.ar" className="text-blue-100 hover:text-white transition-colors">
                cronec@cronecsrl.com.ar
              </a>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <MapPin className="h-8 w-8 mx-auto mb-4 text-orange-500" />
              <h3 className="font-semibold mb-2">Dirección</h3>
              <p className="text-blue-100 text-sm">
                Santa Fe 548, PB "B"
                <br />
                Salta Capital (4400)
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              <a href="tel:+5493875361210">
                <Phone className="h-5 w-5 mr-2" />
                Llamar Ahora
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-900 bg-transparent"
            >
              <a href="mailto:cronec@cronecsrl.com.ar">
                <Mail className="h-5 w-5 mr-2" />
                Enviar Email
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Brochure */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="h-8 w-8 text-orange-500" />
            <p className="text-2xl font-bold">CRONEC SRL</p>
          </div>
          <p className="text-gray-400 mb-2">CUIT: 33-71090097-9</p>
          <p className="text-gray-400 text-sm">
            Santa Fe 548, PB "B" - Salta Capital (4400) - Provincia de Salta, Argentina
          </p>
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-500">
              © 2025 CRONEC SRL. Todos los derechos reservados. | Construcciones Eléctricas y Civiles
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
