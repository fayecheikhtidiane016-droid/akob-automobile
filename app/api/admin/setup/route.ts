import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/admin';

const schema = z.object({ password: z.string().min(12).max(256) });

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Session administrateur invalide. Ouvrez à nouveau le lien d’invitation.' }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 12 caractères.' }, { status: 400 });
  const { error } = await session.supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return NextResponse.json({ error: 'Impossible de définir le mot de passe. Demandez une nouvelle invitation à votre administrateur.' }, { status: 400 });
  return NextResponse.json({ ok: true });
}