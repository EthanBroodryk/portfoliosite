import { wayfinder } from '@laravel/vite-plugin-wayfinder'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import laravel from 'laravel-vite-plugin'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.tsx'],
      ssr: 'resources/js/ssr.tsx',
      refresh: true,
    }),

    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),

    tailwindcss(),

    wayfinder({
      formVariants: true,
    }),


VitePWA({
  registerType: 'autoUpdate',
  strategies: 'generateSW',

  workbox: {
    // Avoid caching API endpoints or Laravel authentication routes
    navigateFallbackDenylist: [/^\/api\//, /^\/login/, /^\/logout/],
    
    // Ensure all static assets compiled by Vite are cached aggressively
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],

    runtimeCaching: [
      {
        // Match the dashboard page URL
        urlPattern: ({ url }) => url.pathname.startsWith('/dashboard'),
        // NetworkFirst ensures fresh data when online, but falls back to cache instantly when offline
        handler: 'NetworkFirst',
        options: {
          cacheName: 'dashboard-cache',
          expiration: { 
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24 * 7 // 1 Week
          },
          networkTimeoutSeconds: 3, // If network takes > 3s, drop back to cache quickly
          cacheableResponse: {
            statuses: [0, 200]
          }
        },
      },
    ],
  },
})


  ],

  esbuild: {
    jsx: 'automatic',
  },
})