import Link from 'next/link';
import { ArrowUpRight, Gauge, Users } from 'lucide-react';
import type { Vehicle } from '@/lib/vehicles';
import { formatCfa } from '@/lib/vehicles';

export function VehicleCard({ vehicle, mode }: { vehicle: Vehicle; mode?: 'rent' | 'sale' }) {
  const price = mode === 'sale' ? vehicle.salePrice : vehicle.dailyRate;
  const suffix = mode === 'sale' ? '' : ' / jour';
  return (
    <article className="vehicle-card">
      <Link className="vehicle-image" href={`/vehicules/${vehicle.slug}`} style={{ backgroundImage: `url("${vehicle.image}")` }} aria-label={`Découvrir ${vehicle.brand} ${vehicle.model}`}>
        <span className="vehicle-category">{vehicle.category}</span><span className="image-arrow"><ArrowUpRight size={18} /></span>
      </Link>
      <div className="vehicle-info">
        <div className="vehicle-heading"><div><span className="vehicle-year">{vehicle.year} · {vehicle.brand}</span><h3>{vehicle.model}</h3></div><span className="vehicle-price">{price ? formatCfa(price) : 'Sur demande'}<small>{suffix}</small></span></div>
        <div className="vehicle-meta"><span><Gauge size={15} />{vehicle.mileage ? `${new Intl.NumberFormat('fr-FR').format(vehicle.mileage)} km` : 'Kilométrage N/A'}</span><span><Users size={15} />{vehicle.seats} places</span><span>{vehicle.transmission}</span></div>
        <Link href={mode === 'sale' ? `/vehicules/${vehicle.slug}?mode=vente` : `/reservation?vehicule=${vehicle.slug}`} className="vehicle-action">{mode === 'sale' ? 'Contacter le vendeur' : 'Réserver'} <span>↗</span></Link>
      </div>
    </article>
  );
}