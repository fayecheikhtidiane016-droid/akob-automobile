import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/admin';

const photoSchema = z.object({ vehicle_id: z.string().uuid(), is_primary: z.enum(['true', 'false']).optional() });
const allowedTypes: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };
const MAX_PHOTOS_PER_VEHICLE = 4;

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  const vehicleId = new URL(request.url).searchParams.get('vehicle_id');
  if (!z.string().uuid().safeParse(vehicleId).success) return NextResponse.json({ error: 'Véhicule invalide.' }, { status: 400 });
  const { data, error } = await session.supabase.from('vehicle_photos').select('id, storage_path, alt_text, is_primary, sort_order').eq('vehicle_id', vehicleId).order('sort_order');
  if (error) return NextResponse.json({ error: 'Chargement des photos impossible.' }, { status: 500 });
  const photos = await Promise.all((data ?? []).map(async (photo) => {
    const { data: signed } = await session.supabase.storage.from('vehicle-photos').createSignedUrl(photo.storage_path, 3600);
    return { ...photo, signed_url: signed?.signedUrl ?? '' };
  }));
  return NextResponse.json({ photos });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  const form = await request.formData();
  const parsed = photoSchema.safeParse({ vehicle_id: form.get('vehicle_id'), is_primary: form.get('is_primary') ?? undefined });
  const files = form.getAll('photos').filter((value): value is File => value instanceof File);
  if (!parsed.success || !files.length || files.length > MAX_PHOTOS_PER_VEHICLE) return NextResponse.json({ error: `Sélectionnez entre 1 et ${MAX_PHOTOS_PER_VEHICLE} photos.` }, { status: 400 });
  const { data: vehicle } = await session.supabase.from('vehicles').select('id').eq('id', parsed.data.vehicle_id).single();
  if (!vehicle) return NextResponse.json({ error: 'Véhicule introuvable.' }, { status: 404 });
  if (files.some((file) => !allowedTypes[file.type] || file.size > 10 * 1024 * 1024)) return NextResponse.json({ error: 'Chaque image doit être JPG, PNG, WebP ou AVIF et ne pas dépasser 10 Mo.' }, { status: 400 });

  const { data: currentPhotos, error: photosError } = await session.supabase.from('vehicle_photos').select('id, sort_order').eq('vehicle_id', vehicle.id).order('sort_order', { ascending: false });
  if (photosError) return NextResponse.json({ error: 'Impossible de vérifier les photos existantes.' }, { status: 500 });
  if ((currentPhotos?.length ?? 0) + files.length > MAX_PHOTOS_PER_VEHICLE) {
    return NextResponse.json({ error: `Chaque véhicule peut avoir au maximum ${MAX_PHOTOS_PER_VEHICLE} photos. Supprimez-en avant d’en ajouter.` }, { status: 400 });
  }
  let order = (currentPhotos?.[0]?.sort_order ?? -1) + 1;
  const uploaded: string[] = [];
  for (const [index, file] of files.entries()) {
    const path = `${vehicle.id}/${crypto.randomUUID()}.${allowedTypes[file.type]}`;
    const primary = parsed.data.is_primary === 'true' && index === 0;
    if (primary) await session.supabase.from('vehicle_photos').update({ is_primary: false }).eq('vehicle_id', vehicle.id);
    const stored = await session.supabase.storage.from('vehicle-photos').upload(path, file, { contentType: file.type, upsert: false });
    if (stored.error) return NextResponse.json({ error: 'Impossible d’enregistrer une photo.' }, { status: 500 });
    uploaded.push(path);
    const recorded = await session.supabase.from('vehicle_photos').insert({ vehicle_id: vehicle.id, storage_path: path, alt_text: `${file.name.replace(/\.[^.]+$/, '')}`, is_primary: primary || (!currentPhotos?.length && index === 0), sort_order: order++ });
    if (recorded.error) {
      await session.supabase.storage.from('vehicle-photos').remove(uploaded);
      return NextResponse.json({ error: 'Impossible de rattacher les photos au véhicule.' }, { status: 500 });
    }
  }
  return NextResponse.json({ ok: true, count: files.length }, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  const parsed = z.object({ photo_id: z.string().uuid(), action: z.enum(['primary', 'up', 'down']) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Modification invalide.' }, { status: 400 });
  const { data: photo } = await session.supabase.from('vehicle_photos').select('id, vehicle_id, sort_order').eq('id', parsed.data.photo_id).single();
  if (!photo) return NextResponse.json({ error: 'Photo introuvable.' }, { status: 404 });
  if (parsed.data.action === 'primary') {
    const { error: clearError } = await session.supabase.from('vehicle_photos').update({ is_primary: false }).eq('vehicle_id', photo.vehicle_id);
    const { error } = clearError ? { error: clearError } : await session.supabase.from('vehicle_photos').update({ is_primary: true }).eq('id', photo.id);
    return error ? NextResponse.json({ error: 'Modification de la couverture impossible.' }, { status: 500 }) : NextResponse.json({ ok: true });
  }
  const { data: photos } = await session.supabase.from('vehicle_photos').select('id, sort_order').eq('vehicle_id', photo.vehicle_id).order('sort_order');
  const ordered = photos ?? [];
  const index = ordered.findIndex((item) => item.id === photo.id);
  const target = index + (parsed.data.action === 'up' ? -1 : 1);
  if (target < 0 || target >= ordered.length) return NextResponse.json({ ok: true });
  const current = ordered[index];
  const neighbor = ordered[target];
  const temporary = Math.max(...ordered.map((item) => item.sort_order)) + 1;
  const first = await session.supabase.from('vehicle_photos').update({ sort_order: temporary }).eq('id', current.id);
  const second = first.error ? first : await session.supabase.from('vehicle_photos').update({ sort_order: current.sort_order }).eq('id', neighbor.id);
  const third = second.error ? second : await session.supabase.from('vehicle_photos').update({ sort_order: neighbor.sort_order }).eq('id', current.id);
  return third.error ? NextResponse.json({ error: 'Réorganisation impossible.' }, { status: 500 }) : NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  const parsed = z.object({ photo_id: z.string().uuid() }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Photo invalide.' }, { status: 400 });
  const { data: photo } = await session.supabase.from('vehicle_photos').select('id, vehicle_id, storage_path, is_primary').eq('id', parsed.data.photo_id).single();
  if (!photo) return NextResponse.json({ error: 'Photo introuvable.' }, { status: 404 });
  const { error: storageError } = await session.supabase.storage.from('vehicle-photos').remove([photo.storage_path]);
  if (storageError) return NextResponse.json({ error: 'Suppression du fichier image impossible.' }, { status: 500 });
  const { error } = await session.supabase.from('vehicle_photos').delete().eq('id', photo.id);
  if (error) return NextResponse.json({ error: 'Suppression de la photo impossible.' }, { status: 500 });
  if (photo.is_primary) {
    const { data: next } = await session.supabase.from('vehicle_photos').select('id').eq('vehicle_id', photo.vehicle_id).order('sort_order').limit(1).maybeSingle();
    if (next) await session.supabase.from('vehicle_photos').update({ is_primary: true }).eq('id', next.id);
  }
  return NextResponse.json({ ok: true });
}