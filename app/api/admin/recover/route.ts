import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const schema = z.object({ email: z.string().trim().email().max(254) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Saisissez une adresse e-mail valide.' }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase n’est pas configuré.' }, { status: 503 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const redirectTo = new URL('/auth/callback?type=recovery', siteUrl).toString();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo });
  if (error) return NextResponse.json({ error: 'Envoi impossible. Vérifiez la configuration e-mail Supabase et réessayez.' }, { status: 429 });
  return NextResponse.json({ ok: true });
}