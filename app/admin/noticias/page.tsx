import { redirect } from "next/navigation"
import { NewsManager } from "@/components/admin/news-manager"
import { getCurrentUser } from "@/lib/auth"
import { getBlogPostsAdmin } from "@/app/actions/db/blog"

export const dynamic = "force-dynamic"

export default async function NoticiasAdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")
  if (!["admin", "superadmin"].includes(user.role)) redirect("/admin/login")

  const posts = await getBlogPostsAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Noticias y Blog</h1>
        <p className="text-muted-foreground mt-1">Administre las entradas del blog y noticias del sitio.</p>
      </div>
      <NewsManager posts={posts} />
    </div>
  )
}
