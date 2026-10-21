import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { vehicles } from '@/lib/data';

export default function AdminVehiclesPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#8c6d2f]">Administration</p>
            <h1 className="mt-2 text-4xl font-bold text-zinc-900">Gestion des véhicules</h1>
          </div>
          <button className="rounded-full bg-[#c9a45b] px-5 py-2 font-semibold text-black hover:bg-[#d9b975]">Ajouter un véhicule</button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[#f7f3ee] text-sm uppercase tracking-wide text-zinc-600">
              <tr>
                <th className="px-5 py-4">Véhicule</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4">Prix</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-t border-zinc-200">
                  <td className="px-5 py-4 font-medium text-zinc-900">{vehicle.title}</td>
                  <td className="px-5 py-4 text-zinc-600">{vehicle.adType}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#f5f3ef] px-3 py-1 text-xs font-medium text-zinc-700">{vehicle.status}</span>
                  </td>
                  <td className="px-5 py-4 text-zinc-900">{vehicle.dailyPrice.toLocaleString('fr-FR')} FCFA/j</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </>
  );
}
