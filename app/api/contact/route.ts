import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const schema = z.object({ name: z.string().trim().min(2).max(120), phone: z.string().trim().min(7).max(40), email: z.string().email().max(254), subject: z.enum(['achat', 'importation', 'autre']), message: z.string().trim().min(5).max(2900) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(Object.fromEntries((await request.formData()).entries()));
  if (!parsed.success) return NextResponse.json({ error: 'Vérifiez les informations renseignées.' }, { status: 400 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: 'Le formulaire de contact sera disponible après configuration de Supabase.' }, { status: 503 });
  const supabase = createClient(url, key);
  const subjectLabels = { achat: 'Achat d’un véhicule', importation: 'Projet d’importation', autre: 'Autre demande' };
  const { name, phone, email, subject, message } = parsed.data;
  const { error } = await supabase.from('contact_messages').insert({ name, phone, email, message: `Objet : ${subjectLabels[subject]}\n\n${message}` });
  if (error) return NextResponse.json({ error: 'Envoi impossible pour le moment.' }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}