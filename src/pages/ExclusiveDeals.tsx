
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Clock, Globe, Heart, Gift, Users, Bell } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ExclusiveDeals = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to join the community.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Attempting to save community member:', formData);
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('community_members')
        .insert([
          {
            email: formData.email,
            phone: formData.phone || null,
            source: 'exclusive_deals'
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
          title: "Welcome to the Community!",
          description: "You've successfully joined! Redirecting you to our WhatsApp group.",
        });
      }

      // Clear form
      setFormData({
        email: '',
        phone: ''
      });

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

  const JoinForm = () => (
    <Card className="card-shadow">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-serif text-forest-green mb-4">
          Get Access to Exclusive Coliving Deals
        </CardTitle>
        <p className="text-xl text-gray-600">Join our community to unlock even bigger discounts.</p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email" className="text-base font-semibold">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                placeholder="your@email.com" 
                required 
                className="mt-2 h-12"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-base font-semibold">WhatsApp Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                placeholder="+1 234 567 8900" 
                className="mt-2 h-12"
                disabled={isSubmitting}
                pattern="[+]?[\d\s\-\(\)]{7,}"
                title="Please enter a valid phone number (minimum 7 digits)"
              />
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              type="submit" 
              className="adventure-button text-lg px-12 py-4 w-full sm:w-auto"
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

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-forest-green text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6">
            Join Our Exclusive Coliving Community
          </h1>
          <p className="text-xl text-gray-100 mb-8">
            Get access to insider deals, last-minute discounts, and a global network 
            of digital nomads sharing tips, recommendations, and experiences.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-adventure-orange">2,847</div>
              <div>Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-adventure-orange">147</div>
              <div>Partner Locations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-adventure-orange">€1.2M</div>
              <div>Total Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* High Priority Join Form - Moved up for better CRO */}
      <section className="py-20 -mt-10 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <JoinForm />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-forest-green mb-6">
              Community Perks & Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Join a community of Digital Nomads and remote workers who love to stay in colivings. Only real recommendations, tips and deals will be shared.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="text-center animate-fade-in" style={{ animationDelay: '0s' }}>
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Bell size={24} className="text-adventure-orange" />
              </div>
              <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
                Early Access Deals
              </h3>
              <p className="text-gray-600">
                Get notified 24-48 hours before deals go public. Never miss out on the best spots.
              </p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock size={24} className="text-adventure-orange" />
              </div>
              <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
                Last-Minute Discounts
              </h3>
              <p className="text-gray-600">
                Exclusive access to last-minute deals with up to 60% off premium co-livings.
              </p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Gift size={24} className="text-adventure-orange" />
              </div>
              <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
                Content-for-Discount
              </h3>
              <p className="text-gray-600">
                Share your experience and get extra discounts on your next stay. Win-win!
              </p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MessageCircle size={24} className="text-adventure-orange" />
              </div>
              <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
                Real-Time Advice
              </h3>
              <p className="text-gray-600">
                Ask questions and get instant answers from nomads who've been there.
              </p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Globe size={24} className="text-adventure-orange" />
              </div>
              <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
                Insider Tips
              </h3>
              <p className="text-gray-600">
                Hidden gems, local recommendations, and insider knowledge from our community.
              </p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users size={24} className="text-adventure-orange" />
              </div>
              <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
                Nomad Connections
              </h3>
              <p className="text-gray-600">
                Connect with like-minded nomads and potentially find travel buddies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use shared Testimonials component */}
      <Testimonials />

      {/* Reinforcement CTA - Secondary form placement */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-forest-green mb-6">
            Don't Miss Out on Exclusive Deals
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our community now and start saving on your next coliving adventure.
          </p>
          <JoinForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExclusiveDeals;
