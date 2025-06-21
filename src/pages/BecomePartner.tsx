
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import PartnerForm from '@/components/PartnerForm';
import PartnerHero from '@/components/PartnerHero';

const BecomePartner = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Become a Partner - RemoteWork.Deals",
    "url": "https://remotework.deals/become-partner",
    "description": "Partner with RemoteWork.Deals to feature your coliving space and reach more digital nomads worldwide.",
    "mainEntity": {
      "@type": "ContactPage",
      "name": "Partner Inquiry Form"
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Become a Partner - Feature Your Coliving Space | RemoteWork.Deals"
        description="Partner with RemoteWork.Deals to feature your coliving space and reach more digital nomads worldwide. Get exclusive deals and increased visibility."
        keywords={['coliving partnership', 'partner program', 'coliving space listing', 'digital nomad accommodation', 'remote work housing partner']}
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <PartnerHero />
          
          <div className="mt-12">
            {isSubmitted ? (
              <div className="max-w-2xl mx-auto text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-8">
                  <div className="text-green-600 text-5xl mb-4">✓</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank you!</h2>
                  <p className="text-gray-700">
                    We'll be in touch shortly with more information in your inbox.
                  </p>
                </div>
              </div>
            ) : (
              <PartnerForm onSuccess={() => setIsSubmitted(true)} />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BecomePartner;
