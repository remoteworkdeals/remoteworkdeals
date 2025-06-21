
import { MapPin, Calendar, Globe, Instagram } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Listing } from '@/types/listing';
import { StarRating } from './StarRating';

interface ListingHeaderProps {
  listing: Listing;
}

/**
 * Header component for listing detail page
 * Displays title, location, ratings, badges, and social links
 */
export const ListingHeader = ({ listing }: ListingHeaderProps) => {
  return (
    <div className="mb-8">
      {/* Badges */}
      <div className="flex items-center gap-2 mb-4">
        {listing.discount_percentage && (
          <Badge className="bg-adventure-orange text-white">
            -{listing.discount_percentage}%
          </Badge>
        )}
        <Badge className="bg-forest-green text-white">
          {listing.type}
        </Badge>
        {listing.is_seasonal && (
          <Badge className="bg-blue-500 text-white">
            <Calendar size={14} className="mr-1" />
            Seasonal
          </Badge>
        )}
      </div>
      
      {/* Title */}
      <h1 className="text-4xl font-serif font-bold text-forest-green mb-4">
        {listing.title}
      </h1>
      
      {/* Location and Rating */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center text-gray-600">
          <MapPin size={20} className="mr-2" />
          <span className="text-lg">{listing.location}, {listing.country}</span>
        </div>
        
        <div className="flex items-center gap-4">
          {listing.rating && listing.rating > 0 ? (
            <>
              <StarRating rating={listing.rating} />
              <span className="text-sm text-gray-600">({listing.review_count || 0} reviews)</span>
            </>
          ) : (
            <span className="text-sm text-gray-600">No reviews yet</span>
          )}
        </div>
      </div>

      {/* Social Links */}
      {(listing.website_url || listing.instagram_url) && (
        <div className="flex items-center gap-4 mb-6">
          {listing.website_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(listing.website_url!, '_blank')}
              className="flex items-center gap-2"
            >
              <Globe size={16} />
              Visit Website
            </Button>
          )}
          {listing.instagram_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(listing.instagram_url!, '_blank')}
              className="flex items-center gap-2"
            >
              <Instagram size={16} />
              Instagram
            </Button>
          )}
        </div>
      )}

      {/* Seasonal Info */}
      {listing.is_seasonal && listing.seasonal_start_date && listing.seasonal_end_date && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center text-blue-700">
            <Calendar size={16} className="mr-2" />
            <span className="font-medium">Seasonal Availability:</span>
          </div>
          <p className="text-blue-600 mt-1">
            {new Date(listing.seasonal_start_date).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })} - {new Date(listing.seasonal_end_date).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        </div>
      )}
    </div>
  );
};
