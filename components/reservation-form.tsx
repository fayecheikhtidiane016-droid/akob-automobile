'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Vehicle } from '@/lib/vehicles';
import { formatCfa } from '@/lib/vehicles';

export function ReservationForm({ vehicles, selectedSlug }: { vehicles: Vehicle[]; selectedSlug?: string }) {
  const params = useSearchParams();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [vehicleSlug, setVehicleSlug] = useState(selectedSlug ?? params.get('vehicule') ?? '');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const selected = vehicles.find((vehicle) => vehicle.slug === vehicleSlug);
  const estimate = useMemo(() => {
    if (!selected?.dailyRate || !start || !end) return null;
    const hours = (new Date(end).getTime() - new Date(start).getTime()) / 3_600_000;
    return hours > 0 ? Math.ceil(hours / 24) * selected.dailyRate : null;
  }, [selected, start, end]);

  async function submit(formData: FormData) {
    setBusy(true); setMessage('');
    for (const field of ['start_at', 'end_at'] as const) {
      const localDate = formData.get(field);
      if (typeof localDate === 'string' && localDate) formData.set(field, new Date(localDate).toISOString());
    }
    const response = await fetch('/api/reservations', { method: 'POST', body: formData });
    const result = await response.json();
    setMessage(response.ok ? 'Votre demande a bien été envoyée. Elle reste en attente de confirmation par l’agence.' : result.error ?? 'Envoi impossible. Veuillez réessayer.');
    if (response.ok) (document.querySelector('#reservation-form') as HTMLFormElement)?.reset();
    setBusy(false);
  }

  return <form id="reservation-form" className="reservation-form" action={submit}>
    <div className="form-grid"><label>Nom complet<input name="customer_name" required autoComplete="name" /></label><label>Téléphone<input name="phone" type="tel" required autoComplete="tel" /></label><label className="full-field">Adresse e-mail <span>(facultatif)</span><input name="email" type="email" autoComplete="email" /></label>
      <label className="full-field">Véhicule<select name="vehicle_slug" required value={vehicleSlug} onChange={(event) => setVehicleSlug(event.target.value)}><option value="">Choisir un véhicule</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.slug}>{vehicle.brand} {vehicle.model} · {vehicle.year}</option>)}</select></label>
      <label>Date et heure de départ<input name="start_at" type="datetime-local" required value={start} onChange={(event) => setStart(event.target.value)} /></label><label>Date et heure de retour<input name="end_at" type="datetime-local" required min={start || undefined} value={end} onChange={(event) => setEnd(event.target.value)} /></label>
      <label>Lieu de prise en charge<input name="pickup_location" required /></label><label>Lieu de retour<input name="return_location" required /></label><label className="full-field">Informations complémentaires<textarea name="notes" rows={4} /></label>
    </div>
    {estimate !== null && <div className="estimate-box"><span>Estimation indicative</span><strong>{formatCfa(estimate)}</strong><small>Le montant définitif sera confirmé par l'agence.</small></div>}
    <p className="form-disclaimer">Cette demande ne constitue pas une réservation confirmée. L'agence vous contactera pour valider la disponibilité et les conditions.</p>
    <button className="button button-dark" disabled={busy}>{busy ? 'Envoi en cours…' : 'Envoyer ma demande'} <span>↗</span></button>{message && <p className={message.startsWith('Votre') ? 'form-success' : 'form-error'} role="status">{message}</p>}
  </form>;
}