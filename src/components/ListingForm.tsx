import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, Trash2, Eye, Save, ExternalLink, Instagram } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/listing';
import { useAuth } from '@/contexts/AuthContext';
import ImageUpload from '@/components/ImageUpload';

interface ListingFormProps {
  listing?: Listing | null;
  onClose: () => void;
}

const ListingForm = ({ listing, onClose }: ListingFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [averageRatings, setAverageRatings] = useState({
    social: 0,
    work: 0,
    surroundings: 0,
    facilities: 0,
    price: 0,
    overall: 0
  });
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    country: '',
    description: '',
    type: 'coliving' as 'coliving' | 'coworking' | 'apartment' | 'house',
    status: 'active' as 'active' | 'inactive' | 'pending',
    original_price: 0,
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: null as number | null,
    discounted_price: null as number | null,
    discount_percentage: null as number | null,
    capacity: null as number | null,
    rooms: null as number | null,
    featured_image: '',
    images: [] as string[],
    amenities: [] as string[],
    review_count: 0,
    discount_code_url: '',
    website_url: '',
    instagram_url: '',
    is_seasonal: false,
    seasonal_start_date: '',
    seasonal_end_date: ''
  });

  const [newAmenity, setNewAmenity] = useState('');

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title || '',
        location: listing.location || '',
        country: listing.country || '',
        description: listing.description || '',
        type: listing.type || 'coliving',
        status: listing.status || 'active',
        original_price: listing.original_price || 0,
        discount_type: listing.discount_percentage ? 'percentage' : 'fixed',
        discount_value: listing.discount_percentage || (listing.original_price - (listing.discounted_price || listing.original_price)),
        discounted_price: listing.discounted_price,
        discount_percentage: listing.discount_percentage,
        capacity: listing.capacity,
        rooms: listing.rooms,
        featured_image: listing.featured_image || '',
        images: listing.images || [],
        amenities: listing.amenities || [],
        review_count: listing.review_count || 0,
        discount_code_url: listing.discount_code_url || '',
        website_url: listing.website_url || '',
        instagram_url: listing.instagram_url || '',
        is_seasonal: listing.is_seasonal || false,
        seasonal_start_date: listing.seasonal_start_date || '',
        seasonal_end_date: listing.seasonal_end_date || ''
      });
      
      // Fetch ratings for existing listing
      if (listing.id) {
        fetchListingRatings(listing.id);
      }
    }
  }, [listing]);

  const fetchListingRatings = async (listingId: number) => {
    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('social_rating, work_rating, surroundings_rating, facilities_rating, price_rating')
        .eq('listing_id', listingId);

      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      }

      if (reviews && reviews.length > 0) {
        const validReviews = reviews.filter(review => 
          review.social_rating && review.work_rating && 
          review.surroundings_rating && review.facilities_rating && 
          review.price_rating
        );

        if (validReviews.length > 0) {
          const social = validReviews.reduce((sum, r) => sum + r.social_rating, 0) / validReviews.length;
          const work = validReviews.reduce((sum, r) => sum + r.work_rating, 0) / validReviews.length;
          const surroundings = validReviews.reduce((sum, r) => sum + r.surroundings_rating, 0) / validReviews.length;
          const facilities = validReviews.reduce((sum, r) => sum + r.facilities_rating, 0) / validReviews.length;
          const price = validReviews.reduce((sum, r) => sum + r.price_rating, 0) / validReviews.length;
          const overall = (social + work + surroundings + facilities + price) / 5;

          setAverageRatings({
            social: Math.round(social * 10) / 10,
            work: Math.round(work * 10) / 10,
            surroundings: Math.round(surroundings * 10) / 10,
            facilities: Math.round(facilities * 10) / 10,
            price: Math.round(price * 10) / 10,
            overall: Math.round(overall * 10) / 10
          });

          setFormData(prev => ({ ...prev, review_count: validReviews.length }));
        }
      }
    } catch (error) {
      console.error('Error calculating ratings:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const calculateDiscountPrice = () => {
    if (formData.discount_value && formData.original_price) {
      if (formData.discount_type === 'percentage') {
        const discounted = formData.original_price - (formData.original_price * formData.discount_value / 100);
        setFormData(prev => ({ 
          ...prev, 
          discounted_price: Math.round(discounted),
          discount_percentage: formData.discount_value
        }));
      } else {
        const discounted = formData.original_price - formData.discount_value;
        const percentage = (formData.discount_value / formData.original_price) * 100;
        setFormData(prev => ({ 
          ...prev, 
          discounted_price: Math.max(0, Math.round(discounted)),
          discount_percentage: Math.round(percentage)
        }));
      }
    }
  };

  const handleImageUploaded = (url: string, isGallery = false) => {
    if (isGallery) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
    } else {
      setFormData(prev => ({ ...prev, featured_image: url }));
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        rating: averageRatings.overall,
        created_by: user?.id,
        updated_at: new Date().toISOString()
      };

      // Remove discount_type and discount_value from submission as they're not in the database
      const { discount_type, discount_value, ...dbData } = submissionData;

      if (listing) {
        // Update existing listing
        const { error } = await supabase
          .from('listings')
          .update(dbData)
          .eq('id', listing.id);

        if (error) throw error;
        toast({ title: 'Listing updated successfully!' });
      } else {
        // Create new listing
        const { error } = await supabase
          .from('listings')
          .insert([dbData]);

        if (error) throw error;
        toast({ title: 'Listing created successfully!' });
      }

      onClose();
    } catch (error: any) {
      console.error('Error saving listing:', error);
      toast({
        title: 'Error saving listing',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onClose}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
          <h1 className="text-2xl font-bold">
            {listing ? 'Edit Listing' : 'Add New Listing'}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g. Tropical Beach House Canggu"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g. Canggu, Bali"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="e.g. Indonesia"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the coliving space, amenities, and what makes it special..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coliving">Coliving</SelectItem>
                        <SelectItem value="coworking">Coworking</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links & Website */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Social Links & Website
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="website_url">Website URL</Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => handleInputChange('website_url', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram_url" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    Instagram URL
                  </Label>
                  <Input
                    id="instagram_url"
                    type="url"
                    value={formData.instagram_url}
                    onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Discounts */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Discounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="original_price">Original Price (€) *</Label>
                  <Input
                    id="original_price"
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => handleInputChange('original_price', parseInt(e.target.value) || 0)}
                    placeholder="1200"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="discount_type">Discount Type</Label>
                  <Select value={formData.discount_type} onValueChange={(value) => handleInputChange('discount_type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discount_value">
                    {formData.discount_type === 'percentage' ? 'Discount value in %' : 'Discount value in €'}
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    value={formData.discount_value || ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || null;
                      handleInputChange('discount_value', value);
                    }}
                    onBlur={calculateDiscountPrice}
                    placeholder={formData.discount_type === 'percentage' ? '40' : '480'}
                    min="0"
                    max={formData.discount_type === 'percentage' ? '100' : formData.original_price}
                  />
                </div>

                {formData.discounted_price && (
                  <div>
                    <Label htmlFor="discounted_price">Final Discounted Price (€)</Label>
                    <Input
                      id="discounted_price"
                      type="number"
                      value={formData.discounted_price}
                      onChange={(e) => handleInputChange('discounted_price', parseInt(e.target.value) || null)}
                      placeholder="720"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="discount_code_url">Discount Code Link</Label>
                  <Input
                    id="discount_code_url"
                    type="url"
                    value={formData.discount_code_url}
                    onChange={(e) => handleInputChange('discount_code_url', e.target.value)}
                    placeholder="https://example.com/discount"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity || ''}
                      onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || null)}
                      placeholder="12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rooms">Rooms</Label>
                    <Input
                      id="rooms"
                      type="number"
                      value={formData.rooms || ''}
                      onChange={(e) => handleInputChange('rooms', parseInt(e.target.value) || null)}
                      placeholder="6"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ratings Display */}
            {listing && (
              <Card>
                <CardHeader>
                  <CardTitle>Ratings (Calculated from Reviews)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Social:</span>
                        <span className="font-medium">{averageRatings.social}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Work/WiFi:</span>
                        <span className="font-medium">{averageRatings.work}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Surroundings:</span>
                        <span className="font-medium">{averageRatings.surroundings}/5</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Facilities:</span>
                        <span className="font-medium">{averageRatings.facilities}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Price:</span>
                        <span className="font-medium">{averageRatings.price}/5</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Overall:</span>
                        <span className="font-bold">{averageRatings.overall}/5</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on {formData.review_count} review{formData.review_count !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUpload
                  onImageUploaded={(url) => handleImageUploaded(url, false)}
                  currentImage={formData.featured_image}
                  label="Featured Image"
                />

                <Separator />

                <div>
                  <Label>Gallery Images</Label>
                  <div className="space-y-4">
                    <ImageUpload
                      onImageUploaded={(url) => handleImageUploaded(url, true)}
                      label="Add Gallery Image"
                    />
                    
                    {formData.images.length > 0 && (
                      <div className="space-y-2">
                        <Label>Current Gallery Images</Label>
                        {formData.images.map((image, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                            <img src={image} alt="" className="w-12 h-12 object-cover rounded" />
                            <span className="flex-1 text-sm truncate">{image}</span>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeGalleryImage(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="e.g. High-speed WiFi"
                  />
                  <Button type="button" onClick={addAmenity}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(index)}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Seasonal Options */}
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_seasonal"
                    checked={formData.is_seasonal}
                    onCheckedChange={(checked) => handleInputChange('is_seasonal', checked)}
                  />
                  <Label htmlFor="is_seasonal">This is a seasonal listing</Label>
                </div>

                {formData.is_seasonal && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="seasonal_start_date">Start Date</Label>
                      <Input
                        id="seasonal_start_date"
                        type="date"
                        value={formData.seasonal_start_date}
                        onChange={(e) => handleInputChange('seasonal_start_date', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="seasonal_end_date">End Date</Label>
                      <Input
                        id="seasonal_end_date"
                        type="date"
                        value={formData.seasonal_end_date}
                        onChange={(e) => handleInputChange('seasonal_end_date', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1 adventure-button">
                {isSubmitting ? 'Saving...' : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {listing ? 'Update Listing' : 'Create Listing'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.featured_image && (
                    <img
                      src={formData.featured_image}
                      alt={formData.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  
                  <div>
                    <h3 className="text-xl font-bold">{formData.title || 'Listing Title'}</h3>
                    <p className="text-gray-600">{formData.location}{formData.country && `, ${formData.country}`}</p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">{formData.type}</Badge>
                    <Badge variant={formData.status === 'active' ? 'default' : 'secondary'}>
                      {formData.status}
                    </Badge>
                    {formData.discount_percentage && (
                      <Badge variant="destructive">
                        {formData.discount_percentage}% OFF
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {formData.discounted_price ? (
                        <>
                          <span className="text-lg font-bold text-green-600">€{formData.discounted_price}</span>
                          <span className="text-sm text-gray-500 line-through">€{formData.original_price}</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold">€{formData.original_price}</span>
                      )}
                    </div>
                    
                    {averageRatings.overall > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span>{averageRatings.overall}</span>
                        {formData.review_count > 0 && (
                          <span className="text-sm text-gray-500">({formData.review_count} reviews)</span>
                        )}
                      </div>
                    )}
                  </div>

                  {formData.description && (
                    <p className="text-gray-700 text-sm">{formData.description}</p>
                  )}

                  {(formData.website_url || formData.instagram_url) && (
                    <div className="flex gap-2">
                      {formData.website_url && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          Website
                        </Badge>
                      )}
                      {formData.instagram_url && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Instagram className="h-3 w-3" />
                          Instagram
                        </Badge>
                      )}
                    </div>
                  )}

                  {formData.amenities.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-1">
                        {formData.amenities.map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingForm;
