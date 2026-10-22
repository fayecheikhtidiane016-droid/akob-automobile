'use client';

import { useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ADMIN_EMAIL } from '@/lib/admin-identity';

export function AuthReturnHandler() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const hash = new URLSearchParams(url.hash.replace(/^#/, ''));
    const code = url.searchParams.get('code');
    const tokenHash = url.searchParams.get('token_hash');
    const type = url.searchParams.get('type');
    const accessToken = hash.get('access_token');
    const refreshToken = hash.get('refresh_token');
    const hasInviteTokens = Boolean(code || (tokenHash && (type === 'invite' || type === 'recovery')) || (accessToken && refreshToken && (type === 'invite' || type === 'recovery')));
    if (!hasInviteTokens) return;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      window.location.replace('/admin?invite=configuration');
      return;
    }

    const supabase = createBrowserClient(supabaseUrl, supabaseKey);
    void (async () => {
      const result = code
        ? await supabase.auth.exchangeCodeForSession(code)
        : tokenHash
          ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as 'invite' | 'recovery' })
          : await supabase.auth.setSession({ access_token: accessToken!, refresh_token: refreshToken! });

      if (result.error) {
        window.location.replace('/admin?invite=expired');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = user
        ? await supabase.from('profiles').select('role').eq('id', user.id).single()
        : { data: null };
      if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL || !profile || profile.role !== 'owner') {
        await supabase.auth.signOut();
        window.location.replace('/admin?invite=unauthorized');
        return;
      }
      window.location.replace(type === 'recovery' ? '/admin/setup?mode=recovery' : '/admin/setup');
    })();
  }, []);

  return null;
}