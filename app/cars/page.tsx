'use client';

import { useMemo, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { VehicleCard } from '@/components/vehicle-card';
import { vehicles, agency } from '@/lib/data';

export default function CarsPage() {
  const [brand, setBrand] = useState('all');
  const [category, setCategory] = useState('all');
  const [type, setType] = useState('all');
  const [maxPrice, setMaxPrice] = useState(2500000);

  const filteredData = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesBrand = brand === 'all' || vehicle.brand === brand;
      const matchesCategory = category === 'all' || vehicle.category === category;
      const matchesType = type === 'all' || vehicle.adType === type || (type === 'rent' && vehicle.adType === 'both');
      const matchesPrice = vehicle.dailyPrice <= maxPrice || vehicle.salePrice <= maxPrice;
      return matchesBrand && matchesCategory && matchesType && matchesPrice;
    });
  }, [brand, category, type, maxPrice]);

  const brands = ['all', ...new Set(vehicles.map((vehicle) => vehicle.brand))];
  const categories = ['all', ...new Set(vehicles.map((vehicle) => vehicle.category))];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#8c6d2f]">Nos voitures</p>
            <h1 className="mt-2 text-4xl font-bold text-zinc-900">Location et vente</h1>
          </div>
          <p className="text-sm text-zinc-600">{filteredData.length} véhicules disponibles</p>
        </div>

        <div className="mb-10 grid gap-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm md:grid-cols-4">
          <label className="text-sm text-zinc-600">
            <span className="mb-2 block">Marque</span>
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2">
              {brands.map((item) => (
                <option key={item} value={item}>{item === 'all' ? 'Toutes' : item}</option>
              ))}
            </select>
          </label>

          <label className="text-sm text-zinc-600">
            <span className="mb-2 block">Catégorie</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2">
              {categories.map((item) => (
                <option key={item} value={item}>{item === 'all' ? 'Toutes' : item}</option>
              ))}
            </select>
          </label>

          <label className="text-sm text-zinc-600">
            <span className="mb-2 block">Type</span>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2">
              <option value="all">Tous</option>
              <option value="rent">Location</option>
              <option value="sale">Vente</option>
              <option value="both">Location et vente</option>
            </select>
          </label>

          <label className="text-sm text-zinc-600">
            <span className="mb-2 block">Prix max</span>
            <input type="range" min={500000} max={6000000} step={50000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[#c9a45b]" />
            <span className="mt-2 block text-xs font-medium text-zinc-700">{maxPrice.toLocaleString('fr-FR')} FCFA</span>
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredData.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
