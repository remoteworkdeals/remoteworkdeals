
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { StarRating } from './listing/StarRating';
import { submitListingReview } from '@/services/listingService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export interface ReviewSubmissionData {
  name: string;
  review: string;
  overall: number;
  social: number;
  work: number;
  surroundings: number;
  facilities: number;
  price: number;
  socialNotes?: string;
  workNotes?: string;
  surroundingsNotes?: string;
  facilitiesNotes?: string;
  priceNotes?: string;
}

interface ReviewFormProps {
  listingId: number;
  listingTitle: string;
  onReviewSubmitted: (updatedReviews: any[], updatedListing?: any) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ 
  listingId, 
  listingTitle, 
  onReviewSubmitted 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [overall, setOverall] = useState(0);
  const [social, setSocial] = useState(0);
  const [work, setWork] = useState(0);
  const [surroundings, setSurroundings] = useState(0);
  const [facilities, setFacilities] = useState(0);
  const [price, setPrice] = useState(0);
  const [socialNotes, setSocialNotes] = useState('');
  const [workNotes, setWorkNotes] = useState('');
  const [surroundingsNotes, setSurroundingsNotes] = useState('');
  const [facilitiesNotes, setFacilitiesNotes] = useState('');
  const [priceNotes, setPriceNotes] = useState('');

  // If user is not authenticated, show login prompt
  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-serif">Write a Review</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-600 mb-4">
            You need to be logged in to write a review for {listingTitle}.
          </p>
          <Button 
            onClick={() => navigate('/auth')} 
            className="adventure-button"
          >
            Sign In to Write Review
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!overall || !social || !work || !surroundings || !facilities || !price) {
      toast({
        title: 'Missing ratings',
        description: 'Please provide ratings for all categories.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const reviewData: ReviewSubmissionData = {
      name: name.trim() || 'Anonymous nomad',
      review: review.trim(),
      overall,
      social,
      work,
      surroundings,
      facilities,
      price,
      socialNotes: socialNotes.trim() || undefined,
      workNotes: workNotes.trim() || undefined,
      surroundingsNotes: surroundingsNotes.trim() || undefined,
      facilitiesNotes: facilitiesNotes.trim() || undefined,
      priceNotes: priceNotes.trim() || undefined,
    };

    try {
      const result = await submitListingReview(listingId, reviewData);
      
      if (result.success) {
        toast({
          title: 'Review submitted successfully!',
          description: 'Thank you for sharing your experience.',
        });
        
        // Reset form
        setName('');
        setReview('');
        setOverall(0);
        setSocial(0);
        setWork(0);
        setSurroundings(0);
        setFacilities(0);
        setPrice(0);
        setSocialNotes('');
        setWorkNotes('');
        setSurroundingsNotes('');
        setFacilitiesNotes('');
        setPriceNotes('');
        
        // Notify parent component
        onReviewSubmitted(result.updatedReviews, result.updatedListing);
      } else {
        toast({
          title: 'Failed to submit review',
          description: result.error || 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error submitting review',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-serif">Share Your Experience</CardTitle>
        <p className="text-gray-600">Help other digital nomads by reviewing {listingTitle}</p>
        <Badge variant="outline" className="w-fit">
          Signed in as: {user.email}
        </Badge>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name (optional)
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How should we display your name?"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience staying at this coliving space..."
              rows={4}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Rate Your Experience</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Experience *
                </label>
                <StarRating 
                  rating={overall} 
                  onRatingChange={setOverall}
                  size="lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social & Community *
                </label>
                <StarRating 
                  rating={social} 
                  onRatingChange={setSocial}
                  size="lg"
                />
                <Input
                  type="text"
                  value={socialNotes}
                  onChange={(e) => setSocialNotes(e.target.value)}
                  placeholder="Quick note about the community..."
                  className="mt-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work & WiFi *
                </label>
                <StarRating 
                  rating={work} 
                  onRatingChange={setWork}
                  size="lg"
                />
                <Input
                  type="text"
                  value={workNotes}
                  onChange={(e) => setWorkNotes(e.target.value)}
                  placeholder="Quick note about work setup..."
                  className="mt-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location & Surroundings *
                </label>
                <StarRating 
                  rating={surroundings} 
                  onRatingChange={setSurroundings}
                  size="lg"
                />
                <Input
                  type="text"
                  value={surroundingsNotes}
                  onChange={(e) => setSurroundingsNotes(e.target.value)}
                  placeholder="Quick note about the location..."
                  className="mt-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facilities & Comfort *
                </label>
                <StarRating 
                  rating={facilities} 
                  onRatingChange={setFacilities}
                  size="lg"
                />
                <Input
                  type="text"
                  value={facilitiesNotes}
                  onChange={(e) => setFacilitiesNotes(e.target.value)}
                  placeholder="Quick note about facilities..."
                  className="mt-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price & Value *
                </label>
                <StarRating 
                  rating={price} 
                  onRatingChange={setPrice}
                  size="lg"
                />
                <Input
                  type="text"
                  value={priceNotes}
                  onChange={(e) => setPriceNotes(e.target.value)}
                  placeholder="Quick note about value for money..."
                  className="mt-2 text-sm"
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="adventure-button w-full"
          >
            {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
