import { ReservationForm } from '@/components/reservation-form';
import { getVehicles } from '@/lib/vehicles';

export default async function ReservationPage({ searchParams }: { searchParams: Promise<{ vehicule?: string }> }) {
  const [{ vehicule }, vehicles] = await Promise.all([searchParams, getVehicles('rent')]);
  return <section className="form-page"><div className="form-heading"><span className="eyebrow">LOCATION · DEMANDE DE RÉSERVATION</span><h1>Préparons votre <em>prochain trajet.</em></h1><p>Complétez les informations ci-dessous. Notre équipe vous recontactera pour confirmer la disponibilité et les détails.</p></div><ReservationForm vehicles={vehicles} selectedSlug={vehicule} /></section>;
}