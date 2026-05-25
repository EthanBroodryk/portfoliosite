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

      manifest: {
        name: 'Job Cards',
        short_name: 'Jobs',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [],
      },

      workbox: {
        navigateFallback: '/dashboard',

        // globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        globPatterns: [
              '**/*.{js,css,html,ico,png,svg,woff,woff2}', 
              'assets/*.js' // Catches deeply nested split chunks explicitly
            ],
        runtimeCaching: [
          {
            // 1. Rule for standard browser navigation (Typing the URL / Hard Refresh)
            urlPattern: ({ url, request }) => 
              url.pathname.startsWith('/dashboard') && request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'dashboard-html-cache',
              networkTimeoutSeconds: 3,
              cacheableResponse: { statuses: [0, 200] }
            },
          },
          {
            // 2. Rule for SPA Inertia data requests (Background transitions)
            urlPattern: ({ url, request }) => 
              url.pathname.startsWith('/dashboard') && request.mode !== 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'dashboard-data-cache',
              networkTimeoutSeconds: 3,
              cacheableResponse: {
                statuses: [0, 200],
                headers: { 'X-Inertia': 'true' } // Confirms Inertia dataset collection
              },
              matchOptions: {
                ignoreVary: true,
                ignoreSearch: true
              }
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/job-cards'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'jobcards-cache',
              cacheableResponse: { statuses: [0, 200] }
            },
          },
        ],
      },
    }),
  ],

  esbuild: {
    jsx: 'automatic',
  },
})