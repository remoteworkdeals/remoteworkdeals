
import { useState, useEffect } from 'react';
import { Listing, Review } from '@/types/listing';
import { useToast } from '@/hooks/use-toast';
import { ReviewSubmissionData } from '@/components/ReviewForm';
import { fetchListingWithReviews, calculateAverageRatings, submitListingReview } from '@/services/listingService';

export const useListingData = (listingId: number) => {
  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadListingData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchListingWithReviews(listingId);
        
        if (result.error) {
          setError(result.error);
          toast({
            title: "Error",
            description: "Failed to load listing data",
            variant: "destructive",
          });
          return;
        }

        setListing(result.listing);
        setReviews(result.reviews);
      } catch (err) {
        console.error('Unexpected error loading listing:', err);
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
      loadListingData();
    }
  }, [listingId, toast]);

  const averageRatings = calculateAverageRatings(reviews);

  const submitReview = async (reviewData: ReviewSubmissionData): Promise<boolean> => {
    const result = await submitListingReview(listingId, reviewData);
    
    if (result.success) {
      // Refresh data after successful submission
      setReviews(result.updatedReviews || []);
      if (result.updatedListing) {
        setListing(result.updatedListing);
      }
      
      toast({
        title: "Success",
        description: "Your review has been submitted!",
      });
      return true;
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to submit review",
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
    averageRatings,
    submitReview
  };
};
