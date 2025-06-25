import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, LogOut, Home, RefreshCw } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/listing';
import { useDeleteListing } from '@/hooks/useListings';
import ListingForm from '@/components/ListingForm';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SitemapManagement from '@/components/SitemapManagement';

const AdminListings = () => {
  const navigate = useNavigate();
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { user, userRole, signOut } = useAuth();
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteListing();

  const { data: listings, isLoading, refetch } = useQuery({
    queryKey: ['admin-listings'],
    queryFn: async () => {
      console.log('=== FETCHING ADMIN LISTINGS ===');
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching admin listings:', error);
        throw error;
      }
      console.log('Fetched admin listings count:', data?.length);
      return data as Listing[];
    }
  });

  const handleEdit = (listing: Listing) => {
    console.log('=== EDITING LISTING ===');
    console.log('Editing listing:', listing.id);
    setEditingListing(listing);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast({ title: 'Listing deleted successfully' });
        refetch();
      } catch (error) {
        console.error('Error deleting listing:', error);
        toast({ title: 'Error deleting listing', variant: 'destructive' });
      }
    }
  };

  const handleFormClose = async () => {
    console.log('=== FORM CLOSING ===');
    console.log('Form is being closed, invalidating cache and refetching');
    setEditingListing(null);
    
    await handleRefresh();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      await queryClient.invalidateQueries({ queryKey: ['listings'] });
      
      console.log('Forcing refetch after refresh');
      await refetch();
      
      toast({ title: 'Data refreshed successfully' });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({ title: 'Error refreshing data', variant: 'destructive' });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({ title: 'Logged out successfully' });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({ title: 'Error logging out', variant: 'destructive' });
    }
  };

  const handleAddNewListing = () => {
    console.log('=== NAVIGATING TO ADD NEW LISTING ===');
    navigate('/admin/listings/new');
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  // Show edit form if editing a listing
  if (editingListing) {
    return (
      <ErrorBoundary
        fallback={
          <div className="max-w-4xl mx-auto p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Form</h2>
              <p className="text-red-600 mb-4">
                There was an error loading the listing form. Please try again.
              </p>
              <Button onClick={() => setEditingListing(null)} variant="outline">
                Back to Listings
              </Button>
            </div>
          </div>
        }
      >
        <ListingForm 
          listing={editingListing} 
          onClose={handleFormClose}
        />
      </ErrorBoundary>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Coliving Deals Administration</h1>
          <p className="text-gray-600 mt-2">Manage your coliving listings that appear live on the website</p>
          {user && (
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm text-gray-500">
                Logged in as: {user.email}
              </p>
              <Badge variant="default">{userRole}</Badge>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open('/', '_blank')}>
            <Home className="mr-2 h-4 w-4" />
            View Website
          </Button>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <SitemapManagement />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Coliving Listings ({listings?.length || 0})</h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleAddNewListing} className="adventure-button">
            <Plus className="mr-2 h-4 w-4" />
            Add New Listing
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {listings?.map((listing) => (
          <Card key={listing.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    {listing.featured_image && (
                      <img 
                        src={listing.featured_image} 
                        alt={listing.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{listing.title}</CardTitle>
                      <p className="text-gray-600">{listing.location}, {listing.country}</p>
                      {listing.usp && (
                        <p className="text-sm text-adventure-orange font-medium mt-1">{listing.usp}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                      {listing.status}
                    </Badge>
                    <Badge variant="outline">{listing.type}</Badge>
                    {listing.featured && (
                      <Badge variant="default" className="bg-yellow-500 text-white">
                        Featured
                      </Badge>
                    )}
                    {listing.discounted_price && (
                      <Badge variant="destructive">
                        {listing.discount_type === 'percentage' 
                          ? `${listing.discount_value}% OFF`
                          : `€${listing.discount_value} OFF`
                        }
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>
                      Starting from €{listing.original_price}
                      {listing.discounted_price && (
                        <span className="text-green-600 font-medium ml-2">
                          Now €{listing.discounted_price}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 ml-1">
                        / {listing.pricing_unit}
                      </span>
                    </span>
                    {listing.minimum_stay && (
                      <span>
                        Min stay: {listing.minimum_stay} {listing.minimum_stay_unit}
                      </span>
                    )}
                    {listing.capacity && <span>{listing.capacity} capacity</span>}
                    {listing.rating && listing.rating > 0 && (
                      <span>★ {listing.rating} ({listing.review_count} reviews)</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(listing)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(`/listing/${listing.id}`, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(listing.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {listing.description && (
              <CardContent>
                <p className="text-gray-600 line-clamp-2">{listing.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {listings?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No listings yet</p>
          <Button onClick={handleAddNewListing} className="adventure-button">
            <Plus className="mr-2 h-4 w-4" />
            Create your first listing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminListings;
