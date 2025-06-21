
-- Add new columns to the listings table for the paragraph content
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS work_wifi_info TEXT,
ADD COLUMN IF NOT EXISTS community_social_info TEXT,
ADD COLUMN IF NOT EXISTS comfort_living_info TEXT,
ADD COLUMN IF NOT EXISTS location_surroundings_info TEXT,
ADD COLUMN IF NOT EXISTS price_value_info TEXT;
