
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/listing';

export const useLinkedBlogPosts = (listingId: number) => {
  const [linkedPosts, setLinkedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinkedPosts = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .contains('linked_listings', [listingId])
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching linked blog posts:', error);
        } else {
          setLinkedPosts(data || []);
        }
      } catch (err) {
        console.error('Unexpected error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      fetchLinkedPosts();
    }
  }, [listingId]);

  return { linkedPosts, loading };
};
