-- Criar buckets de storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('medical-images', 'medical-images', false, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('patient-documents', 'patient-documents', false, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Políticas de acesso para medical-images
CREATE POLICY "Doctors can upload medical images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'medical-images');

CREATE POLICY "Doctors can view medical images" ON storage.objects
  FOR SELECT USING (bucket_id = 'medical-images');

-- Políticas de acesso para patient-documents  
CREATE POLICY "Doctors can upload patient documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'patient-documents');

CREATE POLICY "Doctors can view patient documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'patient-documents');

-- Políticas de acesso para avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars'); 