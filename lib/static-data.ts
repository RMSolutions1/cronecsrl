/**
 * Datos estáticos para la versión exportable (FTP / hosting sin Node).
 * Se usan cuando no hay base de datos (getProjectsPublic falla o devuelve []).
 */
import { images } from "@/lib/images"

export interface StaticProject {
  id: string
  title: string
  category: string
  image_url: string | null
  location: string
  area: string
  year: number
  duration: string
  client: string
  description: string
  tags: string[]
  featured: boolean
  status: string
}

export const staticProjects: StaticProject[] = [
  { id: "1", title: "Centro Comercial Plaza Norte", category: "Construcción Civil", image_url: images.portfolio[0], location: "Salta Capital", area: "8,500 m²", year: 2023, duration: "12 meses", client: "Privado", description: "Edificio comercial de 4 plantas con estacionamiento subterráneo", tags: ["Comercial", "Obra civil"], featured: true, status: "published" },
  { id: "2", title: "Planta Industrial Metalúrgica", category: "Infraestructura Industrial", image_url: images.portfolio[1], location: "Parque Industrial", area: "12,000 m²", year: 2023, duration: "18 meses", client: "Industrial", description: "Nave industrial con sistema de grúas y oficinas administrativas", tags: ["Industrial", "Nave"], featured: true, status: "published" },
  { id: "3", title: "Hospital Regional Sur", category: "Construcción Civil", image_url: images.portfolioHospital, location: "Salta", area: "15,000 m²", year: 2022, duration: "24 meses", client: "Gobierno", description: "Centro de salud con quirófanos y área de emergencias", tags: ["Salud", "Obra pública"], featured: true, status: "published" },
  { id: "4", title: "Subestación Eléctrica 132kV", category: "Instalaciones Eléctricas", image_url: images.portfolio[3], location: "Cerrillos", area: "3,500 m²", year: 2023, duration: "8 meses", client: "Energía", description: "Infraestructura eléctrica de alta tensión para distribución regional", tags: ["Eléctrica", "Subestación"], featured: false, status: "published" },
  { id: "5", title: "Complejo Residencial Mirador", category: "Construcción Civil", image_url: images.portfolio[4], location: "Tres Cerritos", area: "6,800 m²", year: 2022, duration: "14 meses", client: "Privado", description: "Torres residenciales con amenities y espacios verdes", tags: ["Vivienda", "Residencial"], featured: false, status: "published" },
  { id: "6", title: "Bodega Vitivinícola", category: "Infraestructura Industrial", image_url: images.portfolioBodega, location: "Cafayate", area: "4,200 m²", year: 2022, duration: "10 meses", client: "Privado", description: "Instalaciones para producción y almacenamiento de vinos de altura", tags: ["Bodega", "Industrial"], featured: false, status: "published" },
]
