
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface FeaturedFormProps {
  featured: boolean;
  setFeatured: (featured: boolean) => void;
}

const FeaturedForm = ({ featured, setFeatured }: FeaturedFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Featured Listing</h3>
      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={featured}
          onCheckedChange={setFeatured}
        />
        <Label htmlFor="featured" className="text-sm font-medium">
          Feature this listing on the homepage
        </Label>
      </div>
      <p className="text-sm text-gray-600">
        Featured listings will appear in the "Featured Coliving Deals" section on the homepage.
      </p>
    </div>
  );
};

export default FeaturedForm;
