-- Alinea la tabla certifications con el esquema de la app (logo_url).
-- Idempotente: se puede ejecutar varias veces.

ALTER TABLE certifications ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Copia datos del esquema viejo si existían
UPDATE certifications SET logo_url = image_url WHERE logo_url IS NULL AND image_url IS NOT NULL;
