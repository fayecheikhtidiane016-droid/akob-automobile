'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [recovering, setRecovering] = useState(false);

  async function login(formData: FormData) {
    setBusy(true); setError('');
    const response = await fetch('/api/admin/login', { method: 'POST', body: formData });
    const result = await response.json();
    if (!response.ok) { setError(result.error); setBusy(false); return; }
    router.refresh();
  }

  async function recover() {
    setBusy(true); setError(''); setNotice('');
    const response = await fetch('/api/admin/recover', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    const result = await response.json();
    if (!response.ok) { setError(result.error); setBusy(false); return; }
    setNotice('Si cette adresse correspond à un compte, un lien de récupération vient d’être envoyé.');
    setBusy(false);
  }

  return <div>
    <form action={login} className="login-form">
      <label>Adresse e-mail<input name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" /></label>
      {!recovering && <label>Mot de passe<input name="password" type="password" required autoComplete="current-password" /></label>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {notice && <p className="form-success" role="status">{notice}</p>}
      {recovering
        ? <><button type="button" className="button button-dark" disabled={busy || !email} onClick={recover}>{busy ? 'Envoi…' : 'Envoyer le lien de récupération'} <span>↗</span></button><button type="button" className="login-secondary" onClick={() => { setRecovering(false); setError(''); setNotice(''); }}>Retour à la connexion</button></>
        : <><button className="button button-dark" disabled={busy}>{busy ? 'Connexion…' : 'Se connecter'} <span>↗</span></button><button type="button" className="login-secondary" onClick={() => { setRecovering(true); setError(''); setNotice(''); }}>Mot de passe oublié ?</button></>}
  </form>
+  </div>;
}
