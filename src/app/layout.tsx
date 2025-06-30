
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import { Inter, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: "KingDragons - Forge Your Legend in Knowledge",
  description: "Join KingDragons, the gamified learning platform where you conquer science quests, master new skills, and become a legendary knight of knowledge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("font-body antialiased", inter.variable, spaceGrotesk.variable)}>
        {children}
        <Script src="https://js.puter.com/v2/" strategy="lazyOnload" />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
