
-- First, let's check and update the RLS policies for the listings table
-- Drop the existing restrictive UPDATE policy if it exists
DROP POLICY IF EXISTS "Users can update their own listings" ON public.listings;
DROP POLICY IF EXISTS "Authenticated users can update listings" ON public.listings;

-- Create a more flexible UPDATE policy that allows:
-- 1. Admin users to update any listing
-- 2. Regular users to update only listings they created
CREATE POLICY "Admin users can update any listing, users can update their own" 
ON public.listings 
FOR UPDATE 
TO authenticated
USING (
  -- Allow if user is admin OR if user created the listing
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) 
  OR auth.uid() = created_by
);

-- Update existing listings to set created_by to the admin user
-- Replace this UUID with your actual admin user ID
-- You can find your user ID by running: SELECT auth.uid() when logged in as admin
UPDATE public.listings 
SET created_by = (
  SELECT id FROM public.profiles 
  WHERE role = 'admin' 
  LIMIT 1
)
WHERE created_by IS NULL;

-- Also ensure we have proper INSERT and SELECT policies
-- Create INSERT policy if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'listings' AND policyname = 'Authenticated users can create listings'
  ) THEN
    EXECUTE 'CREATE POLICY "Authenticated users can create listings" ON public.listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by)';
  END IF;
END $$;

-- Create SELECT policy if it doesn't exist (allow everyone to view active listings)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'listings' AND policyname = 'Anyone can view active listings'
  ) THEN
    EXECUTE 'CREATE POLICY "Anyone can view active listings" ON public.listings FOR SELECT USING (status = ''active'' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = ''admin''))';
  END IF;
END $$;
