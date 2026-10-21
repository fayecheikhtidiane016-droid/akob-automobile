import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, Gauge, MapPin, ShieldCheck, Star, Wallet } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { vehicles } from '@/lib/data';

export function generateStaticParams() {
  return vehicles.map((vehicle) => ({ slug: vehicle.slug }));
}

export default function VehicleDetailPage({ params }: { params: { slug: string } }) {
  const vehicle = vehicles.find((item) => item.slug === params.slug);

  if (!vehicle) {
    notFound();
  }

  const related = vehicles.filter((item) => item.id !== vehicle.id).slice(0, 3);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <Link href="/cars" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-[#8c6d2f]">
          <ArrowLeft size={16} /> Retour aux véhicules
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
          <div>
            <div className="overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-sm">
              <Image src={vehicle.gallery[0]} alt={vehicle.title} width={1200} height={800} className="h-[420px] w-full object-cover" />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {vehicle.gallery.slice(1, 4).map((image, index) => (
                <div key={`${vehicle.id}-${index}`} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                  <Image src={image} alt={`${vehicle.title} ${index + 1}`} width={600} height={420} className="h-32 w-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#8c6d2f]">{vehicle.brand}</p>
                <h1 className="mt-2 text-3xl font-bold text-zinc-900">{vehicle.model}</h1>
              </div>
              <span className="rounded-full border border-[#c9a45b]/30 bg-[#c9a45b]/10 px-3 py-1 text-xs font-medium text-[#8c6d2f]">
                {vehicle.status}
              </span>
            </div>

            <p className="text-3xl font-bold text-zinc-900">{vehicle.dailyPrice.toLocaleString('fr-FR')} FCFA <span className="text-base font-medium text-zinc-500">/ jour</span></p>
            {vehicle.salePrice ? <p className="mt-2 text-sm text-zinc-600">Prix de vente : {vehicle.salePrice.toLocaleString('fr-FR')} FCFA</p> : null}

            <div className="mt-6 space-y-3 text-sm text-zinc-600">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2"><span>Année</span><span>{vehicle.year}</span></div>
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2"><span>Catégorie</span><span>{vehicle.category}</span></div>
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2"><span>Kilométrage</span><span>{vehicle.mileage.toLocaleString('fr-FR')} km</span></div>
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2"><span>Carburant</span><span>{vehicle.fuel}</span></div>
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2"><span>Transmission</span><span>{vehicle.transmission}</span></div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Link href={`/reservation?vehicle=${vehicle.slug}`} className="rounded-full bg-[#c9a45b] px-5 py-3 text-center font-semibold text-black hover:bg-[#d9b975]">
                Réserver maintenant
              </Link>
              <a href="https://wa.me/?text=Bonjour%2C%20je%20souhaite%20plus%20d%27informations%20sur%20le%20v%C3%A9hicule%20${encodeURIComponent(vehicle.title)}" target="_blank" rel="noreferrer" className="rounded-full border border-zinc-300 px-5 py-3 text-center font-semibold text-zinc-900 hover:bg-zinc-50">
                WhatsApp
              </a>
            </div>
          </aside>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900">Description</h2>
            <p className="mt-4 text-zinc-700">{vehicle.description}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {vehicle.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-2xl bg-[#f5f3ef] p-3 text-zinc-700">
                  <ShieldCheck className="text-[#c9a45b]" size={18} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900">Fiche technique</h3>
            <div className="mt-5 space-y-3 text-sm text-zinc-700">
              <div className="flex items-center justify-between"><span>Marque</span><strong>{vehicle.brand}</strong></div>
              <div className="flex items-center justify-between"><span>Modèle</span><strong>{vehicle.model}</strong></div>
              <div className="flex items-center justify-between"><span>Année</span><strong>{vehicle.year}</strong></div>
              <div className="flex items-center justify-between"><span>Places</span><strong>{vehicle.seats}</strong></div>
              <div className="flex items-center justify-between"><span>Carburant</span><strong>{vehicle.fuel}</strong></div>
              <div className="flex items-center justify-between"><span>Transmission</span><strong>{vehicle.transmission}</strong></div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-zinc-900">Véhicules similaires</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.id} href={`/cars/${item.slug}`} className="rounded-3xl overflow-hidden border border-zinc-200 bg-white shadow-sm">
                <Image src={item.gallery[0]} alt={item.title} width={800} height={500} className="h-52 w-full object-cover" />
                <div className="p-4">
                  <p className="text-sm uppercase tracking-[0.14em] text-[#8c6d2f]">{item.brand}</p>
                  <h3 className="mt-2 text-xl font-semibold text-zinc-900">{item.model}</h3>
                  <p className="mt-2 text-lg font-bold text-zinc-900">{item.dailyPrice.toLocaleString('fr-FR')} FCFA / jour</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
