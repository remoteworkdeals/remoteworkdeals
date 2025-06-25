
const fs = require('fs');
const path = require('path');

// This script generates a comprehensive sitemap for build-time generation
// Note: This is for static generation - for dynamic content, use the admin dashboard

const generateStaticSitemap = () => {
  const baseUrl = 'https://remotework.deals';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Static pages - these are always available
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily', lastmod: currentDate },
    { url: '/coliving-deals', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
    { url: '/blog', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
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
  <!-- This is a basic sitemap with static pages only -->
  <!-- For a complete sitemap with dynamic content (listings and blog posts), -->
  <!-- use the Sitemap Management tool in the admin dashboard -->
  <!-- at /admin/blog or /admin/listings -->
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
console.log('✅ Basic sitemap generated successfully at:', sitemapPath);
console.log('');
console.log('📋 Next steps:');
console.log('1. Login to your admin dashboard at https://remotework.deals/admin/blog');
console.log('2. Go to the "Sitemap" tab');
console.log('3. Click "Generate Sitemap" to create a complete sitemap with all listings and blog posts');
console.log('4. Download the generated XML and replace the basic sitemap');
console.log('5. Submit https://remotework.deals/sitemap.xml to Google Search Console');
console.log('');
console.log('🔄 Remember to regenerate the sitemap whenever you add new listings or blog posts!');
