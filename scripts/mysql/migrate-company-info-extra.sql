-- Si ya tenías el esquema aplicado antes de añadir la columna extra, ejecuta:
-- mysql -u usuario -p base_datos < scripts/mysql/migrate-company-info-extra.sql
ALTER TABLE company_info ADD COLUMN extra JSON DEFAULT NULL COMMENT 'Campos adicionales del formulario de configuración';
