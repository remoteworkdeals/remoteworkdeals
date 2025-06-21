
-- Create a table for partner inquiries
CREATE TABLE public.partner_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  coliving_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed'))
);

-- Add Row Level Security (RLS) - only admins can view these
ALTER TABLE public.partner_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to INSERT (for form submissions)
CREATE POLICY "Anyone can submit partner inquiries" 
  ON public.partner_inquiries 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that only authenticated users can view (for admin access)
CREATE POLICY "Only authenticated users can view partner inquiries" 
  ON public.partner_inquiries 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);
