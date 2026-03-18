import { Building2, Scale, AlertCircle } from "lucide-react"
import DOMPurify from "isomorphic-dompurify"
import { getCompanyInfo } from "@/lib/data-read"

export const metadata = {
  title: "Términos y Condiciones | CRONEC SRL",
  description: "Términos y condiciones de uso de los servicios de CRONEC SRL.",
}

export default async function TerminosCondiciones() {
  let settings: Awaited<ReturnType<typeof getCompanyInfo>> = null
  try {
    settings = await getCompanyInfo()
  } catch {
    // En producción puede fallar la lectura de datos; mostramos contenido por defecto
  }
  const customHtml = (settings?.legal_terminos_condiciones as string)?.trim()
  if (customHtml) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-8 w-8" />
              <h1 className="text-4xl md:text-5xl font-bold">Términos y Condiciones</h1>
            </div>
            <p className="text-xl text-blue-100">Condiciones generales de contratación de servicios de CRONEC SRL</p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(customHtml) }} />
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
            <Scale className="h-8 w-8" />
            <h1 className="text-4xl md:text-5xl font-bold">Términos y Condiciones</h1>
          </div>
          <p className="text-xl text-blue-100">Condiciones generales de contratación de servicios de CRONEC SRL</p>
          <p className="text-sm text-blue-200 mt-4">Última actualización: Enero 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-10">
            {/* Información de la Empresa */}
            <div className="border-l-4 border-blue-900 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-900" />
                1. Información de la Empresa
              </h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  <strong>Razón Social:</strong> CRONEC SRL
                </p>
                <p>
                  <strong>CUIT:</strong> 33-71090097-9
                </p>
                <p>
                  <strong>Forma Jurídica:</strong> Sociedad de Responsabilidad Limitada
                </p>
                <p>
                  <strong>Fecha de Constitución:</strong> 04 de Febrero de 2009
                </p>
                <p>
                  <strong>Domicilio Legal:</strong> Santa Fe 548, PB "B", Salta Capital (CP 4400), Provincia de Salta,
                  Argentina
                </p>
                <p>
                  <strong>Actividad Principal:</strong> Construcción, reforma y reparación de edificios no residenciales
                </p>
                <p>
                  <strong>Inscripción Impositiva:</strong> IVA Responsable Inscripto
                </p>
              </div>
            </div>

            {/* Objeto y Alcance */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Objeto y Alcance</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Los presentes términos y condiciones regulan la contratación de servicios de construcción, obras
                  civiles, instalaciones eléctricas, infraestructura, ingeniería y arquitectura ofrecidos por CRONEC
                  S.R.L. (en adelante "la Empresa").
                </p>
                <p>
                  La contratación de cualquier servicio implica la aceptación expresa e incondicional de estos términos
                  por parte del cliente.
                </p>
              </div>
            </div>

            {/* Servicios */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Servicios Ofrecidos</h2>
              <div className="text-gray-700 space-y-3">
                <p>CRONEC SRL ofrece los siguientes servicios profesionales:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Construcción de Edificios:</strong> Residenciales y no residenciales
                  </li>
                  <li>
                    <strong>Obras de Infraestructura:</strong> Para transporte y servicios públicos
                  </li>
                  <li>
                    <strong>Instalaciones Eléctricas:</strong> Industriales y comerciales
                  </li>
                  <li>
                    <strong>Redes de Distribución:</strong> Electricidad, gas, agua y telecomunicaciones
                  </li>
                  <li>
                    <strong>Arquitectura e Ingeniería:</strong> Proyecto, dirección y construcción
                  </li>
                  <li>
                    <strong>Obras Civiles:</strong> Mantenimiento, refacciones e impermeabilizaciones
                  </li>
                  <li>
                    <strong>Instalaciones Industriales:</strong> Naves, galpones y montajes electromecánicos
                  </li>
                </ul>
              </div>
            </div>

            {/* Cotizaciones y Presupuestos */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cotizaciones y Presupuestos</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  <strong>4.1.</strong> Todas las cotizaciones y presupuestos emitidos por la Empresa tienen una validez
                  de 30 días corridos desde su emisión, salvo que se indique expresamente un plazo diferente.
                </p>
                <p>
                  <strong>4.2.</strong> Los presupuestos son estimativos y pueden sufrir variaciones en función de
                  condiciones imprevistas descubiertas durante la ejecución de la obra, modificaciones solicitadas por
                  el cliente, o variaciones en los costos de materiales y mano de obra.
                </p>
                <p>
                  <strong>4.3.</strong> Cualquier modificación al presupuesto original deberá ser comunicada por escrito
                  y aprobada por el cliente.
                </p>
              </div>
            </div>

            {/* Contratación y Ejecución */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contratación y Ejecución de Obras</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  <strong>5.1.</strong> La aceptación de un presupuesto se formalizará mediante la firma de un contrato
                  específico que detallará el alcance de los trabajos, plazos, condiciones de pago y demás
                  especificaciones técnicas.
                </p>
                <p>
                  <strong>5.2.</strong> Los plazos de ejecución están sujetos a condiciones climáticas favorables,
                  disponibilidad de materiales, y cumplimiento de pagos por parte del cliente según lo pactado.
                </p>
                <p>
                  <strong>5.3.</strong> La Empresa se reserva el derecho de suspender los trabajos ante la falta de pago
                  en los términos acordados.
                </p>
                <p>
                  <strong>5.4.</strong> El cliente deberá facilitar el acceso a la obra y proporcionar los servicios
                  básicos necesarios (agua, electricidad) para la ejecución de los trabajos.
                </p>
              </div>
            </div>

            {/* Condiciones de Pago */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Condiciones de Pago</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  <strong>6.1.</strong> Las condiciones de pago serán establecidas específicamente en cada contrato,
                  pudiendo incluir:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Anticipo inicial (generalmente 30-40% del valor total)</li>
                  <li>Pagos parciales según avance de obra certificado</li>
                  <li>Pago final al completarse la obra y ser aprobada por el cliente</li>
                </ul>
                <p>
                  <strong>6.2.</strong> Los pagos deberán realizarse mediante transferencia bancaria o cheque a nombre
                  de CRONEC SRL
                </p>
                <p>
                  <strong>6.3.</strong> La mora en los pagos generará intereses según la tasa activa del Banco de la
                  Nación Argentina.
                </p>
              </div>
            </div>

            {/* Responsabilidades y Garantías */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Responsabilidades y Garantías</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  <strong>7.1.</strong> La Empresa garantiza la calidad de los trabajos realizados conforme a las normas
                  técnicas vigentes y buenas prácticas de la construcción.
                </p>
                <p>
                  <strong>7.2.</strong> La garantía de los trabajos será de 12 meses desde la fecha de finalización y
                  recepción conforme de la obra, excluyendo daños causados por uso inadecuado, falta de mantenimiento o
                  caso fortuito.
                </p>
                <p>
                  <strong>7.3.</strong> La Empresa cuenta con seguros de responsabilidad civil y ART que cubren a su
                  personal durante la ejecución de los trabajos.
                </p>
                <p>
                  <strong>7.4.</strong> La Empresa no se responsabiliza por demoras o incumplimientos causados por caso
                  fortuito o fuerza mayor.
                </p>
              </div>
            </div>

            {/* Propiedad Intelectual */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Propiedad Intelectual</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Los proyectos, planos, cálculos y diseños elaborados por la Empresa o sus profesionales asociados son
                  de su exclusiva propiedad intelectual y no podrán ser reproducidos, modificados o utilizados sin
                  autorización expresa y por escrito.
                </p>
              </div>
            </div>

            {/* Confidencialidad */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Confidencialidad</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  La Empresa se compromete a mantener la confidencialidad de toda información técnica, comercial o
                  estratégica del cliente a la que tenga acceso durante la ejecución de los trabajos contratados.
                </p>
              </div>
            </div>

            {/* Resolución de Controversias */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Resolución de Controversias</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Cualquier controversia derivada de la interpretación o ejecución de estos términos será sometida a la
                  jurisdicción de los Tribunales Ordinarios de la ciudad de Salta, Provincia de Salta, Argentina, con
                  renuncia expresa a cualquier otro fuero o jurisdicción.
                </p>
              </div>
            </div>

            {/* Modificaciones */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Modificaciones</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  La Empresa se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Las
                  modificaciones entrarán en vigor a partir de su publicación en el sitio web oficial.
                </p>
              </div>
            </div>

            {/* Contacto */}
            <div className="bg-blue-50 rounded-lg p-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Información de Contacto</h2>
              <div className="text-gray-700 space-y-2">
                <p>
                  <strong>CRONEC SRL</strong>
                </p>
                <p>Santa Fe 548, PB "B" - Salta Capital (4400)</p>
                <p>Provincia de Salta, Argentina</p>
                <p>Email: info@cronecsrl.com.ar</p>
                <p>Teléfono: +54 387 431-1902</p>
              </div>
            </div>

            {/* Nota Legal */}
            <div className="border-t pt-6 mt-8">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <p>
                  La aceptación de un presupuesto y/o la firma de un contrato con CRONEC SRL implica la lectura,
                  comprensión y aceptación total de estos Términos y Condiciones. Se recomienda conservar una copia de
                  este documento para futuras referencias.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
