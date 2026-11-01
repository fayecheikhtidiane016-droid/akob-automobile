'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogOut, Plus, Trash2 } from 'lucide-react';
import type { Vehicle } from '@/lib/vehicles';

export function GithubAdminDashboard({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter();
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [pending, startTransition] = useTransition();

  async function addVehicle(formData: FormData) {
    setBusy(true);
    setNotice('');
    try {
      const response = await fetch('/api/content-admin/vehicles', { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Ajout impossible.');
      setNotice('Véhicule enregistré dans GitHub. Le site sera mis à jour après le déploiement.');
      (document.querySelector('#github-vehicle-form') as HTMLFormElement | null)?.reset();
      startTransition(() => router.refresh());
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : 'Ajout impossible.');
    } finally {
      setBusy(false);
    }
  }

  async function addPhotos(formData: FormData) {
    setBusy(true);
    setNotice('');
    try {
      const response = await fetch('/api/content-admin/vehicles', { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Import des photos impossible.');
      setNotice('Photos enregistrées dans GitHub. Le site sera mis à jour après le déploiement.');
      const id = formData.get('id');
      if (typeof id === 'string') (document.getElementById(`photos-${id}`) as HTMLFormElement | null)?.reset();
      startTransition(() => router.refresh());
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : 'Import des photos impossible.');
    } finally {
      setBusy(false);
    }
  }

  async function mutate(action: 'publish' | 'delete' | 'status', vehicle: Vehicle, status?: string) {
    if (action === 'delete' && !window.confirm(`Supprimer ${vehicle.brand} ${vehicle.model} du catalogue ?`)) return;
    setNotice('');
    const response = await fetch('/api/content-admin/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, id: vehicle.id, published: !vehicle.published, status }),
    });
    const result = await response.json();
    if (!response.ok) {
      setNotice(result.error ?? 'Modification impossible.');
      return;
    }
    setNotice(action === 'publish' ? 'Publication mise à jour.' : action === 'status' ? 'Disponibilité mise à jour.' : 'Véhicule supprimé.');
    startTransition(() => router.refresh());
  }

  async function logout() {
    await fetch('/api/content-admin/logout', { method: 'POST' });
    router.refresh();
  }

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <a className="admin-wordmark" href="/">AKOB <span>ADMIN</span></a>
      <div className="admin-user"><span className="admin-avatar">A</span><span>Gestion des véhicules<small>Catalogue GitHub</small></span></div>
      <nav><a className="active" href="#catalogue">Véhicules</a><a href="#add-vehicle">Ajouter un véhicule</a></nav>
      <button className="admin-logout" onClick={logout}><LogOut size={16} /> Déconnexion</button>
    </aside>
    <main className="admin-content">
      <div className="admin-topbar"><span>AKOB AUTOMOBILE <i>/</i> PUBLICATION</span><a href="/" target="_blank">Voir le site ↗</a></div>
      <div className="admin-page-heading" id="overview"><div><span className="eyebrow">GESTION SÉCURISÉE</span><h1>Véhicules.</h1><p>Les modifications sont enregistrées dans GitHub et déclenchent une mise à jour du site.</p></div></div>
      {notice && <p className="admin-notice" role="status">{notice}</p>}
      <section className="admin-panel" id="add-vehicle">
        <div className="admin-panel-heading"><div><span className="eyebrow">NOUVELLE ANNONCE</span><h2>Ajouter un véhicule</h2></div></div>
        <form id="github-vehicle-form" action={addVehicle} className="vehicle-admin-form">
          <label>Marque<input name="brand" required maxLength={80} /></label>
          <label>Modèle<input name="model" required maxLength={100} /></label>
          <label>Année<input name="year" type="number" min="1950" max={new Date().getFullYear() + 1} required /></label>
          <label>Catégorie<input name="category" placeholder="SUV, Berline…" required /></label>
          <label>Type d'annonce<select name="listingType" defaultValue="sale"><option value="sale">Vente</option><option value="rent">Location</option><option value="both">Vente et location</option></select></label>
          <label>Tarif journalier de location (FCFA)<input name="dailyRate" type="number" min="1" /></label>
          <label>Transfert AIBD–Dakar (FCFA, facultatif)<input name="airportTransferRate" type="number" min="1" /></label>
          <label>Prix de vente (FCFA, vide = sur demande)<input name="salePrice" type="number" min="0" /></label>
          <label>Kilométrage<input name="mileage" type="number" min="0" defaultValue="0" required /></label>
          <label>Carburant<input name="fuel" maxLength={40} /></label>
          <label>Transmission<input name="transmission" maxLength={60} /></label>
          <label>Places<input name="seats" type="number" min="1" max="20" defaultValue="5" required /></label>
          <label>Couleur<input name="color" maxLength={40} /></label>
          <label>Localisation<input name="location" defaultValue="Dakar" maxLength={100} /></label>
          <label className="wide">Description<textarea name="description" rows={3} maxLength={5000} /></label>
          <label className="wide">Photos (facultatives, JPEG, PNG, WebP ou AVIF, 5 maximum, 4 Mo au total)<input name="photos" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple /></label>
          <label className="publish-toggle"><input type="hidden" name="published" value="false" /><input type="checkbox" name="published" value="true" defaultChecked /> Publier après enregistrement</label>
          <div className="modal-actions"><button className="button button-dark" disabled={busy || pending}>{busy ? 'Enregistrement…' : 'Ajouter le véhicule'} <Plus size={16} /></button></div>
        </form>
      </section>
      <section className="admin-panel" id="catalogue">
        <div className="admin-panel-heading"><div><span className="eyebrow">CATALOGUE</span><h2>Véhicules enregistrés</h2></div><span>{vehicles.length} annonce{vehicles.length !== 1 ? 's' : ''}</span></div>
        <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Véhicule</th><th>Type</th><th>Tarif</th><th>Disponibilité</th><th>Publication</th><th>Actions</th></tr></thead><tbody>
          {vehicles.map((vehicle) => <tr key={vehicle.id}>
            <td><div className="admin-vehicle-cell">{vehicle.image
              ? <img className="admin-vehicle-thumbnail" src={vehicle.image} alt={`${vehicle.brand} ${vehicle.model}`} loading="lazy" />
              : <span className="admin-vehicle-thumbnail admin-vehicle-thumbnail-empty">Photo à venir</span>}
              <span><strong>{vehicle.brand} {vehicle.model}</strong><small>{vehicle.year} · {vehicle.images.length} photo(s)</small></span></div>
              <details><summary>Ajouter des photos</summary><form id={`photos-${vehicle.id}`} action={addPhotos} className="vehicle-admin-form">
                <input type="hidden" name="action" value="photos" /><input type="hidden" name="id" value={vehicle.id} />
                <label className="wide">Photos (4 Mo au total maximum)<input name="photos" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple required disabled={busy || vehicle.images.length >= 5} /></label>
                <label className="publish-toggle"><input type="checkbox" name="cover" value="true" /> Première nouvelle photo en couverture</label>
                <button className="button button-light" disabled={busy || pending || vehicle.images.length >= 5}>Importer</button>
              </form></details>
            </td>
            <td>{vehicle.listingType === 'rent' ? 'Location' : vehicle.listingType === 'both' ? 'Vente & location' : 'Vente'}</td>
            <td>{vehicle.dailyRate ? `${new Intl.NumberFormat('fr-FR').format(vehicle.dailyRate)} FCFA / jour` : vehicle.salePrice ? `${new Intl.NumberFormat('fr-FR').format(vehicle.salePrice)} FCFA` : 'Sur demande'}{vehicle.airportTransferRate && <small>{new Intl.NumberFormat('fr-FR').format(vehicle.airportTransferRate)} FCFA · AIBD–Dakar</small>}</td>
            <td><select value={vehicle.status} aria-label={`Disponibilité de ${vehicle.brand} ${vehicle.model}`} onChange={(event) => mutate('status', vehicle, event.target.value)}><option value="available">Disponible</option>{vehicle.listingType !== 'sale' && <><option value="reserved">Réservé</option><option value="rented">Loué</option></>}{vehicle.listingType !== 'rent' && <option value="sold">Vendu</option>}<option value="unavailable">Indisponible</option></select></td>
            <td><button className="table-icon" disabled={pending} onClick={() => mutate('publish', vehicle)}>{vehicle.published ? <Eye size={16} /> : <EyeOff size={16} />}<span>{vehicle.published ? 'En ligne' : 'Masqué'}</span></button></td>
            <td><button className="table-icon danger" disabled={pending} title="Supprimer" onClick={() => mutate('delete', vehicle)}><Trash2 size={16} /></button></td>
          </tr>)}
        </tbody></table>{vehicles.length === 0 && <p className="empty-state">Aucun véhicule enregistré.</p>}</div>
      </section>
    </main>
  </div>;
}
