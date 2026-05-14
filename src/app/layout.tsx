import type { Metadata } from 'next';
import { Geist, Geist_Mono, Syne } from 'next/font/google';
import './globals.css';

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

export const metadata: Metadata = {
  title: 'PaletParrot - Extract Color Palettes from Images',
  description: 'Upload an image, extract colors, label them, and export the palette as CSS, SCSS, Tailwind, PDF, PNG, or JPG.',
  icons: {
    icon: '/paletparrot-mark.png',
    shortcut: '/paletparrot-mark.png',
    apple: '/paletparrot-mark.png',
  },
  applicationName: 'PaletParrot',
  openGraph: {
    title: 'PaletParrot - Extract Color Palettes from Images',
    description: 'Upload an image, extract colors, label them, and export the palette as CSS, SCSS, Tailwind, PDF, PNG, or JPG.',
    siteName: 'PaletParrot',
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
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
