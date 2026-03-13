import { FileSearch, ClipboardCheck, Hammer, CheckCircle } from "lucide-react"

export type ProcessStep = { number: string; title: string; description: string }
export type ProcessData = { title?: string; subtitle?: string; steps?: ProcessStep[] }

const defaultSteps: Array<{ number: string; icon: React.ComponentType<{ className?: string }>; title: string; description: string }> = [
  { number: "01", icon: FileSearch, title: "Consulta Inicial", description: "Análisis detallado de sus necesidades, objetivos y requisitos técnicos del proyecto." },
  { number: "02", icon: ClipboardCheck, title: "Evaluación Técnica", description: "Estudio de factibilidad, inspección del sitio y desarrollo de anteproyecto." },
  { number: "03", icon: FileSearch, title: "Propuesta Personalizada", description: "Presentación de solución técnica, cronograma detallado y presupuesto ajustado." },
  { number: "04", icon: Hammer, title: "Ejecución Profesional", description: "Construcción con control de calidad continuo, gestión de seguridad y comunicación constante." },
  { number: "05", icon: CheckCircle, title: "Entrega y Garantía", description: "Inspección final, documentación completa y servicio de garantía post-entrega." },
]

export function ProcessSection({ data }: { data?: ProcessData | null }) {
  const title = data?.title ?? "Nuestro Proceso de Trabajo"
  const subtitle = data?.subtitle ?? "Metodología probada que garantiza resultados excepcionales en cada etapa de su proyecto."
  const stepsFromData = data?.steps ?? []
  const steps = stepsFromData.length >= 5
    ? stepsFromData.map((s, i) => ({ ...defaultSteps[i], ...s, icon: defaultSteps[i].icon }))
    : defaultSteps

  return (
    <section className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden" aria-labelledby="process-heading">
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 id="process-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
            {title === "Nuestro Proceso de Trabajo" ? <>Nuestro Proceso de <span className="text-primary">Trabajo</span></> : title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">{subtitle}</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" aria-hidden="true" />

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 list-none">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <li key={index} className="relative flex flex-col items-center text-center space-y-4">
                  {/* Circle connector */}
                  <div
                    className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground font-bold text-xl shadow-lg border-4 border-background"
                    aria-hidden="true"
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div
                    className="flex items-center justify-center w-14 h-14 rounded-xl bg-card border-2 border-border shadow-sm"
                    aria-hidden="true"
                  >
                    <Icon className="h-7 w-7 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
