'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, LogOut, CarFront, Eye, EyeOff, Trash2, ImagePlus } from 'lucide-react';
import { VehicleManagePanel } from '@/components/vehicle-manage-panel';

type AdminVehicle = {
  id: string; brand: string; model: string; year: number; category: string;
  listing_type: 'sale'; status: 'available' | 'sold' | 'unavailable';
  sale_price: number | null; mileage: number | null; fuel: string;
  transmission: string; seats: number; color: string; description: string;
  published: boolean;
};

export function AdminDashboard({ name, initialVehicles }: { name: string | null; initialVehicles: AdminVehicle[] }) {
  const router = useRouter();
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState('');
  const [pending, startTransition] = useTransition();

  useEffect(() => { setVehicles(initialVehicles); }, [initialVehicles]);

  async function request(url: string, method: string, body?: unknown) {
    const response = await fetch(url, { method, ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? 'Une erreur est survenue.');
    return result;
  }

  async function createVehicle(formData: FormData) {
    setNotice('');
    const result = Object.fromEntries(formData.entries());
    const body = {
      ...result,
      listing_type: 'sale',
      year: Number(result.year),
      seats: Number(result.seats),
      sale_price: result.sale_price ? Number(result.sale_price) : null,
      mileage: result.mileage ? Number(result.mileage) : null,
      published: result.published === 'on',
    };
    try {
      await request('/api/admin', 'POST', body);
      setShowForm(false);
      setNotice('Véhicule ajouté.');
      startTransition(() => router.refresh());
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Création impossible.');
    }
  }

  async function update(body: Record<string, unknown>) {
    setNotice('');
    try {
      await request('/api/admin', 'PATCH', body);
      startTransition(() => router.refresh());
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Mise à jour impossible.');
    }
  }

  async function remove(vehicle: AdminVehicle) {
    if (!window.confirm(`Supprimer ${vehicle.brand} ${vehicle.model} ? Cette action est définitive.`)) return;
    try {
      await request('/api/admin', 'DELETE', { id: vehicle.id });
      startTransition(() => router.refresh());
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Suppression impossible.');
    }
  }

  async function logout() {
    await request('/api/admin/logout', 'POST');
    router.refresh();
  }

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <a className="admin-wordmark" href="/">AKOB <span>ADMIN</span></a>
      <div className="admin-user"><span className="admin-avatar">{(name?.[0] ?? 'A').toUpperCase()}</span><span>{name || 'Administrateur'}<small>Administrateur unique</small></span></div>
      <nav><a className="active" href="#overview"><CarFront size={17} /> Vue d'ensemble</a><a href="#inventory"><CarFront size={17} /> Véhicules</a></nav>
      <button className="admin-logout" onClick={logout}><LogOut size={16} /> Déconnexion</button>
    </aside>
    <main className="admin-content">
      <div className="admin-topbar"><span>AKOB AUTOMOBILE <i>/</i> ADMINISTRATION</span><a href="/" target="_blank">Voir le site ↗</a></div>
      <div className="admin-page-heading" id="overview"><div><span className="eyebrow">TABLEAU DE BORD</span><h1>Bonjour{name ? `, ${name.split(' ')[0]}` : ''}.</h1><p>Gérez les véhicules à vendre, leurs descriptions et leurs photos.</p></div><button className="button button-dark" onClick={() => setShowForm(true)}><Plus size={16} /> Ajouter un véhicule</button></div>
      {notice && <p className="admin-notice" role="status">{notice}</p>}
      <a className="button button-light photo-shortcut" href="#photo-management"><ImagePlus size={16} /> Ajouter des photos à un véhicule</a>
      <div className="stats-grid"><Stat label="Véhicules" value={vehicles.length} /><Stat label="Disponibles" value={vehicles.filter((vehicle) => vehicle.status === 'available').length} /><Stat label="Vendus" value={vehicles.filter((vehicle) => vehicle.status === 'sold').length} /></div>
      <VehicleManagePanel vehicles={vehicles} />
      <section className="admin-panel" id="inventory">
        <div className="admin-panel-heading"><div><span className="eyebrow">ANNONCES</span><h2>Vos véhicules</h2></div><span>{vehicles.length} annonce{vehicles.length !== 1 ? 's' : ''}</span></div>
        <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Véhicule</th><th>Prix</th><th>Statut</th><th>Publication</th><th>Actions</th></tr></thead><tbody>
          {vehicles.map((vehicle) => <tr key={vehicle.id}>
            <td><strong>{vehicle.brand} {vehicle.model}</strong><small>{vehicle.year} · {vehicle.category}</small></td>
            <td>{vehicle.sale_price ? `${new Intl.NumberFormat('fr-FR').format(vehicle.sale_price)} FCFA` : 'Sur demande'}</td>
            <td><select value={vehicle.status} aria-label={`Statut de ${vehicle.brand} ${vehicle.model}`} onChange={(event) => update({ id: vehicle.id, status: event.target.value, published: vehicle.published })}><option value="available">Disponible</option><option value="sold">Vendu</option><option value="unavailable">Indisponible</option></select></td>
            <td><button className="table-icon" title={vehicle.published ? 'Dépublier' : 'Publier'} onClick={() => update({ id: vehicle.id, status: vehicle.status, published: !vehicle.published })}>{vehicle.published ? <Eye size={16} /> : <EyeOff size={16} />}<span>{vehicle.published ? 'En ligne' : 'Masqué'}</span></button></td>
            <td><button className="table-icon danger" title="Supprimer" onClick={() => remove(vehicle)}><Trash2 size={16} /></button></td>
          </tr>)}
        </tbody></table>{vehicles.length === 0 && <p className="empty-state">Aucun véhicule enregistré.</p>}</div>
      </section>
      {showForm && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false); }}><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="vehicle-modal-title"><div className="modal-heading"><div><span className="eyebrow">ANNONCES</span><h2 id="vehicle-modal-title">Ajouter un véhicule</h2></div><button aria-label="Fermer" onClick={() => setShowForm(false)}><X size={20} /></button></div><form action={createVehicle} className="vehicle-admin-form"><label>Marque<input name="brand" required /></label><label>Modèle<input name="model" required /></label><label>Année<input name="year" type="number" min="1950" max="2027" required /></label><label>Catégorie<input name="category" placeholder="SUV, Berline…" required /></label><label>Statut<select name="status"><option value="available">Disponible</option><option value="sold">Vendu</option><option value="unavailable">Indisponible</option></select></label><label>Prix de vente (FCFA)<input name="sale_price" type="number" min="0" /></label><label>Kilométrage<input name="mileage" type="number" min="0" /></label><label>Carburant<input name="fuel" /></label><label>Transmission<input name="transmission" /></label><label>Places<input name="seats" type="number" min="1" defaultValue="5" required /></label><label>Couleur<input name="color" /></label><label className="wide">Description<textarea name="description" rows={3} /></label><label className="publish-toggle"><input type="checkbox" name="published" defaultChecked /> Publier immédiatement</label><div className="modal-actions"><button type="button" className="button button-light" onClick={() => setShowForm(false)}>Annuler</button><button className="button button-dark" disabled={pending}>Ajouter le véhicule <Plus size={16} /></button></div></form></section></div>}
    </main>
  </div>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <article className="stat-card"><span>{label}</span><strong>{value.toString().padStart(2, '0')}</strong></article>;
}
