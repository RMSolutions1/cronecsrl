-- CRONEC SRL - Migration: Add unique constraints for sections
-- This allows proper upsert operations in the admin dashboard

-- Add unique constraint on sections(page, section_key) if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sections_page_section_key_unique'
  ) THEN
    ALTER TABLE sections ADD CONSTRAINT sections_page_section_key_unique UNIQUE (page, section_key);
  END IF;
END $$;

-- Ensure calculator_pricing has necessary columns
DO $$
BEGIN
  -- Add is_active column if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calculator_pricing' AND column_name = 'is_active') THEN
    ALTER TABLE calculator_pricing ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_sections_page_key ON sections(page, section_key);
CREATE INDEX IF NOT EXISTS idx_calc_pricing_category ON calculator_pricing(category);
