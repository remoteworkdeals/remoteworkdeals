import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BlogPostForm from '@/components/BlogPostForm';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, FileText, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import SitemapManager from '@/components/SitemapManager';

const AdminBlog = () => {
  const { user, loading } = useAuth();
  const { data: blogPosts = [], isLoading: blogLoading, refetch } = useBlogPosts();
  const [selectedPost, setSelectedPost] = useState<any>(null);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleEditPost = (post: any) => {
    setSelectedPost(post);
  };

  const handleFormSuccess = () => {
    setSelectedPost(null);
    refetch();
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-forest-green">Blog Management</h1>
          <p className="text-gray-600 mt-2">Create, edit, and manage your blog posts and SEO settings</p>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText size={18} />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Edit size={18} />
              {selectedPost ? 'Edit Post' : 'Create Post'}
            </TabsTrigger>
            <TabsTrigger value="sitemap" className="flex items-center gap-2">
              <Globe size={18} />
              SEO & Sitemap
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Blog Posts</CardTitle>
                <CardDescription>
                  Manage your published and draft blog posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {blogLoading ? (
                  <div className="text-center py-8">Loading blog posts...</div>
                ) : blogPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No blog posts yet.</p>
                    <p className="text-sm text-gray-500">Start by creating your first blog post!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blogPosts.map((post) => (
                      <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{post.title}</h3>
                              <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                {post.status}
                              </Badge>
                              {post.featured && (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            {post.excerpt && (
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.excerpt}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>By {post.author}</span>
                              <span>•</span>
                              <span>{post.category}</span>
                              <span>•</span>
                              <span>{new Date(post.created_at).toLocaleDateString()}</span>
                              {post.read_time && (
                                <>
                                  <span>•</span>
                                  <span>{post.read_time}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {post.status === 'published' && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/blog/${post.slug}`} target="_blank">
                                  <Eye size={16} />
                                </Link>
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditPost(post)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            <BlogPostForm 
              post={selectedPost}
              onClose={handleFormSuccess}
            />
          </TabsContent>

          <TabsContent value="sitemap" className="mt-6">
            <SitemapManager />
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminBlog;
