
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Gift, MessageCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const CommunityPromotion = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) =>  {
    e.preventDefault();
    if (email) {
      toast({
        title: "Thanks for joining!",
        description: "We'll be in touch with exclusive deals soon.",
      });
      setEmail('');
      setPhone('');
    }
  };

  return (
    <Card className="border-2 border-forest-green bg-white shadow-lg">
      <CardHeader className="bg-forest-green text-white">
        <CardTitle className="text-2xl font-serif text-white flex items-center gap-2">
          <Users size={24} />
          Join the RemoteWork.Deals Community
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-6 text-forest-green">Get Exclusive Benefits:</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border-l-4 border-adventure-orange">
                <Gift className="w-6 h-6 text-adventure-orange mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900">Early Access to Flash Deals</h4>
                  <p className="text-sm text-gray-600">Be the first to know about limited-time discounts</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-forest-green">
                <MessageCircle className="w-6 h-6 text-forest-green mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900">Last-Minute Opportunities</h4>
                  <p className="text-sm text-gray-600">Grab amazing deals on short notice</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border-l-4 border-adventure-orange">
                <ArrowRight className="w-6 h-6 text-adventure-orange mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900">Content-for-Discount Collabs</h4>
                  <p className="text-sm text-gray-600">Share your experience for special pricing</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-l-2 border-gray-100 pl-8">
            <h3 className="text-xl font-semibold mb-6 text-forest-green">Ready to Save?</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="mt-2 border-gray-300 focus:border-forest-green focus:ring-forest-green"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="mt-2 border-gray-300 focus:border-forest-green focus:ring-forest-green"
                />
              </div>
              
              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="bg-adventure-orange hover:bg-adventure-orange/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Join Community for Free
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  className="border-forest-green text-forest-green hover:bg-forest-green hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  onClick={() => navigate('/exclusive-deals')}
                >
                  Learn More About Benefits
                </Button>
              </div>
            </form>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityPromotion;
