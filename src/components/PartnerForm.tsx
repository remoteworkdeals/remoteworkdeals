
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const partnerFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  colivingName: z.string().min(2, 'Coliving name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

type PartnerFormData = z.infer<typeof partnerFormSchema>;

interface PartnerFormProps {
  onSuccess: () => void;
}

const PartnerForm = ({ onSuccess }: PartnerFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
  });

  const onSubmit = async (data: PartnerFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Attempting to save partner inquiry:', data);
      
      const { error } = await supabase
        .from('partner_inquiries')
        .insert([
          {
            full_name: data.fullName,
            coliving_name: data.colivingName,
            email: data.email,
          },
        ]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Successfully saved partner inquiry');
      reset();
      onSuccess();
      
      toast({
        title: "Thank you!",
        description: "We'll be in touch shortly with partnership information.",
      });
    } catch (error) {
      console.error('Error submitting partner inquiry:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Full Name *
            </Label>
            <Input
              id="fullName"
              type="text"
              {...register('fullName')}
              className="mt-1"
              placeholder="Your full name"
              disabled={isSubmitting}
            />
            {errors.fullName && (
              <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="colivingName" className="text-sm font-medium text-gray-700">
              Coliving Name *
            </Label>
            <Input
              id="colivingName"
              type="text"
              {...register('colivingName')}
              className="mt-1"
              placeholder="Name of your coliving space"
              disabled={isSubmitting}
            />
            {errors.colivingName && (
              <p className="mt-2 text-sm text-red-600">{errors.colivingName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="mt-1"
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full adventure-button text-lg py-3"
          >
            {isSubmitting ? 'Submitting...' : 'Get Partnership Info'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PartnerForm;
