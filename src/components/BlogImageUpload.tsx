
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image, Edit } from 'lucide-react';

interface BlogImageUploadProps {
  onImageUploaded: (url: string, alt: string) => void;
  currentImage?: string;
  currentAlt?: string;
  label?: string;
  className?: string;
}

const BlogImageUpload = ({ 
  onImageUploaded, 
  currentImage, 
  currentAlt, 
  label = "Upload Featured Image", 
  className = "" 
}: BlogImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [altText, setAltText] = useState(currentAlt || '');
  const [showAltInput, setShowAltInput] = useState(!!currentAlt);
  const { toast } = useToast();

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file.');
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
        setShowAltInput(true);
      };
      reader.readAsDataURL(file);

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      // Auto-generate alt text suggestion based on filename
      const suggestedAlt = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      setAltText(suggestedAlt);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully! Please add alt text for accessibility.",
      });

      // Don't call onImageUploaded yet - wait for alt text
      setPreview(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const saveImageWithAlt = () => {
    if (preview && altText.trim()) {
      onImageUploaded(preview, altText.trim());
      toast({
        title: "Image saved",
        description: "Featured image updated with alt text.",
      });
    } else {
      toast({
        title: "Alt text required",
        description: "Please provide alt text for accessibility.",
        variant: "destructive",
      });
    }
  };

  const removeImage = () => {
    setPreview(null);
    setAltText('');
    setShowAltInput(false);
    onImageUploaded('', '');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label htmlFor="blog-image-upload" className="text-base font-semibold">
        {label}
      </Label>
      
      {preview ? (
        <div className="space-y-4">
          <div className="relative group">
            <img
              src={preview}
              alt={altText || 'Preview'}
              className="w-full h-64 object-cover rounded-lg border shadow-md"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={removeImage}
              >
                <X size={16} className="mr-1" />
                Remove
              </Button>
            </div>
          </div>
          
          {showAltInput && (
            <div className="space-y-2">
              <Label htmlFor="alt-text" className="text-sm font-medium">
                Alt Text (for accessibility and SEO)
              </Label>
              <Input
                id="alt-text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe the image content..."
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Describe what's in the image for screen readers and better SEO
              </p>
              {preview && preview !== currentImage && (
                <Button 
                  type="button"
                  onClick={saveImageWithAlt}
                  className="w-full"
                  variant="outline"
                >
                  <Edit size={16} className="mr-2" />
                  Save Image with Alt Text
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2 font-medium">Click to upload a featured image</p>
          <p className="text-sm text-gray-500">PNG, JPG, WebP up to 5MB</p>
        </div>
      )}

      <Input
        id="blog-image-upload"
        type="file"
        accept="image/*"
        onChange={uploadImage}
        disabled={uploading}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-adventure-orange file:text-white hover:file:bg-adventure-orange/80"
      />

      {uploading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-adventure-orange mr-2"></div>
          <span className="text-sm text-gray-600">Uploading to blog storage...</span>
        </div>
      )}
    </div>
  );
};

export default BlogImageUpload;
