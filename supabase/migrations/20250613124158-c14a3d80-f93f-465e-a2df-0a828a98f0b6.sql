
-- First, disable RLS temporarily to ensure we can work with the table
ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies (including any we might have missed)
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can create blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can create blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can delete blog posts" ON public.blog_posts;

-- Re-enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create completely open policies for a public blog system
CREATE POLICY "Public can view all blog posts" 
  ON public.blog_posts 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public can create blog posts" 
  ON public.blog_posts 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Public can update blog posts" 
  ON public.blog_posts 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete blog posts" 
  ON public.blog_posts 
  FOR DELETE 
  USING (true);
