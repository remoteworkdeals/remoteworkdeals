
-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN role TEXT DEFAULT 'user' NOT NULL;

-- Update your existing profile to have admin role
-- Replace 'remoteworkdeals@gmail.com' with your actual email if different
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'remoteworkdeals@gmail.com';

-- Create an index for better performance on role queries
CREATE INDEX idx_profiles_role ON public.profiles(role);
