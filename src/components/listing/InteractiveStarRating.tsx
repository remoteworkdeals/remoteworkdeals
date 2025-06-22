
import { Star } from 'lucide-react';

interface InteractiveStarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: 'sm' | 'lg';
}

/**
 * Interactive star rating component for review forms
 */
export const InteractiveStarRating = ({ 
  rating, 
  onRatingChange, 
  size = 'sm' 
}: InteractiveStarRatingProps) => {
  const starSize = size === 'lg' ? 24 : 16;

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="focus:outline-none hover:scale-110 transition-transform"
        >
          <Star
            size={starSize}
            className={
              star <= rating
                ? "text-yellow-500 fill-current"
                : "text-gray-300 hover:text-yellow-400"
            }
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">
        {rating > 0 ? `${rating}/5` : 'Click to rate'}
      </span>
    </div>
  );
};
