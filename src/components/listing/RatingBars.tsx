
interface RatingBarsProps {
  averageRatings: {
    overall: number;
    social: number;
    work: number;
    surroundings: number;
    facilities: number;
    price: number;
  };
}

/**
 * Component to display rating bars for different categories
 */
export const RatingBars = ({ averageRatings }: RatingBarsProps) => {
  const renderRatingBar = (category: string, rating: number) => {
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
          <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-adventure-orange h-2 rounded-full"
            style={{ width: `${(rating / 5) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-serif font-bold text-forest-green mb-6">Community Ratings</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          {averageRatings.overall > 0 && renderRatingBar('overall experience', averageRatings.overall)}
          {renderRatingBar('work & wifi', averageRatings.work)}
          {renderRatingBar('community & social', averageRatings.social)}
        </div>
        <div>
          {renderRatingBar('comfort & living', averageRatings.facilities)}
          {renderRatingBar('location & surroundings', averageRatings.surroundings)}
          {renderRatingBar('price & value', averageRatings.price)}
        </div>
      </div>
    </div>
  );
};
