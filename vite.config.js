import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Personal Balance Sheet',
        short_name: 'Balance Sheet',
        description: 'Track assets, liabilities and net worth, and see the ratios that matter for your financial health.',
        start_url: '/',
        display: 'standalone',
        background_color: '#F8F7FC',
        theme_color: '#6D5EF5',
        icons: [{ src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' }]
      }
    })
  ],
  base: '/',
  build: {
    outDir: 'dist'
  }
});
