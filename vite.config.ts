
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { Plugin } from 'vite';

const sitemapPlugin = (): Plugin => {
  return {
    name: 'sitemap-plugin',
    apply: 'build',
    generateBundle() {
      const base = 'https://remotework.deals';
      const today = new Date().toISOString().slice(0, 10);

      const urls = [
        '/', '/coliving-deals', '/blog',
        '/exclusive-deals', '/become-partner', '/about'
      ];

      const entry = (u: string) => `  <url>
    <loc>${base}${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u==='/' ? '1.0' : (['/coliving-deals','/blog'].includes(u) ? '0.9' : '0.8')}</priority>
  </url>`;

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(entry).join('\n')}
</urlset>
`;
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml });

      const robots = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`;
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });

      this.warn(`[sitemap-plugin] emitted ${urls.length} urls`);
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
