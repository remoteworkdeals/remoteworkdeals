
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import FeaturedListings from '@/components/FeaturedListings';
import HowItWorks from '@/components/HowItWorks';
import CommunitySection from '@/components/CommunitySection';
import Testimonials from '@/components/Testimonials';
import PartnersSection from '@/components/PartnersSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <HowItWorks />
      <FeaturedListings />
      <CommunitySection />
      <Testimonials />
      <PartnersSection />
      <Footer />
    </div>
  );
};

export default Index;
