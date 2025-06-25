import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Eye, LogOut, Settings, Home, Building } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost, useDeleteBlogPost } from '@/hooks/useBlogPosts';
import BlogPostForm from '@/components/BlogPostForm';
import AdminManagement from '@/components/AdminManagement';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SitemapManagement from '@/components/SitemapManagement';

const AdminBlog = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
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
        refetch();
      } catch (error) {
        console.error('Error deleting blog post:', error);
        toast({ title: 'Error deleting blog post', variant: 'destructive' });
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPost(null);
    refetch();
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
          <h1 className="text-3xl font-bold">Blog Administration</h1>
          <p className="text-gray-600 mt-2">Manage your SEO-optimized blog posts and administrators</p>
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
          <Button variant="outline" onClick={() => navigate('/admin/listings')}>
            <Building className="mr-2 h-4 w-4" />
            Manage Listings
          </Button>
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

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Blog Posts</TabsTrigger>
          <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
          <TabsTrigger value="admins">Admin Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Blog Posts</h2>
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
        </TabsContent>
        
        <TabsContent value="sitemap" className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Sitemap Management</h2>
          </div>
          <SitemapManagement />
        </TabsContent>
        
        <TabsContent value="admins" className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Administrator Management</h2>
          </div>
          <AdminManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminBlog;
