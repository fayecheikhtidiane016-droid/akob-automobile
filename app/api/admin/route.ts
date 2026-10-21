import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/admin';

const optionalNumber = z.preprocess((value) => value === '' || value === undefined ? null : value, z.coerce.number().nonnegative().nullable());

const vehicleSchema = z.object({
  brand: z.string().trim().min(1).max(80), model: z.string().trim().min(1).max(100), year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1),
  category: z.string().trim().min(1).max(60), listing_type: z.enum(['rent', 'sale', 'both']), status: z.enum(['available', 'reserved', 'rented', 'sold', 'unavailable']),
  daily_rate: optionalNumber, sale_price: optionalNumber, mileage: z.preprocess((value) => value === '' || value === undefined ? null : value, z.coerce.number().int().nonnegative().nullable()),
  fuel: z.string().trim().max(40), transmission: z.string().trim().max(40), seats: z.coerce.number().int().min(1).max(20), color: z.string().trim().max(40),
  description: z.string().trim().max(5000), published: z.boolean(),
}).superRefine((vehicle, context) => {
  if (['rent', 'both'].includes(vehicle.listing_type) && vehicle.daily_rate === null) context.addIssue({ code: 'custom', path: ['daily_rate'], message: 'Le tarif journalier est obligatoire pour une annonce en location.' });
  if (['sale', 'both'].includes(vehicle.listing_type) && vehicle.sale_price === null) context.addIssue({ code: 'custom', path: ['sale_price'], message: 'Le prix de vente est obligatoire pour une annonce en vente.' });
});

const vehicleStatusSchema = z.object({ id: z.string().uuid(), status: z.enum(['available', 'reserved', 'rented', 'sold', 'unavailable']), published: z.boolean().optional() });
const reservationSchema = z.object({ id: z.string().uuid(), status: z.enum(['confirmed', 'declined', 'cancelled']), internal_notes: z.string().max(2000).optional() });

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  const [vehicles, reservations] = await Promise.all([
    session.supabase.from('vehicles').select('*').order('created_at', { ascending: false }),
    session.supabase.from('reservations').select('*, vehicles(brand, model)').order('created_at', { ascending: false }).limit(50),
  ]);
  if (vehicles.error || reservations.error) return NextResponse.json({ error: 'Impossible de charger les données.' }, { status: 500 });
  return NextResponse.json({ vehicles: vehicles.data, reservations: reservations.data });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const parsed = vehicleSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Vérifiez les informations du véhicule.' }, { status: 400 });
  const value = parsed.data;
  const slug = `${value.brand}-${value.model}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const { data, error } = await session.supabase.from('vehicles').insert({ ...value, slug: `${slug}-${value.year}-${crypto.randomUUID().slice(0, 6)}`, created_by: session.user.id }).select('id').single();
  if (error) return NextResponse.json({ error: 'Création impossible. Vérifiez les prix et la configuration de la base.' }, { status: 400 });
  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const completeVehicle = vehicleSchema.safeParse(body);
  if (completeVehicle.success && body?.id) {
    const { id, ...updates } = { ...completeVehicle.data, id: body.id };
    const { error } = await session.supabase.from('vehicles').update(updates).eq('id', id);
    return error ? NextResponse.json({ error: 'Modification impossible.' }, { status: 400 }) : NextResponse.json({ ok: true });
  }
  const vehicle = vehicleStatusSchema.safeParse(body);
  if (vehicle.success) {
    const { id, ...updates } = vehicle.data;
    const { error } = await session.supabase.from('vehicles').update(updates).eq('id', id);
    return error ? NextResponse.json({ error: 'Mise à jour impossible.' }, { status: 400 }) : NextResponse.json({ ok: true });
  }
  const reservation = reservationSchema.safeParse(body);
  if (reservation.success) {
    const { id, ...updates } = reservation.data;
    const { error } = await session.supabase.from('reservations').update(updates).eq('id', id);
    if (error) return NextResponse.json({ error: error.code === '23P01' ? 'Une réservation confirmée chevauche déjà ces dates.' : 'Mise à jour impossible.' }, { status: 409 });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: 'Modification invalide.' }, { status: 400 });
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session || !['owner', 'developer'].includes(session.profile.role)) return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 });
  const { id } = await request.json().catch(() => ({ id: '' }));
  const parsed = z.string().uuid().safeParse(id);
  if (!parsed.success) return NextResponse.json({ error: 'Véhicule invalide.' }, { status: 400 });
  const { error } = await session.supabase.from('vehicles').delete().eq('id', parsed.data);
  return error ? NextResponse.json({ error: 'Suppression impossible.' }, { status: 400 }) : NextResponse.json({ ok: true });
}