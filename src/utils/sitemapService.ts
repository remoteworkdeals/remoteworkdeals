
import { supabase } from '@/integrations/supabase/client';
import { generateSlug } from '@/utils/slugUtils';

export interface SitemapUrl {
  url: string;
  priority: string;
  changefreq: string;
  lastmod: string;
}

interface DatabaseListing {
  id: number;
  title: string;
  updated_at: string;
  status: string;
}

interface DatabaseBlogPost {
  id: string;
  slug: string;
  updated_at: string;
  status: string;
}

export const generateComprehensiveSitemap = async (): Promise<{ success: boolean; sitemap?: string; error?: string }> => {
  try {
    console.log('Starting comprehensive sitemap generation...');
    
    const baseUrl = 'https://remotework.deals';
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Static pages with proper priorities and changefreq
    const staticPages: SitemapUrl[] = [
      { url: '', priority: '1.0', changefreq: 'daily', lastmod: currentDate },
      { url: '/coliving-deals', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
      { url: '/blog', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
      { url: '/exclusive-deals', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
      { url: '/about', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
      { url: '/become-partner', priority: '0.8', changefreq: 'monthly', lastmod: currentDate },
    ];

    // Fetch all active listings
    console.log('Fetching listings for sitemap...');
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('id, title, updated_at, status')
      .eq('status', 'active')
      .order('updated_at', { ascending: false });

    if (listingsError) {
      console.error('Error fetching listings for sitemap:', listingsError);
      throw new Error(`Failed to fetch listings: ${listingsError.message}`);
    }

    console.log(`Found ${listings?.length || 0} active listings`);

    // Generate listing pages
    const listingPages: SitemapUrl[] = (listings || []).map((listing: DatabaseListing) => {
      const slug = generateSlug(listing.title);
      const lastmod = listing.updated_at ? listing.updated_at.split('T')[0] : currentDate;
      
      return {
        url: `/colivings/${slug}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod
      };
    });

    // Fetch all published blog posts
    console.log('Fetching blog posts for sitemap...');
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('id, slug, updated_at, status')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });

    if (blogError) {
      console.error('Error fetching blog posts for sitemap:', blogError);
      throw new Error(`Failed to fetch blog posts: ${blogError.message}`);
    }

    console.log(`Found ${blogPosts?.length || 0} published blog posts`);

    // Generate blog pages
    const blogPages: SitemapUrl[] = (blogPosts || []).map((post: DatabaseBlogPost) => {
      const lastmod = post.updated_at ? post.updated_at.split('T')[0] : currentDate;
      
      return {
        url: `/blog/${post.slug}`,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod
      };
    });

    // Combine all pages
    const allPages = [...staticPages, ...listingPages, ...blogPages];
    
    console.log(`Generated sitemap with ${allPages.length} URLs`);

    // Generate proper XML sitemap with correct formatting for Google
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return { success: true, sitemap: xmlContent };
  } catch (error) {
    console.error('Error generating comprehensive sitemap:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const downloadSitemap = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Generating and downloading sitemap...');
    
    const result = await generateComprehensiveSitemap();
    
    if (!result.success || !result.sitemap) {
      return { success: false, error: result.error || 'Failed to generate sitemap' };
    }

    // Create a downloadable blob
    const blob = new Blob([result.sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Sitemap file downloaded successfully');
    
    return { success: true };
  } catch (error) {
    console.error('Error downloading sitemap:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const copySitemapToClipboard = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const result = await generateComprehensiveSitemap();
    
    if (!result.success || !result.sitemap) {
      return { success: false, error: result.error || 'Failed to generate sitemap' };
    }

    await navigator.clipboard.writeText(result.sitemap);
    console.log('Sitemap XML copied to clipboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error copying sitemap to clipboard:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
