
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/listing';
import { useToast } from '@/hooks/use-toast';

export const useListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching listings:', error);
          setError('Failed to load listings');
          toast({
            title: "Error",
            description: "Failed to load listings",
            variant: "destructive",
          });
          return;
        }

        setListings(data || []);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading listings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [toast]);

  return { listings, loading, error };
};
