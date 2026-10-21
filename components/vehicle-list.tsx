'use client';

import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type { Vehicle } from '@/lib/vehicles';
import { VehicleCard } from '@/components/vehicle-card';

export function VehicleList({ vehicles }: { vehicles: Vehicle[] }) {
  const [category, setCategory] = useState('Toutes les catégories');
  const [brand, setBrand] = useState('Toutes les marques');
  const [available, setAvailable] = useState(false);
  const [maxPrice, setMaxPrice] = useState('any');
  const categories = [...new Set(vehicles.map((vehicle) => vehicle.category))];
  const brands = [...new Set(vehicles.map((vehicle) => vehicle.brand))];
  const filtered = useMemo(() => vehicles.filter((vehicle) =>
    (category === 'Toutes les catégories' || vehicle.category === category)
    && (brand === 'Toutes les marques' || vehicle.brand === brand)
    && (maxPrice === 'any' || (vehicle.salePrice !== null && Number(vehicle.salePrice) <= Number(maxPrice)))
    && (!available || vehicle.status === 'available')),
  [vehicles, category, brand, available, maxPrice]);

  return <>
    <div className="catalog-filters"><span><SlidersHorizontal size={17} /> Affiner la sélection</span>
      <select aria-label="Filtrer par marque" value={brand} onChange={(event) => setBrand(event.target.value)}><option>Toutes les marques</option>{brands.map((item) => <option key={item}>{item}</option>)}</select>
      <select aria-label="Filtrer par catégorie" value={category} onChange={(event) => setCategory(event.target.value)}><option>Toutes les catégories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
      <select aria-label="Filtrer par prix maximum" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}><option value="any">Tous les prix</option>{[15000000, 30000000, 50000000].map((limit) => <option key={limit} value={limit}>Jusqu’à {new Intl.NumberFormat('fr-FR').format(limit)} FCFA</option>)}</select>
      <label className="filter-check"><input type="checkbox" checked={available} onChange={(event) => setAvailable(event.target.checked)} /> Disponibles</label>
      <span className="filter-count">{filtered.length} véhicule{filtered.length > 1 ? 's' : ''}</span>
    </div>
    {filtered.length ? <div className="vehicle-grid">{filtered.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div> : <p className="empty-state">Aucun véhicule ne correspond à ces critères.</p>}
  </>;
}