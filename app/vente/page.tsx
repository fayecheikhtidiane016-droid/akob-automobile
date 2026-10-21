import type { Metadata } from 'next';
import { VehicleList } from '@/components/vehicle-list';
import { getVehicles } from '@/lib/vehicles';

export const metadata: Metadata = { title: 'Voitures à vendre | Akob Automobile' };

export default async function VentePage() {
  const vehicles = await getVehicles();
  return <section className="catalog-page"><div className="catalog-intro"><span className="eyebrow">VENTE · VÉHICULES SÉLECTIONNÉS</span><h1>Votre prochain chapitre <em>commence ici.</em></h1><p>Des véhicules choisis avec soin, et une équipe à votre écoute pour chaque étape.</p></div><VehicleList vehicles={vehicles} /></section>;
}