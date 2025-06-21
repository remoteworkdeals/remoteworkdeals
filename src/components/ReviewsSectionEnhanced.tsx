
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Review } from '@/types/listing';
import ReviewCategoryCard from './ReviewCategoryCard';

interface ReviewsSectionEnhancedProps {
  reviews: Review[];
}

const ReviewsSectionEnhanced = ({ reviews }: ReviewsSectionEnhancedProps) => {
  const [showAll, setShowAll] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const toggleCategoryExpansion = (reviewId: string, category: string) => {
    const key = `${reviewId}-${category}`;
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedCategories(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAverageRatings = () => {
    if (reviews.length === 0) return null;

    const validReviews = reviews.filter(review => 
      review.social_rating && review.work_rating && 
      review.surroundings_rating && review.facilities_rating && 
      review.price_rating
    );

    if (validReviews.length === 0) return null;

    return {
      social: validReviews.reduce((sum, r) => sum + (r.social_rating || 0), 0) / validReviews.length,
      work: validReviews.reduce((sum, r) => sum + (r.work_rating || 0), 0) / validReviews.length,
      surroundings: validReviews.reduce((sum, r) => sum + (r.surroundings_rating || 0), 0) / validReviews.length,
      facilities: validReviews.reduce((sum, r) => sum + (r.facilities_rating || 0), 0) / validReviews.length,
      price: validReviews.reduce((sum, r) => sum + (r.price_rating || 0), 0) / validReviews.length
    };
  };

  const averageRatings = calculateAverageRatings();

  if (!reviews || reviews.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-forest-green flex items-center gap-2">
            💬 Community Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">🌟</div>
            <p className="text-gray-600 text-lg mb-2">No reviews yet!</p>
            <p className="text-gray-500">Be the first to share your experience with fellow nomads.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-serif text-forest-green flex items-center gap-2">
          💬 Community Reviews ({reviews.length})
        </CardTitle>
        
        {averageRatings && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">📊 Average Ratings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ReviewCategoryCard
                title="Social & Community"
                emoji="👥"
                rating={averageRatings.social}
              />
              <ReviewCategoryCard
                title="Work & WiFi"
                emoji="💻"
                rating={averageRatings.work}
              />
              <ReviewCategoryCard
                title="Surroundings"
                emoji="🏞️"
                rating={averageRatings.surroundings}
              />
              <ReviewCategoryCard
                title="Facilities"
                emoji="🏠"
                rating={averageRatings.facilities}
              />
              <ReviewCategoryCard
                title="Price & Value"
                emoji="💰"
                rating={averageRatings.price}
              />
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-8">
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">✍️ Individual Reviews</h3>
          
          {displayedReviews.map((review, index) => (
            <div key={review.id} className={`${index !== displayedReviews.length - 1 ? 'border-b border-gray-200 pb-8 mb-8' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">
                    {review.reviewer_name || 'Anonymous nomad'}
                  </h4>
                  <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                </div>
                {review.overall_rating && (
                  <div className="text-right bg-blue-50 px-3 py-2 rounded-lg">
                    <div className="text-xs font-medium text-gray-600 mb-1">Overall Experience</div>
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-blue-600 mr-1">{review.overall_rating}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </div>
                )}
              </div>

              {review.review_text && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-200">
                  <p className="text-gray-700 leading-relaxed italic">"{review.review_text}"</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ReviewCategoryCard
                  title="Social & Community"
                  emoji="👥"
                  rating={review.social_rating}
                  notes={review.social_notes}
                  isExpanded={expandedCategories.has(`${review.id}-social`)}
                  onToggle={() => toggleCategoryExpansion(review.id, 'social')}
                />
                <ReviewCategoryCard
                  title="Work & WiFi"
                  emoji="💻"
                  rating={review.work_rating}
                  notes={review.work_notes}
                  isExpanded={expandedCategories.has(`${review.id}-work`)}
                  onToggle={() => toggleCategoryExpansion(review.id, 'work')}
                />
                <ReviewCategoryCard
                  title="Surroundings"
                  emoji="🏞️"
                  rating={review.surroundings_rating}
                  notes={review.surroundings_notes}
                  isExpanded={expandedCategories.has(`${review.id}-surroundings`)}
                  onToggle={() => toggleCategoryExpansion(review.id, 'surroundings')}
                />
                <ReviewCategoryCard
                  title="Facilities"
                  emoji="🏠"
                  rating={review.facilities_rating}
                  notes={review.facilities_notes}
                  isExpanded={expandedCategories.has(`${review.id}-facilities`)}
                  onToggle={() => toggleCategoryExpansion(review.id, 'facilities')}
                />
                <ReviewCategoryCard
                  title="Price & Value"
                  emoji="💰"
                  rating={review.price_rating}
                  notes={review.price_notes}
                  isExpanded={expandedCategories.has(`${review.id}-price`)}
                  onToggle={() => toggleCategoryExpansion(review.id, 'price')}
                />
              </div>
            </div>
          ))}
        </div>

        {reviews.length > 3 && (
          <div className="text-center pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="adventure-button px-8"
            >
              {showAll ? '📤 Show Less' : `📥 Show All ${reviews.length} Reviews`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsSectionEnhanced;
