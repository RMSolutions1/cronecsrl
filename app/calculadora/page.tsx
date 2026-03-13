import { getCalculadoraPublic } from "@/app/actions/db/calculadora"
import CalculadoraPageClient from "./calculadora-client"

export const metadata = {
  title: "Cotizador | CRONEC SRL - Presupuesto Online",
  description: "Calcule el presupuesto de su proyecto de construcción en pocos pasos.",
}

export default async function CalculadoraPage() {
  let config = null
  try {
    config = await getCalculadoraPublic()
  } catch {
    // usa valores por defecto en el cliente
  }
  return <CalculadoraPageClient config={config} />
}
