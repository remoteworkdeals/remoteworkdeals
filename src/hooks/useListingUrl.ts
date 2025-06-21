
import { generateSlug } from '@/utils/slugUtils';

export const useListingUrl = () => {
  const getListingUrl = (title: string, id: number) => {
    const slug = generateSlug(title);
    return `/colivings/${slug}`;
  };

  return { getListingUrl };
};
