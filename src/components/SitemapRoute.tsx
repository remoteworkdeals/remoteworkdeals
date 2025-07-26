
import { useEffect, useState } from 'react';
import { generateSitemap } from '@/utils/sitemapGenerator';

const SitemapRoute = () => {
  const [sitemapContent, setSitemapContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSitemap = async () => {
      try {
        // First try to fetch the static sitemap.xml file
        const response = await fetch('/sitemap.xml');
        if (response.ok) {
          const content = await response.text();
          setSitemapContent(content);
        } else {
          // If static file is not available, generate dynamically
          const dynamicContent = await generateSitemap();
          setSitemapContent(dynamicContent);
        }
      } catch (error) {
        console.error('Error loading sitemap:', error);
        // Fallback to dynamic generation
        try {
          const dynamicContent = await generateSitemap();
          setSitemapContent(dynamicContent);
        } catch (genError) {
          console.error('Error generating sitemap:', genError);
          setSitemapContent(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://remotework.deals/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSitemap();
  }, []);

  useEffect(() => {
    if (!loading && sitemapContent) {
      // Set the correct content type for XML
      const blob = new Blob([sitemapContent], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      
      // Replace the current page content with the XML
      document.open();
      document.write(sitemapContent);
      document.close();
      
      // Set the correct content type header if possible
      if (document.contentType !== 'application/xml') {
        try {
          document.contentType = 'application/xml';
        } catch (e) {
          // Ignore if we can't set content type
        }
      }
    }
  }, [sitemapContent, loading]);

  if (loading) {
    return <div>Loading sitemap...</div>;
  }

  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      whiteSpace: 'pre-wrap',
      fontSize: '12px',
      margin: 0,
      padding: 0
    }}>
      {sitemapContent}
    </pre>
  );
};

export default SitemapRoute;
