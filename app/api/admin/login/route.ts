import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim();
  const password = String(form.get('password') ?? '');
  if (!email || !password || password.length > 256) return NextResponse.json({ error: 'Identifiants invalides.' }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase n’est pas encore configuré.' }, { status: 503 });
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return NextResponse.json({ error: 'Adresse e-mail ou mot de passe incorrect.' }, { status: 401 });
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user ? await supabase.from('profiles').select('role').eq('id', user.id).single() : { data: null };
  if (!profile || !['owner', 'assistant', 'developer'].includes(profile.role)) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: 'Ce compte ne dispose pas des droits d’accès.' }, { status: 403 });
  }
  return NextResponse.json({ ok: true });
}