'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { VehiclePhotoManager } from '@/components/vehicle-photo-manager';

type Vehicle = {
  id: string; brand: string; model: string; year: number; category: string;
  listing_type: 'rent' | 'sale' | 'both'; status: string; daily_rate: number | null;
  sale_price: number | null; mileage: number | null; fuel: string;
  transmission: string; seats: number; color: string; description: string;
  published: boolean;
};

export function VehicleManagePanel({ vehicles }: { vehicles: Vehicle[] }) {
  const [selectedId, setSelectedId] = useState('');
  const [message, setMessage] = useState('');
  const vehicle = vehicles.find((item) => item.id === selectedId);

  return (
    <section className="admin-panel vehicle-manage-panel" id="photo-management">
      <div className="admin-panel-heading">
        <div><span className="eyebrow">ÉDITION ET PHOTOS</span><h2>Gérer une annonce</h2></div>
        <span>Modification des prix, détails et images</span>
      </div>
      <div className="vehicle-manage-body">
        <label className="manage-select">Sélectionner un véhicule
          <select value={selectedId} onChange={(event) => { setSelectedId(event.target.value); setMessage(''); }}>
            <option value="">Choisir une annonce</option>
            {vehicles.map((item) => <option key={item.id} value={item.id}>{item.brand} {item.model} · {item.year}</option>)}
          </select>
        </label>
        {!vehicle && <p className="photo-manager-hint">Crée d’abord la fiche dans « Ajouter un véhicule », puis sélectionne-la ici pour importer ses photos et choisir l’image de couverture.</p>}
        {vehicle && <VehicleEditor key={vehicle.id} vehicle={vehicle} onMessage={setMessage} />}
        {message && <p className="photo-message" role="status">{message}</p>}
      </div>
    </section>
  );
}

function VehicleEditor({ vehicle, onMessage }: { vehicle: Vehicle; onMessage: (message: string) => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [listingType, setListingType] = useState(vehicle.listing_type);

  async function save(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const body = {
      ...data,
      id: vehicle.id,
      year: Number(data.year),
      seats: Number(data.seats),
      daily_rate: data.daily_rate ? Number(data.daily_rate) : null,
      sale_price: data.sale_price ? Number(data.sale_price) : null,
      mileage: data.mileage ? Number(data.mileage) : null,
      published: data.published === 'on',
    };
    const response = await fetch('/api/admin', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const result = await response.json();
    onMessage(response.ok ? 'Modifications enregistrées.' : result.error ?? 'Enregistrement impossible.');
    if (response.ok) startTransition(() => router.refresh());
  }

  return <>
    <form action={save} className="vehicle-admin-form">
      <label>Marque<input name="brand" defaultValue={vehicle.brand} required /></label>
      <label>Modèle<input name="model" defaultValue={vehicle.model} required /></label>
      <label>Année<input name="year" type="number" min="1950" defaultValue={vehicle.year} required /></label>
      <label>Catégorie<input name="category" defaultValue={vehicle.category} required /></label>
      <label>Type d'annonce<select name="listing_type" value={listingType} onChange={(event) => setListingType(event.target.value as Vehicle['listing_type'])}><option value="rent">Location</option><option value="sale">Vente</option><option value="both">Location et vente</option></select></label>
      <label>Statut<select name="status" defaultValue={vehicle.status}><option value="available">Disponible</option><option value="reserved">Réservé</option><option value="rented">Loué</option><option value="sold">Vendu</option><option value="unavailable">Indisponible</option></select></label>
      {['rent', 'both'].includes(listingType) && <label>Prix par jour (FCFA)<input name="daily_rate" type="number" min="0" defaultValue={vehicle.daily_rate ?? ''} required /></label>}
      {['sale', 'both'].includes(listingType) && <label>Prix de vente (FCFA)<input name="sale_price" type="number" min="0" defaultValue={vehicle.sale_price ?? ''} required /></label>}
      <label>Kilométrage<input name="mileage" type="number" min="0" defaultValue={vehicle.mileage ?? ''} /></label>
      <label>Carburant<input name="fuel" defaultValue={vehicle.fuel} /></label>
      <label>Transmission<input name="transmission" defaultValue={vehicle.transmission} /></label>
      <label>Places<input name="seats" type="number" min="1" defaultValue={vehicle.seats} required /></label>
      <label>Couleur<input name="color" defaultValue={vehicle.color} /></label>
      <label className="wide">Description<textarea name="description" rows={3} defaultValue={vehicle.description} /></label>
      <label className="publish-toggle"><input type="checkbox" name="published" defaultChecked={vehicle.published} /> Annonce publiée</label>
      <div className="modal-actions"><button className="button button-dark" disabled={pending}>Enregistrer les modifications <span>↗</span></button></div>
    </form>
    <VehiclePhotoManager vehicleId={vehicle.id} />
  </>;
}
