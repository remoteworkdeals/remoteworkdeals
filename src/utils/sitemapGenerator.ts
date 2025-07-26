
import { supabase } from '@/integrations/supabase/client';
import { generateSlug } from './slugUtils';

interface SitemapUrl {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

export const generateSitemap = async (): Promise<string> => {
  const baseUrl = 'https://remotework.deals';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls: SitemapUrl[] = [];

  // Static pages with high priority
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' as const, lastmod: currentDate },
    { url: '/coliving-deals', priority: '0.9', changefreq: 'daily' as const, lastmod: currentDate },
    { url: '/blog', priority: '0.9', changefreq: 'daily' as const, lastmod: currentDate },
    { url: '/exclusive-deals', priority: '0.8', changefreq: 'weekly' as const, lastmod: currentDate },
    { url: '/become-partner', priority: '0.8', changefreq: 'monthly' as const, lastmod: currentDate },
    { url: '/about', priority: '0.7', changefreq: 'monthly' as const, lastmod: currentDate },
  ];

  urls.push(...staticPages);

  try {
    // Fetch active listings
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('id, title, updated_at')
      .eq('status', 'active')
      .order('updated_at', { ascending: false });

    if (listingsError) {
      console.error('Error fetching listings for sitemap:', listingsError);
    } else if (listings) {
      // Add listing pages
      listings.forEach(listing => {
        const slug = generateSlug(listing.title);
        urls.push({
          url: `/colivings/${slug}`,
          lastmod: new Date(listing.updated_at).toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.8'
        });
      });
    }

    // Fetch published blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });

    if (blogError) {
      console.error('Error fetching blog posts for sitemap:', blogError);
    } else if (blogPosts) {
      // Add blog post pages
      blogPosts.forEach(post => {
        urls.push({
          url: `/blog/${post.slug}`,
          lastmod: new Date(post.updated_at).toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.7'
        });
      });
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  // Generate XML
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xmlContent;
};

export const downloadSitemap = async (): Promise<void> => {
  try {
    const sitemapContent = await generateSitemap();
    const blob = new Blob([sitemapContent], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading sitemap:', error);
    throw error;
  }
};
