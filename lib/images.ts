/**
 * Imágenes reales de CRONEC en public/ (renombradas desde las que subiste).
 * Hero: hero-construction-*.jpeg, hero-projects-*.jpeg, etc.
 * Servicios: public/servicios/*.jpeg | Proyectos: public/proyectos/proyecto-*.jpeg
 */
const U = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`

/** Rutas locales desde /public (imágenes reales de la empresa) */
const local = (path: string) => path.startsWith("/") ? path : `/${path}`

export const images = {
  /** Hero inicio: imágenes reales (cronec1, civil2, conec4) */
  hero: [
    local("hero-construction-1.jpeg"),
    local("hero-construction-2.jpeg"),
    local("hero-construction-3.jpeg"),
  ],
  /** Servicios: imágenes reales por servicio */
  services: {
    obrasCiviles: local("servicios/obras-civiles.jpeg"),
    obrasElectricas: local("servicios/obras-electricas.jpeg"),
    instalacionesIndustriales: local("servicios/instalaciones-industriales.jpeg"),
    arquitectura: local("servicios/arquitectura-ingenieria.jpeg"),
    obrasGenerales: local("servicios/obras-generales.jpeg"),
    obrasSaneamiento: local("servicios/obras-saneamiento.jpeg"),
    serviciosEspeciales: local("servicios/servicios-especiales.jpeg"),
  },
  /** Proyectos/portfolio: imágenes reales (civil2, conec4, red2, cronec1) */
  portfolio: [
    local("proyectos/proyecto-1.jpeg"),   // Obra civil / puente
    local("proyectos/proyecto-2.jpeg"),   // Industrial
    local("proyectos/proyecto-3.jpeg"),   // Infraestructura
    local("proyectos/proyecto-4.jpeg"),   // Eléctrica
    local("proyectos/proyecto-5.jpeg"),   // Civil
    local("proyectos/proyecto-6.jpeg"),   // Equipo / industrial
  ],
  portfolioHospital: local("proyectos/proyecto-3.jpeg"),
  portfolioBodega: local("proyectos/proyecto-6.jpeg"),
  testimonials: [
    U("1573496359142-b8d87734a5a2", 200), // Mujer profesional
    U("1472099645785-5658abf4ff4e", 200), // Hombre profesional
    U("1580489944761-15a19d654956", 200), // Mujer profesional 2
  ],
  /** Sección "Por qué elegir CRONEC": imagen conec4 (en public/) + fallback si falla */
  whyCronec: local("conec4.jpeg"),
  whyCronecFallback: local("placeholder.svg"),
  ctaBackground: U("1503387762-592deb58ef4e", 1920),   // Planos técnicos
  clients: [
    U("1486406146926-c627a92ad1ab", 200), // Edificio
    U("1473341304170-971dccb5ac1e", 200), // Energía
    U("1581091226825-a6a2a5aee158", 200), // Industrial
    U("1504309092620-4d0e8a54959e", 200), // Construcción
    U("1510812431401-41d2d2c9b5c9", 200), // Minería/recursos
    U("1541888946425-81bb3d4f723f", 200), // Infraestructura
  ],
  /** ISO 9001, 14001, 45001: mismo icono genérico; data/certifications.json también. Para distinguir, usar 3 imágenes distintas por norma. */
  certifications: [
    U("1563013544-824ae1b704d3", 120),
    U("1563013544-824ae1b704d3", 120),
    U("1563013544-824ae1b704d3", 120),
  ],
  /** Hero páginas internas: imágenes reales */
  heroProyectos: [
    local("hero-projects-1.jpeg"),
    local("hero-projects-2.jpeg"),
    local("hero-projects-3.jpeg"),
  ],
  heroBlog: [
    local("hero-blog-1.jpeg"),
    local("hero-blog-2.jpeg"),
    local("hero-blog-3.jpeg"),
  ],
  heroContacto: [
    local("hero-contacto-1.jpeg"),
    local("hero-contacto-2.jpeg"),
    local("hero-contacto-3.jpeg"),
  ],
  heroNosotros: [
    local("hero-nosotros-1.jpeg"),
    local("hero-nosotros-2.jpeg"),
    local("hero-nosotros-3.jpeg"),
  ],
  heroServicios: [
    local("hero-services-1.jpeg"),
    local("hero-services-2.jpeg"),
    local("hero-services-3.jpeg"),
  ],
  /** Galerías genéricas (reutilizan proyectos reales) */
  portfolioGeneric: {
    hospital: local("proyectos/proyecto-3.jpeg"),
    logistics: local("proyectos/proyecto-2.jpeg"),
    apartment: local("proyectos/proyecto-5.jpeg"),
    university: local("proyectos/proyecto-1.jpeg"),
  },
  /** Fondo tipo planos/blueprint para secciones CTA */
  blueprint: U("1503387762-592deb58ef4e", 1920),
  /** Edificio/empresa para brochure y secciones corporativas */
  companyBuilding: U("1486406146926-c627a92ad1ab", 1200),
  // Imágenes para artículos del blog (índices 1 y 3 duplican cert; considerar imágenes distintas)
  blog: [
    U("1473341304170-971dccb5ac1e"), // Subestación
    U("1563013544-824ae1b704d3", 400), // Certificación
    U("1545324418-cc1a3fa10c00"),     // Viviendas
    U("1563013544-824ae1b704d3", 400), // Seguridad (duplicado)
    U("1581091226825-a6a2a5aee158"),  // Maquinaria
    U("1503387762-592deb58ef4e"),     // Proyecto
  ],
} as const

/** Fallback para proyecto sin image_url (ej. desde dashboard). */
export const defaultProjectImage = images.portfolio[0]

/** Mapa slug -> URL para servicios sin image_url en BD. Incluye todos los slugs usados en menú y data (mantenimiento/consultoria reutilizan imagen). */
export const defaultServiceImages: Record<string, string> = {
  "obras-civiles": images.services.obrasCiviles,
  "obras-electricas": images.services.obrasElectricas,
  "instalaciones-industriales": images.services.instalacionesIndustriales,
  "arquitectura-e-ingenieria": images.services.arquitectura,
  "arquitectura-ingenieria": images.services.arquitectura,
  "obras-generales": images.services.obrasGenerales,
  "obras-de-saneamiento": images.services.obrasSaneamiento,
  "servicios-especiales": images.services.serviciosEspeciales,
  "mantenimiento": images.services.obrasGenerales,
  "consultoria": images.services.arquitectura,
}
