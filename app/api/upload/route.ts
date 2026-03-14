import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { getCurrentUser } from "@/lib/auth"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

export async function POST(request: Request) {
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
    return NextResponse.json({ error: "La imagen no puede superar 5MB" }, { status: 400 })
  }

  try {
    await mkdir(path.join(UPLOAD_DIR, subdir), { recursive: true })
    const ext = file.name.split(".").pop() || "jpg"
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`
    const filepath = path.join(UPLOAD_DIR, subdir, filename)
    const bytes = await file.arrayBuffer()
    await writeFile(filepath, Buffer.from(bytes))
    const url = `/uploads/${subdir}/${filename}`
    return NextResponse.json({ url })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 })
  }
}
