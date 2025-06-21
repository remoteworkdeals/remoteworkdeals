
-- Remove the foreign key constraint that prevents anonymous review submissions
-- This allows user_id to contain either authenticated user IDs or anonymous UUIDs
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;

-- Add a comment to document that user_id can contain anonymous UUIDs
COMMENT ON COLUMN public.reviews.user_id IS 'Can contain either authenticated user IDs from auth.users or anonymous UUIDs for guest reviews';
