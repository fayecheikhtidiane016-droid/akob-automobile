import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { reservations } from '@/lib/data';

export default function AdminReservationsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8c6d2f]">Administration</p>
          <h1 className="mt-2 text-4xl font-bold text-zinc-900">Réservations</h1>
        </div>

        <div className="space-y-6">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-semibold text-zinc-900">{reservation.client}</p>
                  <p className="text-sm text-zinc-500">{reservation.vehicleTitle}</p>
                </div>
                <span className="rounded-full bg-[#f5f3ef] px-3 py-1 text-xs font-medium text-zinc-700">{reservation.status}</span>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3 text-sm text-zinc-600">
                <div><span className="font-medium text-zinc-900">Téléphone</span><p>{reservation.phone}</p></div>
                <div><span className="font-medium text-zinc-900">Dates</span><p>{reservation.dates}</p></div>
                <div><span className="font-medium text-zinc-900">Montant</span><p>{reservation.amount.toLocaleString('fr-FR')} FCFA</p></div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
