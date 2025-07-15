import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateSlug } from '@/utils/slugUtils';

const SitemapXML = () => {
  const [sitemapContent, setSitemapContent] = useState<string>('');

  useEffect(() => {
    const generateSitemap = async () => {
      try {
        const baseUrl = 'https://remotework.deals';
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Static pages
        const staticPages = [
          { url: '', priority: '1.0', changefreq: 'daily', lastmod: currentDate },
          { url: '/coliving-deals', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
          { url: '/blog', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
          { url: '/exclusive-deals', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
          { url: '/about', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
          { url: '/become-partner', priority: '0.8', changefreq: 'monthly', lastmod: currentDate },
        ];

        // Fetch active listings
        const { data: listings } = await supabase
          .from('listings')
          .select('id, title, updated_at')
          .eq('status', 'active')
          .order('updated_at', { ascending: false });

        // Fetch published blog posts
        const { data: blogPosts } = await supabase
          .from('blog_posts')
          .select('slug, updated_at')
          .eq('status', 'published')
          .order('updated_at', { ascending: false });

        let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Add static pages
        staticPages.forEach(page => {
          xmlContent += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
        });

        // Add listing pages
        if (listings && listings.length > 0) {
          listings.forEach(listing => {
            const slug = generateSlug(listing.title);
            const lastmod = listing.updated_at ? listing.updated_at.split('T')[0] : currentDate;
            
            xmlContent += `
  <url>
    <loc>${baseUrl}/colivings/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
          });
        }

        // Add blog pages
        if (blogPosts && blogPosts.length > 0) {
          blogPosts.forEach(post => {
            const lastmod = post.updated_at ? post.updated_at.split('T')[0] : currentDate;
            
            xmlContent += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
          });
        }

        xmlContent += `
</urlset>`;

        setSitemapContent(xmlContent);
      } catch (error) {
        console.error('Error generating sitemap:', error);
        // Fallback sitemap
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
    };

    generateSitemap();
  }, []);

  useEffect(() => {
    if (sitemapContent) {
      // Set the document content to display XML
      document.body.innerHTML = `<pre style="margin: 0; font-family: monospace; white-space: pre-wrap;">${sitemapContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
      
      // Set the title to indicate it's a sitemap
      document.title = 'Sitemap';
      
      // Try to set content type meta tag
      const metaTag = document.createElement('meta');
      metaTag.httpEquiv = 'Content-Type';
      metaTag.content = 'application/xml; charset=utf-8';
      document.head.appendChild(metaTag);
    }
  }, [sitemapContent]);

  return <div dangerouslySetInnerHTML={{ __html: sitemapContent }} style={{ display: 'none' }} />;
};

export default SitemapXML;