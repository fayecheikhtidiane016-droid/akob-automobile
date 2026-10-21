'use client';

import { useMemo, useState } from 'react';
import { CarFront, RotateCcw, SlidersHorizontal } from 'lucide-react';
import type { Vehicle } from '@/lib/vehicles';
import { VehicleCard } from '@/components/vehicle-card';

export function VehicleList({ vehicles }: { vehicles: Vehicle[] }) {
  const [category, setCategory] = useState('Toutes les catégories');
  const [brand, setBrand] = useState('Toutes les marques');
  const [transmission, setTransmission] = useState('Toutes');
  const [fuel, setFuel] = useState('Tous');
  const [seats, setSeats] = useState('Toutes');
  const [available, setAvailable] = useState(false);
  const [maxPrice, setMaxPrice] = useState('any');
  const categories = [...new Set(vehicles.map((vehicle) => vehicle.category))];
  const brands = [...new Set(vehicles.map((vehicle) => vehicle.brand))];
  const transmissions = [...new Set(vehicles.map((vehicle) => vehicle.transmission).filter(Boolean))];
  const fuels = [...new Set(vehicles.map((vehicle) => vehicle.fuel).filter(Boolean))];
  const seatCounts = [...new Set(vehicles.map((vehicle) => vehicle.seats).filter((seats): seats is number => seats !== null))].sort((a, b) => a - b);
  const filtered = useMemo(() => vehicles.filter((vehicle) =>
    (category === 'Toutes les catégories' || vehicle.category === category)
    && (brand === 'Toutes les marques' || vehicle.brand === brand)
    && (transmission === 'Toutes' || vehicle.transmission === transmission)
    && (fuel === 'Tous' || vehicle.fuel === fuel)
    && (seats === 'Toutes' || vehicle.seats === Number(seats))
    && (maxPrice === 'any' || (vehicle.salePrice !== null && Number(vehicle.salePrice) <= Number(maxPrice)))
    && (!available || vehicle.status === 'available')),
  [vehicles, category, brand, transmission, fuel, seats, available, maxPrice]);
  const hasFilters = category !== 'Toutes les catégories' || brand !== 'Toutes les marques'
    || transmission !== 'Toutes' || fuel !== 'Tous' || seats !== 'Toutes' || maxPrice !== 'any' || available;
  const resetFilters = () => {
    setCategory('Toutes les catégories');
    setBrand('Toutes les marques');
    setTransmission('Toutes');
    setFuel('Tous');
    setSeats('Toutes');
    setAvailable(false);
    setMaxPrice('any');
  };

  return <>
    <section className="catalog-browser" aria-label="Rechercher parmi nos véhicules">
      <div className="catalog-browser-heading"><div><span className="eyebrow">FAITES VOTRE CHOIX</span><h2>Nos véhicules</h2></div><span className="catalog-total">{vehicles.length} annonce{vehicles.length > 1 ? 's' : ''}</span></div>
      <div className="category-picker" aria-label="Filtrer par catégorie">
        <button className={category === 'Toutes les catégories' ? 'category-option is-selected' : 'category-option'} type="button" aria-pressed={category === 'Toutes les catégories'} onClick={() => setCategory('Toutes les catégories')}><span className="category-icon"><CarFront size={22} /></span><span>Tous les véhicules</span></button>
        {categories.map((item) => <button className={category === item ? 'category-option is-selected' : 'category-option'} type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}><span className="category-icon"><CarFront size={22} /></span><span>{item}</span></button>)}
      </div>
      <div className="catalog-filter-panel">
        <div className="filter-panel-title"><span><SlidersHorizontal size={17} /> Affiner ma recherche</span>{hasFilters && <button type="button" className="reset-filters" onClick={resetFilters}><RotateCcw size={13} /> Réinitialiser</button>}</div>
        <div className="catalog-filters">
          <select aria-label="Filtrer par marque" value={brand} onChange={(event) => setBrand(event.target.value)}><option value="Toutes les marques">Toutes les marques</option>{brands.map((item) => <option key={item}>{item}</option>)}</select>
          <select aria-label="Filtrer par transmission" value={transmission} onChange={(event) => setTransmission(event.target.value)}><option value="Toutes">Toutes les transmissions</option>{transmissions.map((item) => <option key={item}>{item}</option>)}</select>
          <select aria-label="Filtrer par carburant" value={fuel} onChange={(event) => setFuel(event.target.value)}><option value="Tous">Tous les carburants</option>{fuels.map((item) => <option key={item}>{item}</option>)}</select>
          <select aria-label="Filtrer par nombre de places" value={seats} onChange={(event) => setSeats(event.target.value)}><option value="Toutes">Toutes les capacités</option>{seatCounts.map((item) => <option key={item} value={item}>{item} places</option>)}</select>
          <select aria-label="Filtrer par prix maximum" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}><option value="any">Tous les budgets</option>{[15000000, 30000000, 50000000].map((limit) => <option key={limit} value={limit}>Jusqu’à {new Intl.NumberFormat('fr-FR').format(limit)} FCFA</option>)}</select>
          <label className="filter-check"><input type="checkbox" checked={available} onChange={(event) => setAvailable(event.target.checked)} /> Disponibles uniquement</label>
        </div>
      </div>
    </section>
    <div className="catalog-results-heading"><h2>{hasFilters ? 'Résultats de votre recherche' : 'Toute notre sélection'}</h2><span>{filtered.length} véhicule{filtered.length > 1 ? 's' : ''}</span></div>
    {filtered.length ? <div className="vehicle-grid">{filtered.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div> : <p className="empty-state">Aucun véhicule ne correspond à ces critères.</p>}
  </>;
}