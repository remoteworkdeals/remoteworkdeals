
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ListingDetail from '@/components/ListingDetail';
import SEOHead from '@/components/SEOHead';
import { useListingData } from '@/hooks/useListingData';
import { useListings } from '@/hooks/useListings';
import { extractListingIdFromOldUrl, generateSlug } from '@/utils/slugUtils';

const ListingPage = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const { listings, loading: listingsLoading } = useListings();
  
  // Handle old URL format redirects
  useEffect(() => {
    const currentPath = window.location.pathname;
    const oldId = extractListingIdFromOldUrl(currentPath);
    
    if (oldId && listings.length > 0) {
      const listing = listings.find(l => l.id === oldId);
      if (listing) {
        const newSlug = generateSlug(listing.title);
        navigate(`/colivings/${newSlug}`, { replace: true });
        return;
      }
    }
  }, [listings, navigate]);

  // Find listing by slug or ID
  let listing = null;
  let listingId = null;

  if (slug && listings.length > 0) {
    // Find by slug
    listing = listings.find(l => {
      const listingSlug = generateSlug(l.title);
      return listingSlug === slug;
    });
    listingId = listing?.id;
  } else if (id) {
    // Find by ID (old format)
    const numericId = parseInt(id, 10);
    listing = listings.find(l => l.id === numericId);
    listingId = numericId;
  }

  const { listing: detailedListing, loading } = useListingData(listingId || 0);

  // Show loading state while listings are being fetched
  if (listingsLoading || loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg">Loading listing...</div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show not found if no listing is found
  if (!listing || !listingId) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Listing Not Found</h1>
            <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist or may have been removed.</p>
            <button 
              onClick={() => navigate('/coliving-deals')}
              className="bg-forest-green text-white px-6 py-2 rounded hover:bg-forest-green/90 transition-colors"
            >
              View All Listings
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getSEOData = () => {
    if (!detailedListing) {
      return {
        title: 'Coliving Space Details | RemoteWork.Deals',
        description: 'Discover amazing coliving spaces and remote work accommodations worldwide.',
      };
    }

    const discountText = detailedListing.discount_percentage 
      ? ` - ${detailedListing.discount_percentage}% OFF` 
      : '';
    
    return {
      title: `${detailedListing.title}${discountText} | ${detailedListing.location} Coliving | RemoteWork.Deals`,
      description: `${detailedListing.description?.substring(0, 150) || `Coliving space in ${detailedListing.location}, ${detailedListing.country}. Starting from $${detailedListing.original_price}/${detailedListing.pricing_unit}.`} Perfect for digital nomads and remote workers.`,
      keywords: [
        'coliving',
        detailedListing.location.toLowerCase(),
        detailedListing.country.toLowerCase(),
        'remote work',
        'digital nomad accommodation',
        detailedListing.title.toLowerCase()
      ],
      image: detailedListing.featured_image,
      type: 'product' as const
    };
  };

  const structuredData = detailedListing ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": detailedListing.title,
    "description": detailedListing.description,
    "image": detailedListing.featured_image,
    "offers": {
      "@type": "Offer",
      "price": detailedListing.discounted_price || detailedListing.original_price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": `https://remotework.deals/colivings/${slug || detailedListing.id}`
    },
    "aggregateRating": detailedListing.rating && detailedListing.review_count ? {
      "@type": "AggregateRating",
      "ratingValue": detailedListing.rating,
      "reviewCount": detailedListing.review_count
    } : undefined,
    "brand": {
      "@type": "Organization",
      "name": "RemoteWork.Deals"
    },
    "category": "Coliving Space",
    "location": {
      "@type": "Place",
      "name": `${detailedListing.location}, ${detailedListing.country}`
    }
  } : undefined;

  return (
    <div className="min-h-screen">
      <SEOHead
        {...getSEOData()}
        structuredData={structuredData}
      />
      <Navigation />
      <ListingDetail listingId={listingId} />
      <Footer />
    </div>
  );
};

export default ListingPage;
