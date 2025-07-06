
-- Create storage bucket for medical reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-reports', 'medical-reports', true);

-- Create policy to allow authenticated users to upload their own files
CREATE POLICY "Users can upload their own medical reports"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'medical-reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow users to view their own files
CREATE POLICY "Users can view their own medical reports"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'medical-reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow users to delete their own files
CREATE POLICY "Users can delete their own medical reports"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'medical-reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
