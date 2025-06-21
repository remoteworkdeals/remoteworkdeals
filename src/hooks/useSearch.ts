
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/listing';

export interface SearchResult {
  id: string;
  title: string;
  type: 'listing' | 'blog' | 'page';
  url: string;
  description?: string;
  location?: string;
}

// Static pages content for search
const staticPages = [
  {
    id: 'home',
    title: 'RemoteWork.Deals - Home',
    type: 'page' as const,
    url: '/',
    description: 'Find the best coliving deals and remote work opportunities worldwide',
    keywords: ['home', 'coliving', 'remote work', 'deals', 'digital nomad']
  },
  {
    id: 'about',
    title: 'About Us',
    type: 'page' as const,
    url: '/about',
    description: 'Learn about our mission to help remote workers find amazing coliving spaces',
    keywords: ['about', 'mission', 'remote workers', 'coliving spaces', 'team']
  },
  {
    id: 'coliving-deals',
    title: 'Coliving Deals',
    type: 'page' as const,
    url: '/coliving-deals',
    description: 'Browse all available coliving deals and discounts',
    keywords: ['coliving', 'deals', 'discounts', 'listings', 'spaces']
  },
  {
    id: 'exclusive-deals',
    title: 'Exclusive Deals',
    type: 'page' as const,
    url: '/exclusive-deals',
    description: 'Access exclusive coliving deals and special offers',
    keywords: ['exclusive', 'deals', 'special offers', 'premium', 'discounts']
  }
];

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
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm},location.ilike.${searchTerm},country.ilike.${searchTerm}`)
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

      // Search static pages
      const queryLower = debouncedQuery.toLowerCase();
      staticPages.forEach((page) => {
        const matchesTitle = page.title.toLowerCase().includes(queryLower);
        const matchesDescription = page.description.toLowerCase().includes(queryLower);
        const matchesKeywords = page.keywords.some(keyword => 
          keyword.toLowerCase().includes(queryLower)
        );
        
        if (matchesTitle || matchesDescription || matchesKeywords) {
          results.push({
            id: page.id,
            title: page.title,
            type: page.type,
            url: page.url,
            description: page.description,
          });
        }
      });

      // Sort results by relevance (title matches first, then type priority)
      return results.sort((a, b) => {
        const aInTitle = a.title.toLowerCase().includes(queryLower);
        const bInTitle = b.title.toLowerCase().includes(queryLower);
        
        if (aInTitle && !bInTitle) return -1;
        if (!aInTitle && bInTitle) return 1;
        
        // Secondary sort by type priority: listings > pages > blog
        const typePriority = { listing: 3, page: 2, blog: 1 };
        return typePriority[b.type] - typePriority[a.type];
      }).slice(0, 8); // Limit to top 8 results
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
