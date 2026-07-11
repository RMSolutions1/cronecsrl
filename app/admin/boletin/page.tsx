import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { listNewsletterSubscribers } from "@/lib/newsletter-store"
import { NewsletterManager } from "@/components/admin/newsletter-manager"

export const metadata = {
  title: "Boletín | Admin CRONEC",
}

export default async function AdminNewsletterPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")

  let subscribers: Awaited<ReturnType<typeof listNewsletterSubscribers>> = []
  try {
    subscribers = await listNewsletterSubscribers()
  } catch {
    subscribers = []
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Suscriptores del boletín</h1>
        <p className="text-muted-foreground mt-1">
          Correos registrados desde el formulario de suscripción del blog.
        </p>
      </div>
      <NewsletterManager initialSubscribers={subscribers} />
    </div>
  )
}
