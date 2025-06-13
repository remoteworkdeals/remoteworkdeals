
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, ArrowRight, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Helmet } from 'react-helmet-async';

const Blog = () => {
  const navigate = useNavigate();
  const { data: blogPosts, isLoading, error } = useBlogPosts();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Guides", "Nomad Lifestyle", "Reviews", "Destination Spotlights", "Tips & Tricks", "Community"];

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  // Filter posts based on selected category
  const filteredPosts = blogPosts?.filter(post => 
    selectedCategory === "All" || post.category === selectedCategory
  ) || [];

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  console.log('Blog page - Posts received:', blogPosts);
  console.log('Blog page - Loading state:', isLoading);
  console.log('Blog page - Error state:', error);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Helmet>
          <title>Blog - Digital Nomad Stories & Guides</title>
          <meta name="description" content="Discover the latest insights, guides, and stories from the world of digital nomadism and remote work." />
        </Helmet>
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adventure-orange mx-auto mb-4"></div>
            <p className="text-lg">Loading blog posts...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Helmet>
          <title>Error - Blog Unavailable</title>
        </Helmet>
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">Error loading blog posts</p>
            <p className="text-gray-600">Please try refreshing the page</p>
            <p className="text-sm text-gray-400 mt-2">Error: {error.message}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Blog - Digital Nomad Stories & Guides | NomadCo</title>
        <meta name="description" content="Stories, guides, and insights from the world of remote work and digital nomadism. Real experiences from real nomads." />
        <meta property="og:title" content="The Nomad Blog - Digital Nomad Stories & Guides" />
        <meta property="og:description" content="Stories, guides, and insights from the world of remote work and digital nomadism." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/blog`} />
        
        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "The Nomad Blog",
            "description": "Stories, guides, and insights from the world of remote work and digital nomadism",
            "url": `${window.location.origin}/blog`,
            "publisher": {
              "@type": "Organization",
              "name": "NomadCo"
            }
          })}
        </script>
      </Helmet>

      <Navigation />
      
      {/* Enhanced Header */}
      <section className="bg-gradient-to-br from-forest-green to-forest-green/90 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-serif font-bold mb-8 leading-tight">
            The Nomad Blog
          </h1>
          <p className="text-xl lg:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Stories, guides, and insights from the world of remote work and digital nomadism. 
            Real experiences from real nomads.
          </p>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? "default" : "outline"}
                className={`transition-all duration-200 ${
                  category === selectedCategory 
                    ? "bg-forest-green hover:bg-forest-green/90 text-white shadow-md" 
                    : "border-gray-300 hover:border-forest-green hover:text-forest-green"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          {selectedCategory !== "All" && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Showing {filteredPosts.length} posts in "{selectedCategory}"
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Featured Posts */}
      {featuredPosts.map((post, index) => (
        <section key={post.id} className="py-20 bg-gradient-to-r from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Badge className="bg-adventure-orange text-white text-sm px-4 py-2 font-semibold">
                ⭐ Featured Article
              </Badge>
            </div>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="mb-6">
                  <Badge className="bg-forest-green text-white mb-4 text-sm px-3 py-1">
                    {post.category}
                  </Badge>
                </div>
                <h2 className="text-4xl lg:text-5xl font-serif font-bold text-forest-green mb-6 leading-tight">
                  {post.title}
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-8 text-sm text-gray-500 mb-8">
                  <div className="flex items-center gap-2">
                    <User size={18} />
                    <span className="font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{post.read_time}</span>
                  </div>
                  <span>{new Date(post.created_at).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</span>
                </div>
                <div className="flex gap-4">
                  <Button 
                    className="bg-adventure-orange hover:bg-adventure-orange/90 text-white px-8 py-3 text-lg"
                    onClick={() => handlePostClick(post.slug)}
                  >
                    Read Full Article
                    <ArrowRight size={20} className="ml-2" />
                  </Button>
                  <Button variant="outline" size="lg" className="px-6">
                    <Share2 size={18} className="mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              <div className="order-1 lg:order-2 cursor-pointer group" onClick={() => handlePostClick(post.slug)}>
                {post.featured_image && (
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-300">
                    <img
                      src={post.featured_image}
                      alt={post.featured_image_alt || post.title}
                      className="w-full h-96 lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Enhanced Blog Posts Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-forest-green mb-4">
              {selectedCategory === "All" ? "Latest Articles" : `${selectedCategory} Articles`}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover insights, tips, and stories from our community of digital nomads
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <Card 
                key={post.id} 
                className="overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 animate-fade-in cursor-pointer group border-0"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handlePostClick(post.slug)}
              >
                <div className="relative">
                  {post.featured_image ? (
                    <div className="relative overflow-hidden">
                      <img
                        src={post.featured_image}
                        alt={post.featured_image_alt || post.title}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ) : (
                    <div className="w-full h-56 bg-gradient-to-br from-forest-green to-adventure-orange flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">No Image</span>
                    </div>
                  )}
                  <Badge className="absolute top-4 left-4 bg-forest-green/90 text-white shadow-lg backdrop-blur-sm">
                    {post.category}
                  </Badge>
                </div>
                
                <CardContent className="p-8">
                  <h3 className="text-2xl font-serif font-bold text-forest-green mb-4 leading-tight group-hover:text-adventure-orange transition-colors duration-200">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed text-base">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span className="font-medium">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{post.read_time}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full border-2 border-forest-green text-forest-green hover:bg-forest-green hover:text-white transition-all duration-200">
                    Read More
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-xl mb-2">
                {selectedCategory === "All" 
                  ? "No published blog posts found" 
                  : `No posts found in "${selectedCategory}"`
                }
              </p>
              <p className="text-gray-400 text-sm mb-6">
                {selectedCategory === "All" 
                  ? "Check the admin panel to make sure posts are marked as 'published'" 
                  : "Try selecting a different category or check back later"
                }
              </p>
              {selectedCategory !== "All" && (
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCategory("All")}
                  className="border-forest-green text-forest-green hover:bg-forest-green hover:text-white"
                >
                  View All Posts
                </Button>
              )}
            </div>
          ) : null}
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <section className="py-24 bg-gradient-to-br from-forest-green via-forest-green/95 to-forest-green text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">✉️</div>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-8">
            Stay in the Loop
          </h2>
          <p className="text-xl text-gray-100 mb-10 leading-relaxed">
            Get the latest nomad insights, exclusive deals, and destination guides 
            delivered to your inbox weekly. Join 10,000+ digital nomads!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl text-gray-800 border-0 shadow-lg focus:ring-2 focus:ring-adventure-orange focus:outline-none"
            />
            <Button className="bg-adventure-orange hover:bg-adventure-orange/90 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
              Subscribe Free
            </Button>
          </div>
          <p className="text-sm text-gray-300 mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
