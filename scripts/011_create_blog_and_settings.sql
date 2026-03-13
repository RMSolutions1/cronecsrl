-- Create blog_posts table for news/articles
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'noticias',
  tags TEXT[],
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
CREATE POLICY "Anyone can view published posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can view all posts"
  ON public.blog_posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can insert posts"
  ON public.blog_posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can update posts"
  ON public.blog_posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can delete posts"
  ON public.blog_posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- Create site_settings table for dynamic content
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'general',
  label TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'textarea', 'image', 'images', 'json', 'boolean', 'number')),
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Site settings policies
CREATE POLICY "Anyone can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- Create media_library table
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  category TEXT DEFAULT 'general',
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on media_library
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Media library policies
CREATE POLICY "Anyone can view media"
  ON public.media_library FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage media"
  ON public.media_library FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert default site settings
INSERT INTO public.site_settings (key, value, category, label, description, type) VALUES
  ('hero_images_home', '{"images": ["/hero-construction-1.jpg", "/hero-construction-2.jpg", "/hero-construction-3.jpg"]}', 'home', 'Imagenes Hero Inicio', 'Imagenes del carrusel principal de la pagina de inicio', 'images'),
  ('hero_images_services', '{"images": ["/hero-services-1.jpg", "/hero-services-2.jpg", "/hero-services-3.jpg"]}', 'services', 'Imagenes Hero Servicios', 'Imagenes del carrusel de la pagina de servicios', 'images'),
  ('hero_images_projects', '{"images": ["/hero-projects-1.jpg", "/hero-projects-2.jpg", "/hero-projects-3.jpg"]}', 'projects', 'Imagenes Hero Proyectos', 'Imagenes del carrusel de la pagina de proyectos', 'images'),
  ('company_name', '{"value": "CRONEC SRL"}', 'general', 'Nombre de la Empresa', 'Nombre que aparece en el sitio web', 'text'),
  ('company_slogan', '{"value": "Construimos el Futuro de Salta"}', 'general', 'Slogan', 'Frase principal del sitio', 'text'),
  ('company_phone', '{"value": "+54 9 (387) 536-1210"}', 'contact', 'Telefono', 'Numero de telefono principal', 'text'),
  ('company_email', '{"value": "cronec@cronecsrl.com"}', 'contact', 'Email', 'Email de contacto principal', 'text'),
  ('company_address', '{"value": "Salta Capital, Argentina"}', 'contact', 'Direccion', 'Direccion fisica de la empresa', 'text'),
  ('social_facebook', '{"value": ""}', 'social', 'Facebook', 'URL de la pagina de Facebook', 'text'),
  ('social_instagram', '{"value": ""}', 'social', 'Instagram', 'URL del perfil de Instagram', 'text'),
  ('social_linkedin', '{"value": ""}', 'social', 'LinkedIn', 'URL del perfil de LinkedIn', 'text'),
  ('whatsapp_number', '{"value": "5493875361210"}', 'contact', 'WhatsApp', 'Numero de WhatsApp sin simbolos', 'text'),
  ('stats_years', '{"value": 15}', 'stats', 'Anos de Experiencia', 'Cantidad de anos en el mercado', 'number'),
  ('stats_projects', '{"value": 500}', 'stats', 'Proyectos Completados', 'Cantidad total de proyectos', 'number'),
  ('stats_clients', '{"value": 150}', 'stats', 'Clientes Satisfechos', 'Cantidad de clientes atendidos', 'number'),
  ('stats_professionals', '{"value": 50}', 'stats', 'Profesionales', 'Cantidad de profesionales en equipo', 'number')
ON CONFLICT (key) DO NOTHING;
