
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, FileText, LogOut, Home, Users, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [listingsResult, blogPostsResult] = await Promise.all([
        supabase.from('listings').select('id, status').eq('status', 'active'),
        supabase.from('blog_posts').select('id, status').eq('status', 'published')
      ]);

      return {
        activeListings: listingsResult.data?.length || 0,
        publishedPosts: blogPostsResult.data?.length || 0
      };
    }
  });

  const handleLogout = async () => {
    try {
      await signOut();
      toast({ title: 'Logged out successfully' });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({ title: 'Error logging out', variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your website content and settings</p>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeListings || 0}</div>
            <p className="text-xs text-muted-foreground">
              Published coliving spaces
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.publishedPosts || 0}</div>
            <p className="text-xs text-muted-foreground">
              Live blog articles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Manage Listings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Add, edit, and manage coliving space listings
            </p>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/admin/listings')}>
                View All Listings
              </Button>
              <Button variant="outline" onClick={() => navigate('/admin/listings/new')}>
                Add New Listing
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Manage Blog
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Create and manage SEO-optimized blog content
            </p>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/admin/blog')}>
                View All Posts
              </Button>
              <Button variant="outline" onClick={() => navigate('/admin/blog')}>
                Create New Post
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default AdminDashboard;
