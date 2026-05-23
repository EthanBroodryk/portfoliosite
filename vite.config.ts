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
    clientsClaim: true,       // 🔥 forces SW to take control
    skipWaiting: true,        // 🔥 activates new SW immediately
    cleanupOutdatedCaches: true,
  },

  devOptions: {
    enabled: false,           // ❗ MUST be false for real testing
  },

  manifest: {
    name: 'Zenchi Technologies',
    short_name: 'Zenchi',
    display: 'standalone',
    theme_color: '#ffffff',
  },
})
  ],

  esbuild: {
    jsx: 'automatic',
  },
})