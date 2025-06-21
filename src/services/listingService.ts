
import { supabase } from '@/integrations/supabase/client';
import { Listing, Review } from '@/types/listing';
import { ReviewSubmissionData } from '@/components/ReviewForm';

/**
 * Generates a valid UUID for anonymous users
 */
const generateAnonymousUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Transforms raw listing data to match the Listing type
 */
const transformListingData = (rawData: any): Listing => {
  return {
    ...rawData,
    pricing_unit: rawData.pricing_unit || 'night',
    minimum_stay: rawData.minimum_stay || null,
    minimum_stay_unit: rawData.minimum_stay_unit || 'nights'
  };
};

/**
 * Calculates average ratings from reviews array
 */
export const calculateAverageRatings = (reviews: Review[]) => {
  console.log('Calculating average ratings from', reviews.length, 'reviews');
  
  if (reviews.length === 0) {
    return {
      overall: 0,
      social: 0,
      work: 0,
      surroundings: 0,
      facilities: 0,
      price: 0
    };
  }

  const validReviews = reviews.filter(review => 
    review.social_rating && review.work_rating && 
    review.surroundings_rating && review.facilities_rating && 
    review.price_rating
  );

  const overallRatings = reviews
    .map(r => r.overall_rating)
    .filter(rating => rating !== null) as number[];

  console.log('Valid reviews for detailed ratings:', validReviews.length);
  console.log('Overall ratings:', overallRatings);

  if (validReviews.length === 0 && overallRatings.length === 0) {
    return {
      overall: 0,
      social: 0,
      work: 0,
      surroundings: 0,
      facilities: 0,
      price: 0
    };
  }

  const result = {
    overall: overallRatings.length > 0 ? overallRatings.reduce((sum, r) => sum + r, 0) / overallRatings.length : 0,
    social: validReviews.length > 0 ? validReviews.reduce((sum, r) => sum + (r.social_rating || 0), 0) / validReviews.length : 0,
    work: validReviews.length > 0 ? validReviews.reduce((sum, r) => sum + (r.work_rating || 0), 0) / validReviews.length : 0,
    surroundings: validReviews.length > 0 ? validReviews.reduce((sum, r) => sum + (r.surroundings_rating || 0), 0) / validReviews.length : 0,
    facilities: validReviews.length > 0 ? validReviews.reduce((sum, r) => sum + (r.facilities_rating || 0), 0) / validReviews.length : 0,
    price: validReviews.length > 0 ? validReviews.reduce((sum, r) => sum + (r.price_rating || 0), 0) / validReviews.length : 0
  };

  console.log('Calculated average ratings:', result);
  return result;
};

/**
 * Updates listing rating and review count in database
 */
const updateListingRatings = async (listingId: number, reviews: Review[]): Promise<Listing | null> => {
  const overallRatings = reviews
    .map(r => r.overall_rating)
    .filter(rating => rating !== null) as number[];
  
  if (overallRatings.length === 0) return null;

  const averageRating = overallRatings.reduce((sum, rating) => sum + rating, 0) / overallRatings.length;
  
  const { data, error } = await supabase
    .from('listings')
    .update({ 
      rating: Number(averageRating.toFixed(1)), 
      review_count: reviews.length 
    })
    .eq('id', listingId)
    .select()
    .single();

  if (error) {
    console.error('Error updating listing ratings:', error);
    return null;
  }

  return data ? transformListingData(data) : null;
};

/**
 * Fetches listing data along with its reviews
 */
export const fetchListingWithReviews = async (listingId: number) => {
  try {
    // Fetch listing data
    const { data: listingData, error: listingError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .eq('status', 'active')
      .single();

    if (listingError) {
      console.error('Error fetching listing:', listingError);
      return { error: 'Listing not found' };
    }

    const transformedListing = transformListingData(listingData);

    // Fetch reviews for this listing
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false });

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      return { 
        listing: transformedListing, 
        reviews: [], 
        error: null 
      };
    }

    const reviews = reviewsData || [];
    console.log('Fetched reviews:', reviews);
    
    // Update listing rating and review count if we have reviews
    if (reviews.length > 0) {
      const updatedListing = await updateListingRatings(listingId, reviews);
      return {
        listing: updatedListing || transformedListing,
        reviews,
        error: null
      };
    }

    return {
      listing: transformedListing,
      reviews,
      error: null
    };
  } catch (err) {
    console.error('Unexpected error fetching listing data:', err);
    return { error: 'An unexpected error occurred' };
  }
};

/**
 * Submits a new review for a listing
 */
export const submitListingReview = async (
  listingId: number, 
  reviewData: ReviewSubmissionData
) => {
  try {
    console.log('=== REVIEW SUBMISSION DEBUG ===');
    console.log('Attempting to submit review:', reviewData);
    console.log('Target listing ID:', listingId);
    
    // Verify the listing exists
    const { data: listingCheck, error: listingCheckError } = await supabase
      .from('listings')
      .select('id, title')
      .eq('id', listingId)
      .single();
      
    if (listingCheckError) {
      console.error('Listing verification failed:', listingCheckError);
      return { 
        success: false, 
        error: 'Invalid listing. Please refresh and try again.' 
      };
    }
    
    console.log('Listing verified:', listingCheck);
    
    const anonymousUserId = generateAnonymousUUID();
    console.log('Generated anonymous user ID:', anonymousUserId);

    const reviewPayload = {
      listing_id: listingId,
      user_id: anonymousUserId,
      reviewer_name: reviewData.name || 'Anonymous nomad',
      review_text: reviewData.review,
      overall_rating: reviewData.overall,
      social_rating: reviewData.social,
      work_rating: reviewData.work,
      surroundings_rating: reviewData.surroundings,
      facilities_rating: reviewData.facilities,
      price_rating: reviewData.price,
      social_notes: reviewData.socialNotes || null,
      work_notes: reviewData.workNotes || null,
      surroundings_notes: reviewData.surroundingsNotes || null,
      facilities_notes: reviewData.facilitiesNotes || null,
      price_notes: reviewData.priceNotes || null
    };

    console.log('Final review payload:', reviewPayload);

    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewPayload)
      .select();

    if (error) {
      console.error('=== SUPABASE ERROR DETAILS ===');
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      
      return { 
        success: false, 
        error: `Failed to submit review: ${error.message}` 
      };
    }

    console.log('✅ Review submitted successfully:', data);

    // Fetch updated reviews
    const { data: updatedReviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false });

    // Update listing ratings
    let updatedListing = null;
    if (updatedReviews && updatedReviews.length > 0) {
      updatedListing = await updateListingRatings(listingId, updatedReviews);
    }

    return {
      success: true,
      updatedReviews: updatedReviews || [],
      updatedListing
    };
  } catch (err) {
    console.error('=== UNEXPECTED ERROR ===');
    console.error('Unexpected error submitting review:', err);
    return { 
      success: false, 
      error: 'An unexpected error occurred' 
    };
  }
};
