import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { getCurrentUser } from "@/lib/auth"
import { put } from "@vercel/blob"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

function isVercelBlobConfigured(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN
}

/** Subida de imagen para admin (usa sesión iron-session). Compartido por /api/upload y /api/admin/upload */
export async function handleAdminImageUpload(request: Request): Promise<NextResponse> {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file") as File | null
  const rawPath = (formData.get("path") as string) || "general"
  const subdir = /^[a-zA-Z0-9_-]+$/.test(rawPath) ? rawPath : "general"

  if (!file || !file.size) {
    return NextResponse.json({ error: "No se envió ningún archivo" }, { status: 400 })
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Solo se permiten imágenes" }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "La imagen no puede superar los 5MB" }, { status: 400 })
  }

  try {
    const ext = file.name.split(".").pop() || "jpg"
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`

    if (isVercelBlobConfigured()) {
      const bytes = await file.arrayBuffer()
      const blob = await put(`uploads/${subdir}/${filename}`, bytes, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
      })
      return NextResponse.json({ url: blob.url })
    }

    await mkdir(path.join(UPLOAD_DIR, subdir), { recursive: true })
    const filepath = path.join(UPLOAD_DIR, subdir, filename)
    const bytes = await file.arrayBuffer()
    await writeFile(filepath, Buffer.from(bytes))
    const url = `/uploads/${subdir}/${filename}`
    return NextResponse.json({ url })
  } catch (err) {
    console.error("Upload error:", err)
    if (process.env.VERCEL && !isVercelBlobConfigured()) {
      return NextResponse.json(
        {
          error:
            "Las subidas en Vercel requieren Vercel Blob. Creá un Blob store y añadí BLOB_READ_WRITE_TOKEN.",
        },
        { status: 500 },
      )
    }
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 })
  }
}
