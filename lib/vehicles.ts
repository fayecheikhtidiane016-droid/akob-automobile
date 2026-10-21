export type Vehicle = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  image: string;
  images: string[];
  dailyRate: number | null;
  salePrice: number | null;
  mileage: number | null;
  fuel: string;
  transmission: string;
  seats: number;
  color: string;
  description: string;
  listingType: 'rent' | 'sale' | 'both';
  status: 'available' | 'reserved' | 'rented' | 'sold' | 'unavailable';
  published: boolean;
};

export const demoVehicles: Vehicle[] = [
  {
    id: 'demo-1', slug: 'toyota-land-cruiser-prado', brand: 'Toyota', model: 'Land Cruiser Prado', year: 2023,
    category: 'SUV', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=85', images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=85'],
    dailyRate: 85000, salePrice: null, mileage: 12000, fuel: 'Diesel', transmission: 'Automatique', seats: 7, color: 'Noir',
    description: 'Un SUV spacieux et confortable, pensé pour les longues routes comme pour la ville.', listingType: 'rent', status: 'available', published: true,
  },
  {
    id: 'demo-2', slug: 'mercedes-benz-classe-c', brand: 'Mercedes-Benz', model: 'Classe C', year: 2022,
    category: 'Berline', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1400&q=85', images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1400&q=85'],
    dailyRate: null, salePrice: 24500000, mileage: 28000, fuel: 'Essence', transmission: 'Automatique', seats: 5, color: 'Argent',
    description: 'Une berline élégante à la conduite raffinée et aux finitions soignées.', listingType: 'sale', status: 'available', published: true,
  },
  {
    id: 'demo-3', slug: 'range-rover-sport', brand: 'Land Rover', model: 'Range Rover Sport', year: 2024,
    category: 'SUV', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1400&q=85', images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1400&q=85'],
    dailyRate: 125000, salePrice: 49500000, mileage: 6000, fuel: 'Hybride', transmission: 'Automatique', seats: 5, color: 'Gris',
    description: 'Puissance, confort et présence dans un SUV haut de gamme disponible à la location ou à la vente.', listingType: 'both', status: 'available', published: true,
  },
  {
    id: 'demo-4', slug: 'toyota-corolla-cross', brand: 'Toyota', model: 'Corolla Cross', year: 2023,
    category: 'Crossover', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85', images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85'],
    dailyRate: 55000, salePrice: null, mileage: 15000, fuel: 'Essence', transmission: 'Automatique', seats: 5, color: 'Blanc',
    description: 'Un crossover polyvalent, agréable en ville et prêt pour les escapades.', listingType: 'rent', status: 'available', published: true,
  },
];

export function formatCfa(amount: number) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

export async function getVehicles(mode?: 'rent' | 'sale') {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return demoVehicles.filter((vehicle) => !mode || vehicle.listingType === mode || vehicle.listingType === 'both');

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key);
  let query = supabase.from('vehicles').select('*, vehicle_photos(storage_path, is_primary, sort_order)').eq('published', true).order('created_at', { ascending: false });
  if (mode) query = query.in('listing_type', [mode, 'both']);
  const { data, error } = await query;
  if (error || !data) return [];

  return Promise.all(data.map(async (row) => {
    const photos = [...(row.vehicle_photos ?? [])].sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order);
    const signedPhotos = await Promise.all(photos.map(async (photo) => {
      const { data: signed } = await supabase.storage.from('vehicle-photos').createSignedUrl(photo.storage_path, 3600);
      return signed?.signedUrl ?? '';
    }));
    return {
      id: row.id, slug: row.slug, brand: row.brand, model: row.model, year: row.year, category: row.category,
      image: signedPhotos[0] ?? '', images: signedPhotos.filter(Boolean), dailyRate: row.daily_rate, salePrice: row.sale_price,
      mileage: row.mileage, fuel: row.fuel, transmission: row.transmission, seats: row.seats, color: row.color,
      description: row.description, listingType: row.listing_type, status: row.status, published: row.published,
    } satisfies Vehicle;
  }));
}