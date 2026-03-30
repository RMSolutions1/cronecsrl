"use server"

import { readData } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"
import { query, isPostgresConfigured } from "@/lib/db-pg"

type BlogPost = { status?: string }
type Message = { is_read?: boolean }

export async function getAdminStats() {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) {
    return { 
      users: 0, 
      projects: 0, 
      services: 0, 
      testimonials: 0, 
      contact_submissions: 0, 
      unread_messages: 0,
      blog_posts: 0, 
      blog_published: 0 
    }
  }

  // Intentar obtener stats de la BD primero
  if (isPostgresConfigured()) {
    try {
      const [
        usersResult,
        projectsResult,
        servicesResult,
        testimonialsResult,
        messagesResult,
        unreadResult,
        blogResult,
        blogPublishedResult,
      ] = await Promise.all([
        query<{count: string}[]>("SELECT COUNT(*) as count FROM users"),
        query<{count: string}[]>("SELECT COUNT(*) as count FROM projects"),
        query<{count: string}[]>("SELECT COUNT(*) as count FROM services"),
        query<{count: string}[]>("SELECT COUNT(*) as count FROM testimonials"),
        query<{count: string}[]>("SELECT COUNT(*) as count FROM contact_submissions"),
        query<{count: string}[]>("SELECT COUNT(*) as count FROM contact_submissions WHERE is_read = false"),
        query<{count: string}[]>("SELECT COUNT(*) as count FROM blog_posts"),
        query<{count: string}[]>("SELECT COUNT(*) as count FROM blog_posts WHERE status = 'published'"),
      ])

      return {
        users: parseInt(usersResult[0]?.count || "0"),
        projects: parseInt(projectsResult[0]?.count || "0"),
        services: parseInt(servicesResult[0]?.count || "0"),
        testimonials: parseInt(testimonialsResult[0]?.count || "0"),
        contact_submissions: parseInt(messagesResult[0]?.count || "0"),
        unread_messages: parseInt(unreadResult[0]?.count || "0"),
        blog_posts: parseInt(blogResult[0]?.count || "0"),
        blog_published: parseInt(blogPublishedResult[0]?.count || "0"),
      }
    } catch (error) {
      console.error("[getAdminStats] DB error:", error)
      // Fallback a JSON
    }
  }

  // Fallback a archivos JSON
  const [admins, projects, services, testimonials, messages, blog] = await Promise.all([
    readData<unknown[]>("admins.json"),
    readData<unknown[]>("projects.json"),
    readData<unknown[]>("services.json"),
    readData<unknown[]>("testimonials.json"),
    readData<Message[]>("messages.json"),
    readData<BlogPost[]>("blog.json"),
  ])
  const blogList = Array.isArray(blog) ? blog : []
  const messagesList = Array.isArray(messages) ? messages : []
  const blogPublished = blogList.filter((p) => p.status === "published").length
  const unreadMessages = messagesList.filter((m) => !m.is_read).length
  
  return {
    users: Array.isArray(admins) ? admins.length : 0,
    projects: Array.isArray(projects) ? projects.length : 0,
    services: Array.isArray(services) ? services.length : 0,
    testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
    contact_submissions: messagesList.length,
    unread_messages: unreadMessages,
    blog_posts: blogList.length,
    blog_published: blogPublished,
  }
}
