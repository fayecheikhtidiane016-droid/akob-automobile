import { AdminDashboard } from '@/components/admin-dashboard';
import { AdminLogin } from '@/components/admin-login';
import { InviteStatus } from '@/components/invite-status';
import { getAdminSession } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ invite?: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    const { invite } = await searchParams;
    return <section className="admin-login-page"><div className="login-panel"><a className="admin-wordmark" href="/">AKOB <span>ADMINISTRATION</span></a><span className="eyebrow">ACCÈS SÉCURISÉ</span><h1>Bienvenue<br /><em>à nouveau.</em></h1><p>Connectez-vous avec l’adresse e-mail administrateur autorisée.</p><InviteStatus status={invite} /><AdminLogin /></div><span className="login-note">Espace réservé au compte administrateur Akob Automobile</span></section>;
  }
  const { data: vehicles, error } = await session.supabase.from('vehicles').select('*').order('created_at', { ascending: false });
  if (error) return <section className="admin-login-page"><div className="login-panel"><span className="eyebrow">CONFIGURATION INCOMPLÈTE</span><h1>Impossible de charger les données.</h1><p>Vérifiez que le schéma Supabase a été appliqué et que les politiques RLS sont actives.</p></div></section>;
  return <AdminDashboard name={session.profile.full_name} initialVehicles={vehicles ?? []} />;
}