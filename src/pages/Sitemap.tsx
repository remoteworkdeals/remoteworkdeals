import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Sitemap = () => {
  const { data: listings = [] } = useQuery({
    queryKey: ['sitemap-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('id, title, updated_at')
        .eq('status', 'active');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: blogPosts = [] } = useQuery({
    queryKey: ['sitemap-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('slug, updated_at')
        .eq('status', 'published');
      
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    // Set content type to XML
    const contentType = document.querySelector('meta[http-equiv="Content-Type"]');
    if (contentType) {
      contentType.setAttribute('content', 'application/xml; charset=utf-8');
    }
  }, []);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://remotework.deals/</loc>
    <lastmod>${formatDate(new Date().toISOString())}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://remotework.deals/coliving-deals</loc>
    <lastmod>${formatDate(new Date().toISOString())}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://remotework.deals/blog</loc>
    <lastmod>${formatDate(new Date().toISOString())}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://remotework.deals/exclusive-deals</loc>
    <lastmod>${formatDate(new Date().toISOString())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://remotework.deals/about</loc>
    <lastmod>${formatDate(new Date().toISOString())}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://remotework.deals/become-partner</loc>
    <lastmod>${formatDate(new Date().toISOString())}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
${listings.map(listing => `  <url>
    <loc>https://remotework.deals/colivings/${generateSlug(listing.title)}-${listing.id}</loc>
    <lastmod>${formatDate(listing.updated_at)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
${blogPosts.map(post => `  <url>
    <loc>https://remotework.deals/blog/${post.slug}</loc>
    <lastmod>${formatDate(post.updated_at)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

  return (
    <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '12px' }}>
      {sitemapXML}
    </pre>
  );
};

export default Sitemap;