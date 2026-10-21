import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import logo from '@/image/logoakob.jpeg';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div><Link href="/" className="footer-brand" aria-label={`${siteConfig.name}, accueil`}><Image src={logo} alt={siteConfig.name} className="footer-brand-logo" /></Link><p>La route, à votre manière.</p></div>
        <div><h3>Explorer</h3><Link href="/location">Location</Link><Link href="/vente">Vente</Link><Link href="/a-propos">Notre agence</Link></div>
        <div><h3>Nous joindre</h3><a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}>{siteConfig.phone}</a><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><span>{siteConfig.address}</span></div>
        <div><h3>Informations</h3><Link href="/confidentialite">Confidentialité</Link><Link href="/conditions">Conditions générales</Link><Link href="/admin">Espace équipe <ArrowUpRight size={13} /></Link></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Akob Automobile</span><span>Chaque trajet commence par le bon choix.</span></div>
    </footer>
  );
}