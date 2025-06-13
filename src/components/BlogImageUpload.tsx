
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

  const compressImage = (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      
      if (!ctx) {
        console.log('Canvas context not available, using original file');
        resolve(file);
        return;
      }
      
      img.onload = () => {
        try {
          // Calculate new dimensions
          const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
          const newWidth = Math.round(img.width * ratio);
          const newHeight = Math.round(img.height * ratio);
          
          canvas.width = newWidth;
          canvas.height = newHeight;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                type: 'image/webp',
                lastModified: Date.now()
              });
              console.log(`Image compressed from ${file.size} to ${compressedFile.size} bytes`);
              resolve(compressedFile);
            } else {
              console.log('Compression failed, using original file');
              resolve(file);
            }
          }, 'image/webp', quality);
        } catch (error) {
          console.log('Error during compression, using original file:', error);
          resolve(file);
        }
      };
      
      img.onerror = () => {
        console.log('Error loading image, using original file');
        resolve(file);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      console.log('Starting image upload process...');

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      console.log('Selected file:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file.');
      }
      
      // Validate file size (max 10MB before compression)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Image size should be less than 10MB.');
      }

      // Compress the image
      const compressedFile = await compressImage(file);
      console.log('Image compression completed');
      
      // Generate clean filename
      const fileExt = 'webp';
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9]/g, '-')
        .toLowerCase();
      const fileName = `${cleanName}-${Date.now()}.${fileExt}`;
      
      console.log('Attempting to upload to blog-images bucket with filename:', fileName);

      // Upload directly to the blog-images bucket (we know it exists)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/webp'
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        
        // Provide more specific error messages based on the error
        if (uploadError.message.includes('new row violates row-level security')) {
          throw new Error('You must be logged in to upload images. Please sign in and try again.');
        } else if (uploadError.message.includes('bucket')) {
          throw new Error('Image storage is not properly configured. Please contact support.');
        } else {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      console.log('Public URL generated:', publicUrl);

      // Create preview
      setPreview(publicUrl);
      setShowAltInput(true);

      // Auto-generate alt text suggestion based on filename
      const suggestedAlt = cleanName
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      setAltText(suggestedAlt);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully! Please add alt text for accessibility.",
      });

      // Clear the input
      event.target.value = '';

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      setPreview(null);
      setShowAltInput(false);
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
    toast({
      title: "Image removed",
      description: "Featured image has been removed.",
    });
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
                Alt Text (for accessibility and SEO) *
              </Label>
              <Input
                id="alt-text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe the image content..."
                className="w-full"
                required
              />
              <p className="text-xs text-gray-500">
                Describe what's in the image for screen readers and better SEO
              </p>
              <Button 
                type="button"
                onClick={saveImageWithAlt}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!altText.trim()}
              >
                <Edit size={16} className="mr-2" />
                Save Image with Alt Text
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2 font-medium">Click to upload a featured image</p>
          <p className="text-sm text-gray-500">PNG, JPG, WebP up to 10MB (will be automatically compressed to WebP)</p>
        </div>
      )}

      <Input
        id="blog-image-upload"
        type="file"
        accept="image/*"
        onChange={uploadImage}
        disabled={uploading}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
      />

      {uploading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-sm text-gray-600">Uploading and compressing image...</span>
        </div>
      )}
    </div>
  );
};

export default BlogImageUpload;
