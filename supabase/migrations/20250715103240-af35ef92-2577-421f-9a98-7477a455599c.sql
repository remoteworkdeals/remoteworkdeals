-- Add new fields for "best for" and "not for you if" sections to listings table
ALTER TABLE public.listings 
ADD COLUMN best_for TEXT[],
ADD COLUMN not_suitable_for TEXT[];