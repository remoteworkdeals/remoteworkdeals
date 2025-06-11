
-- Add new columns to the listings table
ALTER TABLE public.listings 
ADD COLUMN featured_image TEXT,
ADD COLUMN discount_code_url TEXT,
ADD COLUMN is_seasonal BOOLEAN DEFAULT FALSE,
ADD COLUMN seasonal_start_date DATE,
ADD COLUMN seasonal_end_date DATE;

-- Create storage bucket for listing images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('listing-images', 'listing-images', true);

-- Create RLS policies for the storage bucket
CREATE POLICY "Anyone can view listing images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'listing-images');

CREATE POLICY "Authenticated users can upload listing images" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'listing-images');

CREATE POLICY "Users can update their own listing images" 
ON storage.objects FOR UPDATE 
TO authenticated
USING (bucket_id = 'listing-images');

CREATE POLICY "Users can delete their own listing images" 
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'listing-images');
