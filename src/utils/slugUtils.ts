
/**
 * Generates a URL-friendly slug from a title
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Generates the SEO-friendly URL path for a listing
 */
export const generateListingPath = (title: string, id: number): string => {
  const slug = generateSlug(title);
  return `/colivings/${slug}`;
};

/**
 * Extracts listing ID from old-style URLs for backward compatibility
 */
export const extractListingIdFromOldUrl = (pathname: string): number | null => {
  const match = pathname.match(/\/listing\/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};
