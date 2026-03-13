"use server"

import { readData } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"

type BlogPost = { status?: string }

export async function getAdminStats() {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) {
    return { users: 0, projects: 0, services: 0, testimonials: 0, contact_submissions: 0, blog_posts: 0, blog_published: 0 }
  }
  const [admins, projects, services, testimonials, messages, blog] = await Promise.all([
    readData<unknown[]>("admins.json"),
    readData<unknown[]>("projects.json"),
    readData<unknown[]>("services.json"),
    readData<unknown[]>("testimonials.json"),
    readData<unknown[]>("messages.json"),
    readData<BlogPost[]>("blog.json"),
  ])
  const blogList = Array.isArray(blog) ? blog : []
  const blogPublished = blogList.filter((p) => p.status === "published").length
  return {
    users: Array.isArray(admins) ? admins.length : 0,
    projects: Array.isArray(projects) ? projects.length : 0,
    services: Array.isArray(services) ? services.length : 0,
    testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
    contact_submissions: Array.isArray(messages) ? messages.length : 0,
    blog_posts: blogList.length,
    blog_published: blogPublished,
  }
}
