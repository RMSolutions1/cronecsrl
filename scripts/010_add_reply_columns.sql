-- Agregar columnas para respuestas de admin en contact_submissions
-- Ejecutar en Neon/PostgreSQL

-- Agregar columna admin_reply para guardar la respuesta
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS admin_reply TEXT;

-- Agregar columna replied_at para fecha de respuesta
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP WITH TIME ZONE;

-- Agregar columna replied_by para saber quien respondio
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS replied_by UUID;

-- Verificar que las columnas notes y status existen
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new';

-- Actualizar mensajes existentes sin status
UPDATE contact_submissions SET status = 'new' WHERE status IS NULL;
