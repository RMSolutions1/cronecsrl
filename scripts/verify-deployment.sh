#!/bin/bash

# CRONEC SRL - Deployment Verification Script
# Verifies that all components are working correctly

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  CRONEC SRL - Deployment Verification  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Check environment variables
echo -e "${YELLOW}Checking environment variables...${NC}"

required_vars=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
)

all_vars_present=true

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}✗ Missing: $var${NC}"
        all_vars_present=false
    else
        echo -e "${GREEN}✓ Found: $var${NC}"
    fi
done

if [ "$all_vars_present" = false ]; then
    echo -e "\n${RED}Error: Some environment variables are missing${NC}"
    exit 1
fi

echo ""

# Check database tables
echo -e "${YELLOW}Checking database tables...${NC}"

tables=(
    "profiles"
    "projects"
    "services"
    "testimonials"
    "company_info"
    "contact_submissions"
)

for table in "${tables[@]}"; do
    result=$(supabase db execute --sql "SELECT COUNT(*) FROM public.$table;" 2>&1)
    
    if [[ $result == *"ERROR"* ]]; then
        echo -e "${RED}✗ Table $table not found or error${NC}"
    else
        echo -e "${GREEN}✓ Table $table exists${NC}"
    fi
done

echo ""

# Check storage buckets
echo -e "${YELLOW}Checking storage buckets...${NC}"

buckets=(
    "project-images"
    "general-images"
)

for bucket in "${buckets[@]}"; do
    result=$(supabase storage ls "$bucket" 2>&1)
    
    if [[ $result == *"ERROR"* ]] || [[ $result == *"Not found"* ]]; then
        echo -e "${RED}✗ Bucket $bucket not found${NC}"
    else
        echo -e "${GREEN}✓ Bucket $bucket exists${NC}"
    fi
done

echo ""

# Check if admin user exists
echo -e "${YELLOW}Checking for admin users...${NC}"

admin_count=$(supabase db execute --sql "SELECT COUNT(*) FROM public.profiles WHERE role IN ('admin', 'superadmin');" 2>&1 | grep -oE '[0-9]+' | head -1)

if [ "$admin_count" -gt 0 ]; then
    echo -e "${GREEN}✓ Found $admin_count admin user(s)${NC}"
else
    echo -e "${YELLOW}⚠ No admin users found. Run: node scripts/create-admin-user.js${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Verification completed!               ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
