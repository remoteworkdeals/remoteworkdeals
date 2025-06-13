import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost, useDeleteBlogPost } from '@/hooks/useBlogPosts';
import BlogPostForm from '@/components/BlogPostForm';
import { useToast } from '@/hooks/use-toast';

const AdminBlog = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();
  const deleteMutation = useDeleteBlogPost();

  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      console.log('Fetching all blog posts for admin...');
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching admin blog posts:', error);
        throw error;
      }
      console.log('Fetched admin blog posts:', data);
      return data as BlogPost[];
    }
  });

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast({ title: 'Blog post deleted successfully' });
        refetch(); // Manually refetch to ensure UI updates
      } catch (error) {
        console.error('Error deleting blog post:', error);
        toast({ title: 'Error deleting blog post', variant: 'destructive' });
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPost(null);
    refetch(); // Refetch when form closes to ensure data is fresh
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (showForm) {
    return (
      <BlogPostForm 
        post={editingPost} 
        onClose={handleFormClose}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-gray-600 mt-2">Create and manage your SEO-optimized blog posts</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="adventure-button">
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="grid gap-6">
        {posts?.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                  <div className="flex gap-2 mb-2">
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                      {post.status}
                    </Badge>
                    <Badge variant="outline">{post.category}</Badge>
                    {post.featured && <Badge variant="destructive">Featured</Badge>}
                  </div>
                  <p className="text-sm text-gray-600">
                    By {post.author} • {new Date(post.created_at).toLocaleDateString()} • {post.read_time || 'No read time'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{post.excerpt || 'No excerpt available'}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No blog posts yet</p>
          <Button onClick={() => setShowForm(true)} className="adventure-button">
            <Plus className="mr-2 h-4 w-4" />
            Create your first post
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
