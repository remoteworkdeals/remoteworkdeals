
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
    { url: '/become-partner', priority: '0.8', changefreq: 'monthly', lastmod: currentDate },
    { url: '/about', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
  ];

  // Sample coliving listings (in production, these would come from your database)
  const sampleListings = [
    'palma-coliving-mallorca',
    'outsite-costa-rica', 
    'koh-phangan-coliving-thailand',
    'lx-factory-lisbon-coliving',
    'dojo-bali',
    'selina-costa-rica',
    'outsite-san-diego',
    'hubud-bali',
    'casa-netural-italy',
    'sun-and-co-spain',
    'roam-miami',
    'nest-copenhagen',
    'beach-hub-portugal',
    'startup-haus-berlin',
    'hacker-paradise-worldwide',
    'tribal-gathering-panama',
    'coconat-workation-germany',
    'mokrin-house-serbia',
    'nine-coliving-spain',
    'zoku-amsterdam',
    'anceu-coliving-portugal',
    'bedndesk-croatia',
    'cloudlands-guatemala',
    'the-workshop-byron-bay',
    'saltwater-house-australia',
    'the-farm-san-luis-potosi',
    'dill-coworking-lisbon'
  ];

  const listingPages = sampleListings.map(slug => ({
    url: `/colivings/${slug}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: currentDate
  }));

  const allPages = [...staticPages, ...listingPages];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xmlContent;
};

// Generate and write the comprehensive sitemap
const sitemapContent = generateStaticSitemap();
const publicDir = path.join(__dirname, '..', 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write the sitemap file
fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');

console.log('✅ Comprehensive sitemap generated successfully!');
console.log(`📊 Generated ${sitemapContent.match(/<url>/g).length} URLs`);
console.log('📍 Location:', sitemapPath);
console.log('');
console.log('🚀 Next steps for Google Search Console:');
console.log('1. Visit https://search.google.com/search-console');
console.log('2. Select your property (remotework.deals)');
console.log('3. Go to "Sitemaps" in the left sidebar');
console.log('4. Enter "sitemap.xml" in the "Add a new sitemap" field');
console.log('5. Click "Submit"');
console.log('');
console.log('🔄 Use the admin dashboard (/admin/blog → SEO & Sitemap tab) to:');
console.log('- Generate dynamic sitemaps with real-time data');
console.log('- Download updated XML files');
console.log('- Monitor sitemap statistics');
console.log('');
console.log('💡 Your sitemap includes:');
console.log('- Homepage (Priority: 1.0)');
console.log('- Main pages (Priority: 0.8-0.9)');
console.log('- All coliving listings (Priority: 0.8)');
console.log('- SEO-optimized URLs and metadata');
