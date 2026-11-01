import type { Metadata } from 'next';
import { RentalBooking } from '@/components/rental-booking';
import type { Vehicle } from '@/lib/vehicles';
import { getRentalVehicles } from '@/lib/vehicle-data';

export const metadata: Metadata = { title: 'Location & réservation | Akob Automobile' };
export const dynamic = 'force-dynamic';

export default async function ReservationPage() {
  let vehicles: Vehicle[] = [];
  let catalogError = false;
  try {
    vehicles = await getRentalVehicles();
  } catch (error) {
    console.error('Rental vehicle catalog could not be loaded:', error);
    catalogError = true;
  }
  return <section className="rental-page">
    <div className="rental-intro">
      <span className="eyebrow">AKOB AUTOMOBILE · DAKAR</span>
      <h1>Votre trajet,<br /><em>en toute liberté.</em></h1>
      <p>Choisissez votre formule, indiquez votre itinéraire et vos dates. Sélectionnez un véhicule disponible puis envoyez votre demande à notre équipe.</p>
    </div>
    <RentalBooking vehicles={vehicles} catalogError={catalogError} />
  </section>;
}