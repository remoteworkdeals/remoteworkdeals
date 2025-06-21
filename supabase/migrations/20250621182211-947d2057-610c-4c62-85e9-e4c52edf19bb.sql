
-- Create a table to store community members
CREATE TABLE public.community_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT DEFAULT 'exclusive_deals',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unique constraint on email to prevent duplicates
ALTER TABLE public.community_members ADD CONSTRAINT unique_email UNIQUE (email);

-- Enable Row Level Security
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (since this is for signups)
CREATE POLICY "Anyone can insert community members" 
  ON public.community_members 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for admins to view all community members
-- (assuming you have admin functionality)
CREATE POLICY "Allow read access for authenticated users" 
  ON public.community_members 
  FOR SELECT 
  TO authenticated
  USING (true);
