
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ListingDetail from '@/components/ListingDetail';
import SEOHead from '@/components/SEOHead';
import { useListingData } from '@/hooks/useListingData';
import { useListings } from '@/hooks/useListings';
import { extractListingIdFromOldUrl } from '@/utils/slugUtils';

const ListingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { listings } = useListings();
  
  // Handle old URL format redirects
  useEffect(() => {
    const currentPath = window.location.pathname;
    const oldId = extractListingIdFromOldUrl(currentPath);
    
    if (oldId && listings.length > 0) {
      const listing = listings.find(l => l.id === oldId);
      if (listing) {
        const newSlug = listing.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        navigate(`/colivings/${newSlug}`, { replace: true });
        return;
      }
    }
  }, [listings, navigate]);

  // Find listing by slug
  const listing = listings.find(l => {
    const listingSlug = l.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return listingSlug === slug;
  });

  const listingId = listing?.id || 1;
  const { listing: detailedListing, loading } = useListingData(listingId);

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
      "url": `https://remotework.deals/colivings/${slug}`
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
