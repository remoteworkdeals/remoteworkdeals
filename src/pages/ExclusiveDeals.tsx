import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Clock, Globe, Heart, Gift, Users, Bell } from 'lucide-react';
import { useState } from 'react';
const ExclusiveDeals = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Welcome to the community! You\'ll receive exclusive deals soon.');
    setFormData({
      email: '',
      phone: ''
    });
    // Redirect to WhatsApp group
    window.open('https://chat.whatsapp.com/Bnb3F4ycBPcLsYRl2BxNtM', '_blank');
  };
  const benefits = [{
    icon: Bell,
    title: "Early Access Deals",
    description: "Get notified 24-48 hours before deals go public. Never miss out on the best spots."
  }, {
    icon: Clock,
    title: "Last-Minute Discounts",
    description: "Exclusive access to last-minute deals with up to 60% off premium co-livings."
  }, {
    icon: Gift,
    title: "Content-for-Discount",
    description: "Share your experience and get extra discounts on your next stay. Win-win!"
  }, {
    icon: MessageCircle,
    title: "Real-Time Advice",
    description: "Ask questions and get instant answers from nomads who've been there."
  }, {
    icon: Globe,
    title: "Insider Tips",
    description: "Hidden gems, local recommendations, and insider knowledge from our community."
  }, {
    icon: Users,
    title: "Nomad Connections",
    description: "Connect with like-minded nomads and potentially find travel buddies."
  }];
  const JoinForm = () => <Card className="card-shadow">
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
              <Input id="email" type="email" value={formData.email} onChange={e => setFormData({
              ...formData,
              email: e.target.value
            })} placeholder="your@email.com" required className="mt-2 h-12" />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-base font-semibold">WhatsApp Number</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={e => setFormData({
              ...formData,
              phone: e.target.value
            })} placeholder="+1 234 567 8900" className="mt-2 h-12" />
            </div>
          </div>
          
          <div className="text-center">
            <Button type="submit" className="adventure-button text-lg px-12 py-4 w-full sm:w-auto">
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
    </Card>;
  return <div className="min-h-screen">
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
            {benefits.map((benefit, index) => <div key={index} className="text-center animate-fade-in" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <benefit.icon size={24} className="text-adventure-orange" />
                </div>
                <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-desert-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-forest-green mb-12">
            What Our Community Says
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=50&h=50&q=80" alt="Sarah" className="w-12 h-12 rounded-full mr-3" />
                  <div>
                    <div className="font-semibold">Sarah Chen</div>
                    <div className="text-sm text-gray-600">UX Designer</div>
                  </div>
                </div>
                <p className="text-gray-700">
                  "Saved €800 on my 3-month Bali trip thanks to early access deals. The community tips were invaluable!"
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&h=50&q=80" alt="Mike" className="w-12 h-12 rounded-full mr-3" />
                  <div>
                    <div className="font-semibold">Mike Rodriguez</div>
                    <div className="text-sm text-gray-600">Software Developer</div>
                  </div>
                </div>
                <p className="text-gray-700">
                  "The last-minute deals are incredible. Got a premium co-living in Lisbon for 50% off just 2 days before my trip."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=50&h=50&q=80" alt="Emma" className="w-12 h-12 rounded-full mr-3" />
                  <div>
                    <div className="font-semibold">Emma Thompson</div>
                    <div className="text-sm text-gray-600">Marketing Consultant</div>
                  </div>
                </div>
                <p className="text-gray-700">
                  "Found my co-living family through this community. The connections I've made are worth more than the discounts!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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
    </div>;
};
export default ExclusiveDeals;