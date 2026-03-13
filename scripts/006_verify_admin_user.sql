-- Script to verify and fix admin user configuration

-- 1. Check if admin email exists in auth.users
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'administracion@emprenor.com.ar';

-- 2. Check if profile exists
SELECT 
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
FROM public.profiles 
WHERE email = 'administracion@emprenor.com.ar';

-- 3. If profile exists but role is not superadmin, fix it:
UPDATE public.profiles 
SET 
  role = 'superadmin',
  updated_at = NOW()
WHERE email = 'administracion@emprenor.com.ar';

-- 4. If profile doesn't exist but user exists in auth, create it:
-- First, get the user ID:
-- Then run:
/*
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  'USER_ID_FROM_STEP_1',
  'administracion@emprenor.com.ar',
  'Administrador',
  'superadmin'
)
ON CONFLICT (id) DO UPDATE
SET role = 'superadmin';
*/

-- 5. Verify final state
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  u.email_confirmed_at,
  u.last_sign_in_at
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.email = 'administracion@emprenor.com.ar';
