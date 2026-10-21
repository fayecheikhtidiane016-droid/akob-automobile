'use client';

import { useEffect } from 'react';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('Erreur de page', { digest: undefined }); }, []);
  return <section className="not-found"><span className="eyebrow">UNE ERREUR EST SURVENUE</span><h1>Reprenons <em>la route.</em></h1><p>Un problème temporaire a empêché l'affichage de cette page.</p><button className="button button-dark" onClick={() => reset()}>Réessayer <span>↗</span></button></section>;
}