
export const generateSitemap = (blogPosts: any[], listings: any[]) => {
  const baseUrl = 'https://remotework.deals';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily', lastmod: currentDate },
    { url: '/blog', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
    { url: '/coliving-deals', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
    { url: '/exclusive-deals', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
    { url: '/about', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
    { url: '/become-partner', priority: '0.8', changefreq: 'monthly', lastmod: currentDate },
  ];

  const blogPages = blogPosts.map(post => ({
    url: `/blog/${post.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: post.updated_at.split('T')[0]
  }));

  const listingPages = listings.map(listing => ({
    url: `/listing/${listing.id}`,
    priority: '0.7',
    changefreq: 'weekly',
    lastmod: listing.updated_at.split('T')[0]
  }));

  const allPages = [...staticPages, ...blogPages, ...listingPages];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
};

export const generateRobotsTxt = () => {
  const baseUrl = 'https://remotework.deals';
  
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Block admin areas
Disallow: /admin/
Disallow: /auth/

# Allow all social media crawlers
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /`;
};
