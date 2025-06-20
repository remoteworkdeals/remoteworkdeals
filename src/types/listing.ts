
export interface Listing {
  id: number;
  title: string;
  description: string | null;
  location: string;
  country: string;
  type: 'coliving' | 'coworking' | 'apartment' | 'house';
  status: 'active' | 'inactive' | 'pending';
  original_price: number;
  discounted_price: number | null;
  discount_percentage: number | null;
  discount_code_url: string | null;
  capacity: number | null;
  rooms: number | null;
  amenities: string[] | null;
  images: string[] | null;
  featured_image: string | null;
  is_seasonal: boolean | null;
  seasonal_start_date: string | null;
  seasonal_end_date: string | null;
  rating: number | null;
  review_count: number | null;
  website_url: string | null;
  instagram_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  listing_id: number;
  user_id: string;
  reviewer_name: string | null;
  review_text: string | null;
  overall_rating: number | null;
  social_rating: number | null;
  work_rating: number | null;
  surroundings_rating: number | null;
  facilities_rating: number | null;
  price_rating: number | null;
  social_notes: string | null;
  work_notes: string | null;
  surroundings_notes: string | null;
  facilities_notes: string | null;
  price_notes: string | null;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  featured_image_alt: string | null;
  author: string;
  category: string;
  status: string | null;
  featured: boolean | null;
  read_time: string | null;
  linked_listings: number[] | null;
  created_at: string;
  updated_at: string;
}
