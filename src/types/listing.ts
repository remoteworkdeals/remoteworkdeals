
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
  capacity: number | null;
  rooms: number | null;
  amenities: string[] | null;
  images: string[] | null;
  rating: number | null;
  review_count: number | null;
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
  social_rating: number | null;
  work_rating: number | null;
  surroundings_rating: number | null;
  facilities_rating: number | null;
  price_rating: number | null;
  created_at: string;
}
