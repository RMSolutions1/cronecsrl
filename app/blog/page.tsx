import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroCarousel } from "@/components/hero-carousel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar, Clock, Building2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { images } from "@/lib/images"
import { getBlogPostsPublic } from "@/app/actions/db/blog"

const heroImages = [
  { src: images.heroBlog[0], alt: "Construccion CRONEC" },
  { src: images.heroBlog[1], alt: "Obra civil CRONEC" },
  { src: images.heroBlog[2], alt: "Instalaciones industriales CRONEC" },
]

export const metadata = {
  title: "Noticias y Blog | CRONEC SRL - Actualidad en Construccion",
  description: "Manténgase informado sobre las últimas noticias, proyectos y novedades de CRONEC SRL en el sector de la construcción en Salta.",
}

type ArticleItem = { id: string; title: string; excerpt: string; category: string; date: string; readTime: string; author: string; image: string; featured: boolean; slug: string }
const defaultArticles: ArticleItem[] = [
  { id: "1", title: "CRONEC completa ampliación de subestación eléctrica en zona industrial", excerpt: "Finalizamos exitosamente el proyecto de ampliacion de la subestacion transformadora para el parque industrial de Salta.", category: "Proyectos", date: "2024-02-15", readTime: "3 min", author: "Equipo CRONEC", image: images.blog[0], featured: true, slug: "ampliacion-subestacion" },
  { id: "2", title: "Nuevas certificaciones ISO para nuestros procesos constructivos", excerpt: "Hemos renovado nuestras certificaciones ISO 9001, ISO 14001 e ISO 45001.", category: "Empresa", date: "2024-02-10", readTime: "2 min", author: "Direccion", image: images.blog[1], featured: true, slug: "certificaciones-iso" },
  { id: "3", title: "Inicio de obra: Complejo habitacional Villa Mitre", excerpt: "Comenzamos la construcción de un nuevo complejo de viviendas sociales con 48 unidades.", category: "Proyectos", date: "2024-02-05", readTime: "4 min", author: "Equipo CRONEC", image: images.blog[2], featured: false, slug: "villa-mitre" },
  { id: "4", title: "Capacitacion en seguridad e higiene para todo el personal", excerpt: "Jornadas de capacitacion en normas de seguridad e higiene industrial.", category: "Capacitacion", date: "2024-01-28", readTime: "2 min", author: "RRHH", image: images.blog[3], featured: false, slug: "capacitacion-seguridad" },
  { id: "5", title: "Incorporacion de nueva maquinaria de ultima generacion", excerpt: "Ampliamos nuestra flota de equipos con maquinaria moderna.", category: "Empresa", date: "2024-01-20", readTime: "3 min", author: "Equipo CRONEC", image: images.blog[4], featured: false, slug: "nueva-maquinaria" },
  { id: "6", title: "Entrega de planta de tratamiento de agua potable", excerpt: "Culminamos el proyecto de construcción de una planta de tratamiento que beneficiará a más de 5.000 habitantes.", category: "Proyectos", date: "2024-01-15", readTime: "5 min", author: "Equipo CRONEC", image: images.blog[5], featured: false, slug: "planta-agua" },
]

export default async function BlogPage() {
  let postsFromDb: Awaited<ReturnType<typeof getBlogPostsPublic>> = []
  try {
    postsFromDb = await getBlogPostsPublic()
  } catch {
    // fallback a artículos por defecto
  }

  const blogImages = [...images.blog]
  const articles: ArticleItem[] =
    postsFromDb.length > 0
      ? postsFromDb.map((p, i) => ({
          id: p.id,
          title: p.title,
          excerpt: p.excerpt ?? p.title,
          category: p.category ?? "Noticias",
          date: p.published_at ?? p.created_at ?? new Date().toISOString().slice(0, 10),
          readTime: "3 min",
          author: p.author_name ?? "Equipo CRONEC",
          image: p.image_url ?? blogImages[i % blogImages.length],
          featured: !!p.featured,
          slug: p.slug ?? p.id,
        }))
      : defaultArticles

  const featuredArticles = articles.filter((a) => a.featured)
  const recentArticles = articles.filter((a) => !a.featured)
  const categories = ["Todos", ...Array.from(new Set(articles.map((a) => a.category))).filter(Boolean)]

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <HeroCarousel
          images={heroImages}
          badge="Blog y Noticias"
          title="Actualidad de CRONEC"
          subtitle="Mantengase informado sobre nuestros proyectos, novedades del sector y el crecimiento de nuestra empresa."
          primaryAction={{ label: "Ver Noticias", href: "#noticias" }}
          secondaryAction={{ label: "Suscribirse", href: "#newsletter" }}
        />

        {/* Featured Articles */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Destacados</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-accent text-accent-foreground">
                        {article.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-4 text-white/70 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(article.date).toLocaleDateString('es-AR', { 
                            day: 'numeric', 
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {article.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>
                    <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 group/btn" asChild>
                      <Link href={`/blog/${article.slug}`}>
                        Leer mas
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Articles Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Ultimas Noticias</h2>
              <div className="hidden md:flex items-center gap-2">
                {categories.map((cat) => (
                  <Button 
                    key={cat}
                    variant={cat === "Todos" ? "default" : "outline"} 
                    size="sm"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="text-xs">
                        {article.category}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(article.date).toLocaleDateString('es-AR', { 
                          day: 'numeric', 
                          month: 'short'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2 mb-4">
                      {article.excerpt}
                    </CardDescription>
                    <Button variant="link" className="p-0 h-auto text-primary" asChild>
                      <Link href={`/blog/${article.slug}`}>
                        Leer articulo
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load more */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Cargar mas noticias
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <Building2 className="h-12 w-12 mx-auto text-accent" />
              <h2 className="text-3xl font-bold">Suscribase a nuestro boletin</h2>
              <p className="text-primary-foreground/80">
                Reciba las ultimas noticias sobre proyectos, novedades del sector 
                y actualizaciones de CRONEC directamente en su correo.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Su correo electronico"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Suscribirse
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
