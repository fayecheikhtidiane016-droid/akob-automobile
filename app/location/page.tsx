import type { Metadata } from 'next';
import { VehicleList } from '@/components/vehicle-list';
import { getVehicles } from '@/lib/vehicles';

export const metadata: Metadata = { title: 'Location de voitures | Akob Automobile' };

export default async function LocationPage() {
  const vehicles = await getVehicles('rent');
  return <section className="catalog-page"><div className="catalog-intro"><span className="eyebrow">LOCATION · DAKAR</span><h1>La route vous <em>appartient.</em></h1><p>Pour un jour, un week-end ou plus longtemps, trouvez le véhicule qui vous accompagnera.</p></div><VehicleList vehicles={vehicles} mode="rent" /></section>;
}