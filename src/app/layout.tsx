
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
// import { GeistMono } from 'geist/mono'; // Removed due to "Module not found" error
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { DEFAULT_OG_IMAGE_URL, SITE_NAME, SITE_URL } from '@/lib/constants';
import './globals.css';
// import { Analytics } from "@vercel/analytics/next" // Commented out to fix module not found error
const siteUrl = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME}: Nepal Driving License Practice Exams (Likhit)`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `Ace your Nepal driving license (Likhit) test for car & bike/scooter (Category A, B) with ${SITE_NAME}. Free online practice questions, realistic real exam simulations, traffic sign tutorials, and more. Start preparing today!`,
  keywords: ['Nepal driving license', 'Likhit exam', 'driving test Nepal', 'practice questions', 'real exam', 'traffic signs Nepal', 'vehicle license Nepal', 'Category A license', 'Category B license', 'bike license Nepal', 'scooter license Nepal', 'नेपाल ड्राइभिङ लाइसेन्स', 'लिखित परीक्षा'],
  authors: [{ name: SITE_NAME, url: siteUrl }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: {
        default: `${SITE_NAME}: Nepal Driving License Practice Exams (Likhit)`,
        template: `%s | ${SITE_NAME}`,
    },
    description: `Ace your Nepal driving license (Likhit) test for car & bike/scooter (Category A, B) with ${SITE_NAME}. Free online practice questions, realistic real exam simulations, traffic sign tutorials, and more. Start preparing today!`,
    url: siteUrl,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Driving License Preparation`,
      },
    ],
    locale: 'en_US', 
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
        default: `${SITE_NAME}: Nepal Driving License Practice Exams (Likhit)`,
        template: `%s | ${SITE_NAME}`,
    },
    description: `Ace your Nepal driving license (Likhit) test for car & bike/scooter (Category A, B) with ${SITE_NAME}. Free online practice questions, realistic real exam simulations, traffic sign tutorials, and more. Start preparing today!`,
    images: [DEFAULT_OG_IMAGE_URL], 
  },
  robots: { 
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: `${siteUrl}/manifest.json`, 
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  other: { 
    'msapplication-TileColor': '#b30000', // Updated to match the new red theme
    'msapplication-tap-highlight': 'no',
  }
};

export const viewport: Viewport = {
  themeColor: '#b30000', // Updated to match the new red theme
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} font-sans`} suppressHydrationWarning>
      
      <body className="antialiased bg-background text-foreground">
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow w-full">{children}</main>
            <Footer />
          </div>
          <Toaster />
          {/* <Analytics/> */} {/* Commented out to fix module not found error */}
      </body>
    </html>
  );
}
