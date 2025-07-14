import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml; charset=utf-8',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generating sitemap...');
    
    // Initialize Supabase client
    const supabase = createClient(
      'https://otfgnjgxalsewdwunfrb.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90Zmduamd4YWxzZXdkd3VuZnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NjQ1MzUsImV4cCI6MjA2NTI0MDUzNX0.XWoZgz4f4w_1m-PqSjRoDz8e7Rz5yPOUopJpdX4e3ho'
    );

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
    console.log('Fetching listings...');
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('id, title, updated_at')
      .eq('status', 'active')
      .order('updated_at', { ascending: false });

    if (listingsError) {
      console.error('Error fetching listings:', listingsError);
      throw new Error(`Failed to fetch listings: ${listingsError.message}`);
    }

    console.log(`Found ${listings?.length || 0} active listings`);

    // Fetch published blog posts
    console.log('Fetching blog posts...');
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });

    if (blogError) {
      console.error('Error fetching blog posts:', blogError);
      throw new Error(`Failed to fetch blog posts: ${blogError.message}`);
    }

    console.log(`Found ${blogPosts?.length || 0} published blog posts`);

    // Generate slug function
    const generateSlug = (title: string) => {
      return title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    };

    // Build sitemap XML
    let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

    // Add static pages
    for (const page of staticPages) {
      sitemapXML += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Add listing pages
    if (listings && listings.length > 0) {
      for (const listing of listings) {
        const slug = generateSlug(listing.title);
        const lastmod = listing.updated_at ? listing.updated_at.split('T')[0] : currentDate;
        
        sitemapXML += `  <url>
    <loc>${baseUrl}/colivings/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      }
    }

    // Add blog pages
    if (blogPosts && blogPosts.length > 0) {
      for (const post of blogPosts) {
        const lastmod = post.updated_at ? post.updated_at.split('T')[0] : currentDate;
        
        sitemapXML += `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
      }
    }

    sitemapXML += `</urlset>`;

    const totalUrls = staticPages.length + (listings?.length || 0) + (blogPosts?.length || 0);
    console.log(`Generated sitemap with ${totalUrls} URLs`);

    return new Response(sitemapXML, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://remotework.deals/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`, {
      headers: corsHeaders,
    });
  }
});