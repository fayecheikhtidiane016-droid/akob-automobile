import { createSupabaseServerClient } from '@/lib/supabase/server';

export const ADMIN_ROLES = ['owner', 'assistant', 'developer'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export async function getAdminSession() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('role, developer_access, full_name').eq('id', user.id).single();
  if (!profile || !ADMIN_ROLES.includes(profile.role as AdminRole)) return null;
  return { supabase, user, profile: profile as { role: AdminRole; developer_access: boolean; full_name: string | null } };
}