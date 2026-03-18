import { Shield, Lock, Eye, UserCheck, Database, FileCheck } from "lucide-react"
import { getCompanyInfo } from "@/lib/data-read"
import { SanitizedHtml } from "@/components/sanitized-html"

export const metadata = {
  title: "Política de Privacidad | CRONEC SRL",
  description: "Política de privacidad y protección de datos personales de CRONEC SRL.",
}

export default async function PoliticaPrivacidad() {
  let settings: Awaited<ReturnType<typeof getCompanyInfo>> = null
  try {
    settings = await getCompanyInfo()
  } catch {
    // En producción puede fallar la lectura de datos; mostramos contenido por defecto
  }
  const customHtml = (settings?.legal_politica_privacidad as string)?.trim()
  if (customHtml) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8" />
              <h1 className="text-4xl md:text-5xl font-bold">Política de Privacidad</h1>
            </div>
            <p className="text-xl text-blue-100">Protección y tratamiento de datos personales en CRONEC SRL</p>
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
            <Shield className="h-8 w-8" />
            <h1 className="text-4xl md:text-5xl font-bold">Política de Privacidad</h1>
          </div>
          <p className="text-xl text-blue-100">Protección y tratamiento de datos personales en CRONEC SRL</p>
          <p className="text-sm text-blue-200 mt-4">Última actualización: Enero 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-10">
            {/* Introducción */}
            <div className="border-l-4 border-blue-900 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6 text-blue-900" />
                Introducción
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  CRONEC SRL (CUIT 33-71090097-9), con domicilio en Santa Fe 548, PB "B", Salta Capital (4400),
                  Argentina, se compromete a proteger la privacidad y los datos personales de sus clientes, proveedores,
                  empleados y visitantes de su sitio web, en cumplimiento de la Ley N° 25.326 de Protección de Datos
                  Personales de la República Argentina y sus normas complementarias.
                </p>
                <p>
                  Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos la
                  información personal que nos proporciona.
                </p>
              </div>
            </div>

            {/* Responsable del Tratamiento */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-blue-900" />
                1. Responsable del Tratamiento de Datos
              </h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  <strong>Responsable:</strong> CRONEC SRL
                </p>
                <p>
                  <strong>CUIT:</strong> 33-71090097-9
                </p>
                <p>
                  <strong>Domicilio:</strong> Santa Fe 548, PB "B", Salta Capital (CP 4400), Provincia de Salta
                </p>
                <p>
                  <strong>Email:</strong> info@cronecsrl.com.ar
                </p>
                <p>
                  <strong>Teléfono:</strong> +54 387 431-1902
                </p>
              </div>
            </div>

            {/* Datos que Recopilamos */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="h-6 w-6 text-blue-900" />
                2. Datos Personales que Recopilamos
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>Podemos recopilar los siguientes tipos de información personal:</p>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">2.1. Datos de Identificación:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Nombre y apellido</li>
                      <li>DNI o documento de identidad</li>
                      <li>CUIT/CUIL (en caso de personas jurídicas o físicas)</li>
                      <li>Razón social (en caso de empresas)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">2.2. Datos de Contacto:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Dirección postal</li>
                      <li>Teléfono fijo y/o móvil</li>
                      <li>Correo electrónico</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">2.3. Datos Profesionales y Comerciales:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Empresa o institución que representa</li>
                      <li>Cargo o función</li>
                      <li>Información sobre proyectos o servicios contratados</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">2.4. Datos de Navegación Web:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Dirección IP</li>
                      <li>Tipo de navegador</li>
                      <li>Páginas visitadas</li>
                      <li>Tiempo de permanencia en el sitio</li>
                      <li>Información de cookies (si aplicable)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Finalidad del Tratamiento */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Finalidad del Tratamiento de Datos</h2>
              <div className="text-gray-700 space-y-3">
                <p>Los datos personales recopilados serán utilizados para las siguientes finalidades:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Gestionar consultas y solicitudes de información sobre nuestros servicios</li>
                  <li>Elaborar presupuestos y propuestas comerciales</li>
                  <li>Formalizar contratos de servicios de construcción, ingeniería y obras civiles</li>
                  <li>Ejecutar y gestionar proyectos contratados</li>
                  <li>Emitir facturas y gestionar pagos</li>
                  <li>Mantener comunicación relacionada con los proyectos en curso</li>
                  <li>Cumplir con obligaciones legales, fiscales y contables</li>
                  <li>Enviar información sobre nuevos servicios (solo con consentimiento previo)</li>
                  <li>Mejorar la experiencia de usuario en nuestro sitio web</li>
                  <li>Realizar análisis estadísticos y de mercado (datos anonimizados)</li>
                </ul>
              </div>
            </div>

            {/* Base Legal */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base Legal del Tratamiento</h2>
              <div className="text-gray-700 space-y-3">
                <p>El tratamiento de sus datos personales se basa en:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Ejecución de un contrato:</strong> Para gestionar la relación comercial y ejecutar servicios
                    contratados
                  </li>
                  <li>
                    <strong>Consentimiento informado:</strong> Para envío de comunicaciones comerciales
                  </li>
                  <li>
                    <strong>Obligación legal:</strong> Para cumplimiento de normativas fiscales, laborales y contables
                  </li>
                  <li>
                    <strong>Interés legítimo:</strong> Para mejorar nuestros servicios y gestión interna
                  </li>
                </ul>
              </div>
            </div>

            {/* Conservación de Datos */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Conservación de Datos</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Los datos personales serán conservados durante el tiempo necesario para cumplir con las finalidades
                  para las que fueron recopilados y para cumplir con las obligaciones legales aplicables:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Datos contractuales:</strong> Durante la vigencia del contrato y hasta 10 años después de su
                    finalización (plazo legal de prescripción)
                  </li>
                  <li>
                    <strong>Datos fiscales y contables:</strong> Mínimo 10 años según normativa argentina
                  </li>
                  <li>
                    <strong>Datos de consultas no concretadas:</strong> Hasta 2 años desde el último contacto
                  </li>
                  <li>
                    <strong>Datos de marketing:</strong> Hasta que se retire el consentimiento
                  </li>
                </ul>
              </div>
            </div>

            {/* Compartir Datos */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Compartir Datos con Terceros</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  CRONEC SRL no vende, alquila ni comparte datos personales con terceros para fines comerciales. Sin
                  embargo, puede compartir información con:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Proveedores de servicios:</strong> Contadores, abogados, asesores técnicos (bajo acuerdos de
                    confidencialidad)
                  </li>
                  <li>
                    <strong>Autoridades gubernamentales:</strong> Cuando sea requerido por ley (AFIP, ARCA,
                    Municipalidad, etc.)
                  </li>
                  <li>
                    <strong>Entidades financieras:</strong> Para procesamiento de pagos
                  </li>
                  <li>
                    <strong>Aseguradoras:</strong> Para gestión de pólizas de seguro de obra
                  </li>
                </ul>
              </div>
            </div>

            {/* Seguridad */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6 text-blue-900" />
                7. Medidas de Seguridad
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Implementamos medidas técnicas, organizativas y administrativas apropiadas para proteger los datos
                  personales contra acceso no autorizado, pérdida, destrucción o alteración:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Acceso restringido a datos personales solo a personal autorizado</li>
                  <li>Uso de contraseñas seguras y cifrado de datos sensibles</li>
                  <li>Copias de seguridad periódicas</li>
                  <li>Acuerdos de confidencialidad con empleados y colaboradores</li>
                  <li>Actualización de sistemas de seguridad informática</li>
                </ul>
              </div>
            </div>

            {/* Derechos del Titular */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-blue-900" />
                8. Derechos del Titular de los Datos
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>De acuerdo con la Ley 25.326, usted tiene derecho a:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Acceso:</strong> Conocer qué datos personales tenemos sobre usted
                  </li>
                  <li>
                    <strong>Rectificación:</strong> Solicitar la corrección de datos inexactos o incompletos
                  </li>
                  <li>
                    <strong>Actualización:</strong> Mantener sus datos actualizados
                  </li>
                  <li>
                    <strong>Supresión:</strong> Solicitar la eliminación de sus datos (salvo obligación legal de
                    conservarlos)
                  </li>
                  <li>
                    <strong>Confidencialidad:</strong> Exigir que sus datos sean tratados con confidencialidad
                  </li>
                  <li>
                    <strong>Oposición:</strong> Oponerse al tratamiento de sus datos para finalidades específicas
                  </li>
                  <li>
                    <strong>Revocación del consentimiento:</strong> Retirar su consentimiento en cualquier momento
                  </li>
                </ul>
                <p className="mt-4">
                  Para ejercer estos derechos, puede contactarnos en <strong>info@cronecsrl.com.ar</strong> o mediante
                  carta dirigida a Santa Fe 548, PB "B", Salta Capital (4400).
                </p>
              </div>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies y Tecnologías Similares</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Nuestro sitio web puede utilizar cookies y tecnologías similares para mejorar la experiencia del
                  usuario y analizar el tráfico del sitio. Las cookies son pequeños archivos de texto almacenados en su
                  dispositivo.
                </p>
                <p>
                  Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del
                  sitio web.
                </p>
              </div>
            </div>

            {/* Enlaces a Terceros */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Enlaces a Sitios de Terceros</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Nuestro sitio web puede contener enlaces a sitios de terceros. No nos responsabilizamos por las
                  políticas de privacidad o contenido de dichos sitios. Recomendamos revisar las políticas de privacidad
                  de cada sitio que visite.
                </p>
              </div>
            </div>

            {/* Modificaciones */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Modificaciones a esta Política</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  CRONEC SRL se reserva el derecho de modificar esta Política de Privacidad en cualquier momento.
                  Cualquier cambio será publicado en esta página con la fecha de actualización correspondiente.
                </p>
              </div>
            </div>

            {/* Reclamos */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Autoridad de Aplicación</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  La Agencia de Acceso a la Información Pública es la autoridad de control en materia de protección de
                  datos personales en Argentina. Puede presentar reclamos ante:
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p>
                    <strong>Agencia de Acceso a la Información Pública</strong>
                  </p>
                  <p>Web: www.argentina.gob.ar/aaip</p>
                  <p>Email: datospersonales@aaip.gob.ar</p>
                </div>
              </div>
            </div>

            {/* Contacto */}
            <div className="bg-blue-50 rounded-lg p-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileCheck className="h-6 w-6 text-blue-900" />
                Contacto para Consultas sobre Privacidad
              </h2>
              <div className="text-gray-700 space-y-2">
                <p>
                  Para cualquier consulta sobre esta Política de Privacidad o el tratamiento de sus datos personales:
                </p>
                <p className="mt-4">
                  <strong>CRONEC SRL</strong>
                </p>
                <p>Santa Fe 548, PB "B" - Salta Capital (4400)</p>
                <p>Provincia de Salta, Argentina</p>
                <p>Email: info@cronecsrl.com.ar</p>
                <p>Teléfono: +54 387 431-1902</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
