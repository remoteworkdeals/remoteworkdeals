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
      console.log('Fetching all blog posts...');
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
      }
      console.log('Fetched all blog posts:', data);
      
      // Filter published posts on the client side for now
      const publishedPosts = data.filter(post => post.status === 'published');
      console.log('Published posts:', publishedPosts);
      
      return publishedPosts as BlogPost[];
    }
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
      
      // Test database connection first
      console.log('Testing database connection...');
      const { data: testData, error: testError } = await supabase
        .from('blog_posts')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('Database connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      
      console.log('Database connection successful, proceeding with insert...');
      
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
        status: post.status || 'draft',
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
        console.error('Detailed error creating blog post:', {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          insertData: insertData
        });
        
        // Provide more specific error messages
        if (error.code === '42501') {
          throw new Error('Permission denied: Row Level Security policy violation. Please check database policies.');
        } else if (error.code === '23505') {
          throw new Error('Blog post with this slug already exists. Please use a different slug.');
        } else if (error.code === '23502') {
          throw new Error('Required field is missing. Please check all required fields are filled.');
        } else {
          throw new Error(`Failed to create blog post: ${error.message} (Code: ${error.code})`);
        }
      }
      
      console.log('Successfully created blog post:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Blog post creation successful, invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
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
    }
  });
};
