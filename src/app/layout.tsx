import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';
import { Header } from '@/components/Header';

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
  metadataBase: new URL('https://rankify-dtu.netlify.app'),
  title: {
    default: 'Rankify DTU | Delhi Technological University Results & Placements',
    template: '%s | Rankify DTU'
  },
  description: 'Comprehensive academic and placement analytics dashboard for Delhi Technological University (DTU). Explore branch-wise CGPA trends, highest packages, and student rankings.',
  keywords: ['DTU', 'Delhi Technological University', 'Rankify DTU', 'DTU Results', 'DTU Placements', 'DTU CGPA', 'DTU CSE Placements', 'DTU Highest Package', 'Delhi College of Engineering'],
  authors: [{ name: 'Aditya Kashyap' }],
  creator: 'Aditya Kashyap',
  publisher: 'Rankify DTU',
  robots: { index: true, follow: true },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://rankify-dtu.netlify.app',
    title: 'Rankify DTU | Next-Gen Placement & Result Analytics',
    description: 'Explore DTU 2026 batch placement data, company-wise hiring trends, compensation insights, and student performance analytics.',
    siteName: 'Rankify DTU',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'Rankify DTU Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rankify DTU | Next-Gen Placement & Result Analytics',
    description: 'Explore DTU 2026 batch placement data, company-wise hiring trends, compensation insights, and student performance analytics.',
    images: ['/logo.png'],
  },
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
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
