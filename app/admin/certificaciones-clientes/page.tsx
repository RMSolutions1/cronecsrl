import { redirect } from "next/navigation"

/** Ruta legacy: redirige al panel de certificaciones. */
export default function CertificacionesClientesLegacyPage() {
  redirect("/admin/certificaciones")
}
