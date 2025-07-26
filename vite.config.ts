
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';
import type { Plugin } from 'vite';

const sitemapPlugin = (): Plugin => {
  return {
    name: 'sitemap-plugin',
    generateBundle(options) {
      const outDir = options.dir || 'dist';
      
      // Generate sitemap content
      const baseUrl = 'https://remotework.deals';
      const buildDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Define routes with priorities
      const routes = [
        { url: '/', priority: '1.0', changefreq: 'weekly' },
        { url: '/coliving-deals', priority: '0.9', changefreq: 'weekly' },
        { url: '/blog', priority: '0.9', changefreq: 'weekly' },
        { url: '/exclusive-deals', priority: '0.8', changefreq: 'weekly' },
        { url: '/become-partner', priority: '0.8', changefreq: 'weekly' },
        { url: '/about', priority: '0.8', changefreq: 'weekly' }
      ];
      
      // Generate sitemap XML
      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      // Generate robots.txt
      const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml`;

      // Ensure output directory exists
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      
      // Write files
      const sitemapPath = path.join(outDir, 'sitemap.xml');
      const robotsPath = path.join(outDir, 'robots.txt');
      
      fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
      fs.writeFileSync(robotsPath, robotsTxt, 'utf-8');
      
      // Verify files exist
      if (!fs.existsSync(sitemapPath)) {
        throw new Error(`[sitemap-plugin] Failed to create sitemap.xml at ${sitemapPath}`);
      }
      if (!fs.existsSync(robotsPath)) {
        throw new Error(`[sitemap-plugin] Failed to create robots.txt at ${robotsPath}`);
      }
      
      // Log success
      console.log(`[sitemap-plugin] wrote ${routes.length} urls to sitemap.xml in ${outDir}`);
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
    mode === 'development' && componentTagger(),
    sitemapPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
