-- Crear bucket para imágenes de proyectos
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acceso para project-images
CREATE POLICY "Public can view project images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Users can update their own project images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-images')
WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Users can delete their own project images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-images');

-- Crear bucket para otras imágenes (servicios, testimonios, etc)
INSERT INTO storage.buckets (id, name, public)
VALUES ('general-images', 'general-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acceso para general-images
CREATE POLICY "Public can view general images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'general-images');

CREATE POLICY "Authenticated users can upload general images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'general-images');

CREATE POLICY "Users can update their own general images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'general-images')
WITH CHECK (bucket_id = 'general-images');

CREATE POLICY "Users can delete their own general images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'general-images');
