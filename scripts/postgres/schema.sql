-- CRONEC SRL - Esquema PostgreSQL (Neon u otro)
-- Ejecutar en la base de datos (Neon SQL Editor o psql)
-- IMPORTANTE: Este esquema usa id VARCHAR(36). Si tu base tiene id UUID y ves
-- "invalid input syntax for type uuid: 'proj-1'", ejecutá fix-uuid-to-varchar.sql en Neon.

-- Usuarios / admins (login)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) DEFAULT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  avatar_url VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Proyectos
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(255) NOT NULL,
  location VARCHAR(255) DEFAULT NULL,
  year INT DEFAULT NULL,
  area DECIMAL(12,2) DEFAULT NULL,
  budget VARCHAR(100) DEFAULT NULL,
  duration VARCHAR(100) DEFAULT NULL,
  client VARCHAR(255) DEFAULT NULL,
  image_url VARCHAR(500) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  featured BOOLEAN DEFAULT FALSE,
  created_by VARCHAR(36) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);

-- Servicios
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description VARCHAR(500) DEFAULT NULL,
  icon VARCHAR(100) NOT NULL DEFAULT 'Building2',
  image_url VARCHAR(500) DEFAULT NULL,
  features JSONB DEFAULT NULL,
  benefits JSONB DEFAULT NULL,
  display_order INT DEFAULT 0,
  order_index INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','inactive')),
  is_active BOOLEAN DEFAULT TRUE,
  created_by VARCHAR(36) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(display_order);

-- Testimonios
CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(36) PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_company VARCHAR(255) DEFAULT NULL,
  client_position VARCHAR(255) DEFAULT NULL,
  content TEXT NOT NULL,
  rating INT DEFAULT 5,
  avatar_url VARCHAR(500) DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  featured BOOLEAN DEFAULT FALSE,
  created_by VARCHAR(36) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);

-- Información de la empresa (una fila)
CREATE TABLE IF NOT EXISTS company_info (
  id VARCHAR(36) PRIMARY KEY,
  company_name VARCHAR(255) DEFAULT NULL,
  tagline VARCHAR(500) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  mission TEXT DEFAULT NULL,
  vision TEXT DEFAULT NULL,
  "values" JSONB DEFAULT NULL,
  address VARCHAR(500) DEFAULT NULL,
  phone VARCHAR(100) DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL,
  whatsapp VARCHAR(50) DEFAULT NULL,
  facebook_url VARCHAR(500) DEFAULT NULL,
  instagram_url VARCHAR(500) DEFAULT NULL,
  linkedin_url VARCHAR(500) DEFAULT NULL,
  twitter_url VARCHAR(500) DEFAULT NULL,
  youtube_url VARCHAR(500) DEFAULT NULL,
  founded_year INT DEFAULT NULL,
  cuit VARCHAR(50) DEFAULT NULL,
  logo_url VARCHAR(500) DEFAULT NULL,
  extra JSONB DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mensajes de contacto
CREATE TABLE IF NOT EXISTS contact_submissions (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100) DEFAULT NULL,
  company VARCHAR(255) DEFAULT NULL,
  service VARCHAR(255) DEFAULT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new','contacted','completed','archived')),
  notes TEXT DEFAULT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at);

-- Blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT DEFAULT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(500) DEFAULT NULL,
  category VARCHAR(255) DEFAULT 'noticias',
  tags JSONB DEFAULT NULL,
  author_id VARCHAR(36) DEFAULT NULL,
  author_name VARCHAR(255) DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  featured BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  published_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);

-- Hero images
CREATE TABLE IF NOT EXISTS hero_images (
  id VARCHAR(36) PRIMARY KEY,
  page VARCHAR(50) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255) DEFAULT NULL,
  title VARCHAR(255) DEFAULT NULL,
  order_index INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_hero_page ON hero_images(page);

-- Certificaciones (ISO, etc.) - sección inicio
CREATE TABLE IF NOT EXISTS certifications (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500) DEFAULT NULL,
  order_index INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_certifications_order ON certifications(order_index);

-- Clientes (logos en inicio)
CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500) DEFAULT NULL,
  order_index INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_clients_order ON clients(order_index);

-- Fila por defecto company_info
INSERT INTO company_info (id, company_name, tagline, address, phone, email, whatsapp, founded_year, cuit)
VALUES ('00000000-0000-0000-0000-000000000001', 'CRONEC S.R.L.', 'Construcción Civil e Instalaciones Eléctricas', 'Santa Fe 548 PB B, Salta Capital (4400)', '+54 9 387 536-1210', 'cronec@cronecsrl.com.ar', '5493875361210', 2009, '33-71090097-9')
ON CONFLICT (id) DO NOTHING;
