
-- Add the missing columns to the listings table that are referenced in the TypeScript types
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS pricing_unit TEXT DEFAULT 'night',
ADD COLUMN IF NOT EXISTS minimum_stay INTEGER,
ADD COLUMN IF NOT EXISTS minimum_stay_unit TEXT DEFAULT 'nights';

-- Add new structured review categories to the reviews table
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS work_wifi JSONB,
ADD COLUMN IF NOT EXISTS social_community JSONB,
ADD COLUMN IF NOT EXISTS comfort_living JSONB,
ADD COLUMN IF NOT EXISTS location_surroundings JSONB,
ADD COLUMN IF NOT EXISTS price_value JSONB,
ADD COLUMN IF NOT EXISTS optimized_flag BOOLEAN DEFAULT false;

-- Add constraints to ensure pricing_unit and minimum_stay_unit have valid values
ALTER TABLE public.listings 
ADD CONSTRAINT check_pricing_unit CHECK (pricing_unit IN ('night', 'month'));

ALTER TABLE public.listings 
ADD CONSTRAINT check_minimum_stay_unit CHECK (minimum_stay_unit IN ('nights', 'weeks', 'months'));
