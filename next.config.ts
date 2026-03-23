import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide Next.js fingerprint from response headers
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // ── Transport & DNS ──────────────────────────────────────────────
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            // Force HTTPS for 2 years, include subdomains (preload-ready)
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },

          // ── Clickjacking Protection ──────────────────────────────────────
          {
            // DENY: no site (not even yours) can embed this in an iframe
            key: 'X-Frame-Options',
            value: 'DENY',
          },

          // ── MIME-type sniffing & XSS ─────────────────────────────────────
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },

          // ── Referrer leakage control ──────────────────────────────────────
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },

          // ── Permissions / Feature Policy ──────────────────────────────────
          {
            // Disable access to sensitive browser APIs not needed by this app
            key: 'Permissions-Policy',
            value: [
              'camera=()',          // No camera
              'microphone=()',      // No mic
              'geolocation=()',     // No GPS
              'payment=()',         // No payment APIs
              'usb=()',             // No USB
              'bluetooth=()',       // No Bluetooth
              'interest-cohort=()', // Opt-out of FLoC/Topics
            ].join(', '),
          },

          // ── Content Security Policy ───────────────────────────────────────
          // Locks down exactly which external sources are trusted.
          // Google Analytics & Google Tag Manager are explicitly whitelisted.
          {
            key: 'Content-Security-Policy',
            value: [
              // Only allow content from own origin by default
              "default-src 'self'",
              // Scripts: self + GA/GTM (Next.js inline scripts need unsafe-inline in dev)
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com",
              // Styles: self + Google Fonts + inline (Tailwind generates inline styles)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts from Google Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Images: self + GA beacon + data URIs + hits.seeyoufarm.com
              "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://hits.seeyoufarm.com",
              // API/fetch calls: self + GA
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com",
              // Block all object/embed/frame embeds
              "object-src 'none'",
              "frame-src 'none'",
              "frame-ancestors 'none'",
              // Only allow form submissions to self
              "form-action 'self'",
              // Upgrade any HTTP sub-requests to HTTPS
              "upgrade-insecure-requests",
            ].join('; '),
          },

          // ── Prevent caching of sensitive API responses ────────────────────
          // (Applied broadly; override per-route if needed)
        ],
      },

      // No-cache rule specifically for API routes to prevent data leakage via caches
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
