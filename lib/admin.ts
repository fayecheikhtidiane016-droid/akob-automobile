import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ADMIN_EMAIL } from '@/lib/admin-identity';

export const ADMIN_ROLES = ['owner'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export async function getAdminSession() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) return null;
  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single();
  if (!profile || !ADMIN_ROLES.includes(profile.role as AdminRole)) return null;
  return { supabase, user, profile: profile as { role: AdminRole; full_name: string | null } };
}