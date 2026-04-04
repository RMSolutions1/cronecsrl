import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getBlogPostBySlug, getBlogPostsPublic } from "@/lib/data-read"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BlogPostBody } from "@/components/blog-post-body"

const defaultBlogSlugs = [
  "ampliacion-subestacion",
  "certificaciones-iso",
  "villa-mitre",
  "capacitacion-seguridad",
  "nueva-maquinaria",
  "planta-agua",
]

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const posts = await getBlogPostsPublic()
    const slugs = posts.map((p) => p.slug ?? p.id).filter((s): s is string => Boolean(s))
    if (slugs.length > 0) return slugs.map((slug) => ({ slug }))
  } catch {
    // Build estático sin BD: usar slugs por defecto
  }
  return defaultBlogSlugs.map((slug) => ({ slug }))
}

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ slug: string }> }

type PostShape = { title?: string; category?: string; author_name?: string; published_at?: string; created_at?: string; image_url?: string; content?: string; excerpt?: string }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug) as PostShape | null
  if (!post) return { title: "Noticia | CRONEC SRL" }
  const title = post.title ?? "Noticia"
  const description = typeof post.excerpt === "string" ? post.excerpt.slice(0, 160) : `Noticia: ${title} - CRONEC SRL`
  const imageUrl = post.image_url && post.image_url.trim() && !post.image_url.startsWith("/placeholder") ? post.image_url : undefined
  return {
    title: `${title} | CRONEC SRL`,
    description,
    openGraph: {
      title: `${title} | CRONEC SRL`,
      description,
      ...(imageUrl && { images: [{ url: imageUrl, width: 1200, height: 630, alt: title }] }),
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug) as PostShape | null
  if (!post) notFound()

  const date = post.published_at ?? post.created_at ?? ""
  const imageSrc = post.image_url ?? "/placeholder.svg"

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <article className="container mx-auto px-4 md:px-6 lg:px-8 py-12 max-w-3xl">
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary mb-6 inline-block">
            ← Volver al blog
          </Link>
          {post.category && (
            <Badge className="mb-4" variant="secondary">
              {post.category}
            </Badge>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title ?? ""}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            {date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(date).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            )}
            {post.author_name && (
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author_name}
              </span>
            )}
          </div>
          {imageSrc && imageSrc !== "/placeholder.svg" && (
            <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
              <Image src={imageSrc} alt={post.title ?? ""} fill className="object-cover" sizes="(max-width: 768px) 100vw, 672px" />
            </div>
          )}
          <BlogPostBody
            content={post.content || post.excerpt || ""}
            className="prose prose-neutral dark:prose-invert max-w-none"
          />
        </article>
      </main>
      <Footer />
    </>
  )
}
