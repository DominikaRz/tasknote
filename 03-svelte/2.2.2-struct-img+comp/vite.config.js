import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { enhancedImages } from '@sveltejs/enhanced-img';
//import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    enhancedImages(),
    /*
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',  // Ensures the plugin generates files with .gz extension
      threshold: 10240, // Only compress files larger than 10kb
      deleteOriginalAssets: false // Keep original files
    })*/
    /**/
    {
      name: 'remove-leading-dot-slash',
      apply: 'build',
      transformIndexHtml(html) {
        return html.replace(/"\.\//g, '"');
      }
    }
     
  ],
  resolve: {
    alias: {
      // Ensure this matches your project structure
      '$service-worker': '/src/service-worker'
    }
  },
  build: { minify: true }
})
