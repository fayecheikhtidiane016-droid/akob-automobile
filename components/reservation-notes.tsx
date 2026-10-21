'use client';

import { useState } from 'react';

type Reservation = { id: string; customer_name: string; status: string; internal_notes: string | null; vehicles: { brand: string; model: string } | null };

export function ReservationNotes({ reservations }: { reservations: Reservation[] }) {
  const [selectedId, setSelectedId] = useState('');
  const [message, setMessage] = useState('');
  const selected = reservations.find((reservation) => reservation.id === selectedId);
  async function save(formData: FormData) {
    if (!selected) return;
    const response = await fetch('/api/admin', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id, status: selected.status, internal_notes: formData.get('internal_notes') }) });
    const result = await response.json();
    setMessage(response.ok ? 'Note interne enregistrée.' : result.error ?? 'Enregistrement impossible.');
  }
  return <section className="admin-panel"><div className="admin-panel-heading"><div><span className="eyebrow">SUIVI ÉQUIPE</span><h2>Notes internes</h2></div></div><div className="vehicle-manage-body"><label className="manage-select">Demande concernée<select value={selectedId} onChange={(event) => { setSelectedId(event.target.value); setMessage(''); }}><option value="">Choisir une demande</option>{reservations.map((item) => <option key={item.id} value={item.id}>{item.customer_name} · {item.vehicles ? `${item.vehicles.brand} ${item.vehicles.model}` : 'Véhicule supprimé'}</option>)}</select></label>{selected && <form action={save} className="reservation-note-form"><label>Note visible uniquement par l'équipe<textarea name="internal_notes" rows={3} defaultValue={selected.internal_notes ?? ''} maxLength={2000} /></label><button className="button button-dark">Enregistrer la note</button></form>}{message && <p className="photo-message" role="status">{message}</p>}</div></section>;
}