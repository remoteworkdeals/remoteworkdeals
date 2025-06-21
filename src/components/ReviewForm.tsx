
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ReviewFormProps {
  onSubmit: (reviewData: ReviewSubmissionData) => Promise<boolean>;
}

export interface ReviewSubmissionData {
  name: string;
  review: string;
  overall: number;
  social: number;
  work: number;
  surroundings: number;
  facilities: number;
  price: number;
  socialNotes: string;
  workNotes: string;
  surroundingsNotes: string;
  facilitiesNotes: string;
  priceNotes: string;
}

/**
 * Mobile-optimized review form component
 * Allows users to submit detailed reviews with category ratings
 */
const ReviewForm = ({ onSubmit }: ReviewFormProps) => {
  const [reviewData, setReviewData] = useState<ReviewSubmissionData>({
    name: '',
    review: '',
    overall: 5,
    social: 5,
    work: 5,
    surroundings: 5,
    facilities: 5,
    price: 5,
    socialNotes: '',
    workNotes: '',
    surroundingsNotes: '',
    facilitiesNotes: '',
    priceNotes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(reviewData);
    
    if (success) {
      setReviewData({
        name: '',
        review: '',
        overall: 5,
        social: 5,
        work: 5,
        surroundings: 5,
        facilities: 5,
        price: 5,
        socialNotes: '',
        workNotes: '',
        surroundingsNotes: '',
        facilitiesNotes: '',
        priceNotes: ''
      });
    }
  };

  const categories = [
    { key: 'work', label: 'Work & WiFi', description: 'Internet quality and work environment' },
    { key: 'social', label: 'Community & Social', description: 'Social atmosphere and community' },
    { key: 'facilities', label: 'Comfort & Living', description: 'Living comfort and facilities' },
    { key: 'surroundings', label: 'Location & Surroundings', description: 'Location and neighborhood' },
    { key: 'price', label: 'Price & Value', description: 'Value for money' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-serif text-forest-green">Leave a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info - Mobile optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Label htmlFor="name" className="text-sm sm:text-base">Your Name (optional)</Label>
              <Input
                id="name"
                value={reviewData.name}
                onChange={(e) => setReviewData({...reviewData, name: e.target.value})}
                placeholder="Anonymous nomad"
                className="mt-1 h-11 sm:h-12"
              />
            </div>
            
            <div className="sm:col-span-1">
              <Label className="text-sm sm:text-base">Overall Experience</Label>
              <Textarea
                value={reviewData.review}
                onChange={(e) => setReviewData({...reviewData, review: e.target.value})}
                placeholder="Share your overall experience with fellow nomads..."
                className="mt-1 min-h-[80px] sm:min-h-[100px]"
              />
            </div>
          </div>

          {/* Overall Experience Rating - Mandatory */}
          <div className="border rounded-lg p-4 sm:p-6 bg-blue-50">
            <Label className="text-base sm:text-lg font-semibold mb-4 block text-blue-900">
              Overall Experience Rating (Required) *
            </Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Label className="text-sm font-medium">Rate your overall experience:</Label>
              <select
                value={reviewData.overall}
                onChange={(e) => setReviewData({
                  ...reviewData,
                  overall: parseInt(e.target.value)
                })}
                className="p-3 sm:p-2 border rounded-md bg-white text-base sm:text-sm w-full sm:w-auto"
                required
              >
                {[1,2,3,4,5].map(num => (
                  <option key={num} value={num}>{num} star{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Category Ratings - Mobile optimized */}
          <div>
            <Label className="text-base sm:text-lg font-semibold mb-4 block">Rate each category (1-5 stars)</Label>
            <div className="space-y-4 sm:space-y-6">
              {categories.map((category) => (
                <div key={category.key} className="border rounded-lg p-4 sm:p-6 bg-gray-50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label className="text-sm sm:text-base font-medium mb-2 block">
                        {category.label}
                      </Label>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">
                        {category.description}
                      </p>
                      <select
                        value={reviewData[category.key as keyof ReviewSubmissionData] as number}
                        onChange={(e) => setReviewData({
                          ...reviewData,
                          [category.key]: parseInt(e.target.value)
                        })}
                        className="w-full p-3 sm:p-2 border rounded-md text-base sm:text-sm"
                      >
                        {[1,2,3,4,5].map(num => (
                          <option key={num} value={num}>{num} star{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label className="text-sm sm:text-base font-medium mb-2 block">
                        Additional Notes (optional)
                      </Label>
                      <Textarea
                        value={reviewData[`${category.key}Notes` as keyof ReviewSubmissionData] as string}
                        onChange={(e) => setReviewData({
                          ...reviewData,
                          [`${category.key}Notes`]: e.target.value
                        })}
                        placeholder={`Any specific feedback about ${category.label.toLowerCase()}...`}
                        className="h-16 sm:h-20 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button type="submit" className="adventure-button w-full sm:w-auto py-3 px-8 text-base">
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
