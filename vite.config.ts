import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'pwa-192x192.svg', 'pwa-512x512.svg'],
      manifest: {
        name: 'JomSolat - Masjid Al-Malik Khalid Digital Companion',
        short_name: 'JomSolat',
        description: 'Prayer times, events, and everything about Masjid Al-Malik Khalid USM — in one place.',
        theme_color: '#1A1A2E',
        background_color: '#1A1A2E',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.svg?v=2',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-512x512.svg?v=2',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-512x512.svg?v=2',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Allow larger assets (images) to be precached by workbox.
        // Some supplied images exceed the default 2 MiB limit.
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  // Security headers - enhanced for production
  server: {
    headers: {
      // Content Security Policy (CSP)
      // Note: 'unsafe-inline' is required for React's inline styles and some PWA features in development
      // For production deployment, consider using nonce-based or hash-based CSP
      'Content-Security-Policy': [
        "default-src 'self'",
        "img-src 'self' https: data: blob:",
        // Restricted script-src - only use 'unsafe-eval' if absolutely necessary for runtime code
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "connect-src 'self' https://*.supabase.co https://api.apify.com https://images.weserv.nl https://*.apify.com",
        "frame-src https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com",
        "worker-src 'self' blob:",
        "manifest-src 'self'"
      ].join('; '),
      // Clickjacking protection
      'X-Frame-Options': 'DENY',
      // MIME type sniffing protection
      'X-Content-Type-Options': 'nosniff',
      // Referrer policy for privacy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      // Permissions policy - disable unused features
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      // HSTS - force HTTPS (only enable for production domains)
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      // XSS filter (legacy browsers)
      'X-XSS-Protection': '1; mode=block',
      // Cross-origin isolation
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})

