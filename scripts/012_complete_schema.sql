-- =====================================================
-- CRONEC SRL - Complete Database Schema
-- Version: 1.0
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE (Admin users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;

CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'Administrador')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 2. PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  category TEXT,
  client TEXT,
  location TEXT,
  year INTEGER,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'completed',
  image_url TEXT,
  gallery TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects_public_read" ON public.projects;
DROP POLICY IF EXISTS "projects_auth_all" ON public.projects;

CREATE POLICY "projects_public_read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "projects_auth_all" ON public.projects FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- 3. SERVICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  features TEXT[],
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "services_public_read" ON public.services;
DROP POLICY IF EXISTS "services_auth_all" ON public.services;

CREATE POLICY "services_public_read" ON public.services FOR SELECT USING (true);
CREATE POLICY "services_auth_all" ON public.services FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- 4. TESTIMONIALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT,
  position TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "testimonials_public_read" ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_auth_all" ON public.testimonials;

CREATE POLICY "testimonials_public_read" ON public.testimonials FOR SELECT USING (active = true);
CREATE POLICY "testimonials_auth_all" ON public.testimonials FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- 5. CONTACT MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_insert" ON public.contact_messages;
DROP POLICY IF EXISTS "messages_auth_all" ON public.contact_messages;

CREATE POLICY "messages_insert" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "messages_auth_all" ON public.contact_messages FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- 6. BLOG POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  tags TEXT[],
  image_url TEXT,
  author_id UUID REFERENCES public.profiles(id),
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blog_public_read" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_auth_all" ON public.blog_posts;

CREATE POLICY "blog_public_read" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "blog_auth_all" ON public.blog_posts FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- 7. SITE SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "settings_public_read" ON public.site_settings;
DROP POLICY IF EXISTS "settings_auth_all" ON public.site_settings;

CREATE POLICY "settings_public_read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "settings_auth_all" ON public.site_settings FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- 8. HERO IMAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hero_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page TEXT NOT NULL,
  image_url TEXT NOT NULL,
  title TEXT,
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hero_public_read" ON public.hero_images;
DROP POLICY IF EXISTS "hero_auth_all" ON public.hero_images;

CREATE POLICY "hero_public_read" ON public.hero_images FOR SELECT USING (active = true);
CREATE POLICY "hero_auth_all" ON public.hero_images FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- 9. CLIENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "clients_public_read" ON public.clients;
DROP POLICY IF EXISTS "clients_auth_all" ON public.clients;

CREATE POLICY "clients_public_read" ON public.clients FOR SELECT USING (active = true);
CREATE POLICY "clients_auth_all" ON public.clients FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- 10. SEED INITIAL DATA
-- =====================================================

-- Insert default site settings
INSERT INTO public.site_settings (key, value) VALUES
  ('company_name', '"CRONEC SRL"'),
  ('company_slogan', '"Construyendo el Futuro"'),
  ('company_email', '"info@cronec.com.ar"'),
  ('company_phone', '"+54 388 422-1234"'),
  ('company_address', '"Av. Senador Perez 123, San Salvador de Jujuy"'),
  ('social_facebook', '"https://facebook.com/cronec"'),
  ('social_instagram', '"https://instagram.com/cronec"'),
  ('social_linkedin', '"https://linkedin.com/company/cronec"'),
  ('whatsapp_number', '"+543884221234"')
ON CONFLICT (key) DO NOTHING;

-- Insert sample services
INSERT INTO public.services (title, slug, description, icon, order_index) VALUES
  ('Obras Civiles', 'obras-civiles', 'Construccion, refaccion, remodelacion e impermeabilizacion de estructuras civiles.', 'Building2', 1),
  ('Obras Electricas', 'obras-electricas', 'Instalaciones electricas de baja, media y alta tension.', 'Zap', 2),
  ('Arquitectura e Ingenieria', 'arquitectura-ingenieria', 'Diseno, proyecto y direccion de obras.', 'Ruler', 3),
  ('Instalaciones Industriales', 'instalaciones-industriales', 'Naves industriales, galpones y montajes especializados.', 'Factory', 4),
  ('Obras Generales', 'obras-generales', 'Obra publica e infraestructura ferroviaria.', 'HardHat', 5),
  ('Servicios Especiales', 'servicios-especiales', 'Reparacion de puentes, estructuras y trabajos especializados.', 'Wrench', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample projects
INSERT INTO public.projects (title, slug, description, category, client, location, year, featured, image_url) VALUES
  ('Centro Comercial Norte', 'centro-comercial-norte', 'Construccion completa de centro comercial de 15,000 m2', 'comercial', 'Grupo Norte SA', 'San Salvador de Jujuy', 2023, true, '/modern-shopping-mall-building-exterior.jpg'),
  ('Planta Industrial Ledesma', 'planta-industrial-ledesma', 'Instalaciones electricas y montaje industrial', 'industrial', 'Ledesma SAAI', 'Libertador Gral. San Martin', 2023, true, '/instalaciones-industriales-cronec.jpg'),
  ('Hospital Regional', 'hospital-regional', 'Refaccion y ampliacion de hospital regional', 'salud', 'Gobierno de Jujuy', 'San Pedro de Jujuy', 2022, true, '/modern-hospital.png'),
  ('Edificio Corporativo PAE', 'edificio-corporativo-pae', 'Construccion de oficinas corporativas', 'corporativo', 'Pan American Energy', 'San Salvador de Jujuy', 2022, false, '/modern-office-tower-building.jpg'),
  ('Subestacion Electrica Perico', 'subestacion-electrica-perico', 'Instalacion de subestacion de alta tension', 'energia', 'EJESA', 'Perico', 2021, false, '/electrical-substation-power-facility.jpg'),
  ('Complejo Residencial Los Alamos', 'complejo-residencial-alamos', 'Construccion de 48 unidades habitacionales', 'residencial', 'Desarrollos Inmobiliarios SA', 'Palpala', 2021, false, '/modern-apartment-complex.png')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample testimonials
INSERT INTO public.testimonials (name, company, position, content, rating, featured) VALUES
  ('Ing. Carlos Rodriguez', 'Pan American Energy', 'Gerente de Proyectos', 'CRONEC demostro profesionalismo excepcional en la construccion de nuestras oficinas. Entregaron a tiempo y con calidad superior.', 5, true),
  ('Arq. Maria Fernandez', 'Grupo Norte SA', 'Directora de Obras', 'Trabajar con CRONEC fue una experiencia excelente. Su equipo tecnico es altamente capacitado y comprometido.', 5, true),
  ('Lic. Juan Martinez', 'Gobierno de Jujuy', 'Director de Infraestructura', 'La refaccion del hospital fue impecable. CRONEC cumple con los mas altos estandares de calidad y seguridad.', 5, false)
ON CONFLICT DO NOTHING;

-- Insert hero images for each page
INSERT INTO public.hero_images (page, image_url, title, order_index) VALUES
  ('inicio', '/hero-construction-1.jpg', 'Construccion profesional', 1),
  ('inicio', '/hero-construction-2.jpg', 'Obras de ingenieria', 2),
  ('inicio', '/hero-construction-3.jpg', 'Instalaciones electricas', 3),
  ('servicios', '/hero-services-1.jpg', 'Equipo profesional', 1),
  ('servicios', '/hero-services-2.jpg', 'Estructuras metalicas', 2),
  ('servicios', '/hero-services-3.jpg', 'Obras civiles', 3),
  ('proyectos', '/hero-projects-1.jpg', 'Edificios modernos', 1),
  ('proyectos', '/hero-projects-2.jpg', 'Instalaciones industriales', 2),
  ('proyectos', '/hero-projects-3.jpg', 'Centros de salud', 3),
  ('nosotros', '/hero-nosotros-1.jpg', 'Nuestra empresa', 1),
  ('nosotros', '/hero-nosotros-2.jpg', 'Nuestro equipo', 2),
  ('nosotros', '/hero-nosotros-3.jpg', 'Reunion de trabajo', 3),
  ('contacto', '/hero-contacto-1.jpg', 'Recepcion', 1),
  ('contacto', '/hero-contacto-2.jpg', 'Acuerdos comerciales', 2),
  ('contacto', '/hero-contacto-3.jpg', 'Atencion al cliente', 3),
  ('blog', '/hero-blog-1.jpg', 'Actualizaciones', 1),
  ('blog', '/hero-blog-2.jpg', 'Innovacion', 2),
  ('blog', '/hero-blog-3.jpg', 'Capacitacion', 3)
ON CONFLICT DO NOTHING;

-- Insert sample clients
INSERT INTO public.clients (name, logo_url, order_index) VALUES
  ('Pan American Energy', '/energy-company-logo-pae.jpg', 1),
  ('Ledesma SAAI', '/food-industry-company-logo.jpg', 2),
  ('Gobierno de Jujuy', '/government-building-icon-logo.jpg', 3),
  ('EJESA', '/energy-company-logo.jpg', 4),
  ('Minera Exar', '/mining-company-logo.jpg', 5)
ON CONFLICT DO NOTHING;

-- =====================================================
-- CREATE UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
