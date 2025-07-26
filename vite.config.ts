
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Configure static file serving
    fs: {
      allow: ['..']
    },
    // Add middleware to handle sitemap.xml specifically
    middlewareMode: false,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configure static file serving to ensure sitemap.xml is served correctly
  publicDir: 'public',
  build: {
    // Ensure static files are copied to the output directory
    copyPublicDir: true,
    // Add rollup options to handle static files properly
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Ensure XML files maintain their extension and path
          if (assetInfo.name && assetInfo.name.endsWith('.xml')) {
            return assetInfo.name;
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  // Ensure static assets are handled properly
  assetsInclude: ['**/*.xml'],
}));
