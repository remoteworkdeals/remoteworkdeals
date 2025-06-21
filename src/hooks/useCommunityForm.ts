
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const communityFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

export type CommunityFormData = z.infer<typeof communityFormSchema>;

interface UseCommunityFormProps {
  source: string;
}

export const useCommunityForm = ({ source }: UseCommunityFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CommunityFormData>({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = async (data: CommunityFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Attempting to save community member:', { ...data, source });
      
      // Save to Supabase
      const { error } = await supabase
        .from('community_members')
        .insert([
          {
            name: data.name,
            email: data.email,
            source: source
          }
        ]);

      if (error) {
        console.error('Supabase error:', error);
        
        // Handle duplicate email error specifically
        if (error.code === '23505') {
          toast({
            title: "Already Registered",
            description: "This email is already part of our community! Redirecting you to WhatsApp.",
          });
        } else {
          toast({
            title: "Error Joining Community",
            description: "There was an issue saving your information. Please try again.",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
      } else {
        console.log('Successfully saved community member');
        toast({
          title: source === 'exclusive_deals' ? "Welcome to the Community!" : "Thanks for joining!",
          description: source === 'exclusive_deals' 
            ? "You've successfully joined! Redirecting you to our WhatsApp group."
            : "We'll be in touch with exclusive deals soon.",
        });
      }

      // Clear form
      form.reset();

      // Redirect to WhatsApp group after a short delay
      setTimeout(() => {
        window.open('https://chat.whatsapp.com/Bnb3F4ycBPcLsYRl2BxNtM', '_blank');
      }, 1500);

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
