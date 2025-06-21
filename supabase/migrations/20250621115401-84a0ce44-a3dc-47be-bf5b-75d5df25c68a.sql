
-- Update the INSERT policy for reviews to allow anonymous submissions
-- This removes the authentication requirement for submitting reviews
DROP POLICY IF EXISTS "Users can create their own reviews" ON public.reviews;

-- Create a new policy that allows anyone to insert reviews
-- We still maintain data integrity by ensuring the user_id field is populated
CREATE POLICY "Anyone can create reviews" 
  ON public.reviews 
  FOR INSERT 
  WITH CHECK (
    -- Allow if user is authenticated and matches user_id, OR if user is anonymous
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
    (auth.uid() IS NULL AND user_id IS NOT NULL)
  );

-- Drop existing SELECT policy and recreate it
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;

CREATE POLICY "Anyone can view reviews" 
  ON public.reviews 
  FOR SELECT 
  USING (true);
