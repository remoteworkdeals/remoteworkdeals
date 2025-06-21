
import { ExternalLink, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Listing } from '@/types/listing';

interface BookingCardProps {
  listing: Listing;
}

/**
 * Sticky booking card component for listing detail page
 * Displays pricing, discount info, and booking CTA
 */
export const BookingCard = ({ listing }: BookingCardProps) => {
  const discountAmount = listing.original_price - (listing.discounted_price || listing.original_price);

  const handleGetCode = () => {
    if (listing.discount_code_url) {
      window.open(listing.discount_code_url, '_blank');
    } else {
      const message = `Hi! I'm interested in getting the discount code for ${listing.title} in ${listing.location}. Can you help me?`;
      const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <Card className="sticky top-8 card-shadow">
      <CardContent className="p-6">
        {/* Pricing Display */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-forest-green">
            Starting from €{listing.discounted_price || listing.original_price}
            {listing.discounted_price && (
              <span className="text-lg text-gray-500 line-through ml-2">
                €{listing.original_price}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            per {listing.pricing_unit}
          </div>
          {listing.minimum_stay && (
            <div className="text-sm text-gray-600 mt-1">
              Minimum stay: {listing.minimum_stay} {listing.minimum_stay_unit}
            </div>
          )}
          {discountAmount > 0 && (
            <div className="text-adventure-orange font-semibold mt-2">
              Save €{discountAmount}!
            </div>
          )}
        </div>
        
        {/* CTA Button */}
        <Button 
          className="adventure-button w-full mb-4 text-lg py-6 flex items-center justify-center gap-2"
          onClick={handleGetCode}
        >
          {listing.discount_code_url ? (
            <>
              <ExternalLink size={20} />
              Get Discount Code
            </>
          ) : (
            <>
              <MessageCircle size={20} />
              Get Discount Code
            </>
          )}
        </Button>
        
        {/* Helper Text */}
        <div className="text-sm text-gray-600 text-center bg-gray-50 p-3 rounded-lg">
          <p className="font-medium text-gray-700 mb-1">
            Receive your discount code directly in your WhatsApp inbox.
          </p>
          <p className="text-xs">
            {listing.discount_code_url 
              ? "Click to get your discount code instantly" 
              : "Fast response guaranteed within minutes"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
