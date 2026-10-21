import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, ShieldCheck, Star, Truck, WalletCards } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { VehicleCard } from '@/components/vehicle-card';
import { vehicles, testimonials, agency } from '@/lib/data';

const featured = vehicles.filter((vehicle) => vehicle.featured).slice(0, 3);

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <section className="relative overflow-hidden bg-[#0d0d0d] text-white">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80"
              alt="Voiture premium"
              fill
              priority
              className="object-cover opacity-60"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/40" />

          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-28 lg:px-8">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex rounded-full border border-[#c9a45b]/60 bg-[#c9a45b]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#e7d2a3]">
                {agency.name}
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Trouvez la voiture qui correspond à votre style de vie.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-zinc-200">
                Location et vente de véhicules premium, avec un service haut de gamme, des conseils avisés et une expérience sans compromis.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/cars?type=rent" className="rounded-full bg-[#c9a45b] px-6 py-3 font-semibold text-black transition hover:bg-[#d9b975]">
                  Louer une voiture
                </Link>
                <Link href="/cars?type=sale" className="rounded-full border border-white/30 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                  Acheter une voiture
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="flex items-end justify-between gap-4 pb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#8c6d2f]">Véhicules populaires</p>
              <h2 className="mt-2 text-3xl font-bold text-zinc-900">Sélection privilégiée</h2>
            </div>
            <Link href="/cars" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 hover:text-[#8c6d2f]">
              Voir toutes les offres <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>

        <section className="bg-[#111111] py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#d5bb7a]">Pourquoi nous choisir</p>
                <h2 className="mt-3 text-3xl font-bold">Une expérience premium et rassurante.</h2>
              </div>

              <div className="space-y-6 lg:col-span-2">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <ShieldCheck className="mb-4 text-[#d5bb7a]" />
                    <h3 className="text-lg font-semibold">Véhicules vérifiés</h3>
                    <p className="mt-2 text-sm text-zinc-300">Chaque véhicule est contrôlé avant mise en location ou vente.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <WalletCards className="mb-4 text-[#d5bb7a]" />
                    <h3 className="text-lg font-semibold">Tarifs clairs</h3>
                    <p className="mt-2 text-sm text-zinc-300">Des prix transparents, sans surprise et adaptés à votre budget.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <Truck className="mb-4 text-[#d5bb7a]" />
                    <h3 className="text-lg font-semibold">Service rapide</h3>
                    <p className="mt-2 text-sm text-zinc-300">Prise en charge, délais de livraison et suivi humain à chaque étape.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-[#8c6d2f]">Comment ça marche</p>
            <h2 className="mt-2 text-3xl font-bold text-zinc-900">Réservez simplement et sans stress</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              'Choisissez votre véhicule',
              'Confirmez la réservation',
              'Récupérez votre voiture'
            ].map((step, index) => (
              <div key={step} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#c9a45b]/15 text-lg font-bold text-[#8c6d2f]">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold">{step}</h3>
                <p className="mt-3 text-sm text-zinc-600">
                  Une procédure claire, rapide et conçue pour vous faire gagner du temps.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#f2ebdf] py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-10 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#8c6d2f]">Témoignages</p>
                <h2 className="mt-2 text-3xl font-bold text-zinc-900">Clients satisfaits</h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((item) => (
                <div key={item.name} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-1 text-[#c9a45b]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={`${item.name}-${index}`} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-zinc-700">“{item.quote}”</p>
                  <div className="mt-6 border-t border-zinc-200 pt-4">
                    <p className="font-semibold text-zinc-900">{item.name}</p>
                    <p className="text-sm text-zinc-500">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <div className="rounded-[32px] bg-zinc-950 p-8 text-white md:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#d5bb7a]">Besoin d'aide ?</p>
                <h2 className="mt-2 text-3xl font-bold">Contactez notre équipe</h2>
              </div>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#c9a45b] px-6 py-3 font-semibold text-black transition hover:bg-[#d9b975]">
                Nous contacter <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
