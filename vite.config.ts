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
  strategies: 'generateSW',
  registerType: 'autoUpdate',
  injectRegister: 'auto',

  manifest: {
    name: 'Zenchi Technologies',
    short_name: 'Zenchi',
    display: 'standalone',
    theme_color: '#ffffff',
  },

  workbox: {
    clientsClaim: true,
    skipWaiting: true,
    cleanupOutdatedCaches: true,

    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

    navigateFallback: '/',

    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.destination === 'document',
        handler: 'NetworkFirst',
      },
      {
        urlPattern: ({ request }) =>
          ['style', 'script', 'worker'].includes(request.destination),
        handler: 'StaleWhileRevalidate',
      },
    ],
  },

  devOptions: {
    enabled: false,
  },
})
  ],

  esbuild: {
    jsx: 'automatic',
  },
})