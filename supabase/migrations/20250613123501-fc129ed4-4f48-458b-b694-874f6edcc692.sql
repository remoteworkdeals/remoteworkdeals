
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can create blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON public.blog_posts;

-- Create more permissive policies for a public blog system
-- Allow anyone to create blog posts (you can restrict this later if needed)
CREATE POLICY "Anyone can create blog posts" 
  ON public.blog_posts 
  FOR INSERT 
  WITH CHECK (true);

-- Allow anyone to update blog posts (you can restrict this later if needed)
CREATE POLICY "Anyone can update blog posts" 
  ON public.blog_posts 
  FOR UPDATE 
  USING (true);

-- Allow anyone to delete blog posts (you can restrict this later if needed)
CREATE POLICY "Anyone can delete blog posts" 
  ON public.blog_posts 
  FOR DELETE 
  USING (true);
