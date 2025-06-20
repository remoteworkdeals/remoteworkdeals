
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Listing, Review } from '@/types/listing';
import { useToast } from '@/hooks/use-toast';
import { ReviewSubmissionData } from '@/components/ReviewForm';

export const useListingData = (listingId: number) => {
  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        
        const { data: listingData, error: listingError } = await supabase
          .from('listings')
          .select('*')
          .eq('id', listingId)
          .eq('status', 'active')
          .single();

        if (listingError) {
          console.error('Error fetching listing:', listingError);
          setError('Listing not found');
          return;
        }

        setListing(listingData);

        // Fetch reviews for this listing
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('listing_id', listingId)
          .order('created_at', { ascending: false });

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
        } else {
          console.log('Fetched reviews:', reviewsData);
          setReviews(reviewsData || []);
          
          // Update listing rating and review count based on reviews
          if (reviewsData && reviewsData.length > 0) {
            const overallRatings = reviewsData
              .map(r => r.overall_rating)
              .filter(rating => rating !== null) as number[];
            
            if (overallRatings.length > 0) {
              const averageRating = overallRatings.reduce((sum, rating) => sum + rating, 0) / overallRatings.length;
              
              // Update the listing in the database with calculated values
              await supabase
                .from('listings')
                .update({ 
                  rating: Number(averageRating.toFixed(1)), 
                  review_count: reviewsData.length 
                })
                .eq('id', listingId);

              // Update local state
              setListing(prev => prev ? { 
                ...prev, 
                rating: Number(averageRating.toFixed(1)), 
                review_count: reviewsData.length 
              } : null);
            }
          }
        }

      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
        toast({
          title: "Error",
          description: "Failed to load listing data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      fetchListing();
    }
  }, [listingId, toast]);

  const calculateAverageRatings = () => {
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
      work: validReviews.length > 0 ? validReviews.reduce((sum, r) => sum + (r.work_rating || 0), 0) / validRevi

ews.length : 0,
      surroundings: validReviews.length > 0 ? validReviews.reduce((sum, r) => sum + (r.surroundings_rating || 0), 0) / validReviews.length : 0,
      facilities: validReviews.length > 0 ? validReviews.reduce((sum, r) => sum + (r.facilities_rating || 0), 0) / validReviews.length : 0,
      price: validReviews.length > 0 ? validReviews.reduce((sum, r) => sum + (r.price_rating || 0), 0) / validReviews.length : 0
    };

    console.log('Calculated average ratings:', result);
    return result;
  };

  const submitReview = async (reviewData: ReviewSubmissionData) => {
    try {
      console.log('Attempting to submit review:', reviewData);
      
      // For now, we'll create reviews without requiring authentication
      // Generate a simple user ID for anonymous reviews
      const anonymousUserId = 'anonymous-' + Math.random().toString(36).substr(2, 9);

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

      console.log('Review payload:', reviewPayload);

      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewPayload)
        .select();

      if (error) {
        console.error('Error submitting review:', error);
        toast({
          title: "Error",
          description: "Failed to submit review. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      console.log('Review submitted successfully:', data);

      // Refresh reviews and recalculate ratings
      const { data: updatedReviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false });

      if (updatedReviews) {
        console.log('Updated reviews after submission:', updatedReviews);
        setReviews(updatedReviews);
        
        // Recalculate and update listing rating
        const overallRatings = updatedReviews
          .map(r => r.overall_rating)
          .filter(rating => rating !== null) as number[];
        
        if (overallRatings.length > 0) {
          const averageRating = overallRatings.reduce((sum, rating) => sum + rating, 0) / overallRatings.length;
          
          await supabase
            .from('listings')
            .update({ 
              rating: Number(averageRating.toFixed(1)), 
              review_count: updatedReviews.length 
            })
            .eq('id', listingId);

          setListing(prev => prev ? { 
            ...prev, 
            rating: Number(averageRating.toFixed(1)), 
            review_count: updatedReviews.length 
          } : null);
        }
      }

      toast({
        title: "Success",
        description: "Your review has been submitted!",
      });

      return true;
    } catch (err) {
      console.error('Unexpected error submitting review:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    listing,
    reviews,
    loading,
    error,
    averageRatings: calculateAverageRatings(),
    submitReview
  };
};
