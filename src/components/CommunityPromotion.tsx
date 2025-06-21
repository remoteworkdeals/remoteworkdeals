
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import { MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { isValidPhoneNumber } from 'react-phone-number-input';

const CommunityPromotion = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePhoneChange = (value: string | undefined) => {
    const phoneValue = value || '';
    setPhone(phoneValue);
    
    // Validate phone number in real-time
    if (phoneValue) {
      const isValid = isValidPhoneNumber(phoneValue);
      setPhoneValid(isValid);
    } else {
      setPhoneValid(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to join the community.",
        variant: "destructive"
      });
      return;
    }

    // Validate phone number if provided
    if (phone && !isValidPhoneNumber(phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number with country code.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Attempting to save community member:', { email, phone });
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('community_members')
        .insert([
          {
            email: email,
            phone: phone || null,
            source: 'community_promotion'
          }
        ]);

      if (error) {
        console.error('Supabase error:', error);
        
        // Handle duplicate email error specifically
        if (error.code === '23505') {
          toast({
            title: "Already Registered",
            description: "This email is already part of our community! Redirecting you to WhatsApp.",
          });
        } else {
          toast({
            title: "Error Joining Community",
            description: "There was an issue saving your information. Please try again.",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
      } else {
        console.log('Successfully saved community member:', data);
        toast({
          title: "Thanks for joining!",
          description: "We'll be in touch with exclusive deals soon.",
        });
      }

      // Clear form
      setEmail('');
      setPhone('');
      setPhoneValid(null);

      // Redirect to WhatsApp group after a short delay
      setTimeout(() => {
        window.open('https://chat.whatsapp.com/Bnb3F4ycBPcLsYRl2BxNtM', '_blank');
      }, 1500);

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-base font-semibold">WhatsApp Number</Label>
              <div className="relative mt-2">
                <PhoneInput
                  value={phone}
                  onChange={handlePhoneChange}
                  disabled={isSubmitting}
                  placeholder="e.g. +44 7123 456789"
                  className={`
                    ${phoneValid === true ? 'phone-input-valid' : ''}
                    ${phoneValid === false ? 'phone-input-invalid' : ''}
                  `}
                />
                {phone && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {phoneValid === true && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {phoneValid === false && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {phoneValid === false && phone && (
                <p className="text-sm text-red-600 mt-1">
                  Please enter a valid phone number with country code
                </p>
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
