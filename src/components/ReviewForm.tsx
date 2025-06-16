
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

const ReviewForm = ({ onSubmit }: ReviewFormProps) => {
  const [reviewData, setReviewData] = useState<ReviewSubmissionData>({
    name: '',
    review: '',
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
    { key: 'social', label: 'Social', description: 'Community and social atmosphere' },
    { key: 'work', label: 'Work/WiFi', description: 'Work environment and internet quality' },
    { key: 'surroundings', label: 'Surroundings', description: 'Location and neighborhood' },
    { key: 'facilities', label: 'Facilities', description: 'Amenities and infrastructure' },
    { key: 'price', label: 'Price', description: 'Value for money' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-serif text-forest-green">Leave a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Your Name (optional)</Label>
              <Input
                id="name"
                value={reviewData.name}
                onChange={(e) => setReviewData({...reviewData, name: e.target.value})}
                placeholder="Anonymous nomad"
              />
            </div>
            
            <div>
              <Label>Overall Experience</Label>
              <Textarea
                value={reviewData.review}
                onChange={(e) => setReviewData({...reviewData, review: e.target.value})}
                placeholder="Share your overall experience with fellow nomads..."
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-base font-semibold mb-4 block">Rate each category (1-5 stars)</Label>
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category.key} className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        {category.label}
                      </Label>
                      <p className="text-xs text-gray-600 mb-2">{category.description}</p>
                      <select
                        value={reviewData[category.key as keyof ReviewSubmissionData] as number}
                        onChange={(e) => setReviewData({
                          ...reviewData,
                          [category.key]: parseInt(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                      >
                        {[1,2,3,4,5].map(num => (
                          <option key={num} value={num}>{num} star{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Additional Notes (optional)
                      </Label>
                      <Textarea
                        value={reviewData[`${category.key}Notes` as keyof ReviewSubmissionData] as string}
                        onChange={(e) => setReviewData({
                          ...reviewData,
                          [`${category.key}Notes`]: e.target.value
                        })}
                        placeholder={`Any specific feedback about ${category.label.toLowerCase()}...`}
                        className="h-20"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button type="submit" className="adventure-button">
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
