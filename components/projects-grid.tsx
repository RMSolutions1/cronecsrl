"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowRight, MapPin, Calendar, Ruler, Search, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { defaultProjectImage } from "@/lib/images"

interface Project {
  id: string
  title: string
  category: string
  image_url?: string | null
  location?: string | null
  area?: string | null
  year?: number | null
  duration?: string | null
  client?: string | null
  description: string
  tags?: string[] | null
  featured: boolean
  status?: string | null
}

const categories = [
  "Todos",
  "Construcción Civil",
  "Instalaciones Eléctricas",
  "Infraestructura Industrial",
  "Arquitectura e Ingeniería",
]

export function ProjectsGrid({ initialProjects }: { initialProjects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProjects = initialProjects.filter((project) => {
    const matchesCategory = activeCategory === "Todos" || project.category === activeCategory
    const location = project.location ?? ""
    const tags = project.tags ?? []
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <>
      {/* Filtros y Búsqueda */}
      <section className="py-8 bg-background border-b sticky top-[73px] z-40 backdrop-blur-sm bg-background/95">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar proyectos por nombre, ubicación o etiqueta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {categories.map((category) => (
                <Button
                  key={category}
                  size="sm"
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className={activeCategory === category ? "bg-primary" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Mostrando {filteredProjects.length} de {initialProjects.length} proyectos
          </div>
        </div>
      </section>

      {/* Grid de Proyectos */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No se encontraron proyectos con los filtros seleccionados.
              </p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setActiveCategory("Todos")
                  setSearchQuery("")
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <Image
                      src={project.image_url || defaultProjectImage}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                      {project.category}
                    </Badge>
                    {project.featured && (
                      <Badge className="absolute top-4 left-4 bg-orange-500 text-white">Destacado</Badge>
                    )}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link href="/contacto">
                        <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                          Más Información
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors mb-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">{project.client ?? ""}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(project.tags ?? []).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span>{project.location ?? ""}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Ruler className="h-3.5 w-3.5 text-primary" />
                        <span>{project.area ?? ""}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span>{project.year ?? ""}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span>{project.duration ?? ""}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
