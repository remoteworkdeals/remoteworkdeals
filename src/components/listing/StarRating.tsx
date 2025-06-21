
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
}

/**
 * Displays a 5-star rating with filled/empty stars
 */
export const StarRating = ({ rating, size = 16 }: StarRatingProps) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.floor(rating) ? "text-yellow-500 fill-current" : "text-gray-300"}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
};
