
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';
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
          <p className="text-lg">Loading blog post...</p>
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
            <Button onClick={() => navigate('/blog')}>
              Back to Blog
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
      </Helmet>

      <Navigation />
      
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')}
            className="flex items-center text-forest-green hover:text-adventure-orange"
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
            <Badge className="bg-forest-green text-white mb-4">
              {blogPost.category}
            </Badge>
            
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-forest-green mb-6">
              {blogPost.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{blogPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(blogPost.created_at).toLocaleDateString()}</span>
              </div>
              {blogPost.read_time && (
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{blogPost.read_time}</span>
                </div>
              )}
            </div>
            
            {blogPost.featured_image && (
              <img
                src={blogPost.featured_image}
                alt={blogPost.title}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
            )}
          </header>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
            style={{
              color: '#374151',
              lineHeight: '1.75'
            }}
          />

          {/* CTA Section */}
          <div className="mt-16 p-8 bg-desert-beige rounded-xl text-center">
            <h3 className="text-2xl font-serif font-bold text-forest-green mb-4">
              Ready to Start Your Nomad Journey?
            </h3>
            <p className="text-gray-600 mb-6">
              Join our community for exclusive deals and insider tips on the best co-living spaces worldwide.
            </p>
            <Button 
              className="adventure-button"
              onClick={() => navigate('/exclusive-deals')}
            >
              Join Our Community
            </Button>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
