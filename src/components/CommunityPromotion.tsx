
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle } from 'lucide-react';
import { useCommunityForm } from '@/hooks/useCommunityForm';

const CommunityPromotion = () => {
  const { form, isSubmitting, onSubmit } = useCommunityForm({ source: 'community_promotion' });
  const { register, formState: { errors } } = form;

  return (
    <Card className="max-w-4xl mx-auto card-shadow">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-serif text-forest-green mb-4">
          Ready to Join the Community?
        </CardTitle>
        <p className="text-xl text-gray-600">
          It's completely free and takes less than 30 seconds. Start saving today!
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="text-base font-semibold">Full Name</Label>
              <Input
                id="name"
                type="text"
                {...register('name')}
                placeholder="Your full name"
                className="mt-2 h-12"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="email" className="text-base font-semibold">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="your@email.com"
                className="mt-2 h-12"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              type="submit" 
              className="adventure-button text-lg px-8 py-4 max-w-xs w-full sm:w-auto"
              disabled={isSubmitting}
            >
              <MessageCircle className="mr-2" size={20} />
              {isSubmitting ? 'Joining...' : 'Join the Community (Free)'}
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              By joining, you agree to receive exclusive deals and community updates. 
              Unsubscribe anytime.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommunityPromotion;
