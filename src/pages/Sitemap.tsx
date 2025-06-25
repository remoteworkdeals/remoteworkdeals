
import { useEffect, useState } from 'react';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useListings } from '@/hooks/useListings';
import { generateSitemap } from '@/utils/sitemapGenerator';

const Sitemap = () => {
  const { data: blogPosts = [] } = useBlogPosts();
  const { listings = [] } = useListings();
  const [sitemapXml, setSitemapXml] = useState<string>('');

  useEffect(() => {
    // Generate the sitemap XML
    const xmlContent = generateSitemap(blogPosts, listings);
    setSitemapXml(xmlContent);
  }, [blogPosts, listings]);

  // Return the XML content as plain text
  return (
    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', margin: 0 }}>
      {sitemapXml}
    </pre>
  );
};

export default Sitemap;
