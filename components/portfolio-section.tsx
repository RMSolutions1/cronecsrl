"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Calendar, Ruler } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { images, defaultProjectImage } from "@/lib/images"

const staticProjects = [
  { id: "1", title: "Centro Comercial Plaza Norte", category: "Construcción Civil", image: images.portfolio[0], location: "Salta Capital", area: "8,500 m²", year: "2023", description: "Edificio comercial de 4 plantas con estacionamiento subterráneo" },
  { id: "2", title: "Planta Industrial Metalúrgica", category: "Infraestructura Industrial", image: images.portfolio[1], location: "Parque Industrial", area: "12,000 m²", year: "2023", description: "Nave industrial con sistema de grúas y oficinas administrativas" },
  { id: "3", title: "Hospital Regional Sur", category: "Construcción Civil", image: images.portfolioHospital, location: "Salta", area: "15,000 m²", year: "2022", description: "Centro de salud con quirófanos y área de emergencias" },
  { id: "4", title: "Subestación Eléctrica 132kV", category: "Instalaciones Eléctricas", image: images.portfolio[3], location: "Cerrillos", area: "3,500 m²", year: "2023", description: "Infraestructura eléctrica de alta tensión para distribución regional" },
  { id: "5", title: "Complejo Residencial Mirador", category: "Construcción Civil", image: images.portfolio[4], location: "Tres Cerritos", area: "6,800 m²", year: "2022", description: "Torres residenciales con amenities y espacios verdes" },
  { id: "6", title: "Bodega Vitivinícola", category: "Infraestructura Industrial", image: images.portfolioBodega, location: "Cafayate", area: "4,200 m²", year: "2022", description: "Instalaciones para producción y almacenamiento de vinos de altura" },
]

const categories = ["Todos", "Construcción Civil", "Instalaciones Eléctricas", "Infraestructura Industrial"]

interface ProjectFromDb {
  id: string
  title: string
  description?: string
  category?: string
  location?: string | null
  year?: number | null
  area?: string | number | null
  image_url?: string | null
}

export function PortfolioSection({ projectsFromDb = [] }: { projectsFromDb?: ProjectFromDb[] }) {
  const projects =
    projectsFromDb.length > 0
      ? projectsFromDb.slice(0, 6).map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category || "Construcción Civil",
          image: (p.image_url && p.image_url.trim()) ? p.image_url : defaultProjectImage,
          location: p.location || "—",
          area: typeof p.area === "number" ? `${p.area} m²` : (p.area || "—"),
          year: String(p.year ?? "—"),
          description: p.description || "",
        }))
      : staticProjects

  const [activeCategory, setActiveCategory] = useState("Todos")
  const filteredProjects = activeCategory === "Todos" ? projects : projects.filter((p) => p.category === activeCategory)

  return (
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
            Proyectos que <span className="text-primary">Transforman</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
            Descubra nuestra trayectoria en obras de infraestructura de gran envergadura en toda la región.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className={activeCategory === category ? "bg-primary" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Grid de proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="relative overflow-hidden aspect-[4/3]">
                <Image
                  src={project.image || defaultProjectImage}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">{project.category}</Badge>
              </div>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Ruler className="h-3.5 w-3.5 text-primary" />
                    <span>{project.area}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span>{project.year}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/proyectos">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Ver Todos los Proyectos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
