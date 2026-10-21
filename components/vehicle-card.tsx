import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Star } from 'lucide-react';
import { Vehicle } from '@/lib/types';

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <Image src={vehicle.gallery[0]} alt={vehicle.title} width={900} height={600} className="h-60 w-full object-cover" />
        <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">{vehicle.category}</span>
        <span className="absolute right-4 top-4 rounded-full bg-[#c9a45b] px-3 py-1 text-xs font-semibold text-black">{vehicle.status}</span>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[#8c6d2f]">{vehicle.brand}</p>
            <h3 className="mt-1 text-2xl font-bold text-zinc-900">{vehicle.model}</h3>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-500">Année</p>
            <strong className="text-zinc-900">{vehicle.year}</strong>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 text-sm text-zinc-600">
          <span>{vehicle.dailyPrice.toLocaleString('fr-FR')} FCFA / jour</span>
          <span>{vehicle.availability}</span>
        </div>

        <div className="mt-5 flex gap-3">
          <Link href={`/cars/${vehicle.slug}`} className="flex-1 rounded-full border border-zinc-300 px-4 py-2.5 text-center font-semibold text-zinc-900 hover:bg-zinc-50">
            Voir détails
          </Link>
          <Link href={`/reservation?vehicle=${vehicle.slug}`} className="flex-1 rounded-full bg-[#c9a45b] px-4 py-2.5 text-center font-semibold text-black hover:bg-[#d9b975]">
            Réserver
          </Link>
        </div>
      </div>
    </article>
  );
}
