'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { vehicles } from '@/lib/data';

const estimateRentalCost = (dailyPrice: number, days: number) => Math.max(0, dailyPrice * days);

export default function ReservationPage() {
  const searchParams = useSearchParams();
  const selectedVehicle = vehicles.find((vehicle) => vehicle.slug === searchParams.get('vehicle')) ?? vehicles[0];
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState(3);
  const [submitted, setSubmitted] = useState(false);

  const total = useMemo(() => estimateRentalCost(selectedVehicle.dailyPrice, days), [selectedVehicle, days]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8c6d2f]">Réservation</p>
          <h1 className="mt-3 text-4xl font-bold text-zinc-900">Demande de réservation</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <form className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
              <input className="rounded-xl border border-zinc-200 px-4 py-3" placeholder="Nom complet" />
              <input className="rounded-xl border border-zinc-200 px-4 py-3" placeholder="Téléphone" />
              <input className="rounded-xl border border-zinc-200 px-4 py-3 md:col-span-2" placeholder="Email (facultatif)" type="email" />
              <input className="rounded-xl border border-zinc-200 px-4 py-3 md:col-span-2" value={selectedVehicle.title} readOnly />
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-xl border border-zinc-200 px-4 py-3" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-xl border border-zinc-200 px-4 py-3" />
              <input type="number" min={1} max={30} value={days} onChange={(e) => setDays(Number(e.target.value) || 1)} className="rounded-xl border border-zinc-200 px-4 py-3" placeholder="Nombre de jours" />
              <input className="rounded-xl border border-zinc-200 px-4 py-3" placeholder="Lieu de prise en charge" />
              <input className="rounded-xl border border-zinc-200 px-4 py-3 md:col-span-2" placeholder="Lieu de retour" />
              <textarea className="min-h-[120px] rounded-xl border border-zinc-200 px-4 py-3 md:col-span-2" placeholder="Informations complémentaires" />
            </div>

            <div className="mt-6 rounded-2xl bg-[#f5f3ef] p-4 text-sm text-zinc-700">
              Votre demande sera traitée par l’agence et ne constituera pas une confirmation définitive de réservation.
            </div>

            <button type="button" onClick={() => setSubmitted(true)} className="mt-6 rounded-full bg-[#c9a45b] px-6 py-3 font-semibold text-black hover:bg-[#d9b975]">
              Envoyer la demande
            </button>

            {submitted ? (
              <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Demande enregistrée. L’agence la confirme après validation.
              </p>
            ) : null}
          </form>

          <aside className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900">Estimation</h2>
            <div className="mt-5 space-y-3 text-sm text-zinc-600">
              <div className="flex items-center justify-between"><span>Véhicule</span><strong>{selectedVehicle.title}</strong></div>
              <div className="flex items-center justify-between"><span>Tarif quotidien</span><strong>{selectedVehicle.dailyPrice.toLocaleString('fr-FR')} FCFA</strong></div>
              <div className="flex items-center justify-between"><span>Durée</span><strong>{days} jours</strong></div>
              <div className="flex items-center justify-between border-t border-zinc-200 pt-3 text-base text-zinc-900">
                <span>Total estimé</span>
                <strong>{total.toLocaleString('fr-FR')} FCFA</strong>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
