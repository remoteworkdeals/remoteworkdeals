
const fs = require('fs');
const path = require('path');

// This would normally fetch from your database
// For now, we'll create a simple version that can be enhanced
const generateStaticSitemap = () => {
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

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xmlContent;
};

// Generate and write the sitemap
const sitemapContent = generateStaticSitemap();
const publicDir = path.join(__dirname, '..', 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write the sitemap file
fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
console.log('Sitemap generated successfully at:', sitemapPath);
