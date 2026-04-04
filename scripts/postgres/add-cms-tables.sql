-- Tablas CMS aditivas (si ya ejecutaste schema.sql antes de que existieran).
-- Pegá este bloque en Neon → SQL Editor y ejecutá una vez.
-- Equivale a lib/cms-migrations.ts / POST /api/admin/setup (solo DDL).

CREATE TABLE IF NOT EXISTS site_config (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(200) DEFAULT '',
  role VARCHAR(200) DEFAULT '',
  bio TEXT,
  image_url TEXT,
  linkedin_url VARCHAR(300),
  order_index INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(order_index);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(active);
