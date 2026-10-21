import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ADMIN_EMAIL } from '@/lib/admin-identity';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const schema = z.object({ email: z.string().trim().email().max(254) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Saisissez une adresse e-mail valide.' }, { status: 400 });
  if (parsed.data.email.toLowerCase() !== ADMIN_EMAIL) return NextResponse.json({ ok: true });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase n’est pas configuré.' }, { status: 503 });

  const redirectTo = new URL('/auth/callback?type=recovery', request.url).toString();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo });
  if (error) return NextResponse.json({ error: 'Envoi impossible. Vérifiez la configuration e-mail Supabase et réessayez.' }, { status: 429 });
  return NextResponse.json({ ok: true });
}