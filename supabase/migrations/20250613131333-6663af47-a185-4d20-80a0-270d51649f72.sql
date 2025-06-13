
-- Add ALT text column to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN featured_image_alt TEXT;

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true);

-- Create RLS policies for the blog images storage bucket
CREATE POLICY "Anyone can view blog images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Users can update their own blog images" 
ON storage.objects FOR UPDATE 
TO authenticated
USING (bucket_id = 'blog-images');

CREATE POLICY "Users can delete their own blog images" 
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'blog-images');
