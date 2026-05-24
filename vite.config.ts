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
    // 1. Force any uncached page navigations to gracefully fall back to your dashboard route
    navigateFallback: '/dashboard',
    
    // Avoid routing API endpoints or Laravel authentication hooks through the fallback shell
    navigateFallbackDenylist: [/^\/api\//, /^\/login/, /^\/logout/],
    
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],

    runtimeCaching: [
      {
        urlPattern: ({ url }) => url.pathname.startsWith('/dashboard'),
        handler: 'NetworkFirst',
        options: {
          cacheName: 'dashboard-cache',
          expiration: { 
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24 * 7 // 1 Week
          },
          networkTimeoutSeconds: 3, 
          cacheableResponse: {
            statuses: [0, 200]
          }
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