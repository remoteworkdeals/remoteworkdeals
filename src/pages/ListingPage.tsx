
import { useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ListingDetail from '@/components/ListingDetail';
import SEOHead from '@/components/SEOHead';
import { useListingData } from '@/hooks/useListingData';

const ListingPage = () => {
  const { id } = useParams();
  const listingId = parseInt(id || '1');
  const { listing, isLoading } = useListingData(listingId);

  const getSEOData = () => {
    if (!listing) {
      return {
        title: 'Coliving Space Details | RemoteWork.Deals',
        description: 'Discover amazing coliving spaces and remote work accommodations worldwide.',
      };
    }

    const discountText = listing.discount_percentage 
      ? ` - ${listing.discount_percentage}% OFF` 
      : '';
    
    return {
      title: `${listing.title}${discountText} | ${listing.location} Coliving | RemoteWork.Deals`,
      description: `${listing.description?.substring(0, 150) || `Coliving space in ${listing.location}, ${listing.country}. Starting from $${listing.original_price}/${listing.pricing_unit}.`} Perfect for digital nomads and remote workers.`,
      keywords: [
        'coliving',
        listing.location.toLowerCase(),
        listing.country.toLowerCase(),
        'remote work',
        'digital nomad accommodation',
        listing.title.toLowerCase()
      ],
      image: listing.featured_image,
      type: 'product' as const
    };
  };

  const structuredData = listing ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": listing.title,
    "description": listing.description,
    "image": listing.featured_image,
    "offers": {
      "@type": "Offer",
      "price": listing.discounted_price || listing.original_price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": `https://remotework.deals/listing/${listing.id}`
    },
    "aggregateRating": listing.rating && listing.review_count ? {
      "@type": "AggregateRating",
      "ratingValue": listing.rating,
      "reviewCount": listing.review_count
    } : undefined,
    "brand": {
      "@type": "Organization",
      "name": "RemoteWork.Deals"
    },
    "category": "Coliving Space",
    "location": {
      "@type": "Place",
      "name": `${listing.location}, ${listing.country}`
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
