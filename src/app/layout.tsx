import type { Metadata } from 'next';
import { Geist, Geist_Mono, Syne } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const syne = Syne({
  variable: '--font-display',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://paletparrot.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'PaletParrot - Extract Color Palettes from Images',
  description: 'Upload an image, extract colors, label them, and export the palette as CSS, SCSS, Tailwind, PDF, PNG, or JPG.',
  icons: {
    icon: [
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/site.webmanifest',
  appleWebApp: {
    title: 'PaletParrot',
  },
  applicationName: 'PaletParrot',
  openGraph: {
    title: 'PaletParrot - Extract Color Palettes from Images',
    description: 'Upload an image, extract colors, label them, and export the palette as CSS, SCSS, Tailwind, PDF, PNG, or JPG.',
    siteName: 'PaletParrot',
    url: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
