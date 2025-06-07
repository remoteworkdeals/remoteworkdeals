
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl lg:text-8xl font-serif font-bold text-forest-green mb-6">
            404
          </h1>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-forest-green mb-6">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            The page you're looking for doesn't exist. Let's get you back on track to discovering amazing coliving deals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="adventure-button text-lg"
              onClick={() => navigate('/')}
            >
              <Home className="mr-2" size={20} />
              Go Home
            </Button>
            <Button 
              variant="outline" 
              className="outline-button text-lg"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2" size={20} />
              Go Back
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NotFound;
