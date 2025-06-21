
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useListings } from '@/hooks/useListings';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, MapPin, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const { data: blogPosts = [], isLoading: blogLoading } = useBlogPosts();
  const { listings, loading: listingsLoading } = useListings();

  // Update search query when URL params change
  useEffect(() => {
    const searchParam = searchParams.get('search') || '';
    setSearchQuery(searchParam);
  }, [searchParams]);

  // Filter blog posts based on search
  const filteredBlogPosts = blogPosts.filter(post => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return post.title.toLowerCase().includes(query) ||
           (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
           post.content.toLowerCase().includes(query);
  });

  // Filter listings based on search
  const filteredListings = listings.filter(listing => {
    if (!searchQuery) return false; // Only show listings when searching
    const query = searchQuery.toLowerCase();
    return listing.title.toLowerCase().includes(query) ||
           (listing.description && listing.description.toLowerCase().includes(query)) ||
           listing.location.toLowerCase().includes(query);
  });

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const hasResults = filteredBlogPosts.length > 0 || filteredListings.length > 0;
  const isSearching = Boolean(searchQuery);

  return (
    <>
      <Helmet>
        <title>{isSearching ? `Search: ${searchQuery}` : 'Blog'} - RemoteWork.Deals</title>
        <meta name="description" content={isSearching ? `Search results for "${searchQuery}"` : "Discover the latest insights on remote work, coliving spaces, and digital nomad lifestyle."} />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Navigation />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-forest-green mb-6">
              {isSearching ? 'Search Results' : 'Remote Work Blog'}
            </h1>
            {!isSearching && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the latest insights on remote work, coliving spaces, and digital nomad lifestyle.
              </p>
            )}
          </div>

          {/* Search Results Summary */}
          {isSearching && (
            <div className="mb-8 text-center">
              <p className="text-gray-600 mb-4">
                Found {filteredBlogPosts.length} blog post{filteredBlogPosts.length !== 1 ? 's' : ''} 
                {filteredListings.length > 0 && ` and ${filteredListings.length} listing${filteredListings.length !== 1 ? 's' : ''}`} 
                for "<span className="font-semibold">{searchQuery}</span>"
              </p>
              <Button 
                variant="outline" 
                onClick={clearSearch}
                className="text-gray-600"
              >
                Clear search
              </Button>
            </div>
          )}

          {/* Loading State */}
          {(blogLoading || listingsLoading) ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adventure-orange"></div>
            </div>
          ) : !hasResults && isSearching ? (
            /* No Results */
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">No results found</h3>
              <p className="text-gray-600 mb-6">Try different keywords or browse all content below.</p>
              <Button onClick={clearSearch} className="adventure-button">
                Browse All Content
              </Button>
            </div>
          ) : (
            /* Results */
            <div className="space-y-12">
              {/* Listings Results (only show when searching) */}
              {isSearching && filteredListings.length > 0 && (
                <section>
                  <h2 className="text-2xl font-serif font-bold text-forest-green mb-6 flex items-center">
                    <MapPin className="mr-2 h-6 w-6 text-adventure-orange" />
                    Coliving Listings ({filteredListings.length})
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map((listing) => (
                      <Link key={listing.id} to={`/listing/${listing.id}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                          {listing.featured_image && (
                            <div className="aspect-video overflow-hidden rounded-t-lg">
                              <img 
                                src={listing.featured_image} 
                                alt={listing.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardContent className="p-6">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{listing.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{listing.location}, {listing.country}</p>
                            {listing.description && (
                              <p className="text-gray-600 text-sm line-clamp-3 mb-4">{listing.description}</p>
                            )}
                            <div className="flex justify-between items-center">
                              <Badge variant="secondary" className="bg-adventure-orange/10 text-adventure-orange">
                                Listing
                              </Badge>
                              <span className="text-adventure-orange font-semibold">
                                ${listing.original_price}/{listing.pricing_unit}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Blog Posts Results */}
              <section>
                {isSearching && (
                  <h2 className="text-2xl font-serif font-bold text-forest-green mb-6 flex items-center">
                    <FileText className="mr-2 h-6 w-6 text-forest-green" />
                    Blog Posts ({filteredBlogPosts.length})
                  </h2>
                )}
                
                {filteredBlogPosts.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBlogPosts.map((post) => (
                      <Link key={post.id} to={`/blog/${post.slug}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                          {post.featured_image && (
                            <div className="aspect-video overflow-hidden rounded-t-lg">
                              <img 
                                src={post.featured_image} 
                                alt={post.featured_image_alt || post.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline">{post.category}</Badge>
                              {post.read_time && (
                                <span className="text-sm text-gray-500">{post.read_time}</span>
                              )}
                            </div>
                            <h3 className="font-serif font-bold text-xl mb-2 line-clamp-2">{post.title}</h3>
                            {post.excerpt && (
                              <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                            )}
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center text-sm text-gray-500">
                              <User size={16} className="mr-1" />
                              <span className="mr-4">{post.author}</span>
                              <Calendar size={16} className="mr-1" />
                              <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : !isSearching ? (
                  <div className="text-center py-12">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">No blog posts yet</h3>
                    <p className="text-gray-600">Check back soon for exciting content!</p>
                  </div>
                ) : null}
              </section>
            </div>
          )}
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Blog;
