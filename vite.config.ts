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
       // navigateFallback: '/dashboard',
        navigateFallback: '/',
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallbackDenylist: [/^\/api\//, /^\/storage\//],

        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/dashboard'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'dashboard-cache',
              networkTimeoutSeconds: 3,
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/job-cards'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'jobcards-cache',
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