-- Eliminar la política problemática que causa recursión infinita
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Crear política simple para que los usuarios puedan insertar su propio perfil
-- (Ya existe "Users can insert own profile" según el esquema actual)

-- Verificar que el perfil del admin existe y tiene el rol correcto
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Buscar el usuario por email
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'administracion@emprenor.com.ar'
  LIMIT 1;

  -- Si el usuario existe, actualizar o insertar su perfil
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
      admin_user_id,
      'administracion@emprenor.com.ar',
      'Administrador CRONEC',
      'superadmin'
    )
    ON CONFLICT (id) 
    DO UPDATE SET 
      role = 'superadmin',
      updated_at = NOW();
    
    RAISE NOTICE 'Perfil de administrador actualizado correctamente';
  ELSE
    RAISE NOTICE 'Usuario no encontrado. Regístrate primero en /admin/registro';
  END IF;
END $$;

-- Verificar el resultado
SELECT id, email, role, created_at 
FROM public.profiles 
WHERE email = 'administracion@emprenor.com.ar';
