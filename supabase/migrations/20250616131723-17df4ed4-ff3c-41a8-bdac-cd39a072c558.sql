
-- Add columns to store category-specific notes in the reviews table
ALTER TABLE public.reviews 
ADD COLUMN social_notes TEXT,
ADD COLUMN work_notes TEXT,
ADD COLUMN surroundings_notes TEXT,
ADD COLUMN facilities_notes TEXT,
ADD COLUMN price_notes TEXT;
