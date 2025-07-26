
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

const sitemapPlugin = () => {
  return {
    name: 'sitemap-plugin',
    closeBundle: {
      order: 'post',
      handler(opts) {
        const outDir = opts?.dir || 'dist';
        
        // Generate sitemap content
        const baseUrl = 'https://remotework.deals';
        const buildTime = new Date().toISOString();
        
        // Main static pages
        const staticRoutes = [
          { url: '/', priority: '1.0', changefreq: 'daily' },
          { url: '/coliving-deals', priority: '0.9', changefreq: 'daily' },
          { url: '/blog', priority: '0.9', changefreq: 'daily' },
          { url: '/exclusive-deals', priority: '0.8', changefreq: 'weekly' },
          { url: '/become-partner', priority: '0.8', changefreq: 'monthly' },
          { url: '/about', priority: '0.7', changefreq: 'monthly' }
        ];
        
        // Coliving listing pages (from the existing sitemap data)
        const colivingRoutes = [
          '/colivings/palma-coliving-mallorca',
          '/colivings/outsite-costa-rica',
          '/colivings/koh-phangan-coliving-thailand',
          '/colivings/lx-factory-lisbon-coliving',
          '/colivings/dojo-bali',
          '/colivings/selina-costa-rica',
          '/colivings/outsite-san-diego',
          '/colivings/hubud-bali',
          '/colivings/casa-netural-italy',
          '/colivings/sun-and-co-spain',
          '/colivings/roam-miami',
          '/colivings/nest-copenhagen',
          '/colivings/beach-hub-portugal',
          '/colivings/startup-haus-berlin',
          '/colivings/hacker-paradise-worldwide',
          '/colivings/tribal-gathering-panama',
          '/colivings/coconat-workation-germany',
          '/colivings/mokrin-house-serbia',
          '/colivings/nine-coliving-spain',
          '/colivings/zoku-amsterdam',
          '/colivings/anceu-coliving-portugal',
          '/colivings/bedndesk-croatia',
          '/colivings/cloudlands-guatemala',
          '/colivings/the-workshop-byron-bay',
          '/colivings/saltwater-house-australia',
          '/colivings/the-farm-san-luis-potosi',
          '/colivings/dill-coworking-lisbon'
        ].map(url => ({ url, priority: '0.8', changefreq: 'weekly' }));
        
        const allRoutes = [...staticRoutes, ...colivingRoutes];
        
        // Generate sitemap XML
        const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${buildTime.split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

        // Generate robots.txt
        const robotsTxt = `User-agent: *
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

        try {
          // Ensure output directory exists
          if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
          }
          
          // Write sitemap.xml
          const sitemapPath = path.join(outDir, 'sitemap.xml');
          fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
          
          // Write robots.txt
          const robotsPath = path.join(outDir, 'robots.txt');
          fs.writeFileSync(robotsPath, robotsTxt, 'utf-8');
          
          // Self-check: verify files exist
          if (!fs.existsSync(sitemapPath)) {
            throw new Error(`Failed to create sitemap.xml at ${sitemapPath}`);
          }
          if (!fs.existsSync(robotsPath)) {
            throw new Error(`Failed to create robots.txt at ${robotsPath}`);
          }
          
          // Log summary
          console.log(`\n🗺️  Sitemap generated successfully!`);
          console.log(`   📍 Total URLs: ${allRoutes.length}`);
          console.log(`   📄 Files: ${sitemapPath}, ${robotsPath}`);
          console.log(`\n📋 sitemap.xml (first 10 lines):`);
          console.log(sitemapXml.split('\n').slice(0, 10).join('\n'));
          console.log(`\n🤖 robots.txt (first 10 lines):`);
          console.log(robotsTxt.split('\n').slice(0, 10).join('\n'));
          
        } catch (error) {
          console.error('❌ Sitemap generation failed:', error);
          throw error;
        }
      }
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    sitemapPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
