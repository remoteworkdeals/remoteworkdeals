
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const CommunityPromotion = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Thanks for joining!",
        description: "We'll be in touch with exclusive deals soon.",
      });
      setEmail('');
      setPhone('');
      // Redirect to WhatsApp group
      window.open('https://chat.whatsapp.com/Bnb3F4ycBPcLsYRl2BxNtM', '_blank');
    }
  };

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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email" className="text-base font-semibold">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="mt-2 h-12"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-base font-semibold">WhatsApp Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className="mt-2 h-12"
              />
            </div>
          </div>
          
          <div className="text-center">
            <Button type="submit" className="adventure-button text-lg px-8 py-4 max-w-xs w-full sm:w-auto">
              <MessageCircle className="mr-2" size={20} />
              Join the Community (Free)
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
