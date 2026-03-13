-- Script para crear/actualizar el perfil de administrador
-- Ejecutar en Supabase SQL Editor

-- Primero, verifica si el usuario existe
SELECT id, email FROM auth.users WHERE email = 'administracion@emprenor.com.ar';

-- Si el usuario existe, crea/actualiza su perfil
-- Reemplaza 'USER_ID_AQUI' con el ID que obtuviste de la consulta anterior
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
SELECT 
  id,
  email,
  'Administrador CRONEC',
  'superadmin',
  NOW(),
  NOW()
FROM auth.users 
WHERE email = 'administracion@emprenor.com.ar'
ON CONFLICT (id) 
DO UPDATE SET
  role = 'superadmin',
  full_name = 'Administrador CRONEC',
  updated_at = NOW();

-- Verifica que se creó correctamente
SELECT * FROM public.profiles WHERE email = 'administracion@emprenor.com.ar';
