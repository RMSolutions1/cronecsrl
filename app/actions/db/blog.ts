"use server"

import { readData, writeData, generateId } from "@/lib/data"
import { requireAdmin } from "@/lib/admin-auth"
import { assertDbWritable } from "@/lib/admin-persist"
import { revalidatePublicContent, REVALIDATE } from "@/lib/revalidate-public"

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  image_url?: string | null
  category?: string | null
  tags?: string[] | null
  author_id?: string | null
  author_name?: string | null
  status: string
  featured: boolean
  views?: number
  published_at?: string | null
  created_at?: string
  updated_at?: string
}

export async function getBlogPostsPublic() {
  try {
    const list = await readData<BlogPost[]>("blog.json")
    return (list || []).filter((p) => p.status === "published")
      .sort((a, b) => (b.published_at ?? b.created_at ?? "").localeCompare(a.published_at ?? a.created_at ?? ""))
  } catch {
    return []
  }
}

export async function getBlogPostsAdmin() {
  const user = await requireAdmin().catch(() => null)
  if (!user) return []
  const list = await readData<BlogPost[]>("blog.json")
  return (list || []).sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
}

export async function getBlogPostById(id: string) {
  const list = await readData<BlogPost[]>("blog.json")
  return list.find((p) => p.id === id) ?? null
}

export async function getBlogPostBySlug(slug: string) {
  const list = await readData<BlogPost[]>("blog.json")
  return list.find((p) => (p.slug ?? p.id) === slug && p.status === "published") ?? null
}

export async function saveBlogPost(data: Record<string, unknown>) {
  const user = await requireAdmin()
  assertDbWritable()
  const list = await readData<BlogPost[]>("blog.json")
  const id = (data.id as string) ?? generateId()
  const prev = list.find((p) => p.id === id)
  const tags = Array.isArray(data.tags) ? data.tags : data.tags != null ? JSON.parse(JSON.stringify(data.tags)) : null
  const now = new Date().toISOString()
  const record: BlogPost = {
    id,
    title: (data.title as string) ?? "",
    slug: (data.slug as string) ?? String(data.title ?? "").toLowerCase().replace(/\s+/g, "-"),
    excerpt: (data.excerpt as string) ?? null,
    content: (data.content as string) ?? "",
    image_url: (data.image_url as string) ?? null,
    category: (data.category as string) ?? "noticias",
    tags,
    author_id: (data.author_id as string) ?? user.id,
    author_name: (data.author_name as string) ?? user.full_name ?? user.email,
    status: (data.status as string) ?? "draft",
    featured: !!data.featured,
    views: Number(data.views ?? 0),
    published_at: (data.published_at as string) ?? null,
    updated_at: now,
  }
  const idx = list.findIndex((p) => p.id === id)
  if (idx >= 0) {
    record.created_at = list[idx].created_at
    list[idx] = record
  } else {
    record.created_at = now
    list.unshift(record)
  }
  await writeData("blog.json", list)
  const paths: string[] = [...REVALIDATE.blog]
  if (record.slug) paths.push(`/blog/${record.slug}`)
  if (prev?.slug && prev.slug !== record.slug) paths.push(`/blog/${prev.slug}`)
  revalidatePublicContent(paths)
  return id
}

export async function deleteBlogPost(id: string) {
  await requireAdmin()
  assertDbWritable()
  const list = await readData<BlogPost[]>("blog.json")
  const target = list.find((p) => p.id === id)
  await writeData("blog.json", list.filter((p) => p.id !== id))
  const paths: string[] = [...REVALIDATE.blog]
  if (target?.slug) paths.push(`/blog/${target.slug}`)
  revalidatePublicContent(paths)
}
