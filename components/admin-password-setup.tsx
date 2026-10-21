'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminPasswordSetup() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(formData: FormData) {
    const password = String(formData.get('password') ?? '');
    const confirmation = String(formData.get('confirmation') ?? '');
    if (password.length < 12) { setMessage("Choisissez un mot de passe d'au moins 12 caractères."); return; }
    if (password !== confirmation) { setMessage('Les deux mots de passe ne correspondent pas.'); return; }
    setBusy(true); setMessage('');
    const response = await fetch('/api/admin/setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error ?? 'Impossible de définir le mot de passe.'); setBusy(false); return; }
    router.replace('/admin');
    router.refresh();
  }

  return <form action={submit} className="login-form"><label>Nouveau mot de passe<input name="password" type="password" minLength={12} autoComplete="new-password" required /></label><label>Confirmer le mot de passe<input name="confirmation" type="password" minLength={12} autoComplete="new-password" required /></label>{message && <p className="form-error" role="status">{message}</p>}<button className="button button-dark" disabled={busy}>{busy ? 'Enregistrement…' : 'Activer mon compte'} <span>↗</span></button></form>;
}