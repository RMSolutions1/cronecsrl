import { Award, Target, CheckCircle2, Users, Briefcase, Shield, TrendingUp, Star } from "lucide-react"
import { getCompanyInfo } from "@/lib/data-read"
import { SanitizedHtml } from "@/components/sanitized-html"

export const metadata = {
  title: "Política de Calidad | CRONEC SRL",
  description: "Política de calidad, compromisos y estándares de excelencia de CRONEC SRL.",
}

export default async function PoliticaCalidad() {
  let settings: Awaited<ReturnType<typeof getCompanyInfo>> = null
  try {
    settings = await getCompanyInfo()
  } catch {
    // En producción puede fallar la lectura de datos; mostramos contenido por defecto
  }
  const customHtml = (settings?.legal_politica_calidad as string)?.trim()
  if (customHtml) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-8 w-8" />
              <h1 className="text-4xl md:text-5xl font-bold">Política de Calidad</h1>
            </div>
            <p className="text-xl text-blue-100">Compromiso con la excelencia en cada proyecto que realizamos</p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <SanitizedHtml html={customHtml} className="bg-white rounded-xl shadow-lg p-8 md:p-12 prose prose-neutral max-w-none" />
          </div>
        </section>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-8 w-8" />
            <h1 className="text-4xl md:text-5xl font-bold">Política de Calidad</h1>
          </div>
          <p className="text-xl text-blue-100">Compromiso con la excelencia en cada proyecto que realizamos</p>
          <p className="text-sm text-blue-200 mt-4">Última actualización: Enero 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-10">
            {/* Declaración de Política */}
            <div className="border-l-4 border-blue-900 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-900" />
                Declaración de Política de Calidad
              </h2>
              <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
                <p>
                  <strong>CRONEC SRL</strong>, empresa Salteña con más de 15 años de trayectoria en el sector de la
                  construcción, obras civiles, instalaciones eléctricas e infraestructura, declara su compromiso
                  inquebrantable con la
                  <strong> excelencia, calidad y satisfacción del cliente</strong> en todos los proyectos que emprende.
                </p>
                <p>
                  Nuestra política de calidad se fundamenta en el cumplimiento de normas técnicas internacionales, la
                  capacitación continua de nuestro personal, y la implementación de sistemas de gestión que garantizan
                  la entrega de obras seguras, funcionales y duraderas.
                </p>
              </div>
            </div>

            {/* Alcance */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Alcance</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Esta Política de Calidad aplica a todas las actividades y servicios desarrollados por CRONEC SRL,
                  incluyendo:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-900 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Construcción de Edificios</h3>
                      <p className="text-sm text-gray-600">Residenciales y no residenciales</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-900 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Obras de Infraestructura</h3>
                      <p className="text-sm text-gray-600">Transporte y servicios públicos</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-900 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Instalaciones Eléctricas</h3>
                      <p className="text-sm text-gray-600">Industriales y comerciales</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-900 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Ingeniería y Arquitectura</h3>
                      <p className="text-sm text-gray-600">Proyecto, dirección y construcción</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Objetivos de Calidad */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="h-6 w-6 text-blue-900" />
                Objetivos de Calidad
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>CRONEC SRL establece los siguientes objetivos de calidad:</p>
                <div className="space-y-4 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-900 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Cumplimiento de Especificaciones Técnicas</h3>
                      <p>
                        Ejecutar todos los proyectos conforme a las normas técnicas nacionales e internacionales
                        aplicables, planos aprobados y especificaciones contractuales.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-900 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Satisfacción del Cliente</h3>
                      <p>
                        Alcanzar un índice de satisfacción superior al 95% mediante entregas puntuales, comunicación
                        transparente y atención personalizada.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-900 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Seguridad Laboral</h3>
                      <p>
                        Mantener un ambiente de trabajo seguro con cero accidentes graves, mediante capacitación
                        continua y cumplimiento estricto de normas de higiene y seguridad.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-900 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Mejora Continua</h3>
                      <p>
                        Implementar acciones de mejora basadas en lecciones aprendidas, auditorías internas y feedback
                        de clientes.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-900 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                      5
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Eficiencia Operativa</h3>
                      <p>
                        Optimizar el uso de recursos, minimizar desperdicios y maximizar la productividad sin
                        comprometer la calidad.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-900 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                      6
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Responsabilidad Ambiental</h3>
                      <p>
                        Minimizar el impacto ambiental de nuestras operaciones mediante gestión adecuada de residuos y
                        uso responsable de recursos naturales.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compromisos */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-blue-900" />
                Compromisos de CRONEC SRL
              </h2>
              <div className="text-gray-700 space-y-3">
                <p>Para cumplir con nuestra Política de Calidad, CRONEC SRL se compromete a:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Capacitar constantemente</strong> a nuestro personal en técnicas constructivas, seguridad
                      laboral y gestión de calidad
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Utilizar materiales de primera calidad</strong> certificados y homologados según
                      normativas vigentes
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Contar con equipamiento moderno</strong> y herramientas en óptimas condiciones de
                      funcionamiento
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Realizar controles de calidad</strong> en todas las etapas del proyecto mediante
                      inspecciones y ensayos
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Mantener comunicación fluida</strong> con el cliente durante todo el desarrollo del
                      proyecto
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Cumplir con plazos de entrega</strong> establecidos contractualmente
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Documentar todos los procesos</strong> para garantizar trazabilidad y transparencia
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Resolver reclamos</strong> de manera ágil y efectiva
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Equipo Profesional */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-900" />
                Equipo Profesional Multidisciplinario
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  CRONEC SRL cuenta con un equipo de profesionales altamente capacitados que respaldan la calidad de
                  nuestros servicios:
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <Users className="h-8 w-8 text-blue-900" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Ingenieros</h3>
                    <p className="text-sm text-gray-600">Civil, Electricistas, Industriales</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <Users className="h-8 w-8 text-blue-900" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Arquitectos</h3>
                    <p className="text-sm text-gray-600">Diseño y dirección de obra</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <Users className="h-8 w-8 text-blue-900" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Especialistas</h3>
                    <p className="text-sm text-gray-600">Geólogos, Topógrafos</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-8 w-8 text-blue-900" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Higiene y Seguridad</h3>
                    <p className="text-sm text-gray-600">Asesores especializados</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <Award className="h-8 w-8 text-blue-900" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Medio Ambiente</h3>
                    <p className="text-sm text-gray-600">Gestión ambiental</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <Briefcase className="h-8 w-8 text-blue-900" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Legales y Contables</h3>
                    <p className="text-sm text-gray-600">Abogados, Contadores</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Control de Calidad */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-blue-900" />
                Sistema de Control de Calidad
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>Nuestro sistema de control de calidad incluye:</p>
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">1. Planificación de Calidad</h3>
                    <p className="text-sm">
                      Definición de estándares, procedimientos y puntos de control para cada proyecto
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">2. Control de Materiales</h3>
                    <p className="text-sm">
                      Verificación de certificados, ensayos de laboratorio y auditorías a proveedores
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">3. Inspecciones en Obra</h3>
                    <p className="text-sm">Supervisión continua durante la ejecución y registros de control diarios</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">4. Ensayos y Pruebas</h3>
                    <p className="text-sm">Pruebas de funcionamiento, resistencia y performance según corresponda</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">5. Documentación y Trazabilidad</h3>
                    <p className="text-sm">
                      Registro completo de actividades, materiales utilizados y controles realizados
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">6. Auditorías Internas</h3>
                    <p className="text-sm">Evaluaciones periódicas del cumplimiento de procedimientos y objetivos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mejora Continua */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-blue-900" />
                Mejora Continua
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>CRONEC SRL implementa un ciclo de mejora continua basado en:</p>
                <div className="grid md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className="bg-blue-900 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                      P
                    </div>
                    <h3 className="font-semibold text-gray-900">Planificar</h3>
                    <p className="text-sm text-gray-600">Identificar oportunidades de mejora</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-900 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                      D
                    </div>
                    <h3 className="font-semibold text-gray-900">Hacer</h3>
                    <p className="text-sm text-gray-600">Implementar acciones de mejora</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-900 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                      C
                    </div>
                    <h3 className="font-semibold text-gray-900">Verificar</h3>
                    <p className="text-sm text-gray-600">Evaluar resultados obtenidos</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-900 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                      A
                    </div>
                    <h3 className="font-semibold text-gray-900">Actuar</h3>
                    <p className="text-sm text-gray-600">Estandarizar mejoras exitosas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Normativas */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Normativas de Referencia</h2>
              <div className="text-gray-700 space-y-3">
                <p>CRONEC SRL adhiere y cumple con las siguientes normativas:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Código de Edificación de la Municipalidad de Salta</li>
                  <li>Normas IRAM (Instituto Argentino de Normalización y Certificación)</li>
                  <li>Reglamento AEA (Asociación Electrotécnica Argentina) para instalaciones eléctricas</li>
                  <li>Ley 19.587 de Higiene y Seguridad en el Trabajo</li>
                  <li>Ley 24.557 de Riesgos del Trabajo (ART)</li>
                  <li>Normas ISO aplicables (ISO 9001, ISO 14001, ISO 45001)</li>
                  <li>Reglamentos municipales y provinciales de construcción</li>
                </ul>
              </div>
            </div>

            {/* Responsabilidad */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsabilidad y Difusión</h2>
              <div className="text-gray-700 space-y-4">
                <p>La Gerencia General de CRONEC SRL es responsable de asegurar que esta Política de Calidad sea:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Comunicada y comprendida por todo el personal de la empresa</li>
                  <li>Implementada en todos los niveles de la organización</li>
                  <li>Revisada periódicamente para mantener su pertinencia y efectividad</li>
                  <li>Disponible para clientes, proveedores y partes interesadas</li>
                </ul>
              </div>
            </div>

            {/* Firma */}
            <div className="bg-blue-50 rounded-lg p-6 mt-8">
              <div className="text-center space-y-4">
                <p className="text-lg font-semibold text-gray-900">
                  "En CRONEC SRL, la calidad no es un objetivo, es nuestra forma de trabajar"
                </p>
                <div className="pt-6 border-t border-blue-200">
                  <p className="font-semibold text-gray-900">Gerencia General</p>
                  <p className="text-gray-700">CRONEC SRL</p>
                  <p className="text-sm text-gray-600">CUIT 33-71090097-9</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
