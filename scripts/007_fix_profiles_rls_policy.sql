-- Script para corregir las políticas RLS de la tabla profiles
-- Este script permite a los usuarios crear su propio perfil

-- Eliminar política existente si existe (por si acaso)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Crear la política de INSERT para que los usuarios puedan crear su propio perfil
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Verificar que RLS esté habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Mostrar todas las políticas actuales
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';
