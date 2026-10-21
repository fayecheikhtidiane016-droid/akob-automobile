'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, Star, Trash2 } from 'lucide-react';

type Photo = { id: string; signed_url: string; alt_text: string; is_primary: boolean; sort_order: number };

export function VehiclePhotoManager({ vehicleId }: { vehicleId: string }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function refresh() {
    const response = await fetch(`/api/admin/photos?vehicle_id=${vehicleId}`);
    const result = await response.json();
    if (response.ok) setPhotos(result.photos);
    else setMessage(result.error ?? 'Chargement impossible.');
  }
  useEffect(() => { void refresh(); }, [vehicleId]);

  async function upload(formData: FormData) {
    setBusy(true); setMessage('');
    formData.set('vehicle_id', vehicleId);
    const response = await fetch('/api/admin/photos', { method: 'POST', body: formData });
    const result = await response.json();
    setMessage(response.ok ? `${result.count} photo(s) ajoutée(s).` : result.error ?? 'Import impossible.');
    if (response.ok) { (document.querySelector(`#photos-${vehicleId}`) as HTMLFormElement)?.reset(); await refresh(); }
    setBusy(false);
  }

  async function mutate(method: 'PATCH' | 'DELETE', payload: object) {
    const response = await fetch('/api/admin/photos', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error ?? 'Modification impossible.'); return; }
    await refresh();
  }

  return <div className="photo-manager"><form id={`photos-${vehicleId}`} action={upload} className="photo-upload"><label><ImagePlus size={16} /> Ajouter des photos<input name="photos" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple required /></label><label className="publish-toggle"><input type="checkbox" name="is_primary" value="true" /> Première photo en couverture</label><button className="button button-light" disabled={busy}>{busy ? 'Import…' : 'Importer'}</button></form>{message && <p className="photo-message" role="status">{message}</p>}{photos.length > 0 && <div className="photo-list">{photos.map((photo, index) => <article className="photo-item" key={photo.id}><img src={photo.signed_url} alt={photo.alt_text || 'Photo du véhicule'} /><span>{photo.is_primary ? 'Couverture' : `Photo ${index + 1}`}</span><div><button title="Définir en couverture" onClick={() => mutate('PATCH', { photo_id: photo.id, action: 'primary' })}><Star size={14} /></button><button title="Monter" disabled={index === 0} onClick={() => mutate('PATCH', { photo_id: photo.id, action: 'up' })}><ArrowUp size={14} /></button><button title="Descendre" disabled={index === photos.length - 1} onClick={() => mutate('PATCH', { photo_id: photo.id, action: 'down' })}><ArrowDown size={14} /></button><button title="Supprimer" onClick={() => mutate('DELETE', { photo_id: photo.id })}><Trash2 size={14} /></button></div></article>)}</div>}</div>;
}