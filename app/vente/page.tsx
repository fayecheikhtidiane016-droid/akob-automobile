import type { Metadata } from 'next';
import { VehicleList } from '@/components/vehicle-list';
import { getVehicles } from '@/lib/vehicle-data';

export const metadata: Metadata = { title: 'Nos véhicules | Akob Automobile' };

export default async function VentePage() {
  const vehicles = await getVehicles();
  return <section className="catalog-page"><div className="catalog-intro"><span className="eyebrow">AKOB AUTOMOBILE · DAKAR</span><h1>Trouvez le véhicule<br /><em>qui vous ressemble.</em></h1><p>Découvrez notre sélection de véhicules à vendre. Consultez les photos, comparez les caractéristiques et échangez avec notre équipe pour concrétiser votre projet.</p></div><VehicleList vehicles={vehicles} /></section>;
}