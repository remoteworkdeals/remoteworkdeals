
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  slug: string;
  category: string;
  author: string;
  featured_image: string | null;
  featured: boolean;
  status: 'draft' | 'published';
  read_time: string | null;
  created_at: string;
  updated_at: string;
}

export const useBlogPosts = () => {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      console.log('Fetching all blog posts from database...');
      
      // First, let's check what's actually in the database
      const { data: allPosts, error: allPostsError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('All posts in database:', allPosts);
      console.log('Database query error:', allPostsError);
      
      if (allPostsError) {
        console.error('Error fetching all blog posts:', allPostsError);
        throw allPostsError;
      }
      
      // Now filter for published posts
      const publishedPosts = allPosts?.filter(post => post.status === 'published') || [];
      console.log('Published posts:', publishedPosts);
      console.log('Total posts found:', allPosts?.length || 0);
      console.log('Published posts found:', publishedPosts.length);
      
      return publishedPosts as BlogPost[];
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      console.log('Fetching blog post by slug:', slug);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching blog post:', error);
        throw error;
      }
      console.log('Fetched blog post:', data);
      return data as BlogPost | null;
    },
    enabled: !!slug
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating blog post with data:', post);
      
      // Prepare the data for insertion
      const insertData = {
        title: post.title.trim(),
        content: post.content.trim(),
        excerpt: post.excerpt?.trim() || null,
        slug: post.slug.trim(),
        category: post.category,
        author: post.author.trim(),
        featured_image: post.featured_image?.trim() || null,
        featured: post.featured || false,
        status: post.status || 'published',
        read_time: post.read_time?.trim() || null,
        updated_at: new Date().toISOString()
      };
      
      console.log('Prepared insert data:', insertData);
      
      // Create the blog post
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([insertData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating blog post:', error);
        throw new Error(`Failed to create blog post: ${error.message}`);
      }
      
      console.log('Successfully created blog post:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Blog post created successfully, invalidating queries...');
      // Invalidate and refetch all blog queries immediately
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      
      // Force immediate refetch
      queryClient.refetchQueries({ queryKey: ['blog-posts'] });
    },
    onError: (error) => {
      console.error('Blog post creation failed:', error);
    }
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...post }: Partial<BlogPost> & { id: string }) => {
      console.log('Updating blog post:', id, post);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          ...post,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating blog post:', error);
        throw new Error(`Failed to update blog post: ${error.message}`);
      }
      
      console.log('Updated blog post:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.refetchQueries({ queryKey: ['blog-posts'] });
    }
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting blog post:', id);
      
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting blog post:', error);
        throw new Error(`Failed to delete blog post: ${error.message}`);
      }
      
      console.log('Deleted blog post:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.refetchQueries({ queryKey: ['blog-posts'] });
    }
  });
};
