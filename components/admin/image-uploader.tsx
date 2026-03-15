"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, ImageIcon, Link as LinkIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  bucket?: string
  path?: string
  label?: string
}

export function ImageUploader({ value, onChange, path = "projects", label = "Imagen" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(value || "")
  const [urlInput, setUrlInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreviewUrl(value || "")
  }, [value])

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
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || "Error al subir")
      }
      const url = data.url
      if (url) {
        setPreviewUrl(url)
        onChange(url)
        setUrlInput("")
      }
    } catch (err) {
      console.error("Error al subir imagen:", err)
      alert(err instanceof Error ? err.message : "Error al subir la imagen. Por favor intente nuevamente.")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleApplyUrl = () => {
    const url = urlInput.trim()
    if (!url) return
    if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
      alert("Ingrese una URL válida (por ejemplo https://... o /uploads/...)")
      return
    }
    setPreviewUrl(url)
    onChange(url)
    setUrlInput("")
  }

  const handleRemove = () => {
    setPreviewUrl("")
    onChange("")
    setUrlInput("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      {previewUrl ? (
        <div className="space-y-2">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
            <Image
              src={previewUrl || "/placeholder.svg"}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized={previewUrl.startsWith("http")}
            />
            <Button type="button" size="icon" variant="destructive" className="absolute top-2 right-2" onClick={handleRemove}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground truncate" title={previewUrl}>
            {previewUrl}
          </p>
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

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="O pegar URL de imagen (https://... o /uploads/...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyUrl())}
            className="flex-1"
            disabled={uploading}
          />
          <Button type="button" variant="outline" size="icon" onClick={handleApplyUrl} disabled={!urlInput.trim() || uploading} title="Usar esta URL">
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            Subir desde la PC
          </Button>
          {uploading && (
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Subiendo...
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
