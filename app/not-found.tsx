import Link from 'next/link';

export default function NotFound() {
  return <section className="not-found"><span className="eyebrow">ERREUR 404</span><h1>Cette route n'existe <em>pas.</em></h1><p>Le véhicule ou la page recherchée n'est peut-être plus disponible.</p><Link href="/" className="button button-dark">Retour à l'accueil <span>↗</span></Link></section>;
}