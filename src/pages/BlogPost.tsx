
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Mock blog post data - in real app this would come from CMS
  const blogPost = {
    title: "The Ultimate Guide to Digital Nomad Visas in 2024",
    excerpt: "Everything you need to know about the latest digital nomad visa programs around the world.",
    category: "Guides",
    author: "Sarah Chen",
    readTime: "8 min read",
    date: "March 15, 2024",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=1200&q=80",
    content: `
      <p>Digital nomadism has exploded in popularity, and governments worldwide are taking notice. In 2024, we're seeing an unprecedented number of countries offering digital nomad visas, making it easier than ever to work remotely while exploring the world.</p>
      
      <h2>What is a Digital Nomad Visa?</h2>
      <p>A digital nomad visa is a special type of visa that allows remote workers to live and work in a foreign country for an extended period, typically 6 months to 2 years. Unlike tourist visas, these permits specifically cater to remote workers and often come with additional benefits.</p>
      
      <h2>Top Digital Nomad Visas in 2024</h2>
      
      <h3>1. Portugal - D7 Visa</h3>
      <p>Portugal's D7 visa has become incredibly popular among nomads. With a relatively low income requirement and access to the entire EU, it's an excellent choice for those looking to base themselves in Europe.</p>
      
      <h3>2. Estonia - Digital Nomad Visa</h3>
      <p>Estonia was one of the first countries to offer a dedicated digital nomad visa. The process is streamlined, and the country offers excellent digital infrastructure.</p>
      
      <h3>3. Barbados - Welcome Stamp</h3>
      <p>For those seeking a tropical paradise, Barbados offers a 12-month renewable visa that's perfect for remote workers looking to escape cold winters.</p>
      
      <h2>How to Choose the Right Visa</h2>
      <p>When selecting a digital nomad visa, consider factors like:</p>
      <ul>
        <li>Income requirements</li>
        <li>Application process complexity</li>
        <li>Visa duration and renewal options</li>
        <li>Tax implications</li>
        <li>Cost of living in the destination</li>
      </ul>
      
      <h2>Application Tips</h2>
      <p>Start your application process early - some visas can take several months to process. Ensure you have all required documents, including proof of remote work, health insurance, and sufficient funds.</p>
      
      <p>Remember to research the tax implications in both your home country and your destination. Consider consulting with a tax professional who specializes in nomad taxation.</p>
    `
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')}
            className="flex items-center text-forest-green hover:text-adventure-orange"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>

      <article className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-12">
            <Badge className="bg-forest-green text-white mb-4">
              {blogPost.category}
            </Badge>
            
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-forest-green mb-6">
              {blogPost.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{blogPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{blogPost.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{blogPost.readTime}</span>
              </div>
            </div>
            
            <img
              src={blogPost.image}
              alt={blogPost.title}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
          </header>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
            style={{
              color: '#374151',
              lineHeight: '1.75'
            }}
          />

          {/* CTA Section */}
          <div className="mt-16 p-8 bg-desert-beige rounded-xl text-center">
            <h3 className="text-2xl font-serif font-bold text-forest-green mb-4">
              Ready to Start Your Nomad Journey?
            </h3>
            <p className="text-gray-600 mb-6">
              Join our community for exclusive deals and insider tips on the best co-living spaces worldwide.
            </p>
            <Button 
              className="adventure-button"
              onClick={() => navigate('/exclusive-deals')}
            >
              Join Our Community
            </Button>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
