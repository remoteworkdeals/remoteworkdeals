
const fs = require('fs');
const path = require('path');

const generateSitemap = () => {
  const baseUrl = 'https://remotework.deals';
  const currentDate = new Date().toISOString();
  
  // Define all public routes with their priorities and change frequencies
  const routes = [
    // High priority pages
    { path: '/', priority: '1.0', changefreq: 'daily' },
    
    // Main sections
    { path: '/coliving-deals', priority: '0.9', changefreq: 'daily' },
    { path: '/blog', priority: '0.9', changefreq: 'daily' },
    
    // Important pages
    { path: '/exclusive-deals', priority: '0.8', changefreq: 'weekly' },
    { path: '/become-partner', priority: '0.8', changefreq: 'monthly' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    
    // Sample coliving listings (in production, these would come from your database)
    { path: '/colivings/palma-coliving-mallorca', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/outsite-costa-rica', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/koh-phangan-coliving-thailand', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/lx-factory-lisbon-coliving', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/dojo-bali', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/selina-costa-rica', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/outsite-san-diego', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/hubud-bali', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/casa-netural-italy', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/sun-and-co-spain', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/roam-miami', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/nest-copenhagen', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/beach-hub-portugal', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/startup-haus-berlin', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/hacker-paradise-worldwide', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/tribal-gathering-panama', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/coconat-workation-germany', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/mokrin-house-serbia', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/nine-coliving-spain', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/zoku-amsterdam', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/anceu-coliving-portugal', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/bedndesk-croatia', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/cloudlands-guatemala', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/the-workshop-byron-bay', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/saltwater-house-australia', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/the-farm-san-luis-potosi', priority: '0.8', changefreq: 'weekly' },
    { path: '/colivings/dill-coworking-lisbon', priority: '0.8', changefreq: 'weekly' }
  ];

  // Generate XML sitemap
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';
  
  const urlEntries = routes.map(route => {
    return `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${currentDate.split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  }).join('\n');

  const sitemapContent = `${xmlHeader}\n${urlsetOpen}\n${urlEntries}\n${urlsetClose}`;

  // Ensure public directory exists
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write sitemap file
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');

  // Generate robots.txt
  const robotsContent = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

# Block admin areas
Disallow: /admin/
Disallow: /auth/

# Allow specific crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# Crawl delay for politeness
Crawl-delay: 1

# Block specific paths that shouldn't be indexed
Disallow: /api/
Disallow: /*?*utm_source=
Disallow: /*?*utm_medium=
Disallow: /*?*utm_campaign=`;

  // Write robots.txt file
  const robotsPath = path.join(publicDir, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsContent, 'utf8');

  console.log('✅ Static sitemap and robots.txt generated successfully!');
  console.log(`📊 Generated ${routes.length} URLs in sitemap`);
  console.log('📍 Files created:');
  console.log('  - public/sitemap.xml');
  console.log('  - public/robots.txt');
  
  return {
    sitemapPath,
    robotsPath,
    urlCount: routes.length
  };
};

// Run the generator
if (require.main === module) {
  try {
    generateSitemap();
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

module.exports = { generateSitemap };
