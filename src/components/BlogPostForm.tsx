
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { BlogPost, useCreateBlogPost, useUpdateBlogPost } from '@/hooks/useBlogPosts';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ImageUpload';
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
    featured: false,
    status: 'published' as 'draft' | 'published', // Default to published for immediate visibility
    read_time: '',
    meta_title: '',
    meta_description: '',
    tags: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();

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
        featured: post.featured,
        status: post.status,
        read_time: post.read_time || '',
        meta_title: post.title,
        meta_description: post.excerpt || '',
        tags: ''
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
        featured: formData.featured,
        status: formData.status, // Explicitly use the form status
        read_time: formData.read_time || estimateReadTime(formData.content)
      };

      console.log('Blog post data being submitted:', blogPostData);

      if (post) {
        await updateMutation.mutateAsync({ id: post.id, ...blogPostData });
        toast({ title: 'Blog post updated successfully!' });
      } else {
        const result = await createMutation.mutateAsync(blogPostData);
        console.log('Created blog post result:', result);
        toast({ title: 'Blog post created successfully!' });
      }
      
      // Comprehensive cache invalidation with proper timing
      console.log('Invalidating all blog queries...');
      
      // First invalidate all queries
      await queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      
      // Then force refetch with a small delay to ensure database consistency
      setTimeout(async () => {
        await queryClient.refetchQueries({ queryKey: ['blog-posts'] });
        await queryClient.refetchQueries({ queryKey: ['admin-blog-posts'] });
        console.log('Forced refetch completed');
      }, 500);
      
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

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={onClose} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog Management
        </Button>
        <h1 className="text-3xl font-bold">
          {post ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
        <p className="text-gray-600 mt-2">
          Fill out all fields for optimal SEO performance
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter an engaging title"
                  required
                />
                <p className="text-sm text-gray-500">
                  {formData.title.length}/60 characters (recommended for SEO)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleExcerptChange(e.target.value)}
                rows={3}
                placeholder="Brief description of your post (used for previews and meta description)"
              />
              <p className="text-sm text-gray-500">
                {formData.excerpt.length}/160 characters (recommended for meta description)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleContentChange(e.target.value)}
                rows={20}
                placeholder="Write your blog post content here..."
                required
              />
              <p className="text-sm text-gray-500">
                Word count: {formData.content.trim().split(/\s+/).filter(word => word.length > 0).length} | 
                Estimated read time: {formData.read_time}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* SEO Optimization */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Optimization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                placeholder="SEO optimized title for search engines"
              />
              <p className="text-sm text-gray-500">
                {formData.meta_title.length}/60 characters (ideal length for Google)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                rows={3}
                placeholder="Description that appears in search engine results"
              />
              <p className="text-sm text-gray-500">
                {formData.meta_description.length}/160 characters (optimal for search snippets)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="tag1, tag2, tag3 (comma-separated)"
              />
              <p className="text-sm text-gray-500">
                Add relevant tags to improve discoverability
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Post Details */}
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
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
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Author name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="read_time">Read Time</Label>
                <Input
                  id="read_time"
                  value={formData.read_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, read_time: e.target.value }))}
                  placeholder="Auto-calculated"
                  disabled
                />
              </div>
            </div>

            <ImageUpload
              onImageUploaded={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
              currentImage={formData.featured_image}
              label="Featured Image"
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Publishing Options */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured">Featured Post</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'draft' | 'published') => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="adventure-button">
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default BlogPostForm;
