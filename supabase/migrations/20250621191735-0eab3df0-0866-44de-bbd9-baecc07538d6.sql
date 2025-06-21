
-- Add a name column to the community_members table
ALTER TABLE public.community_members 
ADD COLUMN name TEXT;

-- Update the table comment for clarity
COMMENT ON COLUMN public.community_members.name IS 'Full name of the community member';
