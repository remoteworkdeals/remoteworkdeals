
-- Add overall_rating to reviews table for the new Overall Experience rating
ALTER TABLE public.reviews 
ADD COLUMN overall_rating integer;

-- Add website and Instagram URLs to listings table
ALTER TABLE public.listings 
ADD COLUMN website_url text,
ADD COLUMN instagram_url text;

-- Add linked_listings array to blog_posts table to connect blog posts with listings
ALTER TABLE public.blog_posts 
ADD COLUMN linked_listings integer[];

-- Update the listings table to store calculated ratings from reviews
-- (These will be updated automatically via triggers or application logic)
UPDATE public.listings 
SET rating = 0, review_count = 0 
WHERE rating IS NULL OR review_count IS NULL;
