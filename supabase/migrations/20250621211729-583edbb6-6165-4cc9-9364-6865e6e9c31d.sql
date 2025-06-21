
-- Add featured column to listings table
ALTER TABLE public.listings 
ADD COLUMN featured boolean NOT NULL DEFAULT false;

-- Add comment to explain the column
COMMENT ON COLUMN public.listings.featured IS 'Whether this listing should be featured on the homepage';
