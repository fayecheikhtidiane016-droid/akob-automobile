import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Fuel, Gauge, Settings2, Users } from 'lucide-react';
import { VehicleCard } from '@/components/vehicle-card';
import { VehicleGallery } from '@/components/vehicle-gallery';
import { siteConfig } from '@/lib/site-config';
import { formatCfa, getVehicles } from '@/lib/vehicles';

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicles = await getVehicles();
  const vehicle = vehicles.find((item) => item.slug === slug);
  if (!vehicle) notFound();
  const similar = vehicles.filter((item) => item.id !== vehicle.id).slice(0, 2);
  const isSale = vehicle.listingType === 'sale';
  const price = isSale ? vehicle.salePrice : vehicle.dailyRate;

  return <div className="detail-page">
    <Link href={isSale ? '/vente' : '/location'} className="back-link"><ArrowLeft size={15} /> Retour aux véhicules</Link>
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
          <span><Users />{vehicle.seats} places</span>
        </div>
        <h2>À propos de ce véhicule</h2>
        <p className="detail-description">Contactez notre équipe pour vérifier les disponibilités, obtenir les conditions détaillées et organiser une visite ou une réservation.</p>
      </div>
      <aside className="detail-aside">
        <span className="eyebrow">{isSale ? 'PRIX DE VENTE' : 'TARIF JOURNALIER'}</span>
        <strong>{price ? formatCfa(price) : 'Sur demande'}{!isSale && <small> / jour</small>}</strong>
        <span className="availability"><i />{vehicle.status === 'available' ? 'Disponible' : 'Nous consulter'}</span>
        <Link href={isSale ? `/contact?vehicule=${vehicle.slug}` : `/reservation?vehicule=${vehicle.slug}`} className="button button-dark">{isSale ? 'Contacter le vendeur' : 'Demander une réservation'} <ArrowUpRight size={17} /></Link>
        <a className="text-link" href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(`Bonjour ${siteConfig.name}, je suis intéressé(e) par le véhicule ${vehicle.brand} ${vehicle.model}.`)}`} target="_blank" rel="noreferrer">Écrire sur WhatsApp <ArrowUpRight size={15} /></a>
        <p>Votre demande sera confirmée par notre équipe.</p>
      </aside>
    </div>
    {similar.length > 0 && <section className="similar-section"><div className="section-heading"><div><span className="eyebrow">À DÉCOUVRIR AUSSI</span><h2>Dans le même esprit.</h2></div></div><div className="vehicle-grid">{similar.map((item) => <VehicleCard key={item.id} vehicle={item} />)}</div></section>}
  </div>;
}
