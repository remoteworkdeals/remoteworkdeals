
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import FeaturedListings from '@/components/FeaturedListings';
import HowItWorks from '@/components/HowItWorks';
import PartnersSection from '@/components/PartnersSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <HowItWorks />
      <FeaturedListings />
      <PartnersSection />
      <Footer />
    </div>
  );
};

export default Index;
