import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = { title: 'Contact | Akob Automobile' };

export default function ContactPage() {
  return <section className="form-page"><div className="form-heading"><span className="eyebrow">CONTACT · AKOB AUTOMOBILE</span><h1>Parlons de <em>votre projet.</em></h1><p>Une question sur un véhicule, une réservation ou nos services ? Notre équipe est à votre écoute.</p></div><div className="contact-layout"><ContactForm /><aside className="contact-details"><span className="eyebrow">RETROUVEZ-NOUS</span><a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}>{siteConfig.phone}</a><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><p>{siteConfig.address}</p><a className="button button-dark" href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer">Écrire sur WhatsApp <span>↗</span></a><small>Coordonnées configurables via les variables d'environnement de l'agence.</small></aside></div></section>;
}