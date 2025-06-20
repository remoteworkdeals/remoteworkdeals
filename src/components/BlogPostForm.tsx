import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { BlogPost, useCreateBlogPost, useUpdateBlogPost } from '@/hooks/useBlogPosts';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BlogImageUpload from '@/components/BlogImageUpload';
import RichTextEditor from '@/components/RichTextEditor';
import SEOFields from '@/components/SEOFields';
import { useQueryClient } from '@tanstack/react-query';

interface BlogPostFormProps {
  post?: BlogPost | null;
  onClose: () => void;
}

const BlogPostForm = ({ post, onClose }: BlogPostFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    category: '',
    author: '',
    featured_image: '',
    featured_image_alt: '',
    featured: false,
    status: 'published' as 'draft' | 'published',
    read_time: '',
    linked_listings: [] as number[],
    meta_title: '',
    meta_description: '',
    focus_keyword: '',
    canonical_url: ''
  });

  const [availableListings, setAvailableListings] = useState<Array<{id: number, title: string}>>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();

  useEffect(() => {
    // Fetch available listings for linking
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('id, title')
        .eq('status', 'active')
        .order('title');
      
      if (!error && data) {
        setAvailableListings(data);
      }
    };
    
    fetchListings();
  }, []);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        slug: post.slug,
        category: post.category,
        author: post.author,
        featured_image: post.featured_image || '',
        featured_image_alt: post.featured_image_alt || '',
        featured: post.featured,
        status: post.status,
        read_time: post.read_time || '',
        linked_listings: post.linked_listings || [],
        meta_title: post.title,
        meta_description: post.excerpt || '',
        focus_keyword: '',
        canonical_url: ''
      });
    }
  }, [post]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
      meta_title: prev.meta_title || title
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content,
      read_time: estimateReadTime(content)
    }));
  };

  const handleExcerptChange = (excerpt: string) => {
    setFormData(prev => ({
      ...prev,
      excerpt,
      meta_description: prev.meta_description || excerpt
    }));
  };

  const handleImageUpload = (url: string, alt: string) => {
    setFormData(prev => ({
      ...prev,
      featured_image: url,
      featured_image_alt: alt
    }));
  };

  const handleListingToggle = (listingId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      linked_listings: checked 
        ? [...prev.linked_listings, listingId]
        : prev.linked_listings.filter(id => id !== listingId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' });
      return;
    }
    
    if (!formData.content.trim()) {
      toast({ title: 'Content is required', variant: 'destructive' });
      return;
    }
    
    if (!formData.category) {
      toast({ title: 'Category is required', variant: 'destructive' });
      return;
    }
    
    if (!formData.author.trim()) {
      toast({ title: 'Author is required', variant: 'destructive' });
      return;
    }

    console.log('Submitting blog post with status:', formData.status);

    try {
      const blogPostData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || formData.content.substring(0, 150) + '...',
        slug: formData.slug.trim() || generateSlug(formData.title),
        category: formData.category,
        author: formData.author.trim(),
        featured_image: formData.featured_image.trim() || null,
        featured_image_alt: formData.featured_image_alt.trim() || null,
        featured: formData.featured,
        status: formData.status,
        read_time: formData.read_time || estimateReadTime(formData.content),
        linked_listings: formData.linked_listings.length > 0 ? formData.linked_listings : null
      };

      console.log('Blog post data being submitted:', blogPostData);

      if (post) {
        await updateMutation.mutateAsync({ id: post.id, ...blogPostData });
        toast({ title: 'Blog post updated successfully!', description: 'Your changes have been saved.' });
      } else {
        const result = await createMutation.mutateAsync(blogPostData);
        console.log('Created blog post result:', result);
        toast({ 
          title: 'Blog post created and published successfully!', 
          description: 'Your new post is now live and visible to readers.' 
        });
      }
      
      // Force immediate cache invalidation and refresh
      console.log('Forcing immediate cache refresh...');
      await queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      await queryClient.refetchQueries({ queryKey: ['blog-posts'] });
      
      onClose();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({ 
        title: 'Error saving blog post', 
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive' 
      });
    }
  };

  const handlePreview = () => {
    if (formData.slug) {
      window.open(`/blog/${formData.slug}`, '_blank');
    } else {
      toast({ 
        title: 'Save first to preview', 
        description: 'Please save the post before previewing',
        variant: 'destructive' 
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={onClose} className="mb-4 hover:bg-gray-100">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog Management
        </Button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-forest-green">
              {post ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Create SEO-optimized content with proper structure and metadata
            </p>
          </div>
          {post && (
            <Button 
              variant="outline" 
              onClick={handlePreview}
              className="border-forest-green text-forest-green hover:bg-forest-green hover:text-white"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview Post
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-xl text-forest-green">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            {/* ... keep existing code (title, slug, excerpt fields) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter an engaging, SEO-friendly title"
                  required
                  className="text-lg p-4"
                />
                <p className="text-sm text-gray-500">
                  This will be your H1 heading on the page
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-base font-semibold">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                  required
                  className="p-4"
                />
                <p className="text-sm text-gray-500">
                  Will be: /blog/{formData.slug}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-base font-semibold">Excerpt</Label>
              <Input
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleExcerptChange(e.target.value)}
                placeholder="Brief, compelling description (used for previews)"
                className="text-base p-4"
              />
              <p className="text-sm text-gray-500">
                {formData.excerpt.length}/160 characters (also used as default meta description)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rich Text Content Editor */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-xl text-forest-green">Content Editor</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-2">
              <Label className="text-base font-semibold">Content * (Markdown Supported)</Label>
              <RichTextEditor
                content={formData.content}
                onChange={handleContentChange}
                placeholder="Write your engaging blog post content here... Use ## for H2 headings, ### for H3 headings"
              />
              <p className="text-sm text-gray-500">
                Word count: {formData.content.trim().split(/\s+/).filter(word => word.length > 0).length} | 
                Estimated read time: {formData.read_time}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Linked Colivings */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-xl text-forest-green">Link to Colivings</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                Select colivings to link to this blog post (optional)
              </Label>
              <p className="text-sm text-gray-500">
                Linked colivings will show this blog post in their "Read more about this Coliving" section
              </p>
              
              {availableListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto border rounded-lg p-4">
                  {availableListings.map((listing) => (
                    <div key={listing.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`listing-${listing.id}`}
                        checked={formData.linked_listings.includes(listing.id)}
                        onCheckedChange={(checked) => handleListingToggle(listing.id, checked as boolean)}
                      />
                      <Label 
                        htmlFor={`listing-${listing.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {listing.title}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No active colivings available to link. Create some listings first.
                </p>
              )}
              
              {formData.linked_listings.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    This blog post will appear on {formData.linked_listings.length} coliving page{formData.linked_listings.length > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SEO Optimization Fields */}
        <SEOFields
          metaTitle={formData.meta_title}
          metaDescription={formData.meta_description}
          focusKeyword={formData.focus_keyword}
          canonicalUrl={formData.canonical_url}
          onMetaTitleChange={(value) => setFormData(prev => ({ ...prev, meta_title: value }))}
          onMetaDescriptionChange={(value) => setFormData(prev => ({ ...prev, meta_description: value }))}
          onFocusKeywordChange={(value) => setFormData(prev => ({ ...prev, focus_keyword: value }))}
          onCanonicalUrlChange={(value) => setFormData(prev => ({ ...prev, canonical_url: value }))}
          title={formData.title}
          content={formData.content}
          slug={formData.slug}
        />

        {/* Featured Image */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-xl text-forest-green">Featured Image & Visual Content</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <BlogImageUpload
              onImageUploaded={handleImageUpload}
              currentImage={formData.featured_image}
              currentAlt={formData.featured_image_alt}
              label="Featured Image"
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Post Details */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-xl text-forest-green">Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-semibold">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="p-4">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Guides">Guides</SelectItem>
                    <SelectItem value="Nomad Lifestyle">Nomad Lifestyle</SelectItem>
                    <SelectItem value="Reviews">Reviews</SelectItem>
                    <SelectItem value="Destination Spotlights">Destination Spotlights</SelectItem>
                    <SelectItem value="Tips & Tricks">Tips & Tricks</SelectItem>
                    <SelectItem value="Community">Community</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author" className="text-base font-semibold">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Author name"
                  required
                  className="p-4"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publishing Options */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-xl text-forest-green">Publishing Options</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured" className="text-base font-semibold">Featured Post</Label>
                  <span className="text-sm text-gray-500">(Will appear prominently on blog page)</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-base font-semibold">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'draft' | 'published') => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="w-40 p-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">📝 Draft</SelectItem>
                      <SelectItem value="published">🌐 Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="bg-adventure-orange hover:bg-adventure-orange/90 text-white px-8 py-4 text-lg font-semibold shadow-lg"
              >
                <Save className="mr-2 h-5 w-5" />
                {isLoading ? 'Saving...' : (post ? 'Update Post' : 'Create & Publish Post')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default BlogPostForm;
