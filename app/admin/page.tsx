import { AdminDashboard } from '@/components/admin-dashboard';
import { AdminLogin } from '@/components/admin-login';
import { InviteStatus } from '@/components/invite-status';
import { getAdminSession } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ invite?: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    const { invite } = await searchParams;
    return <section className="admin-login-page"><div className="login-panel"><a className="admin-wordmark" href="/">AKOB <span>ESPACE ÉQUIPE</span></a><span className="eyebrow">ACCÈS SÉCURISÉ</span><h1>Bienvenue<br /><em>à nouveau.</em></h1><p>Connectez-vous avec le compte qui vous a été attribué par l'agence.</p><InviteStatus status={invite} /><AdminLogin /></div><span className="login-note">Espace réservé à l'équipe Akob Automobile</span></section>;
  }
  const [vehicles, reservations] = await Promise.all([
    session.supabase.from('vehicles').select('*').order('created_at', { ascending: false }),
    session.supabase.from('reservations').select('*, vehicles(brand, model)').order('created_at', { ascending: false }).limit(50),
  ]);
  if (vehicles.error || reservations.error) return <section className="admin-login-page"><div className="login-panel"><span className="eyebrow">CONFIGURATION INCOMPLÈTE</span><h1>Impossible de charger les données.</h1><p>Vérifiez que le schéma Supabase a été appliqué et que les politiques RLS sont actives.</p></div></section>;
  return <AdminDashboard role={session.profile.role} developerAccess={session.profile.developer_access} name={session.profile.full_name} initialVehicles={vehicles.data ?? []} initialReservations={reservations.data ?? []} />;
}