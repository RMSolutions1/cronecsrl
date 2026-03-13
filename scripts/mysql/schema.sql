-- CRONEC SRL - Esquema MySQL (reemplazo de Supabase/PostgreSQL)
-- Ejecutar en tu base de datos MySQL del hosting

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Usuarios (reemplaza auth.users + profiles de Supabase)
CREATE TABLE IF NOT EXISTS `users` (
  `id` CHAR(36) PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) DEFAULT NULL,
  `role` ENUM('user','admin','superadmin') NOT NULL DEFAULT 'user',
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Proyectos
CREATE TABLE IF NOT EXISTS `projects` (
  `id` CHAR(36) PRIMARY KEY,
  `title` VARCHAR(500) NOT NULL,
  `description` TEXT NOT NULL,
  `category` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `year` INT DEFAULT NULL,
  `area` DECIMAL(12,2) DEFAULT NULL,
  `budget` VARCHAR(100) DEFAULT NULL,
  `duration` VARCHAR(100) DEFAULT NULL,
  `client` VARCHAR(255) DEFAULT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `status` ENUM('draft','published','archived') DEFAULT 'draft',
  `featured` TINYINT(1) DEFAULT 0,
  `created_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_projects_status` (`status`),
  KEY `idx_projects_featured` (`featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Servicios (features y benefits como JSON)
CREATE TABLE IF NOT EXISTS `services` (
  `id` CHAR(36) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT NOT NULL,
  `short_description` VARCHAR(500) DEFAULT NULL,
  `icon` VARCHAR(100) NOT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `features` JSON DEFAULT NULL,
  `benefits` JSON DEFAULT NULL,
  `display_order` INT DEFAULT 0,
  `order_index` INT DEFAULT 0,
  `status` ENUM('active','inactive') DEFAULT 'active',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_services_status` (`status`),
  KEY `idx_services_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Testimonios (compatible con UI: content, featured, status)
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` CHAR(36) PRIMARY KEY,
  `client_name` VARCHAR(255) NOT NULL,
  `client_company` VARCHAR(255) DEFAULT NULL,
  `client_position` VARCHAR(255) DEFAULT NULL,
  `content` TEXT NOT NULL,
  `rating` INT DEFAULT 5,
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `status` ENUM('draft','published','archived') DEFAULT 'published',
  `featured` TINYINT(1) DEFAULT 0,
  `created_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_testimonials_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Información de la empresa (una sola fila con muchas columnas, como espera settings-manager)
CREATE TABLE IF NOT EXISTS `company_info` (
  `id` CHAR(36) PRIMARY KEY,
  `company_name` VARCHAR(255) DEFAULT NULL,
  `tagline` VARCHAR(500) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `mission` TEXT DEFAULT NULL,
  `vision` TEXT DEFAULT NULL,
  `values` JSON DEFAULT NULL,
  `address` VARCHAR(500) DEFAULT NULL,
  `phone` VARCHAR(100) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `whatsapp` VARCHAR(50) DEFAULT NULL,
  `facebook_url` VARCHAR(500) DEFAULT NULL,
  `instagram_url` VARCHAR(500) DEFAULT NULL,
  `linkedin_url` VARCHAR(500) DEFAULT NULL,
  `twitter_url` VARCHAR(500) DEFAULT NULL,
  `youtube_url` VARCHAR(500) DEFAULT NULL,
  `founded_year` INT DEFAULT NULL,
  `cuit` VARCHAR(50) DEFAULT NULL,
  `logo_url` VARCHAR(500) DEFAULT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mensajes de contacto
CREATE TABLE IF NOT EXISTS `contact_submissions` (
  `id` CHAR(36) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(100) DEFAULT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `service` VARCHAR(255) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('new','contacted','completed','archived') DEFAULT 'new',
  `notes` TEXT DEFAULT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_contact_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Entradas del blog
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` CHAR(36) PRIMARY KEY,
  `title` VARCHAR(500) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `excerpt` TEXT DEFAULT NULL,
  `content` LONGTEXT NOT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `category` VARCHAR(255) DEFAULT 'noticias',
  `tags` JSON DEFAULT NULL,
  `author_id` CHAR(36) DEFAULT NULL,
  `author_name` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('draft','published','archived') DEFAULT 'draft',
  `featured` TINYINT(1) DEFAULT 0,
  `views` INT DEFAULT 0,
  `published_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_blog_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Configuración del sitio (key-value con JSON)
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` CHAR(36) PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  `value` JSON NOT NULL,
  `category` VARCHAR(100) DEFAULT 'general',
  `label` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `type` VARCHAR(50) DEFAULT 'text',
  `updated_by` CHAR(36) DEFAULT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Imágenes hero por página
CREATE TABLE IF NOT EXISTS `hero_images` (
  `id` CHAR(36) PRIMARY KEY,
  `page` VARCHAR(50) NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `alt_text` VARCHAR(255) DEFAULT NULL,
  `title` VARCHAR(255) DEFAULT NULL,
  `order_index` INT DEFAULT 0,
  `active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_hero_page` (`page`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Biblioteca de medios (opcional)
CREATE TABLE IF NOT EXISTS `media_library` (
  `id` CHAR(36) PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `size` INT NOT NULL,
  `width` INT DEFAULT NULL,
  `height` INT DEFAULT NULL,
  `alt_text` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(100) DEFAULT 'general',
  `uploaded_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Insertar fila por defecto de company_info (una sola fila con id fijo)
INSERT IGNORE INTO `company_info` (`id`, `company_name`, `tagline`, `address`, `phone`, `email`, `whatsapp`, `founded_year`, `cuit`)
VALUES ('00000000-0000-0000-0000-000000000001', 'CRONEC S.R.L.', 'Construcción Civil e Instalaciones Eléctricas', 'Santa Fe 548 PB B, Salta Capital (4400)', '+54 9 387 536-1210', 'cronec@cronecsrl.com', '5493875361210', 2009, '33-71090097-9');

-- Crear usuario admin por defecto (contraseña: admin123 - CAMBIAR EN PRODUCCIÓN)
-- Ejecutar después de tener la app corriendo: npm run db:seed-admin
-- O insertar manualmente con un hash bcrypt de tu contraseña.
