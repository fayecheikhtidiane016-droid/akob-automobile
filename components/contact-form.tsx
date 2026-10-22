'use client';

import { useState } from 'react';
import { siteConfig } from '@/lib/site-config';

export function ContactForm({ initialSubject = 'achat', vehicleSlug }: { initialSubject?: 'achat' | 'importation'; vehicleSlug?: string }) {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(formData: FormData) {
    setBusy(true); setMessage('');
    try {
      const subjectLabels = { achat: 'Achat d’un véhicule', importation: 'Projet d’importation', autre: 'Autre demande' };
      const subject = subjectLabels[String(formData.get('subject')) as keyof typeof subjectLabels] ?? subjectLabels.achat;
      const body = [
        `Nom : ${formData.get('name')}`,
        `Téléphone : ${formData.get('phone')}`,
        `Adresse e-mail : ${formData.get('email')}`,
        `Demande : ${subject}`,
        '',
        'Message :',
        formData.get('message'),
      ].join('\n');
      window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setMessage('Votre application de messagerie va s’ouvrir avec le message prérempli. Il vous restera à l’envoyer.');
    } catch {
      setMessage('Impossible d’ouvrir votre application de messagerie.');
    } finally {
      setBusy(false);
    }
  }
  return <form id="contact-form" className="reservation-form" action={submit}><div className="form-grid"><label>Nom complet<input name="name" required autoComplete="name" /></label><label>Votre téléphone<input name="phone" type="tel" required autoComplete="tel" /></label><label className="full-field">Adresse e-mail<input name="email" type="email" required autoComplete="email" /></label><label className="full-field">Votre demande<select name="subject" defaultValue={initialSubject}><option value="achat">Achat d’un véhicule</option><option value="importation">Projet d’importation</option><option value="autre">Autre demande</option></select></label><label className="full-field">Votre message<textarea name="message" rows={5} defaultValue={vehicleSlug ? `Bonjour, je souhaite obtenir des informations sur le véhicule ${vehicleSlug}.` : ''} required /></label></div><button className="button button-dark" disabled={busy}>{busy ? 'Ouverture…' : 'Envoyer le message'} <span>↗</span></button>{message && <p className="form-success" role="status">{message}</p>}</form>;
}