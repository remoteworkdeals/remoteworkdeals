
import { useState } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Review } from '@/types/listing';

interface ReviewsSectionProps {
  reviews: Review[];
}

const ReviewsSection = ({ reviews }: ReviewsSectionProps) => {
  const [showAll, setShowAll] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  console.log('ReviewsSection received reviews:', reviews);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < Math.floor(rating) ? "text-yellow-500 fill-current" : "text-gray-300"}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const toggleReviewExpansion = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  console.log('Reviews length check:', reviews.length);

  if (!reviews || reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-forest-green">Community Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">
            No reviews yet. Be the first to share your experience!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-serif text-forest-green">
          Community Reviews ({reviews.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {displayedReviews.map((review) => {
          console.log('Rendering review:', review);
          const isExpanded = expandedReviews.has(review.id);
          const hasNotes = review.social_notes || review.work_notes || review.surroundings_notes || 
                          review.facilities_notes || review.price_notes;
          
          return (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {review.reviewer_name || 'Anonymous nomad'}
                  </h4>
                  <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                </div>
                {review.overall_rating && (
                  <div className="text-right">
                    <div className="text-xs font-medium text-gray-600 mb-1">Overall Experience</div>
                    {renderStars(review.overall_rating)}
                  </div>
                )}
              </div>

              {review.review_text && (
                <p className="text-gray-700 mb-4 leading-relaxed">{review.review_text}</p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600 mb-1">Social</div>
                  {renderStars(review.social_rating)}
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600 mb-1">Work/WiFi</div>
                  {renderStars(review.work_rating)}
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600 mb-1">Surroundings</div>
                  {renderStars(review.surroundings_rating)}
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600 mb-1">Facilities</div>
                  {renderStars(review.facilities_rating)}
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600 mb-1">Price</div>
                  {renderStars(review.price_rating)}
                </div>
              </div>

              {hasNotes && (
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleReviewExpansion(review.id)}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp size={16} className="mr-1" />
                        Hide detailed feedback
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} className="mr-1" />
                        View detailed feedback
                      </>
                    )}
                  </Button>

                  {isExpanded && (
                    <div className="mt-3 space-y-3 bg-gray-50 p-4 rounded-lg">
                      {review.social_notes && (
                        <div>
                          <Badge variant="outline" className="text-xs mb-1">Social</Badge>
                          <p className="text-sm text-gray-700">{review.social_notes}</p>
                        </div>
                      )}
                      {review.work_notes && (
                        <div>
                          <Badge variant="outline" className="text-xs mb-1">Work/WiFi</Badge>
                          <p className="text-sm text-gray-700">{review.work_notes}</p>
                        </div>
                      )}
                      {review.surroundings_notes && (
                        <div>
                          <Badge variant="outline" className="text-xs mb-1">Surroundings</Badge>
                          <p className="text-sm text-gray-700">{review.surroundings_notes}</p>
                        </div>
                      )}
                      {review.facilities_notes && (
                        <div>
                          <Badge variant="outline" className="text-xs mb-1">Facilities</Badge>
                          <p className="text-sm text-gray-700">{review.facilities_notes}</p>
                        </div>
                      )}
                      {review.price_notes && (
                        <div>
                          <Badge variant="outline" className="text-xs mb-1">Price</Badge>
                          <p className="text-sm text-gray-700">{review.price_notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {reviews.length > 3 && (
          <div className="text-center pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="adventure-button"
            >
              {showAll ? 'Show Less' : `Show All ${reviews.length} Reviews`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsSection;
