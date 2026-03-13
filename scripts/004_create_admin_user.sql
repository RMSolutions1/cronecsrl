-- Script para crear usuario administrador
-- Email: administracion@emprenor.com.ar
-- Este script debe ejecutarse DESPUÉS de que el usuario se registre en /admin/login

-- OPCIÓN 1: Si el usuario YA SE REGISTRÓ, actualizar su rol
UPDATE public.profiles 
SET 
  role = 'superadmin',
  full_name = 'Administrador CRONEC'
WHERE email = 'administracion@emprenor.com.ar';

-- OPCIÓN 2: Si el usuario NO SE HA REGISTRADO AÚN
-- Primero debes ir a /admin/login y registrarte con:
-- Email: administracion@emprenor.com.ar
-- Password: Ras2025RM@
-- 
-- Después de registrarte, Supabase creará automáticamente el usuario en auth.users
-- y el trigger creará el perfil en public.profiles
--
-- Luego ejecuta la OPCIÓN 1 arriba para cambiar el rol a superadmin

-- Verificar que el usuario fue creado correctamente
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM public.profiles
WHERE email = 'administracion@emprenor.com.ar';

-- Si ves el usuario con role = 'superadmin', ¡está listo!
