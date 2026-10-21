import { NextResponse } from 'next/server';
import { ADMIN_EMAIL } from '@/lib/admin-identity';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.redirect(new URL('/admin?invite=configuration', url));

  const code = url.searchParams.get('code');
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');
  let verificationError = null;

  if (code) {
    ({ error: verificationError } = await supabase.auth.exchangeCodeForSession(code));
  } else if (tokenHash && (type === 'invite' || type === 'recovery')) {
    ({ error: verificationError } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type }));
  } else {
    return NextResponse.redirect(new URL('/admin?invite=invalid', url));
  }

  if (verificationError) return NextResponse.redirect(new URL('/admin?invite=expired', url));
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user ? await supabase.from('profiles').select('role').eq('id', user.id).single() : { data: null };
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL || !profile || profile.role !== 'owner') {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL('/admin?invite=unauthorized', url));
  }

  return NextResponse.redirect(new URL(type === 'recovery' ? '/admin/setup?mode=recovery' : '/admin/setup', url));
}