"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  bucket?: string
  path?: string
}

export function ImageUploader({ value, onChange, path = "projects" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(value || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Por favor seleccione un archivo de imagen válido")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no puede superar los 5MB")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("path", path)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Error al subir")
      }
      const { url } = await res.json()
      setPreviewUrl(url)
      onChange(url)
    } catch (err) {
      console.error("Error al subir imagen:", err)
      alert(err instanceof Error ? err.message : "Error al subir la imagen. Por favor intente nuevamente.")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl("")
    onChange("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-4">
      <Label>Imagen del Proyecto</Label>
      {previewUrl ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
          <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
          <Button type="button" size="icon" variant="destructive" className="absolute top-2 right-2" onClick={handleRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="w-full aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Click para seleccionar imagen</p>
          <p className="text-xs text-muted-foreground">PNG, JPG hasta 5MB</p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Subiendo imagen...
        </div>
      )}
    </div>
  )
}
