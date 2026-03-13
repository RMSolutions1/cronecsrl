-- Script para eliminar la política RLS recursiva y permitir acceso básico
-- EJECUTAR ESTE SCRIPT EN SUPABASE SQL EDITOR

-- Paso 1: Eliminar la política problemática que causa recursión infinita
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Paso 2: Verificar que las políticas restantes sean correctas
-- Estas políticas NO causan recursión porque solo usan auth.uid()

-- Política 1: Los usuarios pueden ver su propio perfil
-- Ya existe: "Users can view own profile"

-- Política 2: Los usuarios pueden actualizar su propio perfil  
-- Ya existe: "Users can update own profile"

-- Política 3: Los usuarios pueden insertar su propio perfil
-- Ya existe: "Users can insert own profile"

-- Paso 3: Verificar las políticas actuales
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- NOTA: Después de ejecutar este script, el usuario f68c0ae6-b717-491f-a949-6100c8dc1967
-- podrá ver su propio perfil sin problemas de recursión.
-- La verificación de roles de admin se hará en el código de la aplicación, no en RLS.
