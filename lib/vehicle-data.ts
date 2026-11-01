import { demoVehicles, type Vehicle } from '@/lib/vehicles';
import { isGithubAdminConfigured, readGithubVehicles } from '@/lib/github-catalog';

export async function getVehicles(): Promise<Vehicle[]> {
  if (isGithubAdminConfigured()) {
    const vehicles = await readGithubVehicles(demoVehicles);
    return vehicles.filter((vehicle) => vehicle.published && ['sale', 'both'].includes(vehicle.listingType));
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return demoVehicles.filter((vehicle) => vehicle.published && ['sale', 'both'].includes(vehicle.listingType));
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('vehicles').select('*, vehicle_photos(storage_path, is_primary, sort_order)').eq('published', true).in('listing_type', ['sale', 'both']).order('created_at', { ascending: false });
  if (error || !data) return [];

  return Promise.all(data.map(async (row) => {
    const photos = [...(row.vehicle_photos ?? [])].sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order).slice(0, 4);
    const signedPhotos = await Promise.all(photos.map(async (photo) => {
      const { data: signed } = await supabase.storage.from('vehicle-photos').createSignedUrl(photo.storage_path, 3600);
      return signed?.signedUrl ?? '';
    }));
    return {
      id: row.id, slug: row.slug, brand: row.brand, model: row.model, year: row.year, category: row.category,
      image: signedPhotos[0] ?? '', images: signedPhotos.filter(Boolean), salePrice: row.sale_price,
      mileage: row.mileage, fuel: row.fuel, transmission: row.transmission, seats: row.seats, color: row.color,
      description: row.description, listingType: row.listing_type, dailyRate: row.daily_rate,
      airportTransferRate: row.airport_transfer_rate,
      status: row.status, published: row.published,
    } satisfies Vehicle;
  }));
}

export async function getRentalVehicles(): Promise<Vehicle[]> {
  const vehicles = isGithubAdminConfigured() ? await readGithubVehicles(demoVehicles) : demoVehicles;
  return vehicles.filter((vehicle) => vehicle.published && vehicle.status === 'available' && ['rent', 'both'].includes(vehicle.listingType));
}
