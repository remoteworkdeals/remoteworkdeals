
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import FeaturedListings from '@/components/FeaturedListings';
import HowItWorks from '@/components/HowItWorks';
import CommunitySection from '@/components/CommunitySection';
import Testimonials from '@/components/Testimonials';
import PartnersSection from '@/components/PartnersSection';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { useEffect } from 'react';

const Index = () => {
  // Preload critical hero image
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = '/lovable-uploads/6c22efa0-f3ff-4036-b52a-2c5adb94f2b9.jpg';
    link.fetchPriority = 'high';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "RemoteWork.Deals",
    "url": "https://remotework.deals",
    "description": "Discover exclusive deals on coliving spaces worldwide. Perfect for digital nomads, remote workers, and location-independent professionals.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://remotework.deals/blog?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RemoteWork.Deals",
      "logo": {
        "@type": "ImageObject",
        "url": "https://remotework.deals/logo.png"
      }
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="RemoteWork.Deals - Find the Best Coliving Spaces & Remote Work Deals"
        description="Discover exclusive deals on coliving spaces worldwide. Perfect for digital nomads, remote workers, and location-independent professionals."
        keywords={['coliving deals', 'remote work', 'digital nomad', 'workation', 'co-living spaces', 'remote work housing', 'nomad accommodation']}
        structuredData={structuredData}
      />
      
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
