'use client';

import { useMemo, useState } from 'react';
import { CarFront, MapPin, Users } from 'lucide-react';
import type { FormEvent } from 'react';
import type { Vehicle } from '@/lib/vehicles';
import { formatCfa } from '@/lib/format-cfa';
import { siteConfig } from '@/lib/site-config';

const rentalOptions = [
  { value: 'airport-transfer', label: 'Transfert aéroport' },
  { value: 'chauffeur', label: 'Location avec chauffeur' },
  { value: 'self-drive', label: 'Location sans chauffeur' },
  { value: 'daily', label: 'Location à la journée' },
  { value: 'long-term', label: 'Location longue durée' },
  { value: 'on-demand', label: 'Mise à disposition' },
] as const;

const categories = ['Tous les véhicules', 'Berline', 'SUV', '4x4', 'Minibus'];
const locationSuggestions = ['Dakar', 'Aéroport Blaise-Diagne (AIBD)', 'Saly', 'Thiès'];

export function RentalBooking({ vehicles, catalogError = false }: { vehicles: Vehicle[]; catalogError?: boolean }) {
  const [category, setCategory] = useState(categories[0]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [message, setMessage] = useState('');
  const categoryOptions = [...new Set([...categories, ...vehicles.map((vehicle) => vehicle.category)])];
  const availableVehicles = useMemo(
    () => vehicles.filter((vehicle) => category === categories[0] || vehicle.category.toLocaleLowerCase('fr') === category.toLocaleLowerCase('fr')),
    [category, vehicles],
  );
  const selectedVehicle = availableVehicles.find((vehicle) => vehicle.id === selectedVehicleId);
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (!selectedVehicle) {
      setMessage('Sélectionnez un véhicule disponible avant d’envoyer votre demande.');
      return;
    }

    const values = new FormData(form);
    const start = new Date(`${values.get('startDate')}T${values.get('startTime')}`);
    const end = new Date(`${values.get('endDate')}T${values.get('endTime')}`);
    if (start <= new Date() || end <= start) {
      setMessage('Vérifiez les dates : la prise en charge doit être future et le retour après le départ.');
      return;
    }

    const packageValue = String(values.get('package'));
    const packageLabel = rentalOptions.find((option) => option.value === packageValue)?.label ?? packageValue;
    const pickup = String(values.get('pickup'));
    const destination = String(values.get('destination'));
    const route = `${pickup} ${destination}`.toLocaleLowerCase('fr');
    const isAibdDakarRoute = /aibd|blaise.diagne/.test(route) && /dakar/.test(route);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86_400_000));
    const estimate = packageValue === 'airport-transfer' && isAibdDakarRoute && selectedVehicle.airportTransferRate
      ? formatCfa(selectedVehicle.airportTransferRate)
      : ['self-drive', 'daily', 'long-term'].includes(packageValue) && selectedVehicle.dailyRate
        ? formatCfa(selectedVehicle.dailyRate * days)
        : 'À confirmer avec l’agence';
    const messageLines = [
      `Bonjour ${siteConfig.name}, je souhaite demander une réservation.`,
      `Formule : ${packageLabel}`,
      `Départ : ${values.get('pickup')} — ${values.get('startDate')} à ${values.get('startTime')}`,
      `Destination / retour : ${values.get('destination')} — ${values.get('endDate')} à ${values.get('endTime')}`,
      `Véhicule : ${selectedVehicle.brand} ${selectedVehicle.model} (${selectedVehicle.category})`,
      `Durée estimée : ${days} jour(s)`,
      `Tarif estimatif : ${estimate}`,
      `Nom : ${values.get('name')}`,
      `Téléphone : ${values.get('phone')}`,
      `E-mail : ${values.get('email') || 'Non renseigné'}`,
      `Précisions : ${values.get('notes') || 'Aucune'}`,
      'Merci de confirmer la disponibilité et le tarif définitif.',
    ];
    window.location.href = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(messageLines.join('\n'))}`;
  }

  return (
    <div className="rental-layout">
      <form className="rental-form" onSubmit={submit}>
        <section className="rental-form-section">
          <span className="eyebrow">01 · VOTRE TRAJET</span>
          <div className="rental-fields">
            <label>Formule de location
              <select name="package" defaultValue="airport-transfer">
                {rentalOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label>Catégorie de véhicule
              <select value={category} onChange={(event) => { setCategory(event.target.value); setSelectedVehicleId(''); }}>
                {categoryOptions.map((item) => <option value={item} key={item}>{item}</option>)}
              </select>
            </label>
            <label>Lieu de départ
              <input name="pickup" list="senegal-locations" placeholder="Dakar, AIBD, hôtel…" required maxLength={160} />
            </label>
            <label>Destination / lieu de retour
              <input name="destination" list="senegal-locations" placeholder="Dakar, Saly, Thiès…" required maxLength={160} />
            </label>
            <datalist id="senegal-locations">{locationSuggestions.map((location) => <option key={location} value={location} />)}</datalist>
            <label>Date de prise en charge<input name="startDate" type="date" min={minDate} required /></label>
            <label>Heure de prise en charge<input name="startTime" type="time" required /></label>
            <label>Date de retour<input name="endDate" type="date" min={minDate} required /></label>
            <label>Heure de retour<input name="endTime" type="time" required /></label>
          </div>
        </section>

        <section className="rental-form-section">
          <div className="rental-section-heading">
            <div><span className="eyebrow">02 · VÉHICULES DISPONIBLES</span><h2>Choisissez votre véhicule</h2></div>
            <span>{catalogError ? 'Catalogue indisponible' : `${availableVehicles.length} disponible${availableVehicles.length !== 1 ? 's' : ''}`}</span>
          </div>
          {availableVehicles.length ? (
            <div className="rental-vehicle-grid">
              {availableVehicles.map((vehicle) => (
                <button
                  type="button"
                  className={`rental-vehicle-card${selectedVehicleId === vehicle.id ? ' is-selected' : ''}`}
                  key={vehicle.id}
                  onClick={() => setSelectedVehicleId(vehicle.id)}
                  aria-pressed={selectedVehicleId === vehicle.id}
                >
                  {vehicle.image
                    ? <span className="rental-vehicle-image"><img src={vehicle.image} alt={`${vehicle.brand} ${vehicle.model}`} loading="lazy" /></span>
                    : <span className="rental-vehicle-image rental-vehicle-placeholder"><CarFront size={34} /><small>Photo à venir</small></span>}
                  <span className="rental-vehicle-info">
                    <strong>{vehicle.brand} {vehicle.model}</strong>
                    <small>{vehicle.category} · {vehicle.seats ?? 5} places</small>
                    {vehicle.dailyRate ? <b>{formatCfa(vehicle.dailyRate)} <small>/ jour</small></b> : <b>Tarif sur demande</b>}
                    {vehicle.airportTransferRate && <b>{formatCfa(vehicle.airportTransferRate)} <small>· AIBD–Dakar</small></b>}
                  </span>
                  <span className="rental-vehicle-check">{selectedVehicleId === vehicle.id ? 'Sélectionné' : 'Choisir'}</span>
                </button>
              ))}
            </div>
          ) : catalogError ? (
            <div className="rental-load-error" role="alert">Le catalogue de location est temporairement inaccessible. Réessayez plus tard ou contactez l’agence.</div>
          ) : (
            <div className="rental-empty-grid" aria-live="polite">
              <div className="rental-empty-card"><CarFront size={30} /><strong>Aucun véhicule disponible pour le moment</strong><span>Notre équipe ajoutera bientôt les véhicules de location et leurs tarifs.</span></div>
              <div className="rental-empty-card rental-empty-card-muted"><CarFront size={30} /><span>Prochainement</span></div>
              <div className="rental-empty-card rental-empty-card-muted"><CarFront size={30} /><span>Prochainement</span></div>
            </div>
          )}
          {selectedVehicle && <p className="rental-price-note"><MapPin size={15} /> Le tarif AIBD–Dakar s’applique uniquement à ce trajet lorsque l’agence l’a renseigné. Pour les autres transferts, la mise à disposition et les prestations avec chauffeur, le prix final est confirmé par l’agence. Les tarifs journaliers affichés sont indicatifs.</p>}
        </section>

        <section className="rental-form-section">
          <span className="eyebrow">03 · VOS COORDONNÉES</span>
          <div className="rental-fields">
            <label>Nom complet<input name="name" autoComplete="name" required minLength={2} maxLength={120} /></label>
            <label>Téléphone<input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={40} /></label>
            <label>E-mail (facultatif)<input name="email" type="email" autoComplete="email" maxLength={254} /></label>
            <label className="rental-notes">Précisions complémentaires<textarea name="notes" rows={3} maxLength={600} placeholder="Nombre de passagers, numéro de vol, besoins particuliers…" /></label>
          </div>
        </section>
        <button className="button button-dark" disabled={!vehicles.length}>Envoyer ma demande sur WhatsApp <span>↗</span></button>
        {message && <p className="form-error" role="alert">{message}</p>}
        <p className="rental-disclaimer">Votre demande ne vaut pas confirmation de réservation. L’équipe Akob vous confirmera la disponibilité et le tarif final sur WhatsApp.</p>
      </form>
      <aside className="rental-summary"><span className="eyebrow">FORMULES DE LOCATION</span><h2>La route, à votre façon.</h2><ul>{rentalOptions.map(({ value, label }) => <li key={value}>{label}</li>)}</ul><p>Les tarifs sont précisés par véhicule lorsqu’ils sont disponibles. Pour un transfert ou une prestation personnalisée, l’agence confirme le prix après étude de votre trajet.</p><div className="rental-summary-contact"><Users size={18} /><span>Une équipe à votre écoute<br /><strong>{siteConfig.phone}</strong></span></div></aside>
    </div>
  );
}
