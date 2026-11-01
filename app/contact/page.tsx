import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = { title: 'Contact | Akob Automobile' };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ objet?: string; vehicule?: string }> }) {
  const params = await searchParams;
  const subject = params.objet === 'importation' ? 'importation' : 'achat';
  return <section className="form-page"><div className="form-heading"><span className="eyebrow">CONTACT · AKOB AUTOMOBILE</span><h1>Parlons de <em>votre projet.</em></h1><p>Une question sur un véhicule à vendre ou un projet d’importation ? Notre équipe est à votre écoute.</p></div><div className="contact-layout"><ContactForm initialSubject={subject} vehicleSlug={params.vehicule} /><aside className="contact-details"><span className="eyebrow">RETROUVEZ-NOUS</span>{siteConfig.phones.map((phone) => <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>)}<a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><p>{siteConfig.address}</p>{siteConfig.whatsappNumbers.map((number, index) => <a className="button button-dark" href={`https://wa.me/${number}`} key={number} target="_blank" rel="noreferrer">WhatsApp {siteConfig.phones[index] ?? `+${number}`} <span>↗</span></a>)}<small>Coordonnées configurables via les variables d'environnement de l'agence.</small></aside></div></section>;
}