
-- Create a table for blog posts
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  featured_image TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  read_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to allow public reading but restrict writing
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to SELECT published blog posts
CREATE POLICY "Anyone can view published blog posts" 
  ON public.blog_posts 
  FOR SELECT 
  USING (status = 'published');

-- Create policy that allows authenticated users to INSERT blog posts
CREATE POLICY "Authenticated users can create blog posts" 
  ON public.blog_posts 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Create policy that allows authenticated users to UPDATE blog posts
CREATE POLICY "Authenticated users can update blog posts" 
  ON public.blog_posts 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Create policy that allows authenticated users to DELETE blog posts
CREATE POLICY "Authenticated users can delete blog posts" 
  ON public.blog_posts 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Create an index on slug for faster lookups
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);

-- Create an index on category for filtering
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);

-- Create an index on status and created_at for efficient queries
CREATE INDEX idx_blog_posts_status_created ON public.blog_posts(status, created_at DESC);
