import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

// ── Google Analytics 4 Measurement ID ──────────────────────────────────────
// Replace this with your real Measurement ID from:
//   https://analytics.google.com → Admin → Data Streams → Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-XXXXXXXXXX';
// ───────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Rankify DTU',
  description: 'Check your academic results effortlessly with Rankify DTU.',
  // Prevent indexing of API routes (important for data security)
  robots: { index: true, follow: true },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics 4 — only loads on valid IDs */}
        {GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true,
                  cookie_flags: 'SameSite=None;Secure',
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
