import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8c6d2f]">À propos</p>
          <h1 className="mt-3 text-4xl font-bold text-zinc-900">Une agence pensée pour des déplacements plus élégants.</h1>
        </div>

        <div className="space-y-6 text-zinc-700">
          <p>
            Akob Automobile accompagne particuliers et professionnels dans la recherche de véhicules fiables, élégants et bien entretenus.
            Notre mission est de rendre l’accès à la mobilité plus simple, plus sûr et plus premium.
          </p>
          <p>
            Nous proposons une sélection rigoureuse de véhicules en location et en vente, avec un accompagnement personnalisé et un service de qualité.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            'Sélection rigoureuse',
            'Conseils personnalisés',
            'Support continu'
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <CheckCircle2 className="mb-4 text-[#c9a45b]" />
              <h3 className="text-xl font-semibold text-zinc-900">{item}</h3>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
