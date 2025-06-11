
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Listing, Review } from '@/types/listing';
import { useToast } from '@/hooks/use-toast';

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
          setReviews(reviewsData || []);
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
    if (reviews.length === 0) {
      return {
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

    if (validReviews.length === 0) {
      return {
        social: 0,
        work: 0,
        surroundings: 0,
        facilities: 0,
        price: 0
      };
    }

    return {
      social: validReviews.reduce((sum, r) => sum + (r.social_rating || 0), 0) / validReviews.length,
      work: validReviews.reduce((sum, r) => sum + (r.work_rating || 0), 0) / validReviews.length,
      surroundings: validReviews.reduce((sum, r) => sum + (r.surroundings_rating || 0), 0) / validReviews.length,
      facilities: validReviews.reduce((sum, r) => sum + (r.facilities_rating || 0), 0) / validReviews.length,
      price: validReviews.reduce((sum, r) => sum + (r.price_rating || 0), 0) / validReviews.length
    };
  };

  const submitReview = async (reviewData: {
    name: string;
    review: string;
    social: number;
    work: number;
    surroundings: number;
    facilities: number;
    price: number;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to submit a review",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('reviews')
        .insert({
          listing_id: listingId,
          user_id: user.id,
          reviewer_name: reviewData.name || 'Anonymous nomad',
          review_text: reviewData.review,
          social_rating: reviewData.social,
          work_rating: reviewData.work,
          surroundings_rating: reviewData.surroundings,
          facilities_rating: reviewData.facilities,
          price_rating: reviewData.price
        });

      if (error) {
        console.error('Error submitting review:', error);
        toast({
          title: "Error",
          description: "Failed to submit review. You may have already reviewed this listing.",
          variant: "destructive",
        });
        return false;
      }

      // Refresh reviews
      const { data: updatedReviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false });

      if (updatedReviews) {
        setReviews(updatedReviews);
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
