import Link from 'next/link';
import { ArrowUpRight, Gauge, Users } from 'lucide-react';
import type { Vehicle } from '@/lib/vehicles';
import { formatCfa } from '@/lib/vehicles';

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <article className="vehicle-card">
      <Link className="vehicle-image" href={`/vehicules/${vehicle.slug}`} style={{ backgroundImage: `url("${vehicle.image}")` }} aria-label={`Découvrir ${vehicle.brand} ${vehicle.model}`}>
        <span className="vehicle-category">{vehicle.category}</span>{vehicle.images.length > 1 && <span className="vehicle-photo-count">{vehicle.images.length} photos</span>}<span className="image-arrow"><ArrowUpRight size={18} /></span>
      </Link>
      <div className="vehicle-info">
        <div className="vehicle-heading"><div><span className="vehicle-year">{vehicle.year} · {vehicle.brand}</span><h3>{vehicle.model}</h3></div><span className="vehicle-price">{vehicle.salePrice ? formatCfa(vehicle.salePrice) : 'Sur demande'}</span></div>
        <div className="vehicle-meta"><span><Gauge size={15} />{vehicle.mileage ? `${new Intl.NumberFormat('fr-FR').format(vehicle.mileage)} km` : 'Kilométrage N/A'}</span>{vehicle.seats !== null && <span><Users size={15} />{vehicle.seats} places</span>}<span>{vehicle.transmission}</span></div>
        <Link href={`/contact?objet=achat&vehicule=${vehicle.slug}`} className="vehicle-action">Contacter le vendeur <span>↗</span></Link>
      </div>
    </article>
  );
}