import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Fuel, Gauge, MapPin, Settings2, Users } from 'lucide-react';
import { VehicleCard } from '@/components/vehicle-card';
import { VehicleGallery } from '@/components/vehicle-gallery';
import { formatCfa } from '@/lib/format-cfa';
import { siteConfig } from '@/lib/site-config';
import { getVehicles } from '@/lib/vehicle-data';

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicles = await getVehicles();
  const vehicle = vehicles.find((item) => item.slug === slug);
  if (!vehicle) notFound();
  const similar = vehicles.filter((item) => item.id !== vehicle.id).slice(0, 2);
  return <div className="detail-page">
    <Link href="/vente" className="back-link"><ArrowLeft size={15} /> Retour aux véhicules</Link>
    <VehicleGallery images={vehicle.images} category={vehicle.category} year={vehicle.year} />
    <div className="detail-layout">
      <div className="detail-main">
        <span className="eyebrow">{vehicle.brand} · {vehicle.year}</span>
        <h1>{vehicle.model}</h1>
        <p className="detail-description">{vehicle.description}</p>
        <h2>Caractéristiques</h2>
        <div className="spec-grid">
          <span><Gauge />{vehicle.mileage ? `${new Intl.NumberFormat('fr-FR').format(vehicle.mileage)} km` : 'Kilométrage N/A'}</span>
          <span><Fuel />{vehicle.fuel}</span><span><Settings2 />{vehicle.transmission}</span>
          {vehicle.seats !== null && <span><Users />{vehicle.seats} places</span>}
          {vehicle.location && <span><MapPin />{vehicle.location}</span>}
        </div>
        <h2>À propos de ce véhicule</h2>
        <p className="detail-description">Contactez notre équipe pour vérifier la disponibilité, obtenir les informations complémentaires et organiser une visite.</p>
      </div>
      <aside className="detail-aside">
        <span className="eyebrow">PRIX DE VENTE</span>
        <strong>{vehicle.salePrice ? formatCfa(vehicle.salePrice) : 'Sur demande'}</strong>
        <span className="availability"><i />{vehicle.status === 'available' ? 'Disponible' : 'Nous consulter'}</span>
        <Link href={`/contact?objet=achat&vehicule=${vehicle.slug}`} className="button button-dark">Contacter le vendeur <ArrowUpRight size={17} /></Link>
        <a className="text-link" href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(`Bonjour ${siteConfig.name}, je suis intéressé(e) par le véhicule ${vehicle.brand} ${vehicle.model}.`)}`} target="_blank" rel="noreferrer">Écrire sur WhatsApp <ArrowUpRight size={15} /></a>
        {vehicle.contactPhones?.length ? <div className="vehicle-contact-phones"><span>Appeler directement</span>{vehicle.contactPhones.map((phone) => <a key={phone} href={`tel:+221${phone}`}>+221 {phone.slice(0, 2)} {phone.slice(2, 5)} {phone.slice(5, 7)} {phone.slice(7)}</a>)}</div> : <p>Notre équipe vous répondra pour échanger sur ce véhicule.</p>}
        {vehicle.location && <p>Visite possible à {vehicle.location}, sur rendez-vous.</p>}
      </aside>
    </div>
    {similar.length > 0 && <section className="similar-section"><div className="section-heading"><div><span className="eyebrow">À DÉCOUVRIR AUSSI</span><h2>Dans le même esprit.</h2></div></div><div className="vehicle-grid">{similar.map((item) => <VehicleCard key={item.id} vehicle={item} />)}</div></section>}
  </div>;
}
