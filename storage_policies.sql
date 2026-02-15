-- Storage Policy 1: Users can read shared documents
CREATE POLICY "Users can read shared documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM documents
    WHERE file_url LIKE '%' || name
    AND (auth.uid() = ANY(shared_with) OR auth.uid() = created_by)
  )
);

-- Storage Policy 2: Admins can upload documents
CREATE POLICY "Admins can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
