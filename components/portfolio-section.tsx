"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Calendar, Ruler } from "lucide-react"
import Link from "next/link"
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
    <section className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
            Nuestro Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
            Proyectos que <span className="gradient-text">Transforman</span>
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
              className={`transition-all duration-300 ${activeCategory === category ? "bg-primary shadow-lg shadow-primary/25 scale-105" : "hover:scale-105"}`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Grid de proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProjects.map((project, index) => (
            <Card 
              key={project.id} 
              className="group overflow-hidden card-hover border-0 bg-card opacity-0 animate-scale-up"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={project.image || defaultProjectImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground shadow-lg">{project.category}</Badge>
                
                {/* Hover overlay with icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <ArrowRight className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold group-hover:text-accent transition-colors duration-300">{project.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 group-hover:text-foreground transition-colors">
                    <MapPin className="h-3.5 w-3.5 text-accent" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 group-hover:text-foreground transition-colors">
                    <Ruler className="h-3.5 w-3.5 text-accent" />
                    <span>{project.area}</span>
                  </div>
                  <div className="flex items-center gap-1.5 group-hover:text-foreground transition-colors">
                    <Calendar className="h-3.5 w-3.5 text-accent" />
                    <span>{project.year}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/proyectos">
            <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 group">
              Ver Todos los Proyectos
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
