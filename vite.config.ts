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
  injectRegister: 'auto',

  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true,
  },

  devOptions: {
    enabled: false, // ❗ MUST BE FALSE IN PRODUCTION
  },

  manifest: {
    name: 'Zenchi Technologies',
    short_name: 'Zenchi',
    theme_color: '#ffffff',
    display: 'standalone',
  },
})
  ],

  esbuild: {
    jsx: 'automatic',
  },
})