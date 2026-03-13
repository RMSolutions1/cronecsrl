#!/bin/bash

# CRONEC SRL - Database Reset Script
# WARNING: This will delete all data!

set -e

RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${RED}╔════════════════════════════════════════╗${NC}"
echo -e "${RED}║  WARNING: DATABASE RESET               ║${NC}"
echo -e "${RED}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}This will DELETE ALL DATA from your database!${NC}"
echo -e "${YELLOW}This action CANNOT be undone!${NC}"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " confirmation

if [ "$confirmation" != "yes" ]; then
    echo "Operation cancelled."
    exit 0
fi

echo ""
echo "Starting database reset..."

# Drop all tables
supabase db execute --sql "
DROP TABLE IF EXISTS public.contact_submissions CASCADE;
DROP TABLE IF EXISTS public.company_info CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at CASCADE;
"

echo "✓ Tables dropped"

# Delete storage buckets
supabase storage rm --recursive project-images || true
supabase storage rm --recursive general-images || true

echo "✓ Storage cleared"

# Re-run migrations
bash scripts/deploy-database.sh

echo ""
echo "✓ Database reset complete"
