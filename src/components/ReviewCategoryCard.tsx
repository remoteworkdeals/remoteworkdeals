
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface ReviewCategoryProps {
  title: string;
  emoji: string;
  rating: number | null;
  notes?: string | null;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const ReviewCategoryCard = ({ title, emoji, rating, notes, isExpanded, onToggle }: ReviewCategoryProps) => {
  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-sm text-gray-400">No rating</span>;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < Math.floor(rating) ? "text-yellow-500 fill-current" : "text-gray-300"}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <h4 className="font-semibold text-gray-800">{title}</h4>
        </div>
        {renderStars(rating)}
      </div>
      
      {notes && isExpanded && (
        <div className="mt-3 p-3 bg-white rounded border-l-4 border-blue-200">
          <p className="text-sm text-gray-600 leading-relaxed">{notes}</p>
        </div>
      )}
      
      {notes && (
        <button
          onClick={onToggle}
          className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          {isExpanded ? 'Hide details' : 'Show details'}
        </button>
      )}
    </div>
  );
};

export default ReviewCategoryCard;
