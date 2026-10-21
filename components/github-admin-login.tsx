'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function GithubAdminLogin() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function login(formData: FormData) {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/content-admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: formData.get('password') }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Connexion impossible.');
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Connexion impossible.');
      setBusy(false);
    }
  }

  return <form action={login} className="login-form">
    <label>Mot de passe administrateur<input name="password" type="password" required autoComplete="current-password" /></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-dark" disabled={busy}>{busy ? 'Connexion…' : 'Se connecter'} <span>↗</span></button>
  </form>;
}
