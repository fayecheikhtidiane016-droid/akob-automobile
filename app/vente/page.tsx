import type { Metadata } from 'next';
import { VehicleList } from '@/components/vehicle-list';
import { getVehicles } from '@/lib/vehicles';

export const metadata: Metadata = { title: 'Nos véhicules | Akob Automobile' };

export default async function VentePage() {
  const vehicles = await getVehicles();
  return <section className="catalog-page"><div className="catalog-intro"><span className="eyebrow">VENTE · VÉHICULES SÉLECTIONNÉS</span><h1>Nos véhicules <em>à vendre.</em></h1><p>Parcourez notre sélection. Chaque fiche présente les photos et informations du véhicule ; contactez-nous pour en savoir plus.</p></div><VehicleList vehicles={vehicles} /></section>;
}