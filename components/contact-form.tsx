'use client';

import { useState } from 'react';

export function ContactForm() {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(formData: FormData) {
    setBusy(true); setMessage('');
    const response = await fetch('/api/contact', { method: 'POST', body: formData });
    const result = await response.json();
    setMessage(response.ok ? 'Votre message a bien été transmis à l’agence.' : result.error ?? 'Envoi impossible.');
    if (response.ok) (document.querySelector('#contact-form') as HTMLFormElement)?.reset();
    setBusy(false);
  }
  return <form id="contact-form" className="reservation-form" action={submit}><div className="form-grid"><label>Nom complet<input name="name" required autoComplete="name" /></label><label>Votre téléphone<input name="phone" type="tel" required autoComplete="tel" /></label><label className="full-field">Adresse e-mail<input name="email" type="email" required autoComplete="email" /></label><label className="full-field">Votre message<textarea name="message" rows={5} required /></label></div><button className="button button-dark" disabled={busy}>{busy ? 'Envoi…' : 'Envoyer le message'} <span>↗</span></button>{message && <p className="form-success" role="status">{message}</p>}</form>;
}