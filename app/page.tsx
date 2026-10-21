import Link from 'next/link';
import { ArrowDown, ArrowUpRight, BadgeCheck, CalendarDays, Headphones, ShieldCheck } from 'lucide-react';
import { VehicleCard } from '@/components/vehicle-card';
import { getVehicles } from '@/lib/vehicles';
import { siteConfig } from '@/lib/site-config';

export default async function HomePage() {
  const vehicles = await getVehicles();
  return <>
    <section className="hero">
      <div className="hero-image" />
      <div className="hero-shade" />
      <div className="hero-content"><span className="eyebrow light-eyebrow"><i /> L'ART DE PRENDRE LA ROUTE</span><h1>Le bon véhicule.<br /><em>Le bon moment.</em></h1><p>Location et vente de voitures sélectionnées, avec un accompagnement qui fait toute la différence.</p><div className="hero-actions"><Link className="button button-gold" href="/location">Louer une voiture <ArrowUpRight size={17} /></Link><Link className="button button-outline" href="/vente">Acheter une voiture <ArrowUpRight size={17} /></Link></div></div>
      <div className="hero-caption"><span>01 / 04</span><span>Liberté, confort, confiance.</span><ArrowDown size={16} /></div>
    </section>
    <section className="trust-strip"><span>AKOB AUTOMOBILE</span><span className="trust-line" /><span>VOTRE PROCHAINE ROUTE COMMENCE ICI</span><span className="trust-location">DAKAR · SÉNÉGAL</span></section>
    <section className="section-wrap featured-section"><div className="section-heading"><div><span className="eyebrow">NOTRE SÉLECTION</span><h2>Des voitures qui<br /><em>vous ressemblent.</em></h2></div><Link className="text-link" href="/location">Voir tous les véhicules <ArrowUpRight size={16} /></Link></div><div className="vehicle-grid">{vehicles.slice(0, 3).map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div></section>
    <section className="promise-section"><div className="promise-image" /><div className="promise-copy"><span className="eyebrow">L'EXPÉRIENCE AKOB</span><h2>Bien plus qu'une<br /><em>question de voiture.</em></h2><p>Du premier échange à la remise des clés, nous vous aidons à trouver une solution adaptée à vos envies et à votre budget.</p><div className="promise-list"><div><ShieldCheck /><span><strong>Une sélection exigeante</strong><small>Des véhicules contrôlés et entretenus.</small></span></div><div><Headphones /><span><strong>Un interlocuteur à vos côtés</strong><small>Une équipe disponible à chaque étape.</small></span></div><div><BadgeCheck /><span><strong>Des conditions transparentes</strong><small>Un accompagnement clair, sans surprise.</small></span></div></div><Link className="text-link" href="/a-propos">Découvrir notre agence <ArrowUpRight size={16} /></Link></div></section>
    <section className="process-section"><div className="process-title"><span className="eyebrow">SIMPLE, TOUT SIMPLEMENT</span><h2>Votre prochaine voiture,<br /><em>en trois étapes.</em></h2></div><div className="process-steps"><article><span>01</span><CalendarDays /><h3>Choisissez</h3><p>Parcourez nos véhicules et trouvez celui qui correspond à votre projet.</p></article><article><span>02</span><Headphones /><h3>Échangeons</h3><p>Envoyez votre demande ; notre équipe vous recontacte pour les détails.</p></article><article><span>03</span><BadgeCheck /><h3>Prenez la route</h3><p>Après validation par l'agence, nous organisons la remise des clés.</p></article></div><p className="process-note">Toute demande de réservation reste soumise à confirmation par l'agence.</p></section>
    <section className="contact-band"><div><span className="eyebrow light-eyebrow">UNE QUESTION, UN PROJET ?</span><h2>On en parle ?</h2></div><a href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(`Bonjour ${siteConfig.name}, je souhaite en savoir plus.`)}`} target="_blank" rel="noreferrer" className="button button-gold">Écrivez-nous sur WhatsApp <ArrowUpRight size={17} /></a></section>
  </>;
}