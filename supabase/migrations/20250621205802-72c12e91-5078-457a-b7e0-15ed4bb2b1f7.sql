
-- Add USP field to listings table
ALTER TABLE public.listings 
ADD COLUMN usp TEXT;

-- Add discount type and value fields to listings table
ALTER TABLE public.listings 
ADD COLUMN discount_type TEXT DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed_amount')),
ADD COLUMN discount_value NUMERIC;

-- Update existing listings to have default discount type based on existing data
UPDATE public.listings 
SET discount_type = 'percentage',
    discount_value = discount_percentage
WHERE discount_percentage IS NOT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.listings.usp IS 'Unique Selling Point - short descriptive text for listing cards';
COMMENT ON COLUMN public.listings.discount_type IS 'Type of discount: percentage or fixed_amount';
COMMENT ON COLUMN public.listings.discount_value IS 'Discount value (percentage or fixed amount in euros)';
