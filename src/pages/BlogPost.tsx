
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User, Calendar, Share2 } from 'lucide-react';
import { useBlogPost } from '@/hooks/useBlogPosts';
import { Helmet } from 'react-helmet-async';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const { data: blogPost, isLoading, error } = useBlogPost(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adventure-orange mx-auto mb-4"></div>
            <p className="text-lg">Loading blog post...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">Blog post not found</p>
            <Button onClick={() => navigate('/blog')} className="bg-forest-green hover:bg-forest-green/90">
              Back to Blog
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPost.title,
        text: blogPost.excerpt || '',
        url: window.location.href
      });
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{blogPost.title} | Nomad Blog</title>
        <meta name="description" content={blogPost.excerpt || blogPost.content.substring(0, 160)} />
        <meta property="og:title" content={blogPost.title} />
        <meta property="og:description" content={blogPost.excerpt || blogPost.content.substring(0, 160)} />
        <meta property="og:type" content="article" />
        {blogPost.featured_image && <meta property="og:image" content={blogPost.featured_image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blogPost.title} />
        <meta name="twitter:description" content={blogPost.excerpt || blogPost.content.substring(0, 160)} />
        {blogPost.featured_image && <meta name="twitter:image" content={blogPost.featured_image} />}
        <link rel="canonical" href={`${window.location.origin}/blog/${blogPost.slug}`} />
        
        {/* Enhanced Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blogPost.title,
            "description": blogPost.excerpt,
            "image": blogPost.featured_image,
            "author": {
              "@type": "Person",
              "name": blogPost.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "NomadCo"
            },
            "datePublished": blogPost.created_at,
            "dateModified": blogPost.updated_at,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${window.location.origin}/blog/${blogPost.slug}`
            }
          })}
        </script>
      </Helmet>

      <Navigation />
      
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')}
            className="flex items-center text-forest-green hover:text-adventure-orange hover:bg-gray-50"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>

      <article className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-12">
            <Badge className="bg-forest-green text-white mb-6 text-sm px-4 py-2">
              {blogPost.category}
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-forest-green mb-8 leading-tight">
              {blogPost.title}
            </h1>
            
            {blogPost.excerpt && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {blogPost.excerpt}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-8 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span className="font-medium">{blogPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{new Date(blogPost.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric', 
                  year: 'numeric'
                })}</span>
              </div>
              {blogPost.read_time && (
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{blogPost.read_time}</span>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="border-forest-green text-forest-green hover:bg-forest-green hover:text-white"
              >
                <Share2 size={16} className="mr-2" />
                Share
              </Button>
            </div>
            
            {blogPost.featured_image && (
              <div className="mb-12">
                <img
                  src={blogPost.featured_image}
                  alt={blogPost.featured_image_alt || blogPost.title}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                />
                {blogPost.featured_image_alt && (
                  <p className="text-sm text-gray-500 mt-2 text-center italic">
                    {blogPost.featured_image_alt}
                  </p>
                )}
              </div>
            )}
          </header>

          {/* Content */}
          <div 
            className="prose prose-lg prose-forest max-w-none"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
            style={{
              color: '#374151',
              lineHeight: '1.8',
              fontSize: '1.125rem'
            }}
          />

          {/* Enhanced CTA Section */}
          <div className="mt-20 p-10 bg-gradient-to-br from-desert-beige to-desert-beige/80 rounded-2xl text-center shadow-lg">
            <div className="text-5xl mb-6">🌍</div>
            <h3 className="text-3xl font-serif font-bold text-forest-green mb-6">
              Ready to Start Your Nomad Journey?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join our community for exclusive deals and insider tips on the best co-living spaces worldwide. 
              Get access to verified reviews and member-only discounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-adventure-orange hover:bg-adventure-orange/90 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                onClick={() => navigate('/exclusive-deals')}
              >
                Join Our Community
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-forest-green text-forest-green hover:bg-forest-green hover:text-white px-8 py-4 text-lg font-semibold"
                onClick={() => navigate('/listings')}
              >
                Browse Listings
              </Button>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
