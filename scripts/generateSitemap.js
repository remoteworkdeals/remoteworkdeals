
const fs = require('fs');
const path = require('path');

// This script generates a comprehensive sitemap including dynamic content
// For static generation, we'll create a basic version that can be enhanced
const generateStaticSitemap = () => {
  const baseUrl = 'https://remotework.deals';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Static pages - these are always available
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily', lastmod: currentDate },
    { url: '/blog', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
    { url: '/coliving-deals', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
    { url: '/exclusive-deals', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
    { url: '/about', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
    { url: '/become-partner', priority: '0.8', changefreq: 'monthly', lastmod: currentDate },
  ];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
  <!-- Dynamic content (listings and blog posts) will be added via admin dashboard -->
  <!-- Use the Sitemap Management tool in the admin panel to generate a complete sitemap -->
</urlset>`;

  return xmlContent;
};

// Generate and write the basic sitemap
const sitemapContent = generateStaticSitemap();
const publicDir = path.join(__dirname, '..', 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write the sitemap file
fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
console.log('Basic sitemap generated successfully at:', sitemapPath);
console.log('Note: Use the admin dashboard Sitemap Management tool to generate a complete sitemap with dynamic content.');
