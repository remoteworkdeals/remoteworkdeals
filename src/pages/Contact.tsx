
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Instagram, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast({
      title: "Message sent!",
      description: "Thanks for reaching out. We'll get back to you soon.",
    });
    setFormData({ name: '', email: '', message: '' });
  };

  const handleWhatsAppClick = () => {
    const message = "Hi! I'd like to get in touch about RemoteWork.Deals";
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="bg-forest-green text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-100">
            Have questions? Want to partner with us? Or just want to chat about the nomad life? 
            We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-forest-green">
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      required
                      className="h-12"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                      className="h-12"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us how we can help you..."
                      required
                      className="min-h-32"
                    />
                  </div>
                  
                  <Button type="submit" className="adventure-button w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-serif font-bold text-forest-green mb-6">
                  Let's Connect
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  We're always excited to meet fellow nomads and travel enthusiasts. 
                  Choose your preferred way to reach out:
                </p>
              </div>

              <div className="space-y-6">
                <Card className="p-6 border-l-4 border-adventure-orange cursor-pointer hover:shadow-lg transition-shadow" onClick={handleWhatsAppClick}>
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <MessageCircle size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-forest-green">WhatsApp</h3>
                      <p className="text-gray-600">Quick responses, perfect for urgent questions</p>
                      <p className="text-sm text-adventure-orange font-medium">Click to chat now</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-l-4 border-adventure-orange">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 rounded-full p-3">
                      <Mail size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-forest-green">Email</h3>
                      <p className="text-gray-600">For detailed inquiries and partnerships</p>
                      <p className="text-sm text-adventure-orange font-medium">hello@remotework.deals</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-l-4 border-adventure-orange">
                  <a 
                    href="https://instagram.com/remotework.deals" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                  >
                    <div className="bg-pink-100 rounded-full p-3">
                      <Instagram size={24} className="text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-forest-green">Instagram</h3>
                      <p className="text-gray-600">Follow our nomad journey and daily updates</p>
                      <p className="text-sm text-adventure-orange font-medium">@remotework.deals</p>
                    </div>
                  </a>
                </Card>
              </div>

              <div className="bg-desert-beige rounded-xl p-8">
                <h3 className="text-xl font-serif font-bold text-forest-green mb-4">
                  Currently Based
                </h3>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={20} />
                  <span>Lisbon, Portugal (this month)</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Our location changes monthly - follow us on Instagram for real-time updates!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
