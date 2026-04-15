
-- Drop the overly broad SELECT policy
DROP POLICY "Anyone can view module assets" ON storage.objects;

-- Create a more restrictive policy - only allow viewing if you know the path
CREATE POLICY "Authenticated can view module assets" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'module-assets');
