import Link from 'next/link';
import { ArrowDown, ArrowUpRight, BadgeCheck, Headphones, ShieldCheck } from 'lucide-react';
import { VehicleCard } from '@/components/vehicle-card';
import { getVehicles } from '@/lib/vehicle-data';
import { siteConfig } from '@/lib/site-config';

export default async function HomePage() {
  const vehicles = await getVehicles();
  return <>
    <section className="hero">
      <div className="hero-image" />
      <div className="hero-shade" />
      <div className="hero-content"><span className="eyebrow light-eyebrow"><i /> VENTE & IMPORTATION AUTOMOBILE</span><h1>Le véhicule idéal.<br /><em>Votre projet, notre route.</em></h1><p>Découvrez nos véhicules à vendre ou confiez-nous votre recherche à l’importation. Un accompagnement clair, de la demande jusqu’à la remise des clés.</p><div className="hero-actions"><Link className="button button-gold" href="/vente">Voir les véhicules <ArrowUpRight size={17} /></Link><Link className="button button-outline" href="/contact?objet=importation">Demander une importation <ArrowUpRight size={17} /></Link></div></div>
      <div className="hero-caption"><span>01 / 04</span><span>Liberté, confort, confiance.</span><ArrowDown size={16} /></div>
    </section>
    <section className="trust-strip"><span>AKOB AUTOMOBILE</span><span className="trust-line" /><span>VOTRE PROCHAINE ROUTE COMMENCE ICI</span><span className="trust-location">DAKAR · SÉNÉGAL</span></section>
    <section className="section-wrap featured-section" id="nos-vehicules"><div className="section-heading"><div><span className="eyebrow">NOS VÉHICULES</span><h2>Découvrez notre<br /><em>sélection à vendre.</em></h2></div><Link className="text-link" href="/vente">Voir tous les véhicules <ArrowUpRight size={16} /></Link></div><div className="vehicle-grid">{vehicles.slice(0, 3).map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div></section>
    <section className="promise-section"><div className="promise-image" /><div className="promise-copy"><span className="eyebrow">L'EXPÉRIENCE AKOB</span><h2>Votre projet auto,<br /><em>à chaque étape.</em></h2><p>Que vous choisissiez un véhicule de notre sélection ou souhaitiez importer un modèle précis, nous vous accompagnons de votre première demande jusqu’à la livraison.</p><div className="promise-list"><div><ShieldCheck /><span><strong>Une sélection exigeante</strong><small>Des informations claires sur chaque véhicule.</small></span></div><div><Headphones /><span><strong>Un interlocuteur à vos côtés</strong><small>Un accompagnement adapté à votre recherche.</small></span></div><div><BadgeCheck /><span><strong>Un suivi transparent</strong><small>Les étapes et modalités sont expliquées avec vous.</small></span></div></div><Link className="text-link" href="/a-propos">Découvrir notre agence <ArrowUpRight size={16} /></Link></div></section>
    <section className="process-section"><div className="process-title"><span className="eyebrow">IMPORTATION SUR DEMANDE</span><h2>Votre recherche,<br /><em>notre accompagnement.</em></h2></div><div className="process-steps"><article><span>01</span><Headphones /><h3>Décrivez votre besoin</h3><p>Indiquez le modèle recherché, vos critères et votre budget.</p></article><article><span>02</span><ShieldCheck /><h3>Étudions le projet</h3><p>Nous échangeons avec vous sur les possibilités, le budget et les modalités.</p></article><article><span>03</span><BadgeCheck /><h3>Suivez les étapes</h3><p>Nous vous accompagnons tout au long du projet d’importation.</p></article></div><p className="process-note"><Link href="/contact?objet=importation" className="text-link">Parler de mon projet d’importation <ArrowUpRight size={16} /></Link></p></section>
    <section className="contact-band"><div><span className="eyebrow light-eyebrow">UNE QUESTION, UN PROJET ?</span><h2>On en parle ?</h2></div><a href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(`Bonjour ${siteConfig.name}, je souhaite en savoir plus.`)}`} target="_blank" rel="noreferrer" className="button button-gold">Écrivez-nous sur WhatsApp <ArrowUpRight size={17} /></a></section>
  </>;
}