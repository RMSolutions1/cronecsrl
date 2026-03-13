#!/bin/bash

# CRONEC SRL - Automated Database Deployment Script
# This script executes all database migrations in order

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  CRONEC SRL - Database Deployment     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Error: Supabase CLI is not installed${NC}"
    echo "Install it with: npm install -g supabase"
    exit 1
fi

# Check if project is linked
if [ ! -f ".supabase/config.toml" ]; then
    echo -e "${YELLOW}Supabase project not linked. Linking now...${NC}"
    echo "Please provide your Supabase project reference ID:"
    read -r PROJECT_REF
    supabase link --project-ref "$PROJECT_REF"
fi

echo -e "${YELLOW}Starting database migration...${NC}"
echo ""

# Execute migrations in order
MIGRATION_FILES=(
    "001_create_admin_schema.sql"
    "002_seed_initial_data.sql"
    "003_create_storage_buckets.sql"
)

for file in "${MIGRATION_FILES[@]}"; do
    echo -e "${YELLOW}Executing: $file${NC}"
    
    if [ -f "scripts/$file" ]; then
        supabase db execute --file "scripts/$file"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ $file executed successfully${NC}"
        else
            echo -e "${RED}✗ Failed to execute $file${NC}"
            exit 1
        fi
    else
        echo -e "${RED}✗ File not found: scripts/$file${NC}"
        exit 1
    fi
    
    echo ""
done

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Database deployment completed!        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}Next steps:${NC}"
echo "1. Create an admin user in Supabase Auth dashboard"
echo "2. Update the user's role to 'admin' in the profiles table"
echo "3. Deploy your application to Vercel"
echo ""
