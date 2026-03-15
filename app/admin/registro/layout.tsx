import { redirect } from "next/navigation"

/**
 * En producción el registro está deshabilitado por defecto.
 * Para permitirlo (p. ej. invitaciones), definir ALLOW_ADMIN_REGISTER=true.
 */
export default function RegistroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_ADMIN_REGISTER !== "true"
  ) {
    redirect("/admin/login")
  }
  return <>{children}</>
}
