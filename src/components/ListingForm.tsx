
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
import { ArrowLeft, Plus, Trash2, Eye, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/listing';
import { useAuth } from '@/contexts/AuthContext';

interface ListingFormProps {
  listing?: Listing | null;
  onClose: () => void;
}

const ListingForm = ({ listing, onClose }: ListingFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    country: '',
    description: '',
    type: 'coliving' as 'coliving' | 'coworking' | 'apartment' | 'house',
    status: 'active' as 'active' | 'inactive' | 'pending',
    original_price: 0,
    discounted_price: null as number | null,
    discount_percentage: null as number | null,
    capacity: null as number | null,
    rooms: null as number | null,
    featured_image: '',
    images: [] as string[],
    amenities: [] as string[],
    rating: null as number | null,
    review_count: 0,
    discount_code_url: '',
    is_seasonal: false,
    seasonal_start_date: '',
    seasonal_end_date: ''
  });

  const [newImage, setNewImage] = useState('');
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
        discounted_price: listing.discounted_price,
        discount_percentage: listing.discount_percentage,
        capacity: listing.capacity,
        rooms: listing.rooms,
        featured_image: listing.featured_image || '',
        images: listing.images || [],
        amenities: listing.amenities || [],
        rating: listing.rating,
        review_count: listing.review_count || 0,
        discount_code_url: listing.discount_code_url || '',
        is_seasonal: listing.is_seasonal || false,
        seasonal_start_date: listing.seasonal_start_date || '',
        seasonal_end_date: listing.seasonal_end_date || ''
      });
    }
  }, [listing]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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
    if (formData.discount_percentage && formData.original_price) {
      const discounted = formData.original_price - (formData.original_price * formData.discount_percentage / 100);
      setFormData(prev => ({ ...prev, discounted_price: Math.round(discounted) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        created_by: user?.id,
        updated_at: new Date().toISOString()
      };

      if (listing) {
        // Update existing listing
        const { error } = await supabase
          .from('listings')
          .update(submissionData)
          .eq('id', listing.id);

        if (error) throw error;
        toast({ title: 'Listing updated successfully!' });
      } else {
        // Create new listing
        const { error } = await supabase
          .from('listings')
          .insert([submissionData]);

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

            {/* Pricing */}
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
                  <Label htmlFor="discount_percentage">Discount Percentage (%)</Label>
                  <Input
                    id="discount_percentage"
                    type="number"
                    value={formData.discount_percentage || ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || null;
                      handleInputChange('discount_percentage', value);
                    }}
                    onBlur={calculateDiscountPrice}
                    placeholder="40"
                    min="0"
                    max="100"
                  />
                </div>

                {formData.discounted_price && (
                  <div>
                    <Label htmlFor="discounted_price">Discounted Price (€)</Label>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating || ''}
                      onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || null)}
                      placeholder="4.8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="review_count">Review Count</Label>
                    <Input
                      id="review_count"
                      type="number"
                      value={formData.review_count}
                      onChange={(e) => handleInputChange('review_count', parseInt(e.target.value) || 0)}
                      placeholder="127"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="featured_image">Featured Image URL</Label>
                  <Input
                    id="featured_image"
                    value={formData.featured_image}
                    onChange={(e) => handleInputChange('featured_image', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <Label>Gallery Images</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="Image URL"
                    />
                    <Button type="button" onClick={addImage}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <img src={image} alt="" className="w-12 h-12 object-cover rounded" />
                        <span className="flex-1 text-sm truncate">{image}</span>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
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
                    
                    {formData.rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span>{formData.rating}</span>
                        {formData.review_count > 0 && (
                          <span className="text-sm text-gray-500">({formData.review_count} reviews)</span>
                        )}
                      </div>
                    )}
                  </div>

                  {formData.description && (
                    <p className="text-gray-700 text-sm">{formData.description}</p>
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
