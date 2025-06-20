
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
    <Card className="bg-gradient-to-r from-forest-green to-adventure-orange text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-serif text-white flex items-center gap-2">
          <Users size={24} />
          Join the RemoteWork.Deals Community
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Get Exclusive Benefits:</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-yellow-300" />
                <span>Early access to flash deals & discounts</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-yellow-300" />
                <span>Last-minute booking opportunities</span>
              </div>
              <div className="flex items-center gap-3">
                <ArrowRight className="w-5 h-5 text-yellow-300" />
                <span>Content-for-discount collaborations</span>
              </div>
            </div>
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-white text-gray-900"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-white">Phone Number (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="bg-white text-gray-900"
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  className="bg-white text-forest-green hover:bg-gray-100 flex-1"
                >
                  Join Community
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-forest-green"
                  onClick={() => navigate('/exclusive-deals')}
                >
                  Learn More
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityPromotion;
