
-- Create enum for listing types
CREATE TYPE public.listing_type AS ENUM ('coliving', 'coworking', 'apartment', 'house');

-- Create enum for listing status
CREATE TYPE public.listing_status AS ENUM ('active', 'inactive', 'pending');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create listings table
CREATE TABLE public.listings (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  country TEXT NOT NULL,
  type listing_type NOT NULL DEFAULT 'coliving',
  status listing_status NOT NULL DEFAULT 'active',
  original_price INTEGER NOT NULL,
  discounted_price INTEGER,
  discount_percentage INTEGER,
  capacity INTEGER,
  rooms INTEGER,
  amenities TEXT[],
  images TEXT[],
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id BIGINT NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewer_name TEXT,
  review_text TEXT,
  social_rating INTEGER CHECK (social_rating >= 1 AND social_rating <= 5),
  work_rating INTEGER CHECK (work_rating >= 1 AND work_rating <= 5),
  surroundings_rating INTEGER CHECK (surroundings_rating >= 1 AND surroundings_rating <= 5),
  facilities_rating INTEGER CHECK (facilities_rating >= 1 AND facilities_rating <= 5),
  price_rating INTEGER CHECK (price_rating >= 1 AND price_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(listing_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Listings policies (public read, authenticated users can create)
CREATE POLICY "Anyone can view active listings" 
  ON public.listings FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Authenticated users can create listings" 
  ON public.listings FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own listings" 
  ON public.listings FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own listings" 
  ON public.listings FOR DELETE 
  USING (auth.uid() = created_by);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" 
  ON public.reviews FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create reviews" 
  ON public.reviews FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
  ON public.reviews FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
  ON public.reviews FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  );
  RETURN new;
END;
$$;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample data for testing
INSERT INTO public.listings (
  title, description, location, country, type, original_price, discounted_price, 
  discount_percentage, capacity, rooms, amenities, images, rating, review_count
) VALUES 
(
  'Tropical Beach House',
  'Experience the ultimate digital nomad lifestyle in our beautiful beachfront co-living space. Located just 5 minutes from Canggu''s famous surf breaks, this tropical paradise offers the perfect blend of work and play.',
  'Canggu, Bali',
  'Indonesia',
  'coliving',
  1200,
  720,
  40,
  12,
  6,
  ARRAY['High-speed WiFi (100+ Mbps)', 'Infinity Pool', 'Coworking Space', 'Surfboard Storage', 'Yoga Deck', 'Communal Kitchen', 'Laundry Service', '24/7 Security'],
  ARRAY[
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80'
  ],
  4.8,
  127
);
