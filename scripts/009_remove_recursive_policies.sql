-- Script para eliminar políticas RLS recursivas y crear políticas seguras
-- Ejecutar este script en Supabase SQL Editor

-- 1. Eliminar TODAS las políticas de la tabla profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 2. Crear políticas simples sin recursión
-- Los usuarios solo pueden ver y editar su propio perfil
CREATE POLICY "Users can view own profile v2"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile v2"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile v2"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 3. Actualizar políticas de otras tablas para evitar recursión
-- Eliminar políticas que consultan profiles
DROP POLICY IF EXISTS "Admins can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;

DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can manage company info" ON public.company_info;

-- 4. Crear políticas para proyectos (sin verificar rol)
-- Los usuarios autenticados pueden gestionar proyectos
CREATE POLICY "Authenticated users can manage projects"
ON public.projects FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. Crear políticas para servicios
CREATE POLICY "Authenticated users can manage services"
ON public.services FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. Crear políticas para testimonios
CREATE POLICY "Authenticated users can manage testimonials"
ON public.testimonials FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 7. Crear políticas para mensajes de contacto
CREATE POLICY "Authenticated users can view submissions"
ON public.contact_submissions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update submissions"
ON public.contact_submissions FOR UPDATE
TO authenticated
USING (true);

-- 8. Crear políticas para información de la empresa
CREATE POLICY "Authenticated users can manage company info"
ON public.company_info FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Verificar que las políticas fueron creadas correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
