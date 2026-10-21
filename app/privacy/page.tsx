import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
        <h1 className="text-4xl font-bold text-zinc-900">Politique de confidentialité</h1>
        <div className="mt-8 space-y-5 text-zinc-700">
          <p>Cette politique décrit la manière dont Akob Automobile collecte, utilise et protège les informations personnelles.</p>
          <p>Les données collectées sont destinées à la gestion des demandes de réservation, au service client et au suivi commercial.</p>
          <p>Nous ne partageons pas ces informations avec des tiers sans votre consentement, sauf obligation légale.</p>
          <p>Les données sont conservées uniquement le temps nécessaire à leur finalité.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
