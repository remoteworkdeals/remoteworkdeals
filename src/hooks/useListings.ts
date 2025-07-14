
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/listing';

export const useListings = () => {
  const { data: listings = [], isLoading: loading, error } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      console.log('Fetching listings...');
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }
      
      // Randomize the order of listings
      const shuffledData = data?.sort(() => Math.random() - 0.5) || [];
      
      console.log('Fetched listings:', shuffledData);
      return shuffledData as Listing[];
    }
  });

  return { 
    listings, 
    loading, 
    error: error?.message 
  };
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    }
  });
};
