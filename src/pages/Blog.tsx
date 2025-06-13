
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBlogPosts } from '@/hooks/useBlogPosts';

const Blog = () => {
  const navigate = useNavigate();
  const { data: blogPosts, isLoading, error } = useBlogPosts();

  const categories = ["All", "Guides", "Nomad Lifestyle", "Reviews", "Destination Spotlights"];

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  const featuredPosts = blogPosts?.filter(post => post.featured) || [];
  const regularPosts = blogPosts?.filter(post => !post.featured) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <p className="text-lg">Loading blog posts...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">Error loading blog posts</p>
            <p className="text-gray-600">Please try refreshing the page</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="bg-forest-green text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6">
            The Nomad Blog
          </h1>
          <p className="text-xl text-gray-100">
            Stories, guides, and insights from the world of remote work and digital nomadism. 
            Real experiences from real nomads.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={category === "All" ? "adventure-button" : "outline-button"}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.map((post) => (
        <section key={post.id} className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Badge className="bg-adventure-orange text-white mb-4">Featured</Badge>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-forest-green text-white mb-4">
                  {post.category}
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-serif font-bold text-forest-green mb-4">
                  {post.title}
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{post.read_time}</span>
                  </div>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <Button 
                  className="adventure-button"
                  onClick={() => handlePostClick(post.slug)}
                >
                  Read Full Article
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </div>
              <div className="cursor-pointer" onClick={() => handlePostClick(post.slug)}>
                {post.featured_image && (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-forest-green mb-12 text-center">
            Latest Articles
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <Card 
                key={post.id} 
                className="overflow-hidden card-shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handlePostClick(post.slug)}
              >
                <div className="relative">
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <Badge className="absolute top-4 left-4 bg-forest-green text-white">
                    {post.category}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-bold text-forest-green mb-3">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{post.read_time}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="outline-button w-full">
                    Read More
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {blogPosts?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blog posts found</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-forest-green text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-6">
            Stay Updated
          </h2>
          <p className="text-xl text-gray-100 mb-8">
            Get the latest nomad insights, exclusive deals, and destination guides 
            delivered to your inbox weekly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800"
            />
            <Button className="adventure-button">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
