import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
        <h1 className="text-4xl font-bold text-zinc-900">Conditions générales de location et de vente</h1>
        <div className="mt-8 space-y-5 text-zinc-700">
          <p>Les présentes conditions doivent être validées par l’agence avant mise en vigueur.</p>
          <p>Pour toute location, la réservation ne constitue pas une confirmation définitive. Une validation de l’agence est requise.</p>
          <p>Pour toute vente, les informations affichées doivent être vérifiées et complétées selon les documents du véhicule.</p>
          <p>Les modalités de paiement, de livraison et de garantie doivent être documentées et confirmées avant la transaction.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
