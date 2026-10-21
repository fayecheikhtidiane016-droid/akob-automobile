'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { vehicles, reservations } from '@/lib/data';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('akob-demo-admin');
    if (saved !== 'true') {
      router.push('/admin/login');
      return;
    }
    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return null;
  }

  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((vehicle) => vehicle.status === 'available').length;
  const reservedVehicles = vehicles.filter((vehicle) => vehicle.status === 'reserved').length;
  const soldVehicles = vehicles.filter((vehicle) => vehicle.status === 'sold').length;
  const pendingReservations = reservations.filter((reservation) => reservation.status === 'pending').length;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#8c6d2f]">Dashboard</p>
            <h1 className="mt-2 text-4xl font-bold text-zinc-900">Tableau de bord</h1>
          </div>
          <button onClick={() => { localStorage.removeItem('akob-demo-admin'); router.push('/admin/login'); }} className="rounded-full border border-zinc-300 px-5 py-2 font-medium text-zinc-900 hover:bg-zinc-50">
            Déconnexion
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: 'Total véhicules', value: totalVehicles },
            { label: 'Disponibles', value: availableVehicles },
            { label: 'Réservés', value: reservedVehicles },
            { label: 'Vendus', value: soldVehicles },
            { label: 'Demandes en attente', value: pendingReservations }
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-zinc-500">{item.label}</p>
              <p className="mt-4 text-3xl font-bold text-zinc-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900">Dernières demandes</h2>
            <div className="mt-5 space-y-4">
              {reservations.slice(0, 4).map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between border-b border-zinc-200 pb-3 last:border-b-0">
                  <div>
                    <p className="font-semibold text-zinc-900">{reservation.client}</p>
                    <p className="text-sm text-zinc-500">{reservation.vehicleTitle}</p>
                  </div>
                  <span className="rounded-full bg-[#f5f3ef] px-3 py-1 text-xs font-medium text-zinc-700">{reservation.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900">Actions rapides</h2>
            <div className="mt-5 space-y-3">
              <a href="/admin/vehicles" className="block rounded-xl bg-[#c9a45b] px-4 py-3 text-center font-semibold text-black hover:bg-[#d9b975]">Gérer les véhicules</a>
              <a href="/admin/reservations" className="block rounded-xl border border-zinc-300 px-4 py-3 text-center font-semibold text-zinc-900 hover:bg-zinc-50">Gérer les réservations</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
