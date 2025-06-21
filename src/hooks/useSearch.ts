
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/listing';
import { BlogPost } from '@/hooks/useBlogPosts';

export interface SearchResult {
  id: string;
  title: string;
  type: 'listing' | 'blog';
  url: string;
  description?: string;
  location?: string;
}

export const useSearch = (query: string, enabled: boolean = true) => {
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        return [];
      }

      const searchTerm = `%${debouncedQuery.toLowerCase()}%`;
      const results: SearchResult[] = [];

      // Search listings
      const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select('id, title, description, location, country')
        .eq('status', 'active')
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm},location.ilike.${searchTerm}`)
        .limit(5);

      if (!listingsError && listings) {
        listings.forEach((listing) => {
          results.push({
            id: listing.id.toString(),
            title: listing.title,
            type: 'listing',
            url: `/listing/${listing.id}`,
            description: listing.description || undefined,
            location: `${listing.location}, ${listing.country}`,
          });
        });
      }

      // Search blog posts
      const { data: blogPosts, error: blogError } = await supabase
        .from('blog_posts')
        .select('id, title, excerpt, content, slug')
        .eq('status', 'published')
        .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},content.ilike.${searchTerm}`)
        .limit(5);

      if (!blogError && blogPosts) {
        blogPosts.forEach((post) => {
          results.push({
            id: post.id,
            title: post.title,
            type: 'blog',
            url: `/blog/${post.slug}`,
            description: post.excerpt || undefined,
          });
        });
      }

      // Sort results by relevance (title matches first)
      return results.sort((a, b) => {
        const aInTitle = a.title.toLowerCase().includes(debouncedQuery.toLowerCase());
        const bInTitle = b.title.toLowerCase().includes(debouncedQuery.toLowerCase());
        
        if (aInTitle && !bInTitle) return -1;
        if (!aInTitle && bInTitle) return 1;
        return 0;
      });
    },
    enabled: enabled && debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    searchResults,
    isLoading: isLoading && debouncedQuery.length >= 2,
    hasQuery: debouncedQuery.length >= 2,
  };
};
