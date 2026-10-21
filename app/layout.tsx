import type { Metadata } from 'next';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { DemoBanner } from '@/components/demo-banner';
import { AuthReturnHandler } from '@/components/auth-return-handler';
import { siteConfig } from '@/lib/site-config';
import './globals.css';

export const metadata: Metadata = {
  title: `${siteConfig.name} | Location & vente`,
  description: 'Louez ou achetez votre prochaine voiture avec Akob Automobile.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <AuthReturnHandler />
        <DemoBanner />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}