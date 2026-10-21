import { NextResponse } from 'next/server';
import { z } from 'zod';

const reservationSchema = z.object({
  customer_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(40),
  email: z.union([z.literal(''), z.string().email().max(254)]).optional(),
  vehicle_slug: z.string().min(1).max(120),
  start_at: z.string().datetime({ offset: true }),
  end_at: z.string().datetime({ offset: true }),
  pickup_location: z.string().trim().min(2).max(200),
  return_location: z.string().trim().min(2).max(200),
  notes: z.string().max(2000).optional(),
});

export async function POST(request: Request) {
  const form = await request.formData();
  const values = Object.fromEntries(form.entries());
  for (const field of ['start_at', 'end_at'] as const) {
    const value = values[field];
    if (typeof value === 'string' && value && !/(Z|[+-]\d{2}:\d{2})$/.test(value)) {
      const parsedDate = new Date(value);
      values[field] = Number.isNaN(parsedDate.getTime()) ? value : parsedDate.toISOString();
    }
  }
  const parsed = reservationSchema.safeParse(values);
  if (!parsed.success) return NextResponse.json({ error: 'Vérifiez les informations renseignées.' }, { status: 400 });
  const data = parsed.data;
  if (new Date(data.start_at) <= new Date() || new Date(data.end_at) <= new Date(data.start_at)) {
    return NextResponse.json({ error: 'Les dates indiquées ne sont pas valides.' }, { status: 400 });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: 'Les demandes en ligne seront disponibles après configuration de Supabase.' }, { status: 503 });

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key);
  const { data: vehicle } = await supabase.from('vehicles').select('id').eq('slug', data.vehicle_slug).eq('published', true).in('listing_type', ['rent', 'both']).single();
  if (!vehicle) return NextResponse.json({ error: 'Ce véhicule n’est plus disponible à la demande.' }, { status: 404 });
  const { error } = await supabase.from('reservations').insert({
    vehicle_id: vehicle.id, customer_name: data.customer_name, phone: data.phone,
    email: data.email || null, start_at: data.start_at, end_at: data.end_at,
    pickup_location: data.pickup_location, return_location: data.return_location,
    customer_notes: data.notes || null, status: 'pending',
  });
  if (error) return NextResponse.json({ error: error.code === '23P01' ? 'Ce véhicule est déjà réservé sur ces dates.' : 'Envoi impossible pour le moment.' }, { status: error.code === '23P01' ? 409 : 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}