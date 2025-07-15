-- Add sample suitability data to the Casanova listing for testing
UPDATE public.listings 
SET 
  best_for = ARRAY['Digital nomads', 'Remote workers', 'Creative freelancers', 'Social people who enjoy community'], 
  not_suitable_for = ARRAY['Heavy partiers', 'People seeking complete isolation', 'Those uncomfortable with shared spaces', 'Light sleepers who need absolute quiet']
WHERE title ILIKE '%casanova%';