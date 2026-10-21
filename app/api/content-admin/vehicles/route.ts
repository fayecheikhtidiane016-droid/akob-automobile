import { NextResponse } from 'next/server';
import { z } from 'zod';
import { commitGithubCatalog, hasGithubAdminSession, readGithubVehicles } from '@/lib/github-catalog';
import { demoVehicles, type Vehicle } from '@/lib/vehicles';

export const runtime = 'nodejs';

const vehicleSchema = z.object({
  brand: z.string().trim().min(1).max(80),
  model: z.string().trim().min(1).max(100),
  year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1),
  category: z.string().trim().min(1).max(60),
  salePrice: z.preprocess((value) => value === '' || value === undefined ? null : value, z.coerce.number().nonnegative().nullable()),
  mileage: z.coerce.number().int().nonnegative(),
  fuel: z.string().trim().max(40),
  transmission: z.string().trim().max(60),
  seats: z.coerce.number().int().min(1).max(20),
  color: z.string().trim().max(40),
  description: z.string().trim().max(5000),
  location: z.string().trim().max(100),
  published: z.enum(['true', 'false']).transform((value) => value === 'true'),
});

const mutationSchema = z.object({
  action: z.enum(['publish', 'delete']),
  id: z.string().min(1).max(100),
  published: z.boolean().optional(),
});

const MAX_PHOTOS = 5;
const MAX_TOTAL_PHOTO_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

export async function POST(request: Request) {
  if (!(await hasGithubAdminSession())) return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 401 });

  try {
    if (request.headers.get('content-type')?.includes('application/json')) {
      const body = await request.json().catch(() => null);
      const parsed = mutationSchema.safeParse(body);
      if (!parsed.success) return NextResponse.json({ error: 'Modification invalide.' }, { status: 400 });
      const vehicles = await readGithubVehicles(demoVehicles);
      const existing = vehicles.find((vehicle) => vehicle.id === parsed.data.id);
      if (!existing) return NextResponse.json({ error: 'Véhicule introuvable.' }, { status: 404 });

      if (parsed.data.action === 'publish') {
        const updated = vehicles.map((vehicle) => vehicle.id === existing.id ? { ...vehicle, published: parsed.data.published ?? !vehicle.published } : vehicle);
        await commitGithubCatalog([{ path: 'data/vehicles.json', content: JSON.stringify(updated, null, 2) }]);
        return NextResponse.json({ ok: true });
      }

      const updated = vehicles.filter((vehicle) => vehicle.id !== existing.id);
      const deletePaths = existing.images
        .filter((image) => /^\/vehicles\/[\w.-]+$/.test(image))
        .map((image) => `public${image}`);
      await commitGithubCatalog([{ path: 'data/vehicles.json', content: JSON.stringify(updated, null, 2) }], deletePaths);
      return NextResponse.json({ ok: true });
    }

    const form = await request.formData();
    if (form.get('action') === 'photos') {
      const id = form.get('id');
      if (typeof id !== 'string') return NextResponse.json({ error: 'Véhicule invalide.' }, { status: 400 });
      const vehicles = await readGithubVehicles(demoVehicles);
      const vehicle = vehicles.find((item) => item.id === id);
      if (!vehicle) return NextResponse.json({ error: 'Véhicule introuvable.' }, { status: 404 });
      const photos = form.getAll('photos').filter((value): value is File => value instanceof File && value.size > 0);
      if (!photos.length || vehicle.images.length + photos.length > MAX_PHOTOS) {
        return NextResponse.json({ error: `Cette annonce peut contenir ${MAX_PHOTOS} photos maximum.` }, { status: 400 });
      }
      if (photos.reduce((total, photo) => total + photo.size, 0) > MAX_TOTAL_PHOTO_BYTES || photos.some((photo) => !ALLOWED_TYPES[photo.type])) {
        return NextResponse.json({ error: 'Vérifiez le format des photos et leur poids total (4 Mo maximum).' }, { status: 400 });
      }
      const additions = await Promise.all(photos.map(async (photo, index) => {
        const filename = `${vehicle.slug}-extra-${crypto.randomUUID().slice(0, 8)}-${index + 1}.${ALLOWED_TYPES[photo.type]}`;
        return {
          path: `public/vehicles/${filename}`,
          content: Buffer.from(await photo.arrayBuffer()).toString('base64'),
          encoding: 'base64' as const,
          image: `/vehicles/${filename}`,
        };
      }));
      const setCover = form.get('cover') === 'true';
      const updated = vehicles.map((item) => item.id === vehicle.id
        ? { ...item, image: setCover ? additions[0].image : item.image, images: [...item.images, ...additions.map((photo) => photo.image)] }
        : item);
      await commitGithubCatalog([
        ...additions.map(({ path, content, encoding }) => ({ path, content, encoding })),
        { path: 'data/vehicles.json', content: JSON.stringify(updated, null, 2) },
      ]);
      return NextResponse.json({ ok: true });
    }

    const parsed = vehicleSchema.safeParse(Object.fromEntries(form.entries()));
    if (!parsed.success) return NextResponse.json({ error: 'Vérifiez les informations du véhicule.' }, { status: 400 });
    const photos = form.getAll('photos').filter((value): value is File => value instanceof File && value.size > 0);
    if (!photos.length || photos.length > MAX_PHOTOS) {
      return NextResponse.json({ error: `Ajoutez entre 1 et ${MAX_PHOTOS} photos.` }, { status: 400 });
    }
    if (photos.reduce((total, photo) => total + photo.size, 0) > MAX_TOTAL_PHOTO_BYTES) {
      return NextResponse.json({ error: 'Le poids total des photos ne doit pas dépasser 4 Mo.' }, { status: 400 });
    }
    for (const photo of photos) {
      if (!ALLOWED_TYPES[photo.type]) {
        return NextResponse.json({ error: 'Format photo non accepté.' }, { status: 400 });
      }
    }

    const vehicles = await readGithubVehicles(demoVehicles);
    const value = parsed.data;
    const id = `github-${crypto.randomUUID()}`;
    const baseSlug = `${value.brand}-${value.model}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const slug = `${baseSlug}-${value.year}-${crypto.randomUUID().slice(0, 6)}`;
    const files = await Promise.all(photos.map(async (photo, index) => {
      const filename = `${slug}-${index + 1}.${ALLOWED_TYPES[photo.type]}`;
      return {
        path: `public/vehicles/${filename}`,
        content: Buffer.from(await photo.arrayBuffer()).toString('base64'),
        encoding: 'base64' as const,
        image: `/vehicles/${filename}`,
      };
    }));
    const vehicle: Vehicle = {
      id,
      slug,
      brand: value.brand,
      model: value.model,
      year: value.year,
      category: value.category,
      image: files[0].image,
      images: files.map((file) => file.image),
      salePrice: value.salePrice,
      mileage: value.mileage,
      fuel: value.fuel,
      transmission: value.transmission,
      seats: value.seats,
      color: value.color,
      description: value.description,
      location: value.location,
      contactPhones: ['769886122', '773143556'],
      listingType: 'sale',
      status: 'available',
      published: value.published,
    };
    const nextVehicles = [vehicle, ...vehicles];
    await commitGithubCatalog([
      ...files.map(({ path, content, encoding }) => ({ path, content, encoding })),
      { path: 'data/vehicles.json', content: JSON.stringify(nextVehicles, null, 2) },
    ]);
    return NextResponse.json({ ok: true, vehicle }, { status: 201 });
  } catch (error) {
    console.error('GitHub vehicle catalog update failed:', error);
    return NextResponse.json({ error: 'Enregistrement impossible. Vérifiez la configuration GitHub et réessayez.' }, { status: 500 });
  }
}
